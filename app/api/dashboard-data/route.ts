import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get("program")
    const categoryId = searchParams.get("category")

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 12)

    try {
        const budgetData = await prisma.financialData.findMany({
            where: {
                type: "BUDGET_ALLOCATION",
                date: { gte: startDate },
                ...(programId ? { programId } : {}),
            },
            orderBy: { date: "asc" },
        })

        const expenseData = await prisma.expense.findMany({
            where: {
                date: { gte: startDate },
                ...(programId ? { programId } : {}),
                ...(categoryId ? { category: categoryId } : {}),
            },
            orderBy: { date: "asc" },
        })

        const chartData = []
        const currentDate = new Date(startDate)
        let cumulativeBudget = 0
        let cumulativeExpense = 0

        while (currentDate <= new Date()) {
            const monthBudget = budgetData
                .filter(
                    (item) =>
                        new Date(item.date).getMonth() === currentDate.getMonth() &&
                        new Date(item.date).getFullYear() === currentDate.getFullYear(),
                )
                .reduce((sum, item) => sum + item.amount, 0)

            const monthExpense = expenseData
                .filter(
                    (item) =>
                        new Date(item.date).getMonth() === currentDate.getMonth() &&
                        new Date(item.date).getFullYear() === currentDate.getFullYear(),
                )
                .reduce((sum, item) => sum + item.amount, 0)

            cumulativeBudget += monthBudget
            cumulativeExpense += monthExpense

            chartData.push({
                date: currentDate.toISOString().slice(0, 7),
                budget: cumulativeBudget,
                actual: cumulativeExpense,
            })

            currentDate.setMonth(currentDate.getMonth() + 1)
        }

        return NextResponse.json(chartData)
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
    }
}

