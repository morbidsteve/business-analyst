import Layout from "@/components/Layout"
import { AddWorkHoursForm } from "@/components/AddWorkHoursForm"

export default function NewWorkHours() {
    return (
        <Layout title="Add Work Hours | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Add Work Hours</h1>
            <AddWorkHoursForm />
        </Layout>
    )
}

