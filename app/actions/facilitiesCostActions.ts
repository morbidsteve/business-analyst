"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function addFacilitiesCost(data: {
    programId: string
    amount: number
    date: string
    description: string
}) {
    try {
        const facilitiesCost = await prisma.facilitiesCost.create({
            data: {
                programId: data.programId,
                amount: data.amount,
                date: new Date(data.date),
                description: data.description,
            },
        })

        revalidatePath(`/programs/${data.programId}/manage`)
        return { success: true, facilitiesCost }
    } catch (error) {
        console.error("Failed to add facilities cost:", error)
        return { success: false, error: "Failed to add facilities cost" }
    }
}
