import mongoose, { Schema, Document, Model} from "mongoose";

export interface vendorDocument extends Document {
    name: string;
    ownerName: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
    foodType: [string];
    password: string;
    serviceAvailable: boolean;
    coverImages: [string];
    rating: number;
    foods: any
}

const vendorSchema: Schema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    foodType: [{ type: String }],
    password: { type: String, required: true, select: true },
    serviceAvailable: { type: Boolean, default: false },
    coverImages: [{ type: String }],
    rating:{type:Number, default : 0},
    foods: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'food'
    }]
}, {
    timestamps:true,
    toJSON: {
        transform: (doc, ret: any) => {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            return ret;
        }
    }
});


const vendor = mongoose.model<vendorDocument>('vendor', vendorSchema);
export default vendor;