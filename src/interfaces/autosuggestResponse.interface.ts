export interface AutosuggestResponse {
  items: Item[];
  queryTerms: any[];
}

export interface Item {
  title: string;
  id: string;
  resultType: string;
  houseNumberType: string;
  address: ItemAddress;
  position: Position;
  access: Position[];
  distance: number;
  mapView: MapView;
  highlights: Highlights;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface ItemAddress {
  label: string;
}

export interface Highlights {
  title: Title[];
  address: HighlightsAddress;
}

export interface HighlightsAddress {
  label: Title[];
}

export interface Title {
  start: number;
  end: number;
}

export interface MapView {
  west: number;
  south: number;
  east: number;
  north: number;
}
