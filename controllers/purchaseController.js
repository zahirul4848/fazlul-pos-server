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
exports.updatePurchase = exports.deletePurchase = exports.createPurchase = exports.getAllPurchase = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const PurchaseModel_1 = __importDefault(require("../models/PurchaseModel"));
// get all purchase // api/purchase // get // not protected
exports.getAllPurchase = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchases = yield PurchaseModel_1.default.find();
        res.status(201).json(purchases);
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
// create new purchase // api/purchase // post // protected by admin
exports.createPurchase = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { supplier, paidAmount, totalPrice, goods } = req.body;
    try {
        yield PurchaseModel_1.default.create({ supplier, paidAmount, totalPrice, goods });
        res.status(201).json({ message: "Purchase Created Successfully" });
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
// create new purchase // api/purchase/:id // delete // protected by admin
exports.deletePurchase = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchase = yield PurchaseModel_1.default.findById(req.params.id);
    if (purchase) {
        yield PurchaseModel_1.default.findOneAndDelete(purchase._id);
        res.status(201).json({ message: "Purchase Deleted Successfully" });
    }
    else {
        res.status(400);
        throw new Error("purchase Not Found with this ID");
    }
}));
// update purchase // api/purchase/:id // put // protected by admin
exports.updatePurchase = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const purchase = yield PurchaseModel_1.default.findById(req.params.id);
    if (purchase) {
        purchase.goods = req.body.goods || purchase.goods;
        purchase.supplier = req.body.supplier || purchase.supplier;
        purchase.totalPrice = req.body.totalPrice || purchase.totalPrice;
        if (req.body.paidAmount > (purchase.totalPrice - purchase.paidAmount)) {
            res.status(400);
            throw new Error("Paid amount can not be more than paid amount");
        }
        purchase.paidAmount = req.body.paidAmount || purchase.paidAmount;
        yield purchase.save();
        res.status(201).json({ message: "Purchase Updated Successfully" });
    }
    else {
        res.status(400);
        throw new Error("Purchase Not Found with this ID");
    }
}));
