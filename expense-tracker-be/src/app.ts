import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth";
import categoryRoutes from "./routes/category"
import expenseRoutes from "./routes/expense"
import transactionRoutes from "./routes/transaction"


dotenv.config();



const app=express();


app.use(cors({
      origin: "http://localhost:3000", // your frontend URL
  credentials: true, // if using cookies or authorization headers
  }
))
app.use(express.json());

app.use("/api/auth",authRoutes)
app.use("/api/category",categoryRoutes)
app.use("/api/expense",expenseRoutes)
app.use("/api/transactions",transactionRoutes);
app.get("/health", (req, res) => {
  res.send("Backend is live");
});



const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("Server is running on port "+PORT);
})