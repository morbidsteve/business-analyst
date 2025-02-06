import { notFound } from "next/navigation"
import Link from "next/link"
import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type React from "react"
import { UpdateEmployeeForm } from "@/components/UpdateEmployeeForm"

async function getEmployee(id: string) {
    const employee = await prisma.employee.findUnique({
        where: { id },
        include: {
            personnel: {
                include: {
                    program: true,
                },
            },
        },
    })

    if (!employee) {
        notFound()
    }

    return employee
}

const EmployeeDetails: React.FC<{ params: { id: string } }> = async ({ params }) => {
    const employee = await getEmployee(params.id)

    return (
        <Layout title={`${employee.name} | Program Analyst`}>
            <h1 className="text-3xl font-bold mb-6">{employee.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Employee Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid grid-cols-1 gap-4">
                            <div>
                                <dt className="font-medium">Email</dt>
                                <dd>{employee.email}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Position</dt>
                                <dd>{employee.position}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Department</dt>
                                <dd>{employee.department}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Start Date</dt>
                                <dd>{new Date(employee.startDate).toLocaleDateString()}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">End Date</dt>
                                <dd>{employee.endDate ? new Date(employee.endDate).toLocaleDateString() : "N/A"}</dd>
                            </div>
                            <div>
                                <dt className="font-medium">Hourly Rate</dt>
                                <dd>${employee.hourlyRate.toFixed(2)}</dd>
                            </div>
                        </dl>
                    </CardContent>
                </Card>

                <UpdateEmployeeForm employee={employee} />
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Assigned Programs</h2>
            {employee.personnel.length > 0 ? (
                <ul className="space-y-2">
                    {employee.personnel.map((assignment) => (
                        <li key={assignment.id}>
                            <Link href={`/programs/${assignment.program.id}`} className="block">
                                <Card className="hover:shadow-md transition-shadow duration-200">
                                    <CardContent className="py-4">
                                        <div>
                                            <p className="font-medium">{assignment.program.name}</p>
                                            <p className="text-sm text-gray-500">
                                                From: {new Date(assignment.startDate).toLocaleDateString()}
                                                {assignment.endDate
                                                    ? ` To: ${new Date(assignment.endDate).toLocaleDateString()}`
                                                    : " (Ongoing)"}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>This employee is not currently assigned to any programs.</p>
            )}
        </Layout>
    )
}

export default EmployeeDetails

