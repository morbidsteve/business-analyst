import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get("programId")

    try {
        const contracts = await prisma.contract.findMany({
            where: programId ? { programId } : undefined,
            select: {
                id: true,
                contractNumber: true,
                title: true,
            },
        })

        return NextResponse.json(contracts)
    } catch (error) {
        console.error("Failed to fetch contracts:", error)
        return NextResponse.json({ error: "Failed to fetch contracts" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json()
        const contract = await prisma.contract.create({
            data: {
                contractNumber: data.contractNumber,
                title: data.title,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                totalValue: data.totalValue,
                fundedValue: data.fundedValue,
                status: data.status,
                contractingOfficer: data.contractingOfficer,
                corName: data.corName,
                securityClearanceReq: data.securityClearanceReq,
                performanceLocation: data.performanceLocation,
                naicsCode: data.naicsCode,
                smallBusinessGoalPct: data.smallBusinessGoalPct,
                agency: { connect: { id: data.agencyId } },
                contractType: { connect: { id: data.contractTypeId } },
                program: { connect: { id: data.programId } },
            },
            include: {
                agency: true,
                contractType: true,
                program: true,
            },
        })

        return NextResponse.json(contract)
    } catch (error) {
        console.error("Failed to create contract:", error)
        return NextResponse.json({ error: "Failed to create contract" }, { status: 500 })
    }
}

