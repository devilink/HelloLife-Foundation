"use client";

import { useState } from "react";
import ImpactGallery from "@/components/home/ImpactGallery";

export default function ProjectTabs({ project }: { project: any }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="bg-card rounded-[2rem] p-8 border border-border shadow-sm mb-8">
      {/* Tabs */}
      <div className="flex overflow-x-auto gap-8 border-b border-border mb-8 pb-4 scrollbar-hide">
        {["Overview", "Gallery", "Updates", "Expenses"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`font-semibold whitespace-nowrap transition-colors pb-4 -mb-[18px] ${
              activeTab === tab.toLowerCase() 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
          <p className="text-xl text-foreground font-medium mb-6">
            {project.description}
          </p>
          <p>
            Our dedicated teams are on the ground working tirelessly to ensure that every affected family receives the help they need. The funds raised will directly go towards procuring essential supplies, rebuilding temporary shelters, and providing necessary medical assistance.
          </p>
          <p>
            We are committed to absolute transparency. Every expenditure related to this project will be documented and available in our Financial Dashboard once verified by our administration team.
          </p>
          <h3>How your donation helps:</h3>
          <ul>
            <li>₹1,000 provides a family with clean drinking water for a week.</li>
            <li>₹2,500 covers the cost of emergency medical supplies for one individual.</li>
            <li>₹5,000 helps in rebuilding a temporary shelter.</li>
          </ul>
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="py-4">
          <p className="text-muted-foreground mb-8">Impact images from this project will be displayed here.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Displaying project specific images if they exist, else placeholder */}
            {project.images?.slice(1).map((img: any, i: number) => (
              <img key={i} src={img.url} className="rounded-xl w-full h-48 object-cover" />
            ))}
            {(!project.images || project.images.length <= 1) && (
              <div className="col-span-2 md:col-span-3 p-8 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground">
                No gallery images uploaded for this project yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "updates" && (
        <div className="py-4 text-center text-muted-foreground">
          No updates posted yet.
        </div>
      )}

      {activeTab === "expenses" && (
        <div className="py-4">
          <p className="text-muted-foreground mb-6">Transparent ledger of all expenses verified and logged for this specific project.</p>
          {(!project.expenses || project.expenses.length === 0) ? (
            <div className="p-8 border-2 border-dashed border-border rounded-xl text-center text-muted-foreground">
              No expenses have been logged for this project yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground text-sm border-b border-border">
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {project.expenses.map((expense: any) => (
                    <tr key={expense.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-foreground">{expense.title}</td>
                      <td className="p-4 text-sm">
                        <span className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium border border-border">
                          {expense.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-rose-600 dark:text-rose-400">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
