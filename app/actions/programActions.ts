"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function addProgram(data: {
    name: string
    description?: string
    budget: number
    startDate: string
    endDate?: string
}) {
    try {
        const program = await prisma.program.create({
            data: {
                name: data.name,
                description: data.description,
                budget: data.budget,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
            },
        })

        revalidatePath("/programs")
        return { success: true, program }
    } catch (error) {
        console.error("Failed to add program:", error)
        return { success: false, error: "Failed to add program" }
    }
}

