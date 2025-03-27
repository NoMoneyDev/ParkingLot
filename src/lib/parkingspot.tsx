import Vehicle from "./vehicle";

class ParkingSpot {
    public parking_vehicle: Vehicle| null;
    public size: VehicleSize
    public spot_id: Number

    public constructor(spot_id: Number, size: VehicleSize) {
        this.spot_id = spot_id;
        this.parking_vehicle = null;
        this.size = size;
    }
    
    public is_available() {
        return this.parking_vehicle == null;
    }

    public clear() {
        this.parking_vehicle = null;
        return true;
    }

    public park_in_spot(vehicle: Vehicle) {
        if (vehicle.size == this.size) {
            this.parking_vehicle = vehicle;
            return true;
        }
        return false;
    }
}

export default ParkingSpot;