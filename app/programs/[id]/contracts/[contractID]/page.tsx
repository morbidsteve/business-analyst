import { notFound } from "next/navigation"
import { getContractById } from "@/services/contracts"

export default async function ContractDetails({ params }: { params: { contractId: string; programId: string } }) {
    const { contractId, programId } = params

    const contract = await getContractById(programId, contractId)

    if (!contract) {
        notFound()
    }

    return (
        <div>
            <h1>Contract Details</h1>
            <p>Contract ID: {contractId}</p>
            <p>Program ID: {programId}</p>
            {/* Display other contract details here */}
        </div>
    )
}

