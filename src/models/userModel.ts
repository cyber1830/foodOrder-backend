import mongoose, { Schema, Document, Model} from "mongoose";

export interface userDoc extends Document {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   address: string;
   phone: string;
   verified: boolean;
   otp: number;
   otp_expiry: Date;
   lat: number;
   lng: number;
}

const userSchema: Schema = new Schema({
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true, select: false },
   firstName: { type: String, required: false },
   lastName: { type: String, required: false },
   phone: { type: String, required: true },
   verified: { type: Boolean, default: false },
    otp: { type: Number },
    otp_expiry: { type: Date },
    lat: { type: Number },
    lng: { type: Number }
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


const user = mongoose.model<userDoc>('user', userSchema);
export default user;