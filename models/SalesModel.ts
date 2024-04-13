import mongoose, {Document, Schema} from "mongoose";

export interface ISales extends Document {
  customer: {
    name: string;
    address: string;
    contact: string;
  };
  salesItems: {
    _id: Schema.Types.ObjectId;
    title: string;
    price: number;
    category: string;
    count: number;
  }[];
  orderNumber: string;
  itemsPrice: number;
  payment: number;
  remarks?: string;
  dueAdjustment: 
    { 
      amount: number;
      paidAt: Date;
    }[]
}

const salesSchema: Schema<ISales> = new Schema({
  customer: {
    name: String,
    address: String,
    contact: String,
  },
  salesItems: [
    {
      _id: {type: Schema.Types.ObjectId},
      title: {type: String},
      price: {type: Number},
      category: {type: String},
      count: {type: Number}
    }
  ],
  orderNumber: {
    type: String,
    unique: true,
  },
  itemsPrice: {
    type: Number, 
    required: true,
  },
  payment: {
    type: Number, 
  },
  remarks: {
    type: String,
  },
  dueAdjustment: [
    { 
      amount: {type: Number},
      paidAt: {type: Date},
    }
  ]
}, {
  timestamps: true
})


export default mongoose.model("Sale", salesSchema);