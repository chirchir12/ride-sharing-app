import { DriverService } from './drivers.service';
import { DriverEntity } from './drivers.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { DriverRepository } from './drivers.repository';

const DriverRepositoryMockFactory = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockDriver: Partial<DriverEntity> = {
  id: 1,
  user_id: 1,
  availability: true,
  current_location: {
    type: 'Point',
    coordinates: [1.37832832, 36.838383],
  },
};

describe('DriverService', () => {
  let driverService: DriverService;
  let repository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: DriverRepository,
          useFactory: DriverRepositoryMockFactory,
        },
      ],
    }).compile();
    driverService = module.get<DriverService>(DriverService);
    repository = module.get<DriverRepository>(DriverRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('updateCurrentLocation', () => {
    it('should updated availability', async () => {
      repository.findOne.mockResolvedValue(mockDriver);
      driverService.driverInstance = jest.fn().mockReturnValue(mockDriver);
      const result = await driverService.updateAvailability(1, {
        status: false,
      });
      expect(result).toEqual({
        user_id: 1,
        availability: false,
      });
    });
  });

  describe('updateAvailability', () => {
    it('should updated availability', async () => {
      repository.findOne.mockResolvedValue(mockDriver);
      driverService.driverInstance = jest.fn().mockReturnValue(mockDriver);
      const result = await driverService.updateCurrentLocation(1, {
        latitude: 1923932,
        longitude: 383838,
      });
      expect(result).toEqual({
        user_id: 1,
        latitude: 1923932,
        longitude: 383838,
      });
    });
  });
});
