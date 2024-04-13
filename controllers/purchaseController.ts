import expressAsync from "express-async-handler";
import PurchaseModel from "../models/PurchaseModel";
import { Request, Response } from "express";

// get all purchase // api/purchase // get // not protected
export const getAllPurchase = expressAsync(async(req: Request, res: Response)=> {
  try {
    const purchases = await PurchaseModel.find();
    res.status(201).json(purchases);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})

// create new purchase // api/purchase // post // protected by admin
export const createPurchase = expressAsync(async(req: Request, res: Response)=> {
  const {supplier, paidAmount, totalPrice, goods} = req.body;
  try {
    await PurchaseModel.create({supplier, paidAmount, totalPrice, goods});
    res.status(201).json({message: "Purchase Created Successfully"});
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }  
})

// create new purchase // api/purchase/:id // delete // protected by admin
export const deletePurchase = expressAsync(async(req: Request, res: Response)=> {
  const purchase = await PurchaseModel.findById(req.params.id);
  if(purchase) {
    await PurchaseModel.findOneAndDelete(purchase._id);
    res.status(201).json({message: "Purchase Deleted Successfully"})
  } else {
    res.status(400);
    throw new Error("purchase Not Found with this ID");
  }
})


// update purchase // api/purchase/:id // put // protected by admin
export const updatePurchase = expressAsync(async(req: Request, res: Response)=> {
  const purchase = await PurchaseModel.findById(req.params.id);
  if(purchase) {
    purchase.goods = req.body.goods || purchase.goods;
    purchase.supplier = req.body.supplier || purchase.supplier;
    purchase.totalPrice = req.body.totalPrice || purchase.totalPrice;
    
    if(req.body.paidAmount > (purchase.totalPrice - purchase.paidAmount)) {
      res.status(400);
      throw new Error("Paid amount can not be more than paid amount");
    }

    purchase.paidAmount = req.body.paidAmount || purchase.paidAmount;
    await purchase.save();
    res.status(201).json({message: "Purchase Updated Successfully"});
  } else {
    res.status(400);
    throw new Error("Purchase Not Found with this ID");
  }  
})