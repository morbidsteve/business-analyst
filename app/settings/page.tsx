"use client"

import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/ui/modal"
import { useToast } from "@/components/ui/use-toast"
import { purgeDatabase, seedDatabase } from "@/app/actions/databaseActions"
import { ProjectStatusManager } from "@/components/ProjectStatusManager"

const log = (message: string, data?: any) => {
    console.log(`[Client] ${message}`, data)
}

export default function Settings() {
    const [openModal, setOpenModal] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const handleOpenModal = (modalName: string) => {
        setOpenModal(modalName)
    }

    const handleCloseModal = () => {
        setOpenModal(null)
    }

    const handlePurgeDatabase = async () => {
        setIsLoading(true)
        const result = await purgeDatabase()
        setIsLoading(false)
        handleCloseModal()
        if (result.success) {
            toast({
                title: "Success",
                description: result.message,
            })
        } else {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        }
    }

    const handleSeedDatabase = async () => {
        setIsLoading(true)
        log("Starting database seeding")
        log("Calling seedDatabase action")
        const result = await seedDatabase()
        log("seedDatabase action completed", result)
        setIsLoading(false)
        handleCloseModal()
        if (result.success) {
            toast({
                title: "Success",
                description: result.message,
            })
        } else {
            toast({
                title: "Error",
                description: result.error,
                variant: "destructive",
            })
        }
    }

    return (
        <Layout title="Settings | Program Analyst">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Manage your user profile and preferences.</p>
                        <Button onClick={() => handleOpenModal("profile")}>Edit Profile</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Notification Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Configure your notification preferences.</p>
                        <Button onClick={() => handleOpenModal("notifications")}>Manage Notifications</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>API Integration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Set up and manage API integrations.</p>
                        <Button onClick={() => handleOpenModal("api")}>Configure API</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Data Export</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Export your program data for backup or analysis.</p>
                        <Button onClick={() => handleOpenModal("export")}>Export Data</Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Database Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Manage your database for development and testing.</p>
                        <div className="space-x-4">
                            <Button onClick={() => handleOpenModal("purge")} variant="destructive">
                                Purge Database
                            </Button>
                            <Button onClick={() => handleOpenModal("seed")}>Seed Database</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Project Status Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProjectStatusManager />
                    </CardContent>
                </Card>
            </div>

            {/* Profile Modal */}
            <Modal open={openModal === "profile"} onOpenChange={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Edit Profile</ModalTitle>
                        <ModalDescription>Update your user profile information.</ModalDescription>
                    </ModalHeader>
                    <div className="py-4">
                        <p>Profile editing form would go here.</p>
                    </div>
                    <ModalFooter>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Notifications Modal */}
            <Modal open={openModal === "notifications"} onOpenChange={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Manage Notifications</ModalTitle>
                        <ModalDescription>Configure your notification settings.</ModalDescription>
                    </ModalHeader>
                    <div className="py-4">
                        <p>Notification settings form would go here.</p>
                    </div>
                    <ModalFooter>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* API Modal */}
            <Modal open={openModal === "api"} onOpenChange={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Configure API</ModalTitle>
                        <ModalDescription>Set up and manage your API integrations.</ModalDescription>
                    </ModalHeader>
                    <div className="py-4">
                        <p>API configuration options would go here.</p>
                    </div>
                    <ModalFooter>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Export Modal */}
            <Modal open={openModal === "export"} onOpenChange={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Export Data</ModalTitle>
                        <ModalDescription>Export your program data for backup or analysis.</ModalDescription>
                    </ModalHeader>
                    <div className="py-4">
                        <p>Data export options and controls would go here.</p>
                    </div>
                    <ModalFooter>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Purge Database Modal */}
            <Modal open={openModal === "purge"} onOpenChange={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Purge Database</ModalTitle>
                        <ModalDescription>
                            Are you sure you want to purge the entire database? This action cannot be undone.
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <Button onClick={handleCloseModal} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handlePurgeDatabase} variant="destructive" disabled={isLoading}>
                            {isLoading ? "Purging..." : "Purge Database"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Seed Database Modal */}
            <Modal open={openModal === "seed"} onOpenChange={handleCloseModal}>
                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>Seed Database</ModalTitle>
                        <ModalDescription>
                            This will populate your database with sample data. Are you sure you want to proceed?
                        </ModalDescription>
                    </ModalHeader>
                    <ModalFooter>
                        <Button onClick={handleCloseModal} variant="outline">
                            Cancel
                        </Button>
                        <Button onClick={handleSeedDatabase} disabled={isLoading}>
                            {isLoading ? "Seeding..." : "Seed Database"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Layout>
    )
}

