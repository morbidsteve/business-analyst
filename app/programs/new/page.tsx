import Layout from "@/components/Layout"
import { AddProgramForm } from "@/components/AddProgramForm"

export default function NewProgram() {
    return (
        <Layout title="Add New Program | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Add New Program</h1>
            <AddProgramForm />
        </Layout>
    )
}

