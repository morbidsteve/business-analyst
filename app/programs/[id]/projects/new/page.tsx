import { notFound } from "next/navigation"
import Layout from "@/components/Layout"
import { AddProjectForm } from "@/components/AddProjectForm"
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

export default async function AddNewProject({ params }: { params: { id: string } }) {
    const program = await getProgram(params.id)

    return (
        <Layout title={`Add New Project to ${program.name} | Program Analyst`}>
            <h1 className="text-3xl font-bold mb-6">Add New Project to {program.name}</h1>
            <AddProjectForm programId={program.id} />
        </Layout>
    )
}

