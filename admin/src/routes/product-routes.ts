import express, { Router } from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getProduct,
	likeProduct,
	updateProduct,
} from "../controllers/product-controller";

const router: Router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/:id/like", likeProduct);

export default router;
