"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

type Contract = {
    id: string
    contractNumber: string
    title: string
    startDate: string
    endDate: string
    totalValue: number | null
    status: string
}

export function ContractsTab() {
    const [contracts, setContracts] = useState<Contract[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { toast } = useToast()

    useEffect(() => {
        fetchContracts()
    }, [])

    const fetchContracts = async () => {
        try {
            const response = await fetch("/api/contracts")
            if (!response.ok) {
                throw new Error("Failed to fetch contracts")
            }
            const data = await response.json()
            setContracts(data)
        } catch (error) {
            console.error("Error fetching contracts:", error)
            toast({
                title: "Error",
                description: "Failed to fetch contracts. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div>Loading contracts...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Contracts</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <Button asChild>
                        <Link href="/contracts/new">Add New Contract</Link>
                    </Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Contract Number</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Total Value</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell>{contract.contractNumber}</TableCell>
                                <TableCell>{contract.title}</TableCell>
                                <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                                <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    {contract.totalValue != null ? `$${contract.totalValue.toLocaleString()}` : "N/A"}
                                </TableCell>
                                <TableCell>{contract.status}</TableCell>
                                <TableCell>
                                    <Button asChild variant="link">
                                        <Link href={`/contracts/${contract.id}`}>View</Link>
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

