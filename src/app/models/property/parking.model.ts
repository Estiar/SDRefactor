export interface Parking {
  propertyID: number;
  reserved: boolean;
  reservedFeeMin: number;
  reservedFeeMax: number;
  covered: boolean;
  coveredFeeMin: number;
  coveredFeeMax: number;
  garage: boolean;
  garageFeeMin: number;
  garageFeeMax: number;
  detached: boolean;
  detachedFeeMin: number;
  detachedFeeMax: number;
}
