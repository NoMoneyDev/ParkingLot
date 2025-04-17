import { Level } from "./level";
import { ParkingSpot } from "./parkingspot";
import Vehicle from "./vehicle";


export class ParkingManager {  
    static level: number;
    static levels: Level[] = []

    public constructor(level: number, spot_per_level: number) {
        ParkingManager.level = level;

        for (let l = 1; l <= level; l++) {
            ParkingManager.levels.push(new Level(l, spot_per_level))
        }
    }

    static getAllSpots() {
        return ParkingManager.levels.flatMap(level => level.parking_spots);
    }

    static getASpot(spotId: string): ParkingSpot | null {
        for (const level of ParkingManager.levels) {
          const spot = level.parking_spots.find((s) => s.spot_id == spotId);
          if (spot) return spot;
        }
        return null;
      }

}
