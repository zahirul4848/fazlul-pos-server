import expressAsync from "express-async-handler";
import ProductModel from "../models/ProductModel";
import CategoryModel from "../models/CategoryModel";
import { Request, Response } from "express";


// get all products // api/product // get // not protected
export const getAllProducts = expressAsync(async(req: Request, res: Response)=> {
  const name = req.query.name || "";
  const nameFilter = name ? {title: {$regex: name, $options: "i"}} : {};
  try {
    const products = await ProductModel.find({...nameFilter}).populate("category");
    res.status(201).json(products);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})

// get product by id // api/product/:id // get // not protected
export const getProduct = expressAsync(async(req, res)=> {
  try {
    const product = await ProductModel.findById(req.params.id).populate("category");
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }
})


// create new product // api/product // post // protected by admin

type ProductRequest = {
  title: string;
  price: number;
  stock: number;
  description?: string;
  category: string;
}
export const createProduct = expressAsync(async(req, res)=> {
  const {
    title,
    price,
    description,
    category,
    stock,
  } = req.body as ProductRequest;
  try {
    const newProduct = await ProductModel.create({
      title,
      price,
      description,
      category,
      stock,
    });
    await CategoryModel.updateOne(
      {_id: newProduct.category},
      {$push: {products: [newProduct._id]}},
      {new: true},
    );
    res.status(201).json({message: "Product Created Successfully"});
  } catch (err: any) {
    res.status(400);
    throw new Error(err.message);
  }  
})

// create product by id // api/product/:id // put // protected by admin
export const updateProduct = expressAsync(async(req, res)=> {
  const product = await ProductModel.findById(req.params.id);
  if(product) {
    product.title = req.body.title || product.title;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.stock = req.body.stock || product.stock;
    
    if(req.body.category && req.body.category !== product.category.toString()) {
      await CategoryModel.updateOne(
        {_id: product.category},
        {$pull: {products: {$in: [product._id]}}},
        {new: true},
      )
      await CategoryModel.updateOne(
        {_id: req.body.category},
        {$push: {products: [product._id]}},
        {new: true},
      )
      product.category = req.body.category;
    }
    await product.save();
    res.status(201).json({message: "Product Updated Successfully"});
  } else {
    res.status(400);
    throw new Error("Product Not Found");
  }
})


// delete product by id // api/product/:id // delete // protected by Admin
export const deleteProduct = expressAsync(async(req, res)=> {
  const product = await ProductModel.findById(req.params.id);
  if(product) {
    await CategoryModel.updateOne(
      {_id: product.category},
      {$pull: {products: {$in: [product._id]}}},
      {new: true},
    )
    await ProductModel.deleteOne({_id: product._id});
    res.status(200).json({message: "Product Deleted Successfully"});
  } else {
    res.status(400);
    throw new Error("Product Not Found");
  }
})
