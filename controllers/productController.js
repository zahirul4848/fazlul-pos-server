"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getAllProducts = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
// get all products // api/product // get // not protected
exports.getAllProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name || "";
    const nameFilter = name ? { title: { $regex: name, $options: "i" } } : {};
    try {
        const products = yield ProductModel_1.default.find(Object.assign({}, nameFilter)).populate("category");
        res.status(201).json(products);
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
// get product by id // api/product/:id // get // not protected
exports.getProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield ProductModel_1.default.findById(req.params.id).populate("category");
        res.status(201).json(product);
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
exports.createProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, price, description, category, stock, } = req.body;
    try {
        const newProduct = yield ProductModel_1.default.create({
            title,
            price,
            description,
            category,
            stock,
        });
        yield CategoryModel_1.default.updateOne({ _id: newProduct.category }, { $push: { products: [newProduct._id] } }, { new: true });
        res.status(201).json({ message: "Product Created Successfully" });
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
// create product by id // api/product/:id // put // protected by admin
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield ProductModel_1.default.findById(req.params.id);
    if (product) {
        product.title = req.body.title || product.title;
        product.price = req.body.price || product.price;
        product.description = req.body.description || product.description;
        product.stock = req.body.stock || product.stock;
        if (req.body.category && req.body.category !== product.category.toString()) {
            yield CategoryModel_1.default.updateOne({ _id: product.category }, { $pull: { products: { $in: [product._id] } } }, { new: true });
            yield CategoryModel_1.default.updateOne({ _id: req.body.category }, { $push: { products: [product._id] } }, { new: true });
            product.category = req.body.category;
        }
        yield product.save();
        res.status(201).json({ message: "Product Updated Successfully" });
    }
    else {
        res.status(400);
        throw new Error("Product Not Found");
    }
}));
// delete product by id // api/product/:id // delete // protected by Admin
exports.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield ProductModel_1.default.findById(req.params.id);
    if (product) {
        yield CategoryModel_1.default.updateOne({ _id: product.category }, { $pull: { products: { $in: [product._id] } } }, { new: true });
        yield ProductModel_1.default.deleteOne({ _id: product._id });
        res.status(200).json({ message: "Product Deleted Successfully" });
    }
    else {
        res.status(400);
        throw new Error("Product Not Found");
    }
}));
