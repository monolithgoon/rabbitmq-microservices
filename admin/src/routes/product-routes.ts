import express, { Router } from "express";
import * as productController from "../controllers/products-controller";

const rotuer: Router = express.Router();

rotuer.get("/api/products", productController.getProducts);
rotuer.post("/api/products", productController.addProduct);

export default rotuer;