import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get("programId")
    const chartType = searchParams.get("chartType")

    if (!programId || !chartType) {
        return NextResponse.json({ error: "Program ID and chart type are required" }, { status: 400 })
    }

    try {
        let data

        switch (chartType) {
            // Financial charts
            case "burnRate":
                data = await getBurnRateData(programId)
                break
            case "expenseVsBudget":
                data = await getExpenseVsBudgetData(programId)
                break
            case "obligationRate":
                data = await getObligationRateData(programId)
                break
            case "revenueVsExpenses":
                data = await getRevenueVsExpensesData(programId)
                break
            case "profitMargin":
                data = await getProfitMarginData(programId)
                break

            // Operational charts
            case "resourceUtilization":
                data = await getResourceUtilizationData(programId)
                break
            case "employeeProductivity":
                data = await getEmployeeProductivityData(programId)
                break
            case "cycleTimeAnalysis":
                data = await getCycleTimeAnalysisData(programId)
                break

            // Project Progress charts
            case "milestoneCompletion":
                data = await getMilestoneCompletionData(programId)
                break
            case "projectStatus":
                data = await getProjectStatusData(programId)
                break
            case "ganttChart":
                data = await getGanttChartData(programId)
                break

            // Risk Assessment charts
            case "riskMatrix":
                data = await getRiskMatrixData(programId)
                break
            case "riskTrend":
                data = await getRiskTrendData(programId)
                break
            case "issueTracker":
                data = await getIssueTrackerData(programId)
                break

            default:
                return NextResponse.json({ error: "Invalid chart type" }, { status: 400 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Failed to fetch program analytics:", error)
        return NextResponse.json({ error: "Failed to fetch program analytics" }, { status: 500 })
    }
}

async function getBurnRateData(programId: string) {
    const financialData = await prisma.financialData.findMany({
        where: { programId, type: "EXPENSE" },
        orderBy: { date: "asc" },
    })

    let cumulativeExpense = 0
    return financialData.map((data) => {
        cumulativeExpense += data.amount
        return {
            date: data.date.toISOString().split("T")[0],
            burnRate: cumulativeExpense,
        }
    })
}

async function getExpenseVsBudgetData(programId: string) {
    const program = await prisma.program.findUnique({
        where: { id: programId },
        include: { financialData: true },
    })

    if (!program) {
        throw new Error("Program not found")
    }

    const monthlyBudget = program.budget / 12 // Assuming a 12-month program duration

    const expenseData = program.financialData
        .filter((data) => data.type === "EXPENSE")
        .reduce(
            (acc, data) => {
                const month = data.date.toISOString().slice(0, 7) // YYYY-MM
                acc[month] = (acc[month] || 0) + data.amount
                return acc
            },
            {} as Record<string, number>,
        )

    return Object.entries(expenseData).map(([month, expense]) => ({
        month,
        expense,
        budget: monthlyBudget,
    }))
}

async function getObligationRateData(programId: string) {
    const program = await prisma.program.findUnique({
        where: { id: programId },
        include: { financialData: true },
    })

    if (!program) {
        throw new Error("Program not found")
    }

    let cumulativeObligation = 0
    return program.financialData
        .filter((data) => data.type === "EXPENSE" || data.type === "BUDGET_ALLOCATION")
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((data) => {
            if (data.type === "EXPENSE") {
                cumulativeObligation += data.amount
            }
            return {
                date: data.date.toISOString().split("T")[0],
                obligationRate: (cumulativeObligation / program.budget) * 100,
            }
        })
}

async function getRevenueVsExpensesData(programId: string) {
    const financialData = await prisma.financialData.findMany({
        where: { programId, type: { in: ["REVENUE", "EXPENSE"] } },
        orderBy: { date: "asc" },
    })

    const monthlyData: Record<string, { revenue: number; expenses: number }> = {}

    financialData.forEach((data) => {
        const month = data.date.toISOString().slice(0, 7) // YYYY-MM
        if (!monthlyData[month]) {
            monthlyData[month] = { revenue: 0, expenses: 0 }
        }
        if (data.type === "REVENUE") {
            monthlyData[month].revenue += data.amount
        } else {
            monthlyData[month].expenses += data.amount
        }
    })

    return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        revenue: data.revenue,
        expenses: data.expenses,
    }))
}

