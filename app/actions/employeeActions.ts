"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function addEmployee(data: {
    name: string
    email: string
    position: string
    department: string
    startDate: string
    endDate?: string
    hourlyRate: number
}) {
    try {
        const employee = await prisma.employee.create({
            data: {
                name: data.name,
                email: data.email,
                position: data.position,
                department: data.department,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                hourlyRate: data.hourlyRate,
            },
        })

        revalidatePath("/employees")
        return { success: true, employee }
    } catch (error) {
        console.error("Failed to add employee:", error)
        return { success: false, error: "Failed to add employee" }
    }
}

export async function updateEmployee(
    id: string,
    data: {
        name: string
        email: string
        position: string
        department: string
        startDate: string
        endDate?: string
        hourlyRate: number
    },
) {
    try {
        const employee = await prisma.employee.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
                position: data.position,
                department: data.department,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : null,
                hourlyRate: data.hourlyRate,
            },
        })

        // Create historical change records
        const oldEmployee = await prisma.employee.findUnique({ where: { id } })
        if (oldEmployee) {
            const changes = Object.entries(data).filter(([key, value]) => oldEmployee[key] !== value)
            await Promise.all(
                changes.map(([field, newValue]) =>
                    prisma.employeeHistoricalChange.create({
                        data: {
                            employeeId: id,
                            field,
                            oldValue: String(oldEmployee[field]),
                            newValue: String(newValue),
                        },
                    }),
                ),
            )
        }

        revalidatePath(`/employees/${id}`)
        return { success: true, employee }
    } catch (error) {
        console.error("Failed to update employee:", error)
        return { success: false, error: "Failed to update employee" }
    }
}

