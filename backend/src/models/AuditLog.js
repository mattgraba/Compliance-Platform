import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    action: { type: String, required: true},
    entity: { type: String, required: true},
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true},
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("AuditLog", auditLogSchema)