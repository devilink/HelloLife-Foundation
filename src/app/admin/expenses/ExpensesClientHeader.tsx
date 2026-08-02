"use client";

import { useState } from "react";
import ExpenseFormModal from "@/components/admin/ExpenseFormModal";

export default function ExpensesClientHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Expense
        </button>
      </div>

      {isModalOpen && <ExpenseFormModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}
