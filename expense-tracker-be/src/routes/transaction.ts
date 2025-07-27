import express from "express"
import {getTransactions,addTransaction} from "../controllers/transactions"

const router=express.Router();

router.get("/",getTransactions);
router.post("/",addTransaction);

export default router