import Layout from "@/components/Layout"
import { AddEmployeeForm } from "@/components/AddEmployeeForm"

export default function NewEmployee() {
    return (
        <Layout title="Add New Employee | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Add New Employee</h1>
            <AddEmployeeForm />
        </Layout>
    )
}

