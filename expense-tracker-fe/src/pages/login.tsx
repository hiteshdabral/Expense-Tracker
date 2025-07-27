import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/router";
import PublicRoute from "@/components/PublicRoute";
import RootLayout from "@/components/layouts/RootLayout";
import Head from "next/head";
import api from "@/lib/axios";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await api.post('/auth/login', { email, password });
            const data = res.data;
            
            if (!res.data.user) {
                throw new Error('Login failed');
            }
            
            login(data.user);
            router.push("/dashboard");
        } catch (error: any) {
            setError(error.message);
        }
    }

    return (
        <PublicRoute>
            <RootLayout title="Login - Expense Tracker" description="Login to your account to manage your expenses">
                <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-md w-full bg-white p-8 border rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login to Your Account</h2>
                    <form onSubmit={handleLogin}>
                        <input 
                            type="email"
                            placeholder="Email"
                            className="w-full mb-3 p-2 border rounded"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full mb-3 p-2 border rounded"
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />
                        {error && <p className="text-red-500 mb-3">{error}</p>}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors">
                            Login
                        </button>
                    </form>
                </div>
            </div>
            </RootLayout>
        </PublicRoute>
    );
}