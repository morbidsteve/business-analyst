import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const employee = await prisma.employee.create({
            data: {
                name: data.name,
                email: data.email,
                position: data.position,
                department: data.department,
                startDate: new Date(data.startDate),
                hourlyRate: data.hourlyRate,
            },
        })

        // Add the employee to the program's personnel
        await prisma.personnel.create({
            data: {
                programId: data.programId,
                employeeId: employee.id,
                role: data.position,
                startDate: new Date(data.startDate),
                contractId: data.isPlanning ? null : data.contractId,
                laborCategoryId: data.isPlanning ? null : data.laborCategoryId,
                assignmentStart: new Date(data.startDate),
                billableRate: data.hourlyRate * 2, // Example: billable rate is twice the hourly rate
                clearanceLevel: "None", // Default value, you may want to add this to the form
                currentStatus: true,
            },
        })

        return NextResponse.json(employee)
    } catch (error) {
        console.error("Failed to create employee:", error)
        return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
    }
}

// ... (keep the existing GET method)

