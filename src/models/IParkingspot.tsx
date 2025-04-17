import mongoose from 'mongoose';

const IParkingspot = new mongoose.Schema({
  parking_spot: {
    type: String,
    required: true,
  },
  license_plate: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

export default mongoose.models.IParkingSpot || mongoose.model('IParkingSpot', IParkingspot);


