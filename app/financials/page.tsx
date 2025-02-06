import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function getFinancialData() {
    const financialData = await prisma.financialData.findMany({
        include: {
            program: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            date: "desc",
        },
    })

    const totalRevenue = financialData
        .filter((data) => data.type === "REVENUE")
        .reduce((sum, data) => sum + data.amount, 0)

    const totalExpenses = financialData
        .filter((data) => data.type === "EXPENSE")
        .reduce((sum, data) => sum + data.amount, 0)

    return {
        financialData,
        totalRevenue,
        totalExpenses,
    }
}

export default async function Financials() {
    const { financialData, totalRevenue, totalExpenses } = await getFinancialData()

    return (
        <Layout title="Financials | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Financials</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Expenses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold text-red-600">${totalExpenses.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Net Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p
                            className={`text-2xl font-bold ${totalRevenue - totalExpenses >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                            ${(totalRevenue - totalExpenses).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Financial Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Program</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {financialData.map((data) => (
                                <TableRow key={data.id}>
                                    <TableCell>{data.date.toLocaleDateString()}</TableCell>
                                    <TableCell>{data.program.name}</TableCell>
                                    <TableCell>{data.type}</TableCell>
                                    <TableCell className={data.type === "REVENUE" ? "text-green-600" : "text-red-600"}>
                                        ${data.amount.toLocaleString()}
                                    </TableCell>
                                    <TableCell>{data.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Layout>
    )
}

