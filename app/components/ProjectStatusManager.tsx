"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

type ProjectStatus = {
    name: string
    color?: string
    isDefault: boolean
}

function log(message: string, data?: any) {
    console.log(`[ProjectStatusManager] ${message}`, data ? JSON.stringify(data, null, 2) : "")
}

export function ProjectStatusManager() {
    const [statuses, setStatuses] = useState<ProjectStatus[]>([])
    const [newStatusName, setNewStatusName] = useState("")
    const [newStatusColor, setNewStatusColor] = useState("#000000")
    const { toast } = useToast()

    useEffect(() => {
        log("Component mounted, fetching statuses")
        fetchStatuses()
    }, [])

    const fetchStatuses = async () => {
        log("Fetching statuses - Start")
        try {
            const response = await fetch("/api/project-statuses")
            log("Fetch response received", { status: response.status, ok: response.ok })

            if (response.ok) {
                const data = await response.json()
                log("Statuses fetched successfully", data)
                setStatuses(data)
            } else {
                log("Failed to fetch statuses", { status: response.status })
                toast({ title: "Error", description: "Failed to fetch project statuses", variant: "destructive" })
            }
        } catch (error) {
            log("Error fetching statuses", error)
            toast({
                title: "Error",
                description: "An error occurred while fetching project statuses",
                variant: "destructive",
            })
        }
        log("Fetching statuses - End")
    }

    const handleAddStatus = async (e: React.FormEvent) => {
        e.preventDefault()
        log("Adding new status - Start", { name: newStatusName, color: newStatusColor })

        try {
            const response = await fetch("/api/project-statuses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newStatusName, color: newStatusColor }),
            })
            log("Add status response received", { status: response.status, ok: response.ok })

            if (response.ok) {
                log("New status added successfully")
                toast({ title: "Success", description: "New status added successfully" })
                setNewStatusName("")
                setNewStatusColor("#000000")
                fetchStatuses()
            } else {
                log("Failed to add new status", { status: response.status })
                toast({ title: "Error", description: "Failed to add new status", variant: "destructive" })
            }
        } catch (error) {
            log("Error adding new status", error)
            toast({ title: "Error", description: "An error occurred while adding new status", variant: "destructive" })
        }
        log("Adding new status - End")
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Manage Project Statuses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Current Statuses</h3>
                    <ul className="space-y-2">
                        {statuses.map((status) => (
                            <li key={status.name} className="flex items-center space-x-2">
                                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color || "#000000" }}></span>
                                <span>{status.name}</span>
                                {status.isDefault && <span className="text-sm text-gray-500">(Default)</span>}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Add New Status</h3>
                    <form onSubmit={handleAddStatus} className="space-y-4">
                        <div>
                            <Label htmlFor="statusName">Status Name</Label>
                            <Input
                                id="statusName"
                                value={newStatusName}
                                onChange={(e) => setNewStatusName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="statusColor">Status Color</Label>
                            <Input
                                id="statusColor"
                                type="color"
                                value={newStatusColor}
                                onChange={(e) => setNewStatusColor(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit">Add Status</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

