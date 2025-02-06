import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Button } from "../components/ui/button"
import { ArrowRight } from "lucide-react"

type Program = {
    id: string
    name: string
    budget: number
    startDate: string
    endDate: string | null
}

type ProgramOverviewProps = {
    programs: Program[]
}

export default function ProgramOverview({ programs }: ProgramOverviewProps) {
    return (
        <Card className="col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Program Overview</CardTitle>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/calendar">View Calendar</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Budget</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {programs.map((program) => (
                            <TableRow key={program.id}>
                                <TableCell className="font-medium">{program.name}</TableCell>
                                <TableCell>${program.budget.toLocaleString()}</TableCell>
                                <TableCell>{new Date(program.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{program.endDate ? new Date(program.endDate).toLocaleDateString() : "Ongoing"}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href={`/programs/${program.id}`}>
                                            View Details
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

