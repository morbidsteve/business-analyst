"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function addWorkHours(data: {
    employeeId: string
    programId: string
    date: string
    hours: number
}) {
    try {
        const workHours = await prisma.laborCost.create({
            data: {
                personnelId: data.employeeId,
                programId: data.programId,
                date: new Date(data.date),
                hours: data.hours,
            },
        })

        revalidatePath("/work-hours")
        return { success: true, workHours }
    } catch (error) {
        console.error("Failed to add work hours:", error)
        return { success: false, error: "Failed to add work hours" }
    }
}

