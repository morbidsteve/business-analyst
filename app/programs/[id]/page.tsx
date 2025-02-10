import { notFound } from "next/navigation"
import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FinancialDataManagement } from "@/components/FinancialDataManagement"
import { ProgramAnalyticsDashboard } from "@/components/ProgramAnalyticsDashboard"
import { EmployeeManagement } from "@/components/EmployeeManagement"

async function getProgram(id: string) {
    const program = await prisma.program.findUnique({
        where: { id },
        include: {
            projects: true,
            personnel: {
                include: {
                    employee: true,
                },
            },
            financialData: true,
            expenses: true,
            laborCosts: true,
            facilitiesCosts: true,
        },
    })

    if (!program) {
        notFound()
    }

    return program
}

export default async function ProgramDetails({ params }: { params: { id: string } }) {
    const program = await getProgram(params.id)

    return (
        <Layout title={`${program.name} | Program Analyst`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{program.name}</h1>
                <EmployeeManagement programId={program.id} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Program Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 mb-4">{program.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="font-medium">Budget:</span> ${program.budget.toLocaleString()}
                            </div>
                            <div>
                                <span className="font-medium">Start Date:</span> {program.startDate.toLocaleDateString()}
                            </div>
                            <div>
                                <span className="font-medium">End Date:</span>{" "}
                                {program.endDate ? program.endDate.toLocaleDateString() : "Ongoing"}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {program.projects.map((project) => (
                                    <TableRow key={project.id}>
                                        <TableCell>{project.name}</TableCell>
                                        <TableCell>
                                            <Badge>{project.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Personnel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {program.personnel.map((person) => (
                                    <TableRow key={person.id}>
                                        <TableCell>{person.employee?.name || "N/A"}</TableCell>
                                        <TableCell>{person.role}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <FinancialDataManagement programId={program.id} />
            </div>
            <ProgramAnalyticsDashboard programId={program.id} />
        </Layout>
    )
}

