import expressAsync from "express-async-handler";
import SalesModel from "../models/SalesModel";
import CounterModel from "../models/CounterModel";
import ProductModel from "../models/ProductModel";

// get all sales // api/sale // get // protected by admin
export const getAllSales = expressAsync(async(req, res)=> {
  const orderNumber = req.query.orderNumber || "";
  const orderNumberFilter = orderNumber ? {orderNumber: {$regex: orderNumber, $options: "i"}} : {};
  try {
    const sales = await SalesModel.find({...orderNumberFilter}).sort({createdAt: -1});
    res.status(201).json(sales);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})

// get sales by id // api/sale/:id // get // protected by user
export const getSale = expressAsync(async(req, res)=> {
  try {
    const sale = await SalesModel.findById(req.params.id);
    res.status(201).json(sale);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})

// create new sale // api/sale // post // protected by user
export const createSale = expressAsync(async(req, res)=> {
  if(req.body.salesItems.length === 0) {
    res.status(400);
    throw new Error("No Product Selected");
  } 
  if(req.body.payment > req.body.itemsPrice) {
    res.status(400);
    throw new Error("Payment can not be more than total price");
  } 
  try {
    const counter = await CounterModel.findOneAndUpdate( {}, {$inc: { seq: 1} },);
    if(!counter) {
      await CounterModel.create({seq: 1});
      res.status(400);
      throw new Error("Counter Not Found, Please try again");
    }
    req.body.salesItems.forEach(async(salesItem: any)=> {
      const product = await ProductModel.findById(salesItem._id);
      if(!product) {
        res.status(400);
        throw new Error("Product Not Found");
      }
      if(salesItem.count > product.stock) {
        res.status(400);
        throw new Error("Count can not be more than product stock");
      }
      product.stock = Number(product.stock - salesItem.count);
      await product.save();
    });
    const sale = new SalesModel({
      customer: req.body.customer,
      orderNumber: counter?.seq,
      salesItems: req.body.salesItems,
      itemsPrice: req.body.itemsPrice,
      payment: req.body.payment,
      remarks: req.body.remarks,
    });
    // due adjustment
    if(req.body.payment > 0) {
      sale.dueAdjustment.push({
        amount: req.body.payment,
        paidAt: new Date(Date.now()),
      })
    }
    await sale.save();
    res.status(201).json({
      message: "Sale Placed Successfully",
    });      
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
});

// dueAdjustmentById by id // api/sale/adjustment/:id // put // protected by admin
export const dueAdjustment = expressAsync(async(req, res)=> {
  try {
    const sale = await SalesModel.findById(req.params.id);
    if(sale) {
      const dueAmount = sale.itemsPrice - sale.payment;
      if(req.body.amount > dueAmount) {
        res.status(400);
        throw new Error("Payment amount can not be more than due amount");
      }
      sale.dueAdjustment.push({
        amount: req.body.amount,
        paidAt: new Date(Date.now()),
      });
      sale.payment = sale.payment + req.body.amount;
      await sale.save();
      res.status(201).json({message: "Payment successfully updated"});
    } else {
      res.status(400);
      throw new Error("Not found with this id");
    }
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})

// delete sale by id // api/sale/:id // delete // protected by admin
export const deleteSale = expressAsync(async(req, res)=> {
  try {
    const sale = await SalesModel.findById(req.params.id);
    if(sale) {
      // stock adjustment
      sale.salesItems.forEach(async(salesItem: any)=> {
        const product = await ProductModel.findById(salesItem._id);
        if(product) {
          product.stock = Number(product.stock + salesItem.count);
          await product.save();
        }
      });
      await SalesModel.findByIdAndDelete(req.params.id);
      res.status(201).json({message: "Sale Successfully deleted"});
    } else {
      res.status(400);
      throw new Error("Sales not found");
    }
    
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})





