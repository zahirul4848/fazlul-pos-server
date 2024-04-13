import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {notFound, errorHandler} from "./middleware/errorMiddleware";

// routers
import userRouter from "./routes/userRouter";
import categoryRouter from "./routes/categoryRouter";
// import uploadRouter from "./routes/uploadRouter.js";
import productRouter from "./routes/productRouter";
import saleRouter from "./routes/salesRouter";
import purchaseRouter from "./routes/purchaseRouter";
import summaryRouter from "./routes/summaryRouter";


const app = express();
dotenv.config();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors());

// routes
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
// app.use("/api/upload", uploadRouter);
app.use("/api/product", productRouter);
app.use("/api/sale", saleRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/summary", summaryRouter);

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// error middleware
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5001;
const MONGO_URL = process.env.MONGO_URL as string;

mongoose.connect(MONGO_URL).then(()=> {
  app.listen(PORT, ()=> console.log(`Server connected to PORT: ${PORT}`));
});