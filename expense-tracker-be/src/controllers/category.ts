import {Request,Response,NextFunction} from "express"
import pool from "../db";


export const createCategory=async(req:Request,res:Response, next: NextFunction):Promise<void>=>{
    try{
        const {name,user_id}=req.body;
        const result=await pool.query("INSERT INTO categories (name,user_id) VALUES ($1,$2) RETURNING *",[name,user_id])
        const category=result.rows[0];

        res.status(201).json({message:"Category created successfully",category})

    }catch(error){
        res.status(500).json({message:"Internal server error"})
    }
}

export const getCategories=async(req:Request,res:Response, next: NextFunction):Promise<void>=>{
    try{
        const userId = parseInt(req.params.userId, 10);
        const result=await pool.query("SELECT * FROM categories WHERE user_id=$1",[userId])
        const categories=result.rows[0]
        res.status(200).json({categories})
    }catch(error){
        res.status(500).json({message:"Internal server error"})
    }
}