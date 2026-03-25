import mongoose, { Schema, Document, Model} from "mongoose";


export interface foodDoc extends Document {
    vendorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    images: [string];
}

const FoodSchema: Schema = new Schema({
    vendorId: { type: String },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    foodType: { type: String, required: true },
    readyTime: { type: Number, required: true },
    price: { type: Number, required: true },
    rating:{type:Number, default : 0},
    images:[{type:String}]
}, {
    timestamps:true,
    toJSON:{
        transform:(doc, ret: any) => {
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
            return ret;
        }
    },
})

const food = mongoose.model<foodDoc>('food', FoodSchema);
export default food;