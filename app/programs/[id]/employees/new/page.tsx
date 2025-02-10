import { notFound } from "next/navigation"
import Layout from "@/components/Layout"
import { AddEmployeeForm } from "@/components/AddEmployeeForm"
import prisma from "@/lib/prisma"

async function getProgram(id: string) {
    const program = await prisma.program.findUnique({
        where: { id },
        select: { id: true, name: true },
    })

    if (!program) {
        notFound()
    }

    return program
}

export default async function AddNewEmployee({ params }: { params: { id: string } }) {
    const program = await getProgram(params.id)

    return (
        <Layout title={`Add New Employee to ${program.name} | Program Analyst`}>
            <h1 className="text-3xl font-bold mb-6">Add New Employee to {program.name}</h1>
            <AddEmployeeForm programId={program.id} />
        </Layout>
    )
}

