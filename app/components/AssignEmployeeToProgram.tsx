"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

type Employee = {
    id: string
    name: string
    email: string
}

type Contract = {
    id: string
    contractNumber: string
    title: string
}

type LaborCategory = {
    id: string
    title: string
}

type AssignEmployeeToProgramProps = {
    programId: string
}

export function AssignEmployeeToProgram({ programId }: AssignEmployeeToProgramProps) {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [contracts, setContracts] = useState<Contract[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
    const [selectedContract, setSelectedContract] = useState<string | null>(null)
    const [role, setRole] = useState("")
    const [billableRate, setBillableRate] = useState<number | "">("")
    const [isPlanning, setIsPlanning] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [laborCategories, setLaborCategories] = useState<LaborCategory[]>([])
    const [selectedLaborCategory, setSelectedLaborCategory] = useState<string | null>(null)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch("/api/employees")
            const data = await response.json()
            setEmployees(data)
        }
        const fetchContracts = async () => {
            const response = await fetch(`/api/contracts?programId=${programId}`)
            const data = await response.json()
            setContracts(data)
        }
        fetchEmployees()
        fetchContracts()
    }, [programId])

    useEffect(() => {
        if (selectedContract) {
            const fetchLaborCategories = async () => {
                try {
                    const response = await fetch(`/api/labor-categories?contractId=${selectedContract}`)
                    if (response.ok) {
                        const data = await response.json()
                        setLaborCategories(data)
                    } else {
                        throw new Error("Failed to fetch labor categories")
                    }
                } catch (error) {
                    console.error("Error fetching labor categories:", error)
                    toast({
                        title: "Error",
                        description: "Failed to fetch labor categories. Please try again.",
                        variant: "destructive",
                    })
                }
            }
            fetchLaborCategories()
        }
    }, [selectedContract, toast])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedEmployee || !role || billableRate === "") return

        setIsSubmitting(true)
        try {
            const response = await fetch("/api/personnel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    programId,
                    employeeId: selectedEmployee,
                    contractId: isPlanning ? null : selectedContract,
                    laborCategoryId: isPlanning ? null : selectedLaborCategory,
                    role,
                    billableRate: Number(billableRate),
                    isPlanning,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to assign employee to program")
            }

            toast({
                title: "Success",
                description: "Employee assigned to program successfully",
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to assign employee to program. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Assign Employee to Program</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="employee">Employee</Label>
                        <Select onValueChange={(value) => setSelectedEmployee(value)}>
                            <SelectTrigger id="employee">
                                <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((employee) => (
                                    <SelectItem key={employee.id} value={employee.id}>
                                        {employee.name} ({employee.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Enter employee's role"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="billableRate">Billable Rate</Label>
                        <Input
                            id="billableRate"
                            type="number"
                            step="0.01"
                            value={billableRate}
                            onChange={(e) => setBillableRate(e.target.value ? Number(e.target.value) : "")}
                            placeholder="Enter billable rate"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isPlanning"
                            checked={isPlanning}
                            onCheckedChange={(checked) => setIsPlanning(checked as boolean)}
                        />
                        <Label htmlFor="isPlanning">Planning (No contract assigned yet)</Label>
                    </div>
                    {!isPlanning && (
                        <div className="space-y-2">
                            <Label htmlFor="contract">Contract</Label>
                            <Select onValueChange={(value) => setSelectedContract(value)}>
                                <SelectTrigger id="contract">
                                    <SelectValue placeholder="Select a contract" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contracts.map((contract) => (
                                        <SelectItem key={contract.id} value={contract.id}>
                                            {contract.contractNumber} - {contract.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    {!isPlanning && selectedContract && (
                        <div className="space-y-2">
                            <Label htmlFor="laborCategory">Labor Category</Label>
                            <Select onValueChange={(value) => setSelectedLaborCategory(value)}>
                                <SelectTrigger id="laborCategory">
                                    <SelectValue placeholder="Select a labor category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {laborCategories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            !selectedEmployee ||
                            !role ||
                            billableRate === "" ||
                            (!isPlanning && !selectedContract) ||
                            (!isPlanning && !selectedLaborCategory)
                        }
                    >
                        {isSubmitting ? "Assigning..." : "Assign to Program"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

