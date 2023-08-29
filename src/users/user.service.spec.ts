import { Test, TestingModule } from '@nestjs/testing';
import { UsersEntity } from './users.entity';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { CustomHttpException } from '../common/exception/custom-http-exception';
import { userErrors } from './errors';

const UserRepositoryMockFactory = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const resolvedUser: Partial<UsersEntity> = {
  id: 1,
  name: 'test',
  phone_number: '1234567890',
  email: 'test@email',
};

describe('userService', () => {
  let userService: UsersService;
  let repository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useFactory: UserRepositoryMockFactory,
        },
      ],
    }).compile();
    userService = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should return user when searched by id', async () => {
      repository.findOne.mockResolvedValue(resolvedUser);
      const result = await userService.getById(1);
      expect(result).toEqual(resolvedUser);
    });

    it('should throw error when user with id does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(userService.getById(10000)).rejects.toThrow(
        new CustomHttpException(userErrors.usernotFound, 404),
      );
    });
  });

  describe('getByphone', () => {
    it('should return user when searched by phone', async () => {
      repository.findOne.mockResolvedValue(resolvedUser);
      const result = await userService.getByphone('96969696');
      expect(result).toEqual(resolvedUser);
    });

    it('should throw error when user with phone does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(userService.getByphone('67589340498')).rejects.toThrow(
        new CustomHttpException(userErrors.usernotFound, 404),
      );
    });
  });

  describe('getByEmail', () => {
    it('should return user when searched by email', async () => {
      repository.findOne.mockResolvedValue(resolvedUser);
      const result = await userService.getByEmail('test@gmail.com');
      expect(result).toEqual(resolvedUser);
    });

    it('should throw error when user with phone does not exist', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(userService.getByEmail('test@gmail.com')).rejects.toThrow(
        new CustomHttpException(userErrors.usernotFound, 404),
      );
    });
  });

  describe('userExist', () => {
    it('should return user when searched by both phone and email', async () => {
      repository.findOne.mockResolvedValue(resolvedUser);
      const result = await userService.userExist(
        '006038933283',
        'test@gmail.com',
      );
      expect(result).toEqual(resolvedUser);
    });

    it('should return null when user is not found', async () => {
      repository.findOne.mockResolvedValue(null);
      const result = await userService.userExist(
        '006038933283',
        'test@gmail.com',
      );
      expect(result).toEqual(null);
    });
  });
});
