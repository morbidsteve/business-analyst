import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        // Fetch all unique categories from the Expense table
        const categories = await prisma.expense.findMany({
            select: {
                category: true,
            },
            distinct: ["category"],
        })

        // Map the categories to the required format
        const formattedCategories = categories.map(({ category }) => ({
            id: category,
            name: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
        }))

        return NextResponse.json(formattedCategories)
    } catch (error) {
        console.error("Failed to fetch cost categories:", error)
        return NextResponse.json({ error: "Failed to fetch cost categories" }, { status: 500 })
    }
}

