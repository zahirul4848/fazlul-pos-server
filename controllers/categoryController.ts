import expressAsync from "express-async-handler";
import CategoryModel from "../models/CategoryModel";
import { Request, Response } from "express";
import ProductModel from "../models/ProductModel";

// get all category // api/category // get // not protected
export const getAllCategory = expressAsync(async(req: Request, res: Response)=> {
  const name = req.query.name || "";
  const nameFilter = name ? {name: {$regex: name, $options: "i"}} : {};
  try {
    const categories = await CategoryModel.find({...nameFilter});
    res.status(201).json(categories);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})

// get a category // api/category/:id // get // protected by admin
export const getCategory = expressAsync(async(req: Request, res: Response)=> {
  try {
    const category = await CategoryModel.findById(req.params.id);
    res.status(201).json(category);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})

// create new category // api/category // post // protected by admin
export const createCategory = expressAsync(async(req: Request, res: Response)=> {
  const {name} = req.body;
  try {
    await CategoryModel.create({name});
    res.status(201).json({message: "Category Created Successfully"});
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }  
})

// create new category // api/category/:id // delete // protected by admin
export const deleteCategory = expressAsync(async(req: Request, res: Response)=> {
  const category = await CategoryModel.findById(req.params.id);
  if(category) {
    if(category.products.length > 0) {
      category.products.forEach(async(product)=> await ProductModel.findByIdAndDelete(product._id));
    }
    await CategoryModel.findOneAndDelete(category._id);
    res.status(201).json({message: "Category Deleted Successfully"})
  } else {
    res.status(400);
    throw new Error("Category Not Found with this ID");
  }
})


// update category // api/category/:id // put // protected by admin
export const updateCategory = expressAsync(async(req: Request, res: Response)=> {
  const category = await CategoryModel.findById(req.params.id);
  if(category) {
    category.name = req.body.name || category.name;
    await category.save();
    res.status(201).json({message: "Category Updated Successfully"});
  } else {
    res.status(400);
    throw new Error("Category Not Found with this ID");
  }  
})