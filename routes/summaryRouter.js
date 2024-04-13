"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const summaryController_1 = require("../controllers/summaryController");
const router = express_1.default.Router();
router.route("/").get(summaryController_1.getSummary);
router.route("/daywisesales").get(summaryController_1.getDayWiseSales);
exports.default = router;
