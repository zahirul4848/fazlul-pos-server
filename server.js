"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
// routers
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const categoryRouter_1 = __importDefault(require("./routes/categoryRouter"));
// import uploadRouter from "./routes/uploadRouter.js";
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const salesRouter_1 = __importDefault(require("./routes/salesRouter"));
const purchaseRouter_1 = __importDefault(require("./routes/purchaseRouter"));
const summaryRouter_1 = __importDefault(require("./routes/summaryRouter"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
// routes
app.use("/api/user", userRouter_1.default);
app.use("/api/category", categoryRouter_1.default);
// app.use("/api/upload", uploadRouter);
app.use("/api/product", productRouter_1.default);
app.use("/api/sale", salesRouter_1.default);
app.use("/api/purchase", purchaseRouter_1.default);
app.use("/api/summary", summaryRouter_1.default);
// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// error middleware
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL;
mongoose_1.default.connect(MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`Server connected to PORT: ${PORT}`));
});
