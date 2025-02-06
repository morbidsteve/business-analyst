"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function addLaborCost(data: {
    programId: string
    employeeId: string
    date: string
    hours: number
    rate: number
}) {
    try {
        const laborCost = await prisma.laborCost.create({
            data: {
                programId: data.programId,
                personnelId: data.employeeId,
                date: new Date(data.date),
                hours: data.hours,
            },
        })

        revalidatePath(`/programs/${data.programId}/manage`)
        return { success: true, laborCost }
    } catch (error) {
        console.error("Failed to add labor cost:", error)
        return { success: false, error: "Failed to add labor cost" }
    }
}
