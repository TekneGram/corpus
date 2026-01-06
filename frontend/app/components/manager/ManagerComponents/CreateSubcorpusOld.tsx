import '@styles/manager.css';

// import types
import { CorpusFile } from '@shared/types/manageCorpusTypes';

// APIs
import { postGroupName, uploadFileContent, updateCorpusPreppedStatus } from '@app-api/manageCorpus';

// Context and state management
import { useEffect, useState} from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@context/corpusMetadata/useCorpusMetadata';

// Child components
import { toast } from 'react-toastify';

interface CreateSubcorpusProps {
    cancelAddNewSubcorpus: (state:void) => void;
}

const CreateSubcorpus:React.FC<CreateSubcorpusProps> = ({ cancelAddNewSubcorpus }) => {

    const [files, setFiles] = useState<File[]>([]);
    const [subcorpusName, setSubcorpusName] = useState<string>('');
    const corpusMetadata = useCorpusMetaData();
    const corpusDispatch = useCorpusDispatch();
    
    const handleGroupNameChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSubcorpusName(event.target.value);
    }

    const handleFileChange = async (event:React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setFiles(Array.from(files));
        } else {
            setFiles([]);
        }
    };

    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (typeof reader.result === "string") {
                    resolve(reader.result);
                } else {
                    reject(new Error("FileReader result was not a string"));
                }
            };

            reader.onerror = () => {
                reject(reader.error ?? new Error("Failed to read file"));
            };

            reader.readAsText(file)
        });
    }

    const processUploadedFiles = async () => {
        try {
            const subCorpus = await postGroupName(subcorpusName, corpusMetadata.corpus);

            corpusDispatch({
                type: 'add-new-subcorpus',
                subCorpusName: subcorpusName,
                subCorpusId: subCorpus.id
            });

            const results: Array<{
                status: "success" | "fail",
                cppOutput: CorpusFile | string;
            }> = [];
            
            for (const file of files) {
                // Handle file uploads
                try {
                    const fileContent = await readFile(file);
                    const result = await uploadFileContent(fileContent, subCorpus.id, file.name);
                    results.push({
                        status: "success",
                        cppOutput: result
                    })
                } catch (err) {
                    results.push({
                        status: "fail",
                        cppOutput: err instanceof Error ? err.message : "Unknown error"
                    });
                }
                
            }

            let errorMessages = "";

            for (const result of results) {
                if (result.status === "success") {
                    corpusDispatch({
                        type: "add-corpus-file",
                        subCorpusId: subCorpus.id,
                        corpusFile: result.cppOutput as CorpusFile
                    });
                } else {
                    errorMessages += result.cppOutput + "\n";
                }
            }

            if (errorMessages) {
                toast.warning(
                    "Some files failed to upload:\n" + errorMessages
                );
            } else {
                toast.success("All files were successfully uploaded");
                updateCorpusPreppedStatus(corpusMetadata.corpus.id);
            }

            cancelAddNewSubcorpus();
        } catch (err) {
            console.error(err);
            toast.error("Failed to create subcorpus");
            cancelAddNewSubcorpus();
        }
    }

    const handleCancelAddNewSubcorpus = () => {
        cancelAddNewSubcorpus();
    }

    return (
            <div className='group-input-area'>
                <input
                    className='group-name-input'
                    type='text' 
                    onChange={(e) => handleGroupNameChange(e)}
                    placeholder="Name subcorpus"
                    value={subcorpusName}
                />
                <input
                    type='file'
                    id='file-upload'
                    name='files'
                    multiple
                    accept='.txt'
                    className='file-chooser-button'
                    onChange={(e) => handleFileChange(e)}
                />
                <button
                    className={files.length > 0 && subcorpusName.length > 3 ? `file-uploader-button` : `file-uploader-button-disabled`}
                    type='button'
                    onClick={processUploadedFiles}
                    disabled={files.length === 0 && subcorpusName.length < 3}
                >
                    {
                        files.length > 0 && subcorpusName.length > 3 ? `Add files` : `Prepare name and files`
                    }
                </button>
                <button
                    className='cancel-add-files'
                    type='button'
                    onClick={handleCancelAddNewSubcorpus}
                >
                    Cancel
                </button>
            </div>
        
    );
};

export default CreateSubcorpus