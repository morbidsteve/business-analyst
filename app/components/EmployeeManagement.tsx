"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AddNewEmployeeForm } from "./AddNewEmployeeForm"
import { AssignEmployeeForm } from "./AssignEmployeeForm"

type EmployeeManagementProps = {
    programId: string
}

export function EmployeeManagement({ programId }: EmployeeManagementProps) {
    const [showAddNew, setShowAddNew] = useState(false)
    const [showAssign, setShowAssign] = useState(false)

    const closeModals = () => {
        setShowAddNew(false)
        setShowAssign(false)
    }

    return (
        <div>
            <div className="space-x-2">
                <Button onClick={() => setShowAddNew(true)}>Add New Employee</Button>
                <Button onClick={() => setShowAssign(true)}>Assign Existing Employee</Button>
            </div>
            {showAddNew && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
                        <AddNewEmployeeForm programId={programId} onClose={closeModals} />
                    </div>
                </div>
            )}
            {showAssign && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Assign Existing Employee</h2>
                        <AssignEmployeeForm programId={programId} onClose={closeModals} />
                    </div>
                </div>
            )}
        </div>
    )
}

