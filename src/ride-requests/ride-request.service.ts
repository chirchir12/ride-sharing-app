import { Injectable } from '@nestjs/common';
import { RideRequestRepository } from './ride-request.repository';
import { RideRequestEntity } from './ride-request.entity';
import { RideRequestDto } from './dtos/create-ride-request.dto';
import { DriverService } from '../drivers/drivers.service';
import { CustomHttpException } from '../common/exception/custom-http-exception';
import { rideRequestErrors } from './errors';
import { Point } from 'geojson';
import { RideRequest } from './interface';
import { DriverEntity } from '../drivers/drivers.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RidesEntity } from './rides.entity';
import { DataSource, In, Repository } from 'typeorm';
import { Pagination } from '../common/pagination/pagination';
import { SearchRidesdDto } from './dtos/search-ride.dto';

@Injectable()
export class RideRequestService {
  constructor(
    private readonly repository: RideRequestRepository,
    private readonly driverService: DriverService,
    @InjectRepository(RidesEntity)
    private ridesRepository: Repository<RidesEntity>,
    private dataSource: DataSource,
  ) {}

  async requestRide(params: RideRequestDto): Promise<RideRequest> {
    try {
      const { user_id, pickup_location, destination_location } = params;

      //   prevent drivers who could be users from requesting ride
      const isDriver = await this.isDriver(user_id);
      if (isDriver && isDriver.availability === true) {
        throw new CustomHttpException(rideRequestErrors.actionNotAllowed);
      }

      //   prevent users with pending/accepted ride request from creating another one
      const rideExist = await this.repository.find({
        where: [
          { user_id, status: 'pending' },
          { user_id, status: 'accepted' },
        ],
      });

      if (rideExist && rideExist.length > 0) {
        throw new CustomHttpException(rideRequestErrors.rideIsInProgres);
      }

      const pickupPoint: Point = {
        type: 'Point',
        coordinates: [pickup_location.longitude, pickup_location.latitude],
      };

      const destinationPoint: Point = {
        type: 'Point',
        coordinates: [
          destination_location.longitude,
          destination_location.latitude,
        ],
      };

      const rideRequest: Partial<RideRequestEntity> = {
        user_id: user_id,
        pickup_location: pickupPoint,
        destination_location: destinationPoint,
        status: 'pending',
      };

      const instance = await this.rideRequestInstance(rideRequest);
      return this.saveRideRequest(instance).then((request) => {
        return this.rideRequestSerialize(request);
      });
    } catch (error) {
      throw error;
    }
  }

  async allUserRides(user_id: number): Promise<RideRequest[]> {
    //todo.we need pagination here to improve perfomance
    return this.repository.find({ where: { user_id } }).then((requests) => {
      return requests.map((request) => this.rideRequestSerialize(request));
    });
  }

  async allDriverRides(driver_id: number): Promise<RideRequest[]> {
    //todo.we need pagination here to improve perfomance
    const request_ids = await this.ridesRepository
      .find({
        where: { driver_id: driver_id },
      })
      .then((requests) => {
        return requests.map((request) => request.request_id);
      });
    return this.repository
      .find({ where: { id: In(request_ids) } })
      .then((requests) => {
        return requests.map((request) => this.rideRequestSerialize(request));
      });
  }

  async getRideRequests() {
    return;
  }

  async getRideRequest(
    id: number,
    serialize = true,
  ): Promise<RideRequest | RideRequestEntity> {
    const rideRequest = await this.repository.findOne({ where: { id } });
    if (!rideRequest) {
      throw new CustomHttpException(rideRequestErrors.rideRequestNotFound, 404);
    }
    if (serialize) {
      return this.rideRequestSerialize(rideRequest);
    }
    return rideRequest;
  }

  async acceptRideRequest(userid: number, rideId: number) {
    try {
      // prevent users who are not drivers from doing this action
      const isDriver = await this.isDriver(userid);
      if (!isDriver) {
        throw new CustomHttpException(rideRequestErrors.actionNotAllowed);
      }

      // only drivers who are avaialable can accept ride request
      if (isDriver && !isDriver.availability) {
        throw new CustomHttpException(rideRequestErrors.driverMustBeAvailable);
      }
      return this.tryAssignRequestToDriver(rideId, isDriver);
    } catch (error) {
      throw error;
    }
  }

  async cancelRideRequest(
    userid: number,
    rideId: number,
  ): Promise<RideRequest> {
    try {
      const rideRequest = await this.repository.findOne({
        where: { user_id: userid, id: rideId },
      });

      if (!rideRequest) {
        throw new CustomHttpException(
          rideRequestErrors.rideRequestNotFound,
          404,
        );
      }

      //  prevent users from cancelling ride that is completed
      if (rideRequest && rideRequest.status === 'completed') {
        console.log(rideRequest);
        throw new CustomHttpException(rideRequestErrors.actionNotAllowed);
      }

      //check if ride was already accepted and update drivers to available
      if (rideRequest && rideRequest.status === 'accepted') {
        const ride = await this.ridesRepository.findOne({
          where: { request_id: rideId },
        });
        // update status in rides
        await this.ridesRepository.save(
          this.ridesRepository.create({ ...ride, status: 'canceled' }),
        );

        // make driver available
        const driver = await this.driverService.driverExist(ride.driver_id);
        driver.availability = true;
        await this.driverService.saveDriver(driver);
      }
      const instance = await this.rideRequestInstance({
        ...rideRequest,
        status: 'canceled',
      });
      return this.saveRideRequest(instance)
        .then((request) => this.rideRequestSerialize(request))
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      throw error;
    }
  }

