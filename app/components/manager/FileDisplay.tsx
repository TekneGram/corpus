"use client"

// Fonts
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// CSS
import '../../manager.css';

// import types
import { CorpusFilesPerSubCorpus } from '@/app/types/types';

// APIs
import { uploadFileContent, patchGroupName, deleteFile, deleteSubcorpus } from '../../api/manageCorpus';

// Context and State Management
import { useState, useEffect } from 'react';

// FileDisplayProps
interface FileDisplayProps {
    subCorpusFiles: CorpusFilesPerSubCorpus;
}

type FileSelected = {
    fileId: number;
    selected: boolean;
}


const FileDisplay:React.FC<FileDisplayProps> = ({ subCorpusFiles }) => {

    const [files, setFiles] = useState<File[]>([]); // State for storing files
    const [showAddNewFileSelector, setShowAddNewFileSelector] = useState<boolean>(false);
    const [editingSubcorpusName, setEditingSubcorpusName] = useState<boolean>(false);

    const [subcorpusName, setSubcorpusName] = useState<string>(subCorpusFiles.subCorpus.group_name);
    const [originalSubcorpusName, setOriginalSubcorpusName] = useState<string>(subcorpusName); // To allow for undoing changes when the user cancels a name change.
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

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
    
    // selectFile updates the state when a file is selected
    const selectFile = (corpusFileID: number) => {
        console.log("My file id is:", corpusFileID);
        setFileNameSelected((prevState) => {
            return prevState.map((file) => {
                return file.fileId === corpusFileID ? { ...file, selected: !file.selected } : { ...file, selected: false};
            });
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

    const processSubcorpusNameChange = () => {

        const result = patchGroupName(subcorpusName, subCorpusFiles.subCorpus.id);
        //TODO
        /**
         * If the result is successful
         * update the subCorpusName in the context.
         */
        setOriginalSubcorpusName(subcorpusName); // Set a new value for the original
        setEditingSubcorpusName(false);
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
        console.log("Here we go again!");
        let results = [];
        for (const file of files) {
            console.log(file);
            const fileContent = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsText(file);
            });
            const result = await uploadFileContent(fileContent, subCorpusFiles.subCorpus.id, file.name);
            results.push(result);
        }
        setShowAddNewFileSelector(false);
    }

    const handleCancelAddNewFiles = () => {
        setShowAddNewFileSelector(false);
    }

    /**
     * Deleting files that are no longer needed
     */
    const handleDeleteFile = (file_id: number) => {
        // TODO
        alert("This file will be deleted!");
        const result = deleteFile(file_id);
        // Handle the result here
        // The file should disappear from the view
    }

    /**
     * Functionality to delete the entire subcorpus
     */
    const handleDeleteSubcorpus = () => {
        alert("Are you sure you want to do this? It can't be undone!");
        const result = deleteSubcorpus(subCorpusFiles.subCorpus.id);
        // Handle the result here
        // If the subcorpus is deleted, show a message that it was deleted
        // May need a prop to message up to parent Manager.tsx to update view
        // and remove this component from the view.
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
                                    fileNameSelected.find(file => file.fileId === corpusFile.id)?.selected ? <div onClick={() => handleDeleteFile(corpusFile.id)}>Delete File</div> : ''
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