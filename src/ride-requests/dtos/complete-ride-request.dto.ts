import { IsNotEmpty, IsNumber } from 'class-validator';

export class CompleteRideRequestDto {
  @IsNotEmpty()
  @IsNumber()
  request_id: number;
}
