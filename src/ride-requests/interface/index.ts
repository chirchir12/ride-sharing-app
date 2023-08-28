export interface PickupLocation {
  latitude: number;

  longitude: number;
}

export interface DestinationLocation {
  latitude: number;

  longitude: number;
}

export interface RideRequest {
  user_id?: number;

  pickup_location: PickupLocation;

  destination_location: DestinationLocation;

  status: 'pending' | 'accepted' | 'completed' | 'canceled';
}

export interface CalculatedDistance {
  distance_meters: number;
}
