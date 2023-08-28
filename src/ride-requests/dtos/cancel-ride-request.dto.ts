import { IsNotEmpty, IsNumber } from 'class-validator';

export class CancelRideRequestDto {
  @IsNotEmpty()
  @IsNumber()
  request_id: number;
}
