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

    return (
        <div>
            <div className="group-name-display">
                {/* Subcorpus name area. Can click to change the name of the subcorpus */}
                <div>{subCorpusFiles.subCorpus.group_name}</div>
                <div className="group-name-display-file-number">{subCorpusFiles.corpusFiles.length} files</div>
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
                                    fileNameSelected.find(file => file.fileId === corpusFile.id)?.selected ? <div>Delete File</div> : ''
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