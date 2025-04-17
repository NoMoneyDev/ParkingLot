import { ParkingSpot } from "./parkingspot";
import Vehicle from "./vehicle";
import { VehicleSize } from "./vehiclesize";

export class Car extends Vehicle {
    public constructor(license_plate: string) {
        super()
        this.license_plate = license_plate;
        this.size = VehicleSize.Car;
    }
}
