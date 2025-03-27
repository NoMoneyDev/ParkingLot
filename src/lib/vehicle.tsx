import ParkingSpot from "./parkingspot";

abstract class Vehicle {
    public license_plate: String = '';
    public parking_spot: ParkingSpot | null = null;
    public size: VehicleSize = 0;

    public is_parking() {
        return this.parking_spot == null;
    }

    public park(parking_spot: ParkingSpot) {
        if (parking_spot.park_in_spot(this)) {
            this.parking_spot = parking_spot;
            return true;
        }
        return false;
    }

    public leave() {
        if (this.parking_spot) {
            this.parking_spot.clear()
            return true;
        }
        return false;
    }
    
}

export default Vehicle;
