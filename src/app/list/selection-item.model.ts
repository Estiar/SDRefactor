export class SelectionItem {
  propertyID: number;
  lat: number;
  lng: number;
  gMarker: any;
  favorite = false;
  order: number;

  constructor(propertyID: number, lat: number, lng: number, gMarker: any, favorite: boolean, order: number) {
    this.propertyID = propertyID;
    this.lat = lat;
    this.lng = lng;
    this.gMarker = gMarker;
    this.favorite = favorite;
    this.order = order;
  }
}
