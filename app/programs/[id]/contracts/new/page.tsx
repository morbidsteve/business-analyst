import Layout from "@/components/Layout"
import { AddContractForm } from "@/components/AddContractForm"

export default function NewContract({ params }: { params: { id: string } }) {
    return (
        <Layout title="Add New Contract | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Add New Contract</h1>
            <AddContractForm programId={params.id} />
        </Layout>
    )
}

