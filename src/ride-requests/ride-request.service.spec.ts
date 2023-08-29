import { Test, TestingModule } from '@nestjs/testing';
import { RideRequest } from './interface';
import { RideRequestEntity } from './ride-request.entity';
import { RideRequestService } from './ride-request.service';
import { DriverService } from '../drivers/drivers.service';
import { DataSource, Repository } from 'typeorm';
import { RidesEntity } from './rides.entity';
import { RideRequestRepository } from './ride-request.repository';
import { RideRequestDto } from './dtos/create-ride-request.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DriverEntity } from '../drivers/drivers.entity';
import { CustomHttpException } from '../common/exception/custom-http-exception';
import { rideRequestErrors } from './errors';

//  mock factories
const RideRequestRepositoryMockFactory = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  find: jest.fn(),
});
const RideRepositoryMockFactory = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const DriverServiceMockFactory = () => ({
  driverExist: jest.fn(),
});

const DataSourceMockFactory = () => ({
  createEntityManager: jest.fn(),
});

// mock data

const mockedSerializedRideRequest: RideRequest = {
  id: 1,
  user_id: 1,
  status: 'pending',
  pickup_location: {
    longitude: -11727,
    latitude: 38383,
  },
  destination_location: {
    longitude: -9222,
    latitude: 83333,
  },
};

const mockRideRequest: Partial<RideRequestEntity> = {
  id: 1,
  user_id: 1,
  status: 'pending',
  pickup_location: {
    type: 'Point',
    coordinates: [-11727, 38383],
  },
  destination_location: {
    type: 'Point',
    coordinates: [-9222, 83333],
  },
};

const mockedDriver: Partial<DriverEntity> = {
  id: 1,
  user_id: 1,
  availability: true,
  current_location: {
    type: 'Point',
    coordinates: [1.37832832, 36.838383],
  },
};

describe('RideRequestService', () => {
  let rideRequestService: RideRequestService;
  let repository, driverService, ridesRepository, dataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RideRequestService,
        {
          provide: DriverService,
          useFactory: DriverServiceMockFactory,
        },

        {
          provide: RideRequestRepository,
          useFactory: RideRequestRepositoryMockFactory,
        },
        {
          provide: getRepositoryToken(RidesEntity),
          useFactory: RideRepositoryMockFactory,
        },
        {
          provide: DataSource,
          useFactory: DataSourceMockFactory,
        },
      ],
    }).compile();
    rideRequestService = module.get<RideRequestService>(RideRequestService);
    repository = module.get<RideRequestRepository>(RideRequestRepository);
    driverService = module.get<DriverService>(DriverService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('requestRide', () => {
    const rideRequest: RideRequestDto = {
      user_id: 1,
      pickup_location: {
        latitude: 38383,
        longitude: -11727,
      },
      destination_location: {
        latitude: 83333,
        longitude: -9222,
      },
    };
    it('should create a ride request', async () => {
      rideRequestService.saveRideRequest = jest
        .fn()
        .mockResolvedValue(mockRideRequest);
      driverService.driverExist.mockResolvedValue(false);
      repository.find.mockResolvedValue([]);
      rideRequestService.rideRequestInstance = jest
        .fn()
        .mockReturnValue(mockRideRequest);
      rideRequestService.rideRequestSerialize = jest
        .fn()
        .mockReturnValue(mockedSerializedRideRequest);
      const result = await rideRequestService.requestRide(rideRequest);
      expect(result).toEqual(mockedSerializedRideRequest);
    });

    it('should throw error if available driver is requesting a ride', async () => {
      rideRequestService.saveRideRequest = jest
        .fn()
        .mockResolvedValue(mockRideRequest);
      driverService.driverExist.mockResolvedValue(mockedDriver);
      repository.find.mockResolvedValue([]);
      rideRequestService.rideRequestInstance = jest
        .fn()
        .mockReturnValue(mockRideRequest);
      rideRequestService.rideRequestSerialize = jest
        .fn()
        .mockReturnValue(mockedSerializedRideRequest);

      await expect(rideRequestService.requestRide(rideRequest)).rejects.toThrow(
        new CustomHttpException(rideRequestErrors.actionNotAllowed),
      );
    });

    it('should throw error if user has a pending ride and is requesting another', async () => {
      rideRequestService.saveRideRequest = jest
        .fn()
        .mockResolvedValue(mockRideRequest);
      driverService.driverExist.mockResolvedValue(false);
      repository.find.mockResolvedValue([1]);
      rideRequestService.rideRequestInstance = jest
        .fn()
        .mockReturnValue(mockRideRequest);
      rideRequestService.rideRequestSerialize = jest
        .fn()
        .mockReturnValue(mockedSerializedRideRequest);

      await expect(rideRequestService.requestRide(rideRequest)).rejects.toThrow(
        new CustomHttpException(rideRequestErrors.rideIsInProgres),
      );
    });
  });
  //   more tests to go here
});
