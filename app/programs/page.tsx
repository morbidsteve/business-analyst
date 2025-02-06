import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getPrograms() {
    return await prisma.program.findMany({
        include: {
            _count: {
                select: { projects: true, personnel: true },
            },
        },
    })
}

export default async function Programs() {
    const programs = await getPrograms()

    return (
        <Layout title="Programs | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Programs</h1>
            <div className="mb-6">
                <Button asChild>
                    <Link href="/programs/new">Add New Program</Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program) => (
                    <Card key={program.id} className="bg-white shadow-md rounded-lg p-6">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold mb-2">
                                <Link href={`/programs/${program.id}`} className="text-primary hover:underline">
                                    {program.name}
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600 mb-4">{program.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
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
                                <div>
                                    <span className="font-medium">Projects:</span> {program._count.projects}
                                </div>
                                <div>
                                    <span className="font-medium">Personnel:</span> {program._count.personnel}
                                </div>
                            </div>
                            <div className="mt-4">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/programs/${program.id}`}>View Details</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Layout>
    )
}

