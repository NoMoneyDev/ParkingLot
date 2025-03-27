import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  license_plate: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);


