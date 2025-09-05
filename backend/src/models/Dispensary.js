import mongoose from "mongoose";

const dispensarySchema = new mongoose.Schema({
    name: { type: String, required: true},
    licenseNumber: { type: String, required: true, unique: true},
    address: { type: String, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    zip: { type: String, required: true},
    phone: { type: String, required: true},
    email: { type: String, required: true},
    website: { type: String, required: true},
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Dispensary", dispensarySchema)