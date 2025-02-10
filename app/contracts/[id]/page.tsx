import { notFound } from "next/navigation"
import Layout from "@/components/Layout"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EditableField } from "@/components/EditableField"
import { FileUpload } from "@/components/FileUpload"
import { getContractAttachments } from "@/app/actions/contractActions"

async function getContract(id: string) {
    const contract = await prisma.contract.findUnique({
        where: { id },
        include: {
            agency: true,
            contractType: true,
            program: true,
        },
    })

    if (!contract) {
        notFound()
    }

    return contract
}

export default async function ContractDetails({ params }: { params: { id: string } }) {
    const contract = await getContract(params.id)
    const attachments = await getContractAttachments(params.id)

    return (
        <Layout title={`${contract.title} | Program Analyst`}>
            <h1 className="text-3xl font-bold mb-6">{contract.title}</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Contract Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <dl className="space-y-4">
                        <EditableField
                            label="Contract Number"
                            value={contract.contractNumber}
                            fieldName="contractNumber"
                            contractId={contract.id}
                        />
                        <EditableField label="Title" value={contract.title} fieldName="title" contractId={contract.id} />
                        <EditableField label="Status" value={contract.status} fieldName="status" contractId={contract.id} />
                        <EditableField
                            label="Start Date"
                            value={contract.startDate.toISOString().split("T")[0]}
                            fieldName="startDate"
                            contractId={contract.id}
                            type="date"
                        />
                        <EditableField
                            label="End Date"
                            value={contract.endDate.toISOString().split("T")[0]}
                            fieldName="endDate"
                            contractId={contract.id}
                            type="date"
                        />
                        <EditableField
                            label="Total Value"
                            value={contract.totalValue}
                            fieldName="totalValue"
                            contractId={contract.id}
                            type="number"
                        />
                        <EditableField
                            label="Funded Value"
                            value={contract.fundedValue}
                            fieldName="fundedValue"
                            contractId={contract.id}
                            type="number"
                        />
                        <EditableField
                            label="Contracting Officer"
                            value={contract.contractingOfficer}
                            fieldName="contractingOfficer"
                            contractId={contract.id}
                        />
                        <EditableField label="COR Name" value={contract.corName} fieldName="corName" contractId={contract.id} />
                        <EditableField
                            label="Security Clearance Requirement"
                            value={contract.securityClearanceReq}
                            fieldName="securityClearanceReq"
                            contractId={contract.id}
                        />
                        <EditableField
                            label="Performance Location"
                            value={contract.performanceLocation}
                            fieldName="performanceLocation"
                            contractId={contract.id}
                        />
                        <EditableField
                            label="NAICS Code"
                            value={contract.naicsCode}
                            fieldName="naicsCode"
                            contractId={contract.id}
                        />
                        <EditableField
                            label="Small Business Goal Percentage"
                            value={contract.smallBusinessGoalPct}
                            fieldName="smallBusinessGoalPct"
                            contractId={contract.id}
                            type="number"
                        />
                        <div>
                            <dt className="font-medium">Agency</dt>
                            <dd>{contract.agency.name}</dd>
                        </div>
                        <div>
                            <dt className="font-medium">Contract Type</dt>
                            <dd>{contract.contractType.name}</dd>
                        </div>
                        <div>
                            <dt className="font-medium">Program</dt>
                            <dd>{contract.program.name}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                </CardHeader>
                <CardContent>
                    <FileUpload contractId={contract.id} existingFiles={attachments} />
                </CardContent>
            </Card>
        </Layout>
    )
}

