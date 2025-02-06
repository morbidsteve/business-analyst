import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

function log(message: string, data?: any) {
    console.log(`[Test Prisma] ${message}`, data ? JSON.stringify(data, null, 2) : "")
}

export async function GET() {
    log("Testing Prisma connection")
    try {
        const result = await prisma.$queryRaw`SELECT 1 as result`
        log("Prisma connection test result", result)
        return NextResponse.json({ message: "Prisma connection successful", result })
    } catch (error) {
        log("Prisma connection test error", error)
        return NextResponse.json({ error: "Prisma connection failed", details: error.message }, { status: 500 })
    }
}

