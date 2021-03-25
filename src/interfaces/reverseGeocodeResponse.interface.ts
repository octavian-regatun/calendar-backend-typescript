export interface ReverseGeocodeResponse {
  items: Item[];
}

export interface Item {
  title: string;
  id: string;
  resultType: string;
  houseNumberType: string;
  address: Address;
  position: Position;
  access: Position[];
  distance: number;
  mapView: MapView;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface Address {
  label: string;
  countryCode: string;
  countryName: string;
  state: string;
  county: string;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  houseNumber: string;
}

export interface MapView {
  west: number;
  south: number;
  east: number;
  north: number;
}
