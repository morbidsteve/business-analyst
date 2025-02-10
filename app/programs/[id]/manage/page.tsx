import { notFound } from "next/navigation"
import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import { ProgramManagement } from "@/components/ProgramManagement"

async function getProgram(id: string) {
    const program = await prisma.program.findUnique({
        where: { id },
        include: {
            projects: true,
            personnel: {
                include: {
                    employee: true,
                },
            },
            financialData: true,
            expenses: true,
            laborCosts: true,
            facilitiesCosts: true,
        },
    })

    if (!program) {
        notFound()
    }

    return program
}

export default async function ManageProgram({ params }: { params: { id: string } }) {
    const program = await getProgram(params.id)

    return (
        <Layout title={`Manage ${program.name} | Program Analyst`}>
            <h1 className="text-3xl font-bold mb-6">Manage {program.name}</h1>
            <ProgramManagement program={program} />
        </Layout>
    )
}

