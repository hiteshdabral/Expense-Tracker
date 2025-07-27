export interface Transaction {
    id: number;
    description: string;
    amount: string;
    type: "income" | "expense";
    date: string; // ISO date string
    category_id: number;
    user_id: number;
}