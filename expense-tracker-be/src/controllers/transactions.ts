import {Request,Response} from "express"
import pool from "../db"


export const getTransactions=async(req:Request,res:Response)=>{
    try{
        const {userId}=req.query;
        const result =await pool.query(
            "SELECT * FROM transactions where user_id=$1 ORDER BY date DESC",[userId]
        );
         res.json(result.rows)
    }catch(error){
  if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Internal server error" });
    }    }
}


export const addTransaction=async(req:Request,res:Response)=>{
    try{
const {title,amount,type,date,category_id,user_id}=req.body;

const result=await pool.query(
    "INSERT INTO transactions (title, amount,type,date,category_id,user_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",[title,amount,type,date,category_id,user_id]
)

res.status(201).json(result.rows[0])
    }catch(error){
  if (error instanceof Error) {
        res.status(500).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Internal server error" });
    }    }
}