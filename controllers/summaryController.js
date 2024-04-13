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
exports.getDayWiseSales = exports.getSummary = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const SalesModel_1 = __importDefault(require("../models/SalesModel"));
const ProductModel_1 = __importDefault(require("../models/ProductModel"));
const CategoryModel_1 = __importDefault(require("../models/CategoryModel"));
const PurchaseModel_1 = __importDefault(require("../models/PurchaseModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
// get all summary // api/summary // get // not protected
exports.getSummary = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const monthlySales = yield SalesModel_1.default.aggregate([
            {
                $group: {
                    _id: {
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    numOrders: { $sum: 1 },
                    totalSales: { $sum: '$itemsPrice' }
                }
            }
        ]).limit(12);
        const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const monthlySalesArray = monthlySales.map((monthlySale) => {
            return Object.assign(Object.assign({}, monthlySale), { month: monthArray[monthlySale._id.month - 1] });
        });
        const salesMonth = monthlySalesArray.map((item) => {
            return item.month;
        });
        const salesMonthTotal = monthlySalesArray.map((item) => {
            return item.totalSales;
        });
        // number of products
        const products = yield ProductModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    numberOfProducts: { $sum: 1 },
                }
            }
        ]);
        // number of categories
        const categories = yield CategoryModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    numberOfCategories: { $sum: 1 },
                }
            }
        ]);
        // number of sales
        const sales = yield SalesModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    numberOfSales: { $sum: 1 },
                }
            }
        ]);
        // number of purchase
        const purchase = yield PurchaseModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    numberOfPurchase: { $sum: 1 },
                }
            }
        ]);
        // number of users
        const users = yield UserModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    numberOfUsers: { $sum: 1 },
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
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
// get day wise sales // api/summary // get // not protected
exports.getDayWiseSales = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let date = req.query.datePicker;
    let startDate = new Date(new Date(date).setHours(0, 0, 0, 0));
    let endDate = new Date(new Date(date).setHours(23, 59, 59, 999));
    try {
        const dayWiseSales = yield SalesModel_1.default.find({ createdAt: { $gte: startDate, $lt: endDate } });
        res.status(201).json(dayWiseSales);
    }
    catch (err) {
        res.status(400);
        throw new Error(err.message);
    }
}));
