"use client"

import FinancialSummary from "@/components/FinancialSummary"
import ProgramOverview from "@/components/ProgramOverview"
import ProjectStatus from "@/components/ProjectStatus"

type DashboardContentProps = {
    financialSummary: {
        totalBudget: number
        totalExpenses: number
        totalRevenue: number
        laborCosts: number
        facilitiesCosts: number
    }
    programs: any[]
    projects: any[]
}

export function DashboardContent({ financialSummary, programs, projects }: DashboardContentProps) {
    return (
        <div className="space-y-6">
            <FinancialSummary
                totalBudget={financialSummary.totalBudget}
                totalExpenses={financialSummary.totalExpenses + financialSummary.laborCosts + financialSummary.facilitiesCosts}
                totalRevenue={financialSummary.totalRevenue}
            />
            <ProgramOverview programs={programs} />
            <ProjectStatus projects={projects} />
        </div>
    )
}

