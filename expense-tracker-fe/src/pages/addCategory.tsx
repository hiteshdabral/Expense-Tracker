import { useAuth } from "@/context/AuthContext"
import api from "@/lib/axios";
import { showToast } from "@/utils/toast";
import { useRouter } from "next/router";
import { useState } from "react"
import Form from "@/components/Form";


const AddCategory=()=>{
    const {user}=useAuth();
    const router=useRouter();
    const [category,setCategory]=useState("")

    const formConfig={
        fields:[
            {
                "name":"name",
                "label":"Category Name",
                "type":"text" as const,
                "placeholder":"Enter category name",    
                "required":true
            }
        ],
        onSubmit:async(data:any)=>{
            try{
                const response=await api.post('category',{
                    ...data,
                    user_id:user?.id
                })
                showToast.success("Category added successfully");
                router.push("/dashboard");
            }catch(error){
                showToast.error("Failed to add category");
            }
        },
        submitLabel:"Add Category",

    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Category</h1>
                    <Form {...formConfig} />
                </div>
            </div>
        </div>
    )
}

export default AddCategory;