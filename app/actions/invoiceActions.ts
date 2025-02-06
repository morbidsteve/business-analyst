"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function addInvoice(data: {
    programId: string
    amount: number
    date: string
    description: string
    category: "TRAVEL" | "EQUIPMENT" | "SUPPLIES" | "SERVICES" | "MISCELLANEOUS"
}) {
    try {
        const invoice = await prisma.expense.create({
            data: {
                programId: data.programId,
                amount: data.amount,
                date: new Date(data.date),
                description: data.description,
                category: data.category,
            },
        })

        revalidatePath("/invoices")
        return { success: true, invoice }
    } catch (error) {
        console.error("Failed to add invoice:", error)
        return { success: false, error: "Failed to add invoice" }
    }
}

