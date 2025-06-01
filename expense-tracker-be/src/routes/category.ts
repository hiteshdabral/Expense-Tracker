import express from "express";
import {createCategory,getCategories} from "../controllers/category"
const router=express.Router();


router.post('/',createCategory)

router.get('/:userId',getCategories)

export default  router; 