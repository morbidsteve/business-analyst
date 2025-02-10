import Layout from "@/components/Layout"
import { VisualizationDashboard } from "@/components/VisualizationDashboard"

export default function DashboardPage() {
    return (
        <Layout title="Visualization Dashboard | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Visualization Dashboard</h1>
            <VisualizationDashboard />
        </Layout>
    )
}

