"use client"

// CSS
import '../../manager.css';

// import types
import { CorpusFilesPerSubCorpus } from '@/app/types/types';

// APIs

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
        // TODO
        alert("You will soon be able to change the name of the subcorpus")
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

    const processUploadedFiles = () => {
        console.log("Here we go again!");
        setShowAddNewFileSelector(false);
    }

    const handleCancelAddNewFiles = () => {
        setShowAddNewFileSelector(false);
    }

    /**
     * Deleting files that are no longer needed
     */
    const handleDeleteFile = () => {
        // TODO
        alert("This file will be deleted!");
    }

    return (
        <div>
            <div className="group-name-display">
                {/* Subcorpus name area. Can click to change the name of the subcorpus */}
                <div onClick={handleChangeName}>{subCorpusFiles.subCorpus.group_name}</div>
                <div className="group-name-display-file-number">
                    <div>{subCorpusFiles.corpusFiles.length} {subCorpusFiles.corpusFiles.length === 1 ? 'file' : 'files'}</div>
                    <div onClick={handleAddFiles}>Add files</div>
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
                                    fileNameSelected.find(file => file.fileId === corpusFile.id)?.selected ? <div onClick={handleDeleteFile}>Delete File</div> : ''
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