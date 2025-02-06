import Layout from "@/components/Layout"
import { AddInvoiceForm } from "@/components/AddInvoiceForm"

export default function NewInvoice() {
    return (
        <Layout title="Add New Invoice | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Add New Invoice</h1>
            <AddInvoiceForm />
        </Layout>
    )
}

