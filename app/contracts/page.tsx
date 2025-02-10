import Layout from "@/components/Layout"
import { ContractsTab } from "@/components/ContractsTab"

export default function ContractsPage() {
    return (
        <Layout title="Contracts | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Contracts</h1>
            <ContractsTab />
        </Layout>
    )
}

