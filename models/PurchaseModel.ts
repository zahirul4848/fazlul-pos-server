import mongoose, { Document, Schema } from "mongoose";

export interface IPurchase extends Document {
  supplier: string;
  goods: string;
  totalPrice: number;
  paidAmount: number;
}

const purchaseSchema: Schema<IPurchase> = new Schema({
  supplier: {
    type: String,
    required: true,
  },
  goods: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  }
}, {
  timestamps: true,
});


export default mongoose.model("Purchase", purchaseSchema);