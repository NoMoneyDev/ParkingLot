import Vehicle from "./vehicle";
import { VehicleSize } from "./vehiclesize";

export class ParkingSpot {
    public parking_vehicle: Vehicle | null;
    public size: VehicleSize;
    public spot_id: string;
    public status: "Occupied" | "Available";
  
    constructor(spot_id: string, size: VehicleSize) {
      this.spot_id = spot_id;
      this.parking_vehicle = null;
      this.size = size;
      this.status = "Available";
    }
  
    public is_available() {
      return this.parking_vehicle == null;
    }
  
    public clear() {
      this.parking_vehicle = null;
      this.status = "Available";
      return true;
    }
  
    public park_in_spot(vehicle: Vehicle) {
      if (vehicle.size == this.size) {
        this.parking_vehicle = vehicle;
        this.status = "Occupied";
        return true;
      }
      return false;
    }
  }
  
