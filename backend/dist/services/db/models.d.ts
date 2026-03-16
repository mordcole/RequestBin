import mongoose, { Document } from 'mongoose';
export interface IBody extends Document {
    body: unknown;
    created_at: Date;
}
export declare const BodyModel: mongoose.Model<IBody, {}, {}, {}, mongoose.Document<unknown, {}, IBody, {}, {}> & IBody & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=models.d.ts.map