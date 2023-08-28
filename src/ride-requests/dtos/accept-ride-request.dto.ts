import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AcceptRideRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  driver_id: number;

  @IsNotEmpty()
  @IsNumber()
  request_id: number;
}
