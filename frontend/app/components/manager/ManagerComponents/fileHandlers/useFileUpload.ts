import { useState } from 'react';

// types
import { CorpusFile, FileUploadResult } from '@shared/types/manageCorpusTypes';

// api
import { uploadFileContent } from '@/api/manageCorpus';

export const useFileUpload = () => {
    const [files, setFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        setFiles(selectedFiles ? Array.from(selectedFiles) : []);
    };

    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject("File content was not text");
                }
            };

            reader.onerror = () => {
                reject(reader.error?.message ?? "Failed to read file");
            };

            reader.readAsText(file);
        });
    }

    /**
     * CHANGE THE PROMISE TYPE!!!
     */
    const uploadFiles = async (subCorpusId: number): Promise<FileUploadResult> => {
        setIsUploading(true);

        const successFiles: CorpusFile[] = [];
        const failedFiles: string[] = [];

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
                failedFiles.push(
                    err instanceof Error? err.message : String(err)
                );
            }
        }

        setIsUploading(false);
        return { successFiles, failedFiles }
    };

    /**
     * UPDATE PROMISE
     */
    const deleteFiles = async (fileId: number): Promise<any> => {
        
        
    }

    const resetFiles = () => setFiles([]);

    return {
        files,
        isUploading,
        onFileChange,
        uploadFiles,
        resetFiles
    }
}