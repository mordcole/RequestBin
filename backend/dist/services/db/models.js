import mongoose, { Schema } from 'mongoose';
// Body schema for MongoDB
const BodySchema = new Schema({
    body: {
        type: Schema.Types.Mixed,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});
// Body model
export const BodyModel = mongoose.model('Body', BodySchema);
//# sourceMappingURL=models.js.map