import { useState } from 'react';

// types
import { CorpusFile, FileUploadResult, FileUploadError, DeleteFileResult } from '@shared/types/manageCorpusTypes';

// api
import { uploadFileContent, deleteFileFromDatabase } from '@/api/manageCorpus';

export const useFileUpload = () => {
    const [files, setFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<FileUploadError | null>(null);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        setFiles(selectedFiles ? Array.from(selectedFiles) : []);
        setError(null);
    };

    // Utility function - should NOT alter React state.
    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    // Throw error here (don't set state from here!)
                    reject(new Error("File content was not text."));
                }
            };

            reader.onerror = () => {
                // Throw error here - don't set state from here!
                reject(
                    new Error(reader.error?.message ?? "Failed to read file")
                );
            };

            reader.readAsText(file);
        });
    }

    const uploadFiles = async (subCorpusId: number): Promise<FileUploadResult> => {
        setIsUploading(true);
        setError(null);

        const successFiles: CorpusFile[] = [];
        const failedFiles: string[] = [];

        try {
            for (const file of files) {
                try {
                    const content = await readFile(file);
                    const result = await uploadFileContent(
                        content,
                        subCorpusId,
                        file.name
                    );
                    successFiles.push(result);
                }
                catch (err) {
                    const message = err instanceof Error ? err.message : String(err);
                    failedFiles.push(`${file.name}: ${message}`);
                }
            }

            if (failedFiles.length > 0) {
                setError({ type: 'partial', failedFiles });
            }
        } catch (err) {
            console.error(err);
            setError({
                type: 'unexpected',
                message: 'An unexpected error occurred during upload.',
            });
        } finally {
            setIsUploading(false);
        }

        return { successFiles, failedFiles }
    };

    /**
     * UPDATE PROMISE
     */
    const deleteFile = async (fileId: number): Promise<DeleteFileResult> => {
        const result = await deleteFileFromDatabase(fileId);
        return result;
    }

    const resetFiles = () => {
        setFiles([]);
        setError(null);
    } 

    return {
        files,
        isUploading,
        error,
        onFileChange,
        uploadFiles,
        resetFiles,
        deleteFile
    }
}