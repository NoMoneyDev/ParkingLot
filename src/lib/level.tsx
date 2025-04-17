import { ParkingSpot } from "./parkingspot";
import Vehicle from "./vehicle";
import { VehicleSize } from "./vehiclesize";


function pad(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}


export class Level {
    public parking_spots: ParkingSpot[] = [];

    public constructor(level: number, spots: number) {
        let level_id = String("L").concat(level.toString());

        let motorcycle_spots = Math.floor(spots / 4);
        let bus_spots = Math.floor(spots / 4);
        let car_spots = spots - motorcycle_spots - bus_spots;

        let s = 0;
        
        for (; s < motorcycle_spots; s++) {
            let spot_id = level_id.concat(String('S').concat(pad(s, 2)));
            this.parking_spots.push(new ParkingSpot(spot_id, VehicleSize.Motorcycle));
        }
        
        for (; s < motorcycle_spots + car_spots; s++) {
            let spot_id = level_id.concat(String('S').concat(pad(s, 2)));
            this.parking_spots.push(new ParkingSpot(spot_id, VehicleSize.Car));
        }
        
        for (; s < spots; s++) {
            let spot_id = level_id.concat(String('S').concat(pad(s, 2)));
            this.parking_spots.push(new ParkingSpot(spot_id, VehicleSize.Bus));
        }
        
    }

    public get_parking_spot(vehicle_size: VehicleSize) {
        let spots = this.parking_spots.length;
        for (let i=0; i<spots; i++) {
            let parking_spot = this.parking_spots[i];
            if (parking_spot.size == vehicle_size && parking_spot.is_available()) {
                return parking_spot;
            }
        }
        return null;
    }

}
