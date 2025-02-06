"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddInvoiceForm } from "./AddInvoiceForm"
import { AddWorkHoursForm } from "./AddWorkHoursForm"
import { AddLaborCostForm } from "./AddLaborCostForm"
import { AddFacilitiesCostForm } from "./AddFacilitiesCostForm"
import { AssignEmployeeToProgram } from "./AssignEmployeeToProgram"

type Program = {
    id: string
    name: string
    description: string
    budget: number
    startDate: Date
    endDate: Date | null
    projects: { id: string; name: string; status: string }[]
    personnel: { id: string; name: string; role: string }[]
}

type ProgramManagementProps = {
    program: Program
}

export function ProgramManagement({ program }: ProgramManagementProps) {
    const [activeTab, setActiveTab] = useState("overview")

    return (
        <Card>
            <CardHeader>
                <CardTitle>{program.name} Management</CardTitle>
                <CardDescription>{program.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="invoices">Invoices</TabsTrigger>
                        <TabsTrigger value="workHours">Work Hours</TabsTrigger>
                        <TabsTrigger value="laborCosts">Labor Costs</TabsTrigger>
                        <TabsTrigger value="facilitiesCosts">Facilities Costs</TabsTrigger>
                        <TabsTrigger value="assignEmployee">Assign Employee</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Program Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-2 gap-4">
                                    <div>
                                        <dt className="font-medium">Budget</dt>
                                        <dd>${program.budget.toLocaleString()}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">Start Date</dt>
                                        <dd>{program.startDate.toLocaleDateString()}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">End Date</dt>
                                        <dd>{program.endDate ? program.endDate.toLocaleDateString() : "Ongoing"}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">Projects</dt>
                                        <dd>{program.projects.length}</dd>
                                    </div>
                                    <div>
                                        <dt className="font-medium">Personnel</dt>
                                        <dd>{program.personnel.length}</dd>
                                    </div>
                                </dl>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="invoices">
                        <AddInvoiceForm programId={program.id} />
                    </TabsContent>
                    <TabsContent value="workHours">
                        <AddWorkHoursForm programId={program.id} />
                    </TabsContent>
                    <TabsContent value="laborCosts">
                        <AddLaborCostForm programId={program.id} />
                    </TabsContent>
                    <TabsContent value="facilitiesCosts">
                        <AddFacilitiesCostForm programId={program.id} />
                    </TabsContent>
                    <TabsContent value="assignEmployee">
                        <AssignEmployeeToProgram programId={program.id} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

