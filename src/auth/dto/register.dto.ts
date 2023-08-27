import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @Matches(/^\d{10}$/, {
    message: 'Invalid Phone number',
  })
  phone_number: string;

  @IsNotEmpty()
  password: string;
}
