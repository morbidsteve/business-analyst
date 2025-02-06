import { notFound } from "next/navigation"
import Link from "next/link"
import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

async function getProgram(id: string) {
    const program = await prisma.program.findUnique({
        where: { id },
        include: {
            projects: {
                select: { id: true, name: true, status: true },
            },
            personnel: {
                select: {
                    id: true,
                    employee: {
                        select: { name: true, position: true },
                    },
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
                <Button asChild>
                    <Link href={`/programs/${program.id}/manage`}>Manage Program</Link>
                </Button>
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
                                        <TableCell>{person.employee.name}</TableCell>
                                        <TableCell>{person.employee.position}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Financial Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {program.financialData.map((data) => (
                                    <TableRow key={data.id}>
                                        <TableCell>{data.type}</TableCell>
                                        <TableCell>${data.amount.toLocaleString()}</TableCell>
                                        <TableCell>{data.date.toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}

