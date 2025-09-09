import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String, required: true, unique: true, lowercase: true
    },
    passwordHash: {
        type: String, required: true,
        minlength: [8, "Password must be at least 8 characters long"]
    },
    role: {
        type: String,
        enum: ["admin", "compliance_officer", "budtender", "inspector"],
        default: "budtender"
    },
    dispensary: { type: mongoose.Schema.Types.ObjectId, ref: "Dispensary" },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
});


userSchema.methods.hasRole = function(role) {
    return this.role === role;
};

export default mongoose.model("User", userSchema)