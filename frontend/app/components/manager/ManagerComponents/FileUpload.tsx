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

interface FileUploadProps {
    cancelAddNewSubcorpus: (state:void) => void;
}

const FileUpload:React.FC<FileUploadProps> = ({ cancelAddNewSubcorpus }) => {

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

    // CAN BE DELETED!
    // const processUploadedFiles_ = async () => {
    //     let results = [];
    //     // Process group name first and retrieve back the group_id
    //     const name_result = await postGroupName(subcorpusName, corpusMetadata.corpus);
    //     console.log("The name_result is: ", name_result);
    //     if (name_result.status === "success") {
    //         // Update the context state with the subcorpus name
    //         // Apply a typeguard here
    //         const subCorpusId = name_result.cppOutput.id;
    //         corpusDispatch({ type: 'add-new-subcorpus', subCorpusName: subcorpusName, subCorpusId: subCorpusId });

    //         // Then process each file one at a time
    //         for (const file of files) {
    //             console.log(file);
    //             const fileContent = await new Promise<string>((resolve, reject) => {
    //                 const reader = new FileReader();
    //                 reader.onload = () => resolve(reader.result as string);
    //                 reader.onerror = reject;
    //                 reader.readAsText(file);
    //             });
    //             // Send the text to be processed by R and C++
    //             const result = await uploadFileContent(fileContent, subCorpusId, file.name);
    //             results.push(result);
    //         }
    //         console.log(results);

    //         let errorMessages = "";
    //         for (const result of results) {
    //             console.log(result);
    //             if(result.status === 'fail') {
    //                 errorMessages = errorMessages + result.cppOutput + "\n";
    //             }
    //             // Update the context
    //             corpusDispatch({ type: 'add-corpus-file', subCorpusId: subCorpusId, corpusFile: result.cppOutput as CorpusFile });
    //         }

    //         if (errorMessages === "") {
    //             toast.success("All files were successfully uploaded");
    //             cancelAddNewSubcorpus();
    //             // Update the status of the corpus
    //             updateCorpusPreppedStatus(corpusMetadata.corpus.id);
    //         } else {
    //             toast.warning("The following error messages were received: \n" + errorMessages);
    //             cancelAddNewSubcorpus();
    //         }
    //         // Update the context
    //         //confirmUploadSuccessful();
    //     } else {
    //         toast.error("There was an error creating your subcorpus");
    //         cancelAddNewSubcorpus();
    //     }
    // }

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

export default FileUpload