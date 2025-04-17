import mongoose from 'mongoose';

const IVehicle = new mongoose.Schema({
  license_plate: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
});

export default mongoose.models.IVehicle || mongoose.model('IVehicle', IVehicle);


