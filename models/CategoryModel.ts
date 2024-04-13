import mongoose, {Document, Schema, Types} from "mongoose";

export interface ICategory extends Document {
  name: string;
  products: [_id: Types.ObjectId];
}

const categorySchema: Schema<ICategory> = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product"
    },
  ]
}, {
  timestamps: true,
});


export default mongoose.model("Category", categorySchema);