import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

async function getEmployees() {
    return await prisma.employee.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
    })
}

export default async function Employees() {
    const employees = await getEmployees()

    return (
        <Layout title="Employees | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Employees</h1>
            <div className="mb-6">
                <Button asChild>
                    <Link href="/employees/new">Add New Employee</Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Employee List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {employees.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.position}</TableCell>
                                    <TableCell>{employee.department}</TableCell>
                                    <TableCell>{new Date(employee.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Button asChild variant="link">
                                            <Link href={`/employees/${employee.id}`}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Layout>
    )
}

