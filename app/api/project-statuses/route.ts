import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

function log(message: string, data?: any) {
    console.log(`[API] ${message}`, data ? JSON.stringify(data, null, 2) : "")
}

export async function GET() {
    log("GET /api/project-statuses - Start")
    try {
        log("Prisma instance", { prisma: !!prisma })
        log("Attempting to fetch custom statuses from database")
        const customStatuses = await prisma.customProjectStatus.findMany()
        log("Custom statuses fetched successfully", customStatuses)

        const defaultStatuses = ["PLANNING", "IN_PROGRESS", "COMPLETED", "ON_HOLD", "CANCELLED"]
        log("Default statuses", defaultStatuses)

        const allStatuses = [
            ...defaultStatuses.map((status) => ({ name: status, isDefault: true, color: "#000000" })),
            ...customStatuses.map((status) => ({ ...status, isDefault: false })),
        ]
        log("All statuses combined", allStatuses)

        log("GET /api/project-statuses - End (Success)")
        return NextResponse.json(allStatuses)
    } catch (error) {
        log("GET /api/project-statuses - Error", error)
        console.error("Failed to fetch project statuses:", error)
        return NextResponse.json({ error: "Failed to fetch project statuses", details: error.message }, { status: 500 })
    }
}

export async function POST(request: Request) {
    log("POST /api/project-statuses - Start")
    try {
        const body = await request.json()
        log("Received POST data", body)

        const { name, color } = body
        log("Attempting to create new custom status", { name, color })

        const newStatus = await prisma.customProjectStatus.create({
            data: { name, color },
        })
        log("New custom status created successfully", newStatus)

        log("POST /api/project-statuses - End (Success)")
        return NextResponse.json(newStatus)
    } catch (error) {
        log("POST /api/project-statuses - Error", error)
        console.error("Failed to create custom project status:", error)
        return NextResponse.json({ error: "Failed to create custom project status" }, { status: 500 })
    }
}

