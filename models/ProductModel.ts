import mongoose, {Document, Schema} from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  description?: string;
  stock: number;
  category: Schema.Types.ObjectId;
}


const productSchema: Schema<IProduct> = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
}, {
  timestamps: true,
});


export default mongoose.model("Product", productSchema);