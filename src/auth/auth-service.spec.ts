import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UsersEntity } from '../users/users.entity';
import { RegisterDto } from './dto/register.dto';
import { DriverService } from '../drivers/drivers.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            userExist: jest.fn(),
            userInstance: jest.fn(),
            create: jest.fn(),
            getByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: DriverService,
          useValue: {
            driverExist: jest.fn(),
            driverInstance: jest.fn(),
            saveDriver: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        phone_number: '1234567890',
        name: 'test',
        password: 'test',
      };
      const mockUserInstance = { id: 1, ...registerDto };
      jest.spyOn(usersService, 'userExist').mockResolvedValue(null);
      jest
        .spyOn(usersService, 'userInstance')
        .mockResolvedValue(mockUserInstance as UsersEntity);
      jest
        .spyOn(usersService, 'create')
        .mockResolvedValue(mockUserInstance as UsersEntity);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(result).toEqual(mockUserInstance);
      expect(usersService.userExist).toHaveBeenCalledWith(
        registerDto.phone_number,
        registerDto.email,
      );
      expect(usersService.userInstance).toHaveBeenCalledWith(
        expect.objectContaining(registerDto),
      );
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining(mockUserInstance),
      );
    });

    // Add more test cases here
  });

  // Add more describe blocks for other methods
});
