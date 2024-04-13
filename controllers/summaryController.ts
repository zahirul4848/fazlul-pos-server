import expressAsync from "express-async-handler";
import { Request, Response } from "express";
import SalesModel from "../models/SalesModel";
import ProductModel from "../models/ProductModel";
import CategoryModel from "../models/CategoryModel";
import PurchaseModel from "../models/PurchaseModel";
import UserModel from "../models/UserModel";

// get all summary // api/summary // get // not protected
export const getSummary = expressAsync(async(req: Request, res: Response)=> {
  
  try {
    const monthlySales = await SalesModel.aggregate([
      {
        $group: {
          _id: {
            month: {
              $month: "$createdAt"
            }
          },
          numOrders: {$sum: 1},
          totalSales: {$sum: '$itemsPrice'}
        }
      }
    ]).limit(12);
    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const monthlySalesArray = monthlySales.map((monthlySale)=> {
      return {...monthlySale, month: monthArray[monthlySale._id.month - 1]};
    });
    const salesMonth = monthlySalesArray.map((item)=> {
      return item.month;
    });
    const salesMonthTotal = monthlySalesArray.map((item)=> {
      return item.totalSales;
    });

    // number of products
    const products = await ProductModel.aggregate([
      {
        $group: {
          _id: null,
          numberOfProducts: {$sum: 1},
        }
      }
    ]);
    // number of categories
    const categories = await CategoryModel.aggregate([
      {
        $group: {
          _id: null,
          numberOfCategories: {$sum: 1},
        }
      }
    ]);
    // number of sales
    const sales = await SalesModel.aggregate([
      {
        $group: {
          _id: null,
          numberOfSales: {$sum: 1},
        }
      }
    ]);
    // number of purchase
    const purchase = await PurchaseModel.aggregate([
      {
        $group: {
          _id: null,
          numberOfPurchase: {$sum: 1},
        }
      }
    ]);
    // number of users
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: null,
          numberOfUsers: {$sum: 1},
        }
      }
    ]);

    res.status(201).json({
      monthlySalesArray, 
      salesMonth, 
      salesMonthTotal, 
      products,
      sales,
      users,
      purchase,
      categories
    });
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})

// get day wise sales // api/summary // get // not protected
export const getDayWiseSales = expressAsync(async(req: Request, res: Response)=> {
  let date = req.query.datePicker as any;
  let startDate = new Date(new Date(date).setHours(0,0,0,0));
  let endDate = new Date(new Date(date).setHours(23,59,59,999));
    
  try {
    const dayWiseSales = await SalesModel.find({createdAt: {$gte: startDate, $lt: endDate}});
    res.status(201).json(dayWiseSales);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})