async function getProfitMarginData(programId: string) {
    const financialData = await prisma.financialData.findMany({
        where: { programId, type: { in: ["REVENUE", "EXPENSE"] } },
        orderBy: { date: "asc" },
    })

    const monthlyData: Record<string, { revenue: number; expenses: number }> = {}

    financialData.forEach((data) => {
        const month = data.date.toISOString().slice(0, 7) // YYYY-MM
        if (!monthlyData[month]) {
            monthlyData[month] = { revenue: 0, expenses: 0 }
        }
        if (data.type === "REVENUE") {
            monthlyData[month].revenue += data.amount
        } else {
            monthlyData[month].expenses += data.amount
        }
    })

    return Object.entries(monthlyData).map(([month, data]) => {
        const profitMargin = data.revenue > 0 ? ((data.revenue - data.expenses) / data.revenue) * 100 : 0
        return {
            month,
            profitMargin,
        }
    })
}

async function getResourceUtilizationData(programId: string) {
    const personnel = await prisma.personnel.findMany({
        where: { programId },
        include: { employee: true },
    })

    return personnel.map((person) => ({
        resource: person.employee.name,
        utilization: Math.random() * 100, // Replace with actual utilization calculation
    }))
}

async function getEmployeeProductivityData(programId: string) {
    const personnel = await prisma.personnel.findMany({
        where: { programId },
        include: { employee: true },
    })

    return personnel.map((person) => ({
        employee: person.employee.name,
        hoursWorked: Math.floor(Math.random() * 160) + 40, // Replace with actual hours worked
        tasksCompleted: Math.floor(Math.random() * 50) + 10, // Replace with actual tasks completed
    }))
}

async function getCycleTimeAnalysisData(programId: string) {
    // This is a placeholder. In a real application, you would have a table of processes and their cycle times.
    const processes = ["Requirements", "Design", "Development", "Testing", "Deployment"]
    return processes.map((process) => ({
        process,
        cycleTime: Math.floor(Math.random() * 30) + 1, // Random cycle time between 1 and 30 days
    }))
}

async function getMilestoneCompletionData(programId: string) {
    const projects = await prisma.project.findMany({
        where: { programId },
    })

    return projects.map((project) => ({
        milestone: project.name,
        completionPercentage: Math.floor(Math.random() * 100), // Replace with actual completion percentage
    }))
}

async function getProjectStatusData(programId: string) {
    const projects = await prisma.project.findMany({
        where: { programId },
    })

    return projects.map((project) => ({
        project: project.name,
        completionPercentage: Math.floor(Math.random() * 100), // Replace with actual completion percentage
    }))
}

async function getGanttChartData(programId: string) {
    const projects = await prisma.project.findMany({
        where: { programId },
    })

    return projects.map((project) => ({
        task: project.name,
        date: project.startDate.toISOString().split("T")[0],
        duration: Math.floor((project.endDate.getTime() - project.startDate.getTime()) / (1000 * 3600 * 24)),
    }))
}

async function getRiskMatrixData(programId: string) {
    // This is a placeholder. In a real application, you would have a table of identified risks.
    const risks = ["Budget Overrun", "Schedule Delay", "Scope Creep", "Resource Shortage", "Technical Issues"]
    return risks.map((risk) => ({
        name: risk,
        likelihood: Math.floor(Math.random() * 100),
        impact: Math.floor(Math.random() * 100),
        value: Math.floor(Math.random() * 1000000),
    }))
}

async function getRiskTrendData(programId: string) {
    // This is a placeholder. In a real application, you would track risks over time.
    const dates = Array.from({ length: 6 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - 5 + i)
        return date.toISOString().slice(0, 7) // YYYY-MM
    })

    return dates.map((date) => ({
        date,
        highRisks: Math.floor(Math.random() * 5),
        mediumRisks: Math.floor(Math.random() * 10),
        lowRisks: Math.floor(Math.random() * 15),
    }))
}

async function getIssueTrackerData(programId: string) {
    // This is a placeholder. In a real application, you would have a table of issues.
    const categories = ["Technical", "Process", "People", "External"]
    return categories.map((category) => ({
        category,
        openIssues: Math.floor(Math.random() * 10),
        closedIssues: Math.floor(Math.random() * 15),
    }))
}