  async completeRideRequest(
    driver_id: number,
    ride_id: number,
  ): Promise<RideRequest> {
    try {
      const ride = await this.ridesRepository.findOne({
        where: { driver_id: driver_id, request_id: ride_id },
      });
      if (!ride) {
        throw new CustomHttpException(
          rideRequestErrors.rideRequestNotFound,
          404,
        );
      }

      if (ride && ride.status !== 'accepted') {
        throw new CustomHttpException(rideRequestErrors.actionNotAllowed);
      }

      // 1. update rideRequest status
      const rideRequest: Partial<RideRequestEntity> =
        (await this.getRideRequest(ride_id, false)) as RideRequestEntity;
      rideRequest.status = 'completed';
      await this.saveRideRequest(await this.rideRequestInstance(rideRequest));

      // 2. update ride status
      ride.status = 'completed';
      ride.completed_at = new Date(Date.now());
      ride.actual_amount = ride.estimated_amount;
      await this.ridesRepository.save(ride);

      // 3. update driver availability
      const driver = await this.driverService.driverExist(driver_id);
      driver.availability = true;
      await this.driverService.saveDriver(driver);
      return this.rideRequestSerialize(rideRequest);
    } catch (error) {
      throw error;
    }
  }

  async getPendingRideRequests(driver_id: number) {
    try {
      const driver = await this.driverService.driverExist(driver_id);
      if (driver && !driver.availability) {
        throw new CustomHttpException(rideRequestErrors.actionNotAllowed);
      }
      const RADIUS = 1000; // todo this should be in configuration
      const pendingRequests = await this.repository.getPendingRequests(
        driver_id,
        RADIUS,
      );
      return pendingRequests;
    } catch (error) {
      throw error;
    }
  }

  async rideRequestInstance(
    params: Partial<RideRequestEntity>,
  ): Promise<Partial<RideRequestEntity>> {
    return this.repository.create(params);
  }

  saveRideRequest(
    params: Partial<RideRequestEntity>,
  ): Promise<Partial<RideRequestEntity>> {
    return this.repository.save(params);
  }

  async isDriver(user_id: number) {
    const driver = await this.driverService.driverExist(user_id);
    if (!driver) {
      return false;
    }
    return driver;
  }

  private rideRequestSerialize(
    rideRequest: Partial<RideRequestEntity>,
  ): RideRequest {
    return {
      id: rideRequest.id,
      user_id: rideRequest.user_id,
      status: rideRequest.status,
      pickup_location: {
        longitude: rideRequest.pickup_location.coordinates[0],
        latitude: rideRequest.pickup_location.coordinates[1],
      },
      destination_location: {
        longitude: rideRequest.destination_location.coordinates[0],
        latitude: rideRequest.destination_location.coordinates[1],
      },
    } as RideRequest;
  }

  private async tryAssignRequestToDriver(
    rideId: number,
    driver: Partial<DriverEntity>,
  ): Promise<RideRequest> {
    const queryrunner = this.dataSource.createQueryRunner();
    await queryrunner.connect();
    //start transaction
    await queryrunner.startTransaction();
    try {
      // check if ride request exists and lock it to prevent simultaneous drivers from accepting it
      const rideRequest = await queryrunner.manager
        .getRepository(RideRequestEntity)
        .findOne({
          where: { id: rideId },
          lock: {
            mode: 'pessimistic_write',
          },
        });

      if (!rideRequest) {
        throw new CustomHttpException(
          rideRequestErrors.rideRequestNotFound,
          404,
        );
      }

      if (rideRequest && rideRequest.status !== 'pending') {
        throw new CustomHttpException(rideRequestErrors.actionNotAllowed);
      }
      // 1. update driver availability
      driver.availability = false;
      await queryrunner.manager.save(this.driverService.driverInstance(driver));

      //2. update ride request status
      rideRequest.status = 'accepted';
      await queryrunner.manager.save(
        await this.rideRequestInstance(rideRequest),
      );

      //3. create ride entry
      const { pickup_location, destination_location } =
        this.rideRequestSerialize(rideRequest);

      const estimatedDIstance = await this.repository.calculateDistanceInMeters(
        pickup_location,
        destination_location,
      );

      const estimatedAmount = this.calculateAmount(
        estimatedDIstance.distance_meters,
      );
      await queryrunner.manager.save(
        this.ridesRepository.create({
          user_id: rideRequest.user_id,
          driver_id: driver.user_id,
          status: 'accepted',
          actual_amount: 0,
          estimated_amount: estimatedAmount,
          request_id: rideRequest.id,
        }),
      );
      await queryrunner.commitTransaction();
      return this.rideRequestSerialize(rideRequest);
    } catch (error) {
      await queryrunner.rollbackTransaction();
      throw error;
    } finally {
      await queryrunner.release();
    }
  }

  private calculateAmount(distanceInMeters: number): number {
    const PRICE_PER_KM = 100; //todo this should be a configuration
    return Math.ceil(Number(distanceInMeters) / 1000) * PRICE_PER_KM;
  }
}
