"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

type Project = {
    id: string
    name: string
    status: string
    programName: string
}

type ProjectStatusProps = {
    projects: Project[]
}

type StatusColor = {
    name: string
    color: string
}

export default function ProjectStatus({ projects }: ProjectStatusProps) {
    const [statusColors, setStatusColors] = useState<StatusColor[]>([])

    useEffect(() => {
        const fetchStatusColors = async () => {
            const response = await fetch("/api/project-statuses")
            if (response.ok) {
                const data = await response.json()
                setStatusColors(data)
            }
        }
        fetchStatusColors()
    }, [])

    const getStatusColor = (status: string): string => {
        const statusColor = statusColors.find((s) => s.name === status)
        return statusColor?.color || "bg-gray-100 text-gray-800"
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Project Status</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Program</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                <TableCell>{project.programName}</TableCell>
                                <TableCell>
                                    <Badge
                                        className={`${getStatusColor(project.status)}`}
                                        style={{ backgroundColor: getStatusColor(project.status) }}
                                    >
                                        {project.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

