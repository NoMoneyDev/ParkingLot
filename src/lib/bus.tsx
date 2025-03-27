import ParkingSpot from "./parkingspot";
import Vehicle from "./vehicle";

class Bus extends Vehicle {
    public constructor(license_plate: string) {
        super()
        this.license_plate = license_plate;
        this.size = VehicleSize.Bus;
    }
}

export default Bus;
