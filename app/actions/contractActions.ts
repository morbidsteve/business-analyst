"use server"

import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"

export async function updateContract(id: string, data: Partial<any>) {
    try {
        const updatedContract = await prisma.contract.update({
            where: { id },
            data: {
                ...data,
                startDate: data.startDate ? new Date(data.startDate) : undefined,
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            },
        })

        revalidatePath(`/contracts/${id}`)
        return { success: true, contract: updatedContract }
    } catch (error) {
        console.error("Failed to update contract:", error)
        return { success: false, error: "Failed to update contract" }
    }
}

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File
    const contractId = formData.get("contractId") as string

    // In a real-world scenario, you would upload the file to a storage service
    // and save the file metadata to your database. For this example, we'll just
    // simulate the process.

    try {
        const attachment = await prisma.contractAttachment.create({
            data: {
                name: file.name,
                url: `/uploads/${file.name}`, // This would be the actual URL from your storage service
                contractId: contractId,
            },
        })

        revalidatePath(`/contracts/${contractId}`)
        return { success: true, attachment }
    } catch (error) {
        console.error("Failed to upload file:", error)
        return { success: false, error: "Failed to upload file" }
    }
}

export async function deleteFile(fileId: string) {
    try {
        const deletedFile = await prisma.contractAttachment.delete({
            where: { id: fileId },
        })

        revalidatePath(`/contracts/${deletedFile.contractId}`)
        return { success: true, file: deletedFile }
    } catch (error) {
        console.error("Failed to delete file:", error)
        return { success: false, error: "Failed to delete file" }
    }
}

export async function getContractAttachments(contractId: string) {
    try {
        const attachments = await prisma.contractAttachment.findMany({
            where: { contractId },
        })
        return attachments
    } catch (error) {
        console.error("Failed to fetch contract attachments:", error)
        return []
    }
}

