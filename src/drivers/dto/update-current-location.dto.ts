import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCurrentLocationDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
