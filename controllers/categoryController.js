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
exports.updateCategory = exports.deleteCategory = exports.createCategory = exports.getCategory = exports.getAllCategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
// get all category // api/category // get // not protected
exports.getAllCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.query.name || "";
    const nameFilter = name ? { name: { $regex: name, $options: "i" } } : {};
    try {
        const categories = yield CategoryModel_1.default.find(Object.assign({}, nameFilter));
        res.status(201).json(categories);
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
// get a category // api/category/:id // get // protected by admin
exports.getCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield CategoryModel_1.default.findById(req.params.id);
        res.status(201).json(category);
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
// create new category // api/category // post // protected by admin
exports.createCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        yield CategoryModel_1.default.create({ name });
        res.status(201).json({ message: "Category Created Successfully" });
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
// create new category // api/category/:id // delete // protected by admin
exports.deleteCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield CategoryModel_1.default.findById(req.params.id);
    if (category) {
        if (category.products.length > 0) {
            category.products.forEach((product) => __awaiter(void 0, void 0, void 0, function* () { return yield ProductModel_1.default.findByIdAndDelete(product._id); }));
        }
        yield CategoryModel_1.default.findOneAndDelete(category._id);
        res.status(201).json({ message: "Category Deleted Successfully" });
    }
    else {
        res.status(400);
        throw new Error("Category Not Found with this ID");
    }
}));
// update category // api/category/:id // put // protected by admin
exports.updateCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield CategoryModel_1.default.findById(req.params.id);
    if (category) {
        category.name = req.body.name || category.name;
        yield category.save();
        res.status(201).json({ message: "Category Updated Successfully" });
    }
    else {
        res.status(400);
        throw new Error("Category Not Found with this ID");
    }
}));
