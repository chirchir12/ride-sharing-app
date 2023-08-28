import { Point } from 'geojson';

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

export interface PendingRideReqiests {
  pickup_longitude: number;
  pickup_latitude: number;
  destination_longitude: number;
  destination_latitude: number;
  status: 'pending' | 'accepted' | 'completed' | 'canceled';
  requested_by: string;
  distance_meters: number;
}
