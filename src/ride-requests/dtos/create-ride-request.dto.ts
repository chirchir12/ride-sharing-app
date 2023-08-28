import { Type } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class PickupLocation {
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;
}

class DestinationLocation extends PickupLocation {}

export class RideRequestDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  user_id?: number;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PickupLocation)
  pickup_location: PickupLocation;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => DestinationLocation)
  destination_location: DestinationLocation;
}
