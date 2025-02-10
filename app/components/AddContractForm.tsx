"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileUpload } from "@/components/FileUpload"

const contractSchema = z.object({
    contractNumber: z.string().min(1, "Contract number is required"),
    title: z.string().min(1, "Title is required"),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    totalValue: z.number().min(0, "Total value must be a positive number"),
    fundedValue: z.number().min(0, "Funded value must be a positive number"),
    status: z.string().min(1, "Status is required"),
    contractingOfficer: z.string().min(1, "Contracting officer is required"),
    corName: z.string().min(1, "COR name is required"),
    securityClearanceReq: z.string().min(1, "Security clearance requirement is required"),
    performanceLocation: z.string().min(1, "Performance location is required"),
    naicsCode: z.string().min(1, "NAICS code is required"),
    smallBusinessGoalPct: z.number().min(0).max(100, "Small business goal percentage must be between 0 and 100"),
    agencyId: z.string().min(1, "Agency is required"),
    contractTypeId: z.string().min(1, "Contract type is required"),
    programId: z.string().min(1, "Program is required"),
})

type ContractFormData = z.infer<typeof contractSchema>

type Agency = {
    id: string
    name: string
}

type ContractType = {
    id: string
    name: string
}

type Program = {
    id: string
    name: string
}

export function AddContractForm() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [agencies, setAgencies] = useState<Agency[]>([])
    const [contractTypes, setContractTypes] = useState<ContractType[]>([])
    const [programs, setPrograms] = useState<Program[]>([])
    const { toast } = useToast()
    const [isAddingAgency, setIsAddingAgency] = useState(false)
    const [isAddingContractType, setIsAddingContractType] = useState(false)
    const [newAgency, setNewAgency] = useState("")
    const [newContractType, setNewContractType] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ContractFormData>({
        resolver: zodResolver(contractSchema),
    })

    useEffect(() => {
        fetchAgencies()
        fetchContractTypes()
        fetchPrograms()
    }, [])

    const fetchAgencies = async () => {
        try {
            const response = await fetch("/api/agencies")
            if (response.ok) {
                const data = await response.json()
                setAgencies(data)
            } else {
                throw new Error("Failed to fetch agencies")
            }
        } catch (error) {
            console.error("Failed to fetch agencies:", error)
            toast({
                title: "Error",
                description: "Failed to fetch agencies. Please try again.",
                variant: "destructive",
            })
        }
    }

    const fetchContractTypes = async () => {
        try {
            const response = await fetch("/api/contract-types")
            if (response.ok) {
                const data = await response.json()
                setContractTypes(data)
            } else {
                throw new Error("Failed to fetch contract types")
            }
        } catch (error) {
            console.error("Failed to fetch contract types:", error)
            toast({
                title: "Error",
                description: "Failed to fetch contract types. Please try again.",
                variant: "destructive",
            })
        }
    }

    const fetchPrograms = async () => {
        try {
            const response = await fetch("/api/programs")
            if (response.ok) {
                const data = await response.json()
                setPrograms(data)
            } else {
                throw new Error("Failed to fetch programs")
            }
        } catch (error) {
            console.error("Failed to fetch programs:", error)
            toast({
                title: "Error",
                description: "Failed to fetch programs. Please try again.",
                variant: "destructive",
            })
        }
    }

    const onSubmit = async (data: ContractFormData) => {
        setIsSubmitting(true)
        try {
            const response = await fetch("/api/contracts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to add contract")
            }

            toast({
                title: "Success",
                description: "Contract added successfully",
            })
            router.push("/contracts")
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add contract. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleAddAgency = async () => {
        try {
            const response = await fetch("/api/agencies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newAgency }),
            })

            if (!response.ok) {
                throw new Error("Failed to add agency")
            }

            const addedAgency = await response.json()
            setAgencies([...agencies, addedAgency])
            setNewAgency("")
            setIsAddingAgency(false)
            toast({
                title: "Success",
                description: "Agency added successfully",
            })
        } catch (error) {
            console.error("Failed to add agency:", error)
            toast({
                title: "Error",
                description: "Failed to add agency. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleAddContractType = async () => {
        try {
            const response = await fetch("/api/contract-types", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newContractType }),
            })

            if (!response.ok) {
                throw new Error("Failed to add contract type")
            }

            const addedContractType = await response.json()
            setContractTypes([...contractTypes, addedContractType])
            setNewContractType("")
            setIsAddingContractType(false)
            toast({
                title: "Success",
                description: "Contract type added successfully",
            })
        } catch (error) {
            console.error("Failed to add contract type:", error)
            toast({
                title: "Error",
                description: "Failed to add contract type. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Contract</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="contractNumber">Contract Number</Label>
                        <Input id="contractNumber" {...register("contractNumber")} />
                        {errors.contractNumber && <p className="text-red-500 text-sm mt-1">{errors.contractNumber.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" {...register("startDate")} />
                        {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="endDate">End Date</Label>
                        <Input id="endDate" type="date" {...register("endDate")} />
                        {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="totalValue">Total Value</Label>
                        <Input id="totalValue" type="number" step="0.01" {...register("totalValue", { valueAsNumber: true })} />
                        {errors.totalValue && <p className="text-red-500 text-sm mt-1">{errors.totalValue.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="fundedValue">Funded Value</Label>
                        <Input id="fundedValue" type="number" step="0.01" {...register("fundedValue", { valueAsNumber: true })} />
                        {errors.fundedValue && <p className="text-red-500 text-sm mt-1">{errors.fundedValue.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Input id="status" {...register("status")} />
                        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="contractingOfficer">Contracting Officer</Label>
                        <Input id="contractingOfficer" {...register("contractingOfficer")} />
                        {errors.contractingOfficer && (
                            <p className="text-red-500 text-sm mt-1">{errors.contractingOfficer.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="corName">COR Name</Label>
                        <Input id="corName" {...register("corName")} />
                        {errors.corName && <p className="text-red-500 text-sm mt-1">{errors.corName.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="securityClearanceReq">Security Clearance Requirement</Label>
                        <Input id="securityClearanceReq" {...register("securityClearanceReq")} />
                        {errors.securityClearanceReq && (
                            <p className="text-red-500 text-sm mt-1">{errors.securityClearanceReq.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="performanceLocation">Performance Location</Label>
                        <Input id="performanceLocation" {...register("performanceLocation")} />
                        {errors.performanceLocation && (
                            <p className="text-red-500 text-sm mt-1">{errors.performanceLocation.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="naicsCode">NAICS Code</Label>
                        <Input id="naicsCode" {...register("naicsCode")} />
                        {errors.naicsCode && <p className="text-red-500 text-sm mt-1">{errors.naicsCode.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="smallBusinessGoalPct">Small Business Goal Percentage</Label>
                        <Input
                            id="smallBusinessGoalPct"
                            type="number"
                            step="0.01"
                            {...register("smallBusinessGoalPct", { valueAsNumber: true })}
                        />
                        {errors.smallBusinessGoalPct && (
                            <p className="text-red-500 text-sm mt-1">{errors.smallBusinessGoalPct.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="agencyId">Agency</Label>
                        <div className="flex items-center space-x-2">
                            <Select onValueChange={(value) => register("agencyId").onChange({ target: { value } })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select an agency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {agencies.map((agency) => (
                                        <SelectItem key={agency.id} value={agency.id}>
                                            {agency.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Dialog open={isAddingAgency} onOpenChange={setIsAddingAgency}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Agency</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newAgency" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="newAgency"
                                                value={newAgency}
                                                onChange={(e) => setNewAgency(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handleAddAgency}>Add Agency</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {errors.agencyId && <p className="text-red-500 text-sm mt-1">{errors.agencyId.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="contractTypeId">Contract Type</Label>
                        <div className="flex items-center space-x-2">
                            <Select onValueChange={(value) => register("contractTypeId").onChange({ target: { value } })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a contract type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contractTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Dialog open={isAddingContractType} onOpenChange={setIsAddingContractType}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <PlusCircle className="h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add New Contract Type</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="newContractType" className="text-right">
                                                Name
                                            </Label>
                                            <Input
                                                id="newContractType"
                                                value={newContractType}
                                                onChange={(e) => setNewContractType(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <Button onClick={handleAddContractType}>Add Contract Type</Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {errors.contractTypeId && <p className="text-red-500 text-sm mt-1">{errors.contractTypeId.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="programId">Program</Label>
                        <Select onValueChange={(value) => register("programId").onChange({ target: { value } })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a program" />
                            </SelectTrigger>
                            <SelectContent>
                                {programs.map((program) => (
                                    <SelectItem key={program.id} value={program.id}>
                                        {program.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.programId && <p className="text-red-500 text-sm mt-1">{errors.programId.message}</p>}
                    </div>
                </CardContent>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Attachments</h3>
                    <FileUpload contractId="" existingFiles={[]} />
                </div>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Adding..." : "Add Contract"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

