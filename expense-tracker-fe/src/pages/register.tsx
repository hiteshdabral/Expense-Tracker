import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/router";
import api from "@/lib/axios";


export default function RegisterPage(){

    const router=useRouter();
    const {login}=useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name,setName]=useState("");
    const [error, setError] = useState("");

    const handleRegister=async(e:React.FormEvent)=>{
        e.preventDefault();
        setError("");
        try{
            const res=await api.post("/auth/register",{email,password,name});
            const data=res.data;
            login(data.user);
            router.push("/dashboard");

        }catch(error:any){
            setError(error.message);
        }
    }

    return (
           <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
            <h2 className="text-2xl mb-4">Login</h2>
            <form onSubmit={handleRegister}>
                <input type="name"
                placeholder="Name"
                className="w-full mb-3 p-2 border rounded"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
                />
                <input type="email"
                placeholder="Email"
                className="w-full mb-3 p-2 border rounded"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Password"
                className="w-fully mb-3 p-2 border rounded"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
                />
                {error && <p className="text-red-500 mb-3">{error}</p>}
                <button className="w-full bg-blue-600 text-white p-2 rounded">
                    Login
                </button>
            </form>
        </div>
    )
}