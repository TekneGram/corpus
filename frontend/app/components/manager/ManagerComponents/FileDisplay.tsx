// Fonts
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// CSS
import '@styles/manager.css';

// import types
import { CorpusFile, CorpusFilesPerSubCorpus, EmptyCPPOutput, SubCorpus } from '@shared/types/manageCorpusTypes';

// APIs
import { uploadFileContent, patchGroupName, deleteFile, deleteSubcorpus, updateCorpusPreppedStatus } from '@app-api/manageCorpus';

// Context and State Management
import { useState, useEffect } from 'react';
import { useCorpusMetaData, useCorpusDispatch } from '@context/corpusMetadata/useCorpusMetadata';

// Child components
import { toast } from "react-toastify";

// FileDisplayProps
interface FileDisplayProps {
    subCorpusFiles: CorpusFilesPerSubCorpus;
    showTextWithFileID: (fileId: number) => void; // Function to show text with file ID
}

type FileSelected = {
    fileId: number;
    selected: boolean;
}


const FileDisplay:React.FC<FileDisplayProps> = ({ subCorpusFiles, showTextWithFileID }) => {

    const [files, setFiles] = useState<File[]>([]); // State for storing files
    const [showAddNewFileSelector, setShowAddNewFileSelector] = useState<boolean>(false);
    const [editingSubcorpusName, setEditingSubcorpusName] = useState<boolean>(false);

    const [subcorpusName, setSubcorpusName] = useState<string>(subCorpusFiles.subCorpus.group_name);
    const [originalSubcorpusName, setOriginalSubcorpusName] = useState<string>(subcorpusName); // To allow for undoing changes when the user cancels a name change.
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    const corpusMetadata = useCorpusMetaData();
    const corpusDispatch = useCorpusDispatch();

    /**
     * Selecting a file
     */
    // Set the state so initially no files are selected
    const [fileNameSelected, setFileNameSelected] = useState<FileSelected[]>(() => {
        return subCorpusFiles.corpusFiles.map((corpusFile) => {
            return {fileId: corpusFile.id, selected: false};
        });
    });

    // useEffect can reset the state when there is a change in subCorpusFiles
    useEffect(() => {
        setFileNameSelected(
            subCorpusFiles.corpusFiles.map((corpusFile) => {
                return {fileId: corpusFile.id, selected: false};
            })
        );
    }, [subCorpusFiles]);

    // useEffect(() => {
    //     console.log("State changed:", subCorpusFiles);
    // }, [subCorpusFiles]); // Log when the state updates
    
    // selectFile updates the state when a file is selected
    const selectFile = (corpusFileID: number) => {
        setFileNameSelected((prevState) => {
            const nextState = prevState.map((file) => {
                return file.fileId === corpusFileID
                    ? { ...file, selected: !file.selected } // this allows the file to be selected or deselected
                    : { ...file, selected: false };
            });

            // Find the file in the next state (after the change)
            const selectedFile = nextState.find(file => file.fileId === corpusFileID)
            // This ensures that if the file is deselected, the text is not shown.
            // i.e., it is only shown is the file is selected
            if (selectedFile?.selected) {
                showTextWithFileID(corpusFileID);
            }
            return nextState;
        });
    };

    /**
     * Change the name of the subCorpus
     */
    const handleChangeName = () => {
        setEditingSubcorpusName(true);
    }

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setSubcorpusName(event.target.value);
        if (subcorpusName.length > 23) {
            setSubcorpusName((prevName) => prevName.substring(0, 22));
        }
        /**
         * If the name is less than 4 characters, then deselect the add button
         */
        if (subcorpusName.length < 4) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    }

    const cancelChangeName = () => {
        setSubcorpusName(originalSubcorpusName);
        setEditingSubcorpusName(false);
    }

    const processSubcorpusNameChange = async () => {

        try {
            const result = await patchGroupName(subcorpusName, subCorpusFiles.subCorpus.id);
            corpusDispatch({
                type: 'update-subcorpus-name',
                subCorpusId: result.id,
                subCorpusName: result.group_name
            });
            toast.success(`Successfully updated the subcorpus name to ${subcorpusName}`);
            setEditingSubcorpusName(false);
        } catch (err) {
            toast.error(`Could not update the subcorpus name to ${subcorpusName}. Received error: ${err}`);
            setOriginalSubcorpusName(subcorpusName);
            setEditingSubcorpusName(false);
        }
    }

    /**
     * Adding new files
     */
    const handleAddFiles = () => {
        setShowAddNewFileSelector(true);
    }

    const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        // Add this to the file handler.
        const files = event.target.files;
        if (files) {
            setFiles(Array.from(files));
        } else {
            setFiles([]);
        }
    }

    const processUploadedFiles = async () => {
        let results = [];
        for (const file of files) {
            const fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsText(file);
            });
            const result = await uploadFileContent(fileContent, subCorpusFiles.subCorpus.id, file.name);
            results.push(result);
        }

        // Update the context
        let errorMessages = "";
        for (const result of results) {
            console.log(result);
            if(result.status === 'fail') {
                errorMessages = errorMessages + result.cppOutput + "\n";
            }
            corpusDispatch({ type: 'add-corpus-file', subCorpusId: subCorpusFiles.subCorpus.id, corpusFile: result.cppOutput as CorpusFile });
        }
        if (errorMessages === "") {
            toast.success("All files were successfully uploaded");
            updateCorpusPreppedStatus(corpusMetadata.corpus.id);
        } else {
            toast.warning("The following error messages were received: \n" + errorMessages);
        }
        setShowAddNewFileSelector(false);
    }

    const handleCancelAddNewFiles = () => {
        setShowAddNewFileSelector(false);
    }

    /**
     * Deleting files that are no longer needed
     */
    const handleDeleteFile = async (file_id: number) => {
        alert("This file will be deleted!");
        const result = await deleteFile(file_id);
        if (result.status === 'success') {
            corpusDispatch({ type: 'delete-file', subCorpusId: subCorpusFiles.subCorpus.id, fileId: file_id });
            toast.success((result.cppOutput as EmptyCPPOutput).message);
            updateCorpusPreppedStatus(corpusMetadata.corpus.id);
        } else {
            toast.error("There was an error deleting your file: " + result.cppOutput);
        }
    }

    /**
     * Functionality to delete the entire subcorpus
     */
    const handleDeleteSubcorpus = async () => {
        alert("Are you sure you want to do this? It can't be undone!");
        const result = await deleteSubcorpus(subCorpusFiles.subCorpus.id);
        if (result.status === 'success') {
            corpusDispatch( { type: 'delete-subcorpus', subCorpusId: subCorpusFiles.subCorpus.id });
            toast.success("Subcorpus group successfully deleted.");
        } else {
            toast.error("There was an error deleting the subcorpus: " + result.cppOutput);
        }
    }

    return (
        <div>
            <div className="group-name-display">
                {/* Subcorpus name area. Can click to change the name of the subcorpus */}
                {
                    editingSubcorpusName
                    ?
                        <div className="editing-subcorpus-name-area">
                            <div>
                                <input 
                                    className='group-name-input text-black'
                                    type='text'
                                    value={subcorpusName}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <button
                                    className='corpus-name-update-button'
                                    type='button'
                                    disabled={buttonDisabled}
                                    onClick={processSubcorpusNameChange}
                                >
                                    <FontAwesomeIcon icon={faCircleCheck} />
                                </button>
                                <button
                                    className='corpus-name-cancel-button'
                                    type='button'
                                    onClick={() => {
                                        cancelChangeName();
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            </div>
                        </div>
                    :
                        <div onClick={handleChangeName}>{subCorpusFiles.subCorpus.group_name}</div>
                }
                

                {/* Area for adding files or deleting the whole subcorpus */}
                <div className="group-name-display-file-number">
                    <div>{subCorpusFiles.corpusFiles.length} {subCorpusFiles.corpusFiles.length === 1 ? 'file' : 'files'}</div>
                    <div onClick={handleAddFiles}>Add files</div>
                    <div onClick={handleDeleteSubcorpus}>Delete All</div>
                </div>
                {
                    showAddNewFileSelector &&
                        <div className='group-input-area'>
                            <input
                                type='file'
                                id='new-file-upload'
                                name='files'
                                multiple
                                accept='.txt'
                                className='file-adder-button'
                                onChange={(e) => handleFileChange(e)}
                            />
                            <button
                                className={files.length > 0 ? `file-uploader-button` : `file-uploader-button-disabled`}
                                type='button'
                                onClick={processUploadedFiles}
                                disabled={files.length === 0}
                            >
                                {
                                    files.length > 0 ? `Add files` : `Select files first`
                                }
                            </button>
                            <button
                                className='cancel-add-new-files'
                                type='button'
                                onClick={handleCancelAddNewFiles}
                            > Cancel 
                            </button>
                        </div>
                }
            </div>
            <div className="file-display-container">
                {/* Files display area. If a file is clicked, it highlights the file and will eventually display the file text. */}
                {
                    subCorpusFiles.corpusFiles.map((corpusFile) => (
                        // Ensures that the class name is conditionally applied to a selected item
                        <div 
                            className={ fileNameSelected.find(file => file.fileId === corpusFile.id)?.selected ? 'file-selected' : 'file-not-selected' } 
                            key={corpusFile.id}
                        >
                            <div className='file-name' onClick={() => selectFile(corpusFile.id)}>
                                <div>{corpusFile.file_name}</div>
                                {
                                    fileNameSelected.find(file => file.fileId === corpusFile.id)?.selected 
                                    ? <div onClick={() => handleDeleteFile(corpusFile.id)}>Delete File</div>
                                    : ''
                                }
                            </div>

                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default FileDisplay;