import {Request,Response,RequestHandler} from "express"
import pool from "../db";


export const createExpense: RequestHandler = async (req, res, next) => {
try{
const {amount,description,user_id,category_id,date}=req.body;
const result = await pool.query("SELECT id, name FROM categories WHERE id = $1", [category_id]);
const category = result.rows[0]; 
if(!category){
    // throw createError(404,"Category not found")
      res.status(404).json({message:"Category not found"});
      return
}

const data=await pool.query("INSERT INTO expenses (amount,description,user_id,category_id,date) VALUES ($1,$2,$3,$4,$5) RETURNING *",[amount,description,user_id,category_id,date])
const expense=data.rows[0];

res.status(201).json({message:"Expense created successfully",expense})
 
}catch(error){
    res.status(500).json("Internal server error")
}

}


export const getExpenses=async(req:Request,res:Response)=>{
    try{
       const userId=req.params.userId;
       console.log("hello",userId)
        const result=await pool.query("SELECT * FROM expenses WHERE user_id=$1",[userId])
        const expenses=result.rows[0];
        console.log("expenses",expenses)    
        res.status(200).json({expenses})
        return
    }catch(error){
        console.error("Error fetching expenses:", error);
        res.status(500).json("Internal server error")
        return;
    }
}