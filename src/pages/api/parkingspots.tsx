import ParkingSpot from '../../models/IParkingspot';
import Vehicle from '../../models/IVehicle'
import dbConnect from '../../lib/mongodb';


export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const level = await ParkingSpot.find({});

        res.status(200).json({ success: true, data: level });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

      case 'POST':
        try {
          let { parking_spot, license_plate, size } = req.body;
          
          console.log('Received:', parking_spot, license_plate, size);
      
          let spot = await ParkingSpot.findOne({ parking_spot });
      
          if (!spot) {
            console.log("No spot found, creating a new one.");
            spot = new ParkingSpot({
              parking_spot,
              license: license_plate,
              size: size,
            });
            await spot.save();
            console.log(`New parking spot created: ${parking_spot}`);
          } else {
            console.log("Spot found, proceeding to park vehicle.");
          }

          if (spot.license_plate) {
            return res.status(400).json({ message: 'This parking spot is already occupied.' });
          }
          
      
          const vehicle = await Vehicle.findOne({ license_plate });
          if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
          }
      
          console.log("Vehicle found: ", vehicle);
      
          // Check if sizes match before logging "I got here"
          if (spot.size !== vehicle.size) {
            console.log(`Size mismatch: spot size ${spot.size} vs vehicle size ${vehicle.size}`);
            return res.status(400).json({ message: 'Vehicle size does not match the spot size' });
          }
      
          console.log("I got here");
      
          // Assign the vehicle to the spot
          spot.license = license_plate;
          spot.size = vehicle.size;
          await spot.save();
      
          console.log("I saved");
      
          return res.status(200).json({ message: 'Vehicle parked successfully', spot });
      
        } catch (error) {
          console.error('POST /api/parkingspot error:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
         

    default:
      res.status(400).json({ success: false });
      break;
  }
}