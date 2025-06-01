import express from "express";
import {createExpense,getExpenses} from "../controllers/expense"


const router=express.Router()

router.post("/",createExpense)

router.get("/:userId",getExpenses)

export default router;