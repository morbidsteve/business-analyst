"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { uploadFile, deleteFile } from "@/app/actions/contractActions"

type FileUploadProps = {
    contractId: string
    existingFiles: { id: string; name: string; url: string }[]
}

export function FileUpload({ contractId, existingFiles }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("contractId", contractId)

            await uploadFile(formData)
            toast({
                title: "Success",
                description: "File uploaded successfully",
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to upload file. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsUploading(false)
            setFile(null)
        }
    }

    const handleDelete = async (fileId: string) => {
        try {
            await deleteFile(fileId)
            toast({
                title: "Success",
                description: "File deleted successfully",
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete file. Please try again.",
                variant: "destructive",
            })
        }
    }

    return (
        <div>
            <Input type="file" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={!file || isUploading} className="mt-2">
                {isUploading ? "Uploading..." : "Upload"}
            </Button>
            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Existing Attachments</h3>
                <ul className="space-y-2">
                    {existingFiles.map((file) => (
                        <li key={file.id} className="flex items-center justify-between">
                            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {file.name}
                            </a>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(file.id)}>
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

