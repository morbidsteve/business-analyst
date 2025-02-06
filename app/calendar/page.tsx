import Layout from "@/components/Layout"
import { Calendar } from "@/components/Calendar"

export default function CalendarPage() {
    return (
        <Layout title="Calendar | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Program Calendar</h1>
            <div className="bg-white p-4 rounded-lg shadow">
                <Calendar />
            </div>
        </Layout>
    )
}

