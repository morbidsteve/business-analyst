"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { updateContract } from "@/app/actions/contractActions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type EditableFieldProps = {
    label: string
    value: string | number
    fieldName: string
    contractId: string
    type?: "text" | "number" | "date"
}

export function EditableField({ label, value, fieldName, contractId, type = "text" }: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [fieldValue, setFieldValue] = useState(value)
    const { toast } = useToast()

    const handleSave = async () => {
        try {
            await updateContract(contractId, { [fieldName]: fieldValue })
            setIsEditing(false)
            toast({
                title: "Success",
                description: "Field updated successfully",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update field. Please try again.",
                variant: "destructive",
            })
        }
    }

    const renderEditField = () => {
        if (fieldName === "securityClearanceReq") {
            return (
                <Select onValueChange={(value) => setFieldValue(value)} defaultValue={fieldValue as string}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select clearance level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Secret">Secret</SelectItem>
                        <SelectItem value="Top Secret">Top Secret</SelectItem>
                        <SelectItem value="Top Secret SCI">Top Secret SCI</SelectItem>
                    </SelectContent>
                </Select>
            )
        }

        return (
            <Input
                id={fieldName}
                type={type}
                value={fieldValue}
                onChange={(e) => setFieldValue(type === "number" ? Number(e.target.value) : e.target.value)}
            />
        )
    }

    if (isEditing) {
        return (
            <div className="space-y-2">
                <Label htmlFor={fieldName}>{label}</Label>
                <div className="flex space-x-2">
                    {renderEditField()}
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-between items-center">
            <div>
                <dt className="font-medium">{label}</dt>
                <dd>{type === "date" ? new Date(value as string).toLocaleDateString() : value}</dd>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
            </Button>
        </div>
    )
}

