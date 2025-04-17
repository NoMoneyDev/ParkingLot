import { VehicleSize } from '../../lib/vehiclesize';
import dbConnect from '../../lib/mongodb';
import Vehicle from '../../models/IVehicle';

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const vehicle = await Vehicle.find({});
        res.status(200).json({ success: true, data: vehicle });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const isValidSize = (size: string): size is VehicleSize => {
          return (Object.values(VehicleSize) as string[]).includes(size);
        };
        if (!isValidSize(req.body.size)) {
          res.status(400).json({ success: false, data: "Invalid Size" });
        }
        const vehicle = await Vehicle.create(req.body);
        vehicle.save();
        res.status(201).json({ success: true, data: vehicle });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}