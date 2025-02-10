import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const employees = await prisma.employee.findMany({
            select: {
                id: true,
                name: true,
            },
        })
        return NextResponse.json(employees)
    } catch (error) {
        console.error("Failed to fetch employees:", error)
        return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
    }
}

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
            },
        })

        return NextResponse.json(employee)
    } catch (error) {
        console.error("Failed to create employee:", error)
        return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
    }
}

