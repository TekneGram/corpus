// css
import "@styles/manager.css";

// fonts
import { faCircleCheck, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// state
import { useState } from 'react';

// types
import { CorpusFilesPerSubCorpus } from "@shared/types/manageCorpusTypes";

interface SubcorpusDisplayViewProps {
    subCorpusFiles: CorpusFilesPerSubCorpus
    subcorpusName: string;
    onNameChange: (value: string) => void;
    canSubmitNameChange: boolean;
    onSubmitNameChange: () => void;
    onCancelNameChange: () => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    canSubmitFiles: boolean;
    onSubmitFiles: () => void;
    selectedFileID: number | null;
    setSelectedFile: (fileId: number) => void;
    onSubmitDeleteFile: () => void;
}

export const SubcorpusDisplayView: React.FC<SubcorpusDisplayViewProps> = ({
    subCorpusFiles,
    subcorpusName,
    onNameChange,
    canSubmitNameChange,
    onSubmitNameChange,
    onCancelNameChange,
    onFileChange,
    canSubmitFiles,
    onSubmitFiles,
    selectedFileID,
    setSelectedFile,
    onSubmitDeleteFile
}) => {

    /**
     * Handle local state for changing subcorpus name
     */
    const [editingSubcorpusName, setEditingSubcorpusName] = useState<boolean>(false);

    const handleChangeName = () => {
        setEditingSubcorpusName(true);
    }

    const submitNameChange = () => {
        onSubmitNameChange();
        setEditingSubcorpusName(false);
    }

    const cancelChangeName = () => {
        setEditingSubcorpusName(false);
        onCancelNameChange();
    }

    /**
     * Handle local state for adding files to the subcorpus
     */
    const [isAddingFiles, setIsAddingFiles] = useState<boolean>(false);
    const handleAddFiles = () => {
        setIsAddingFiles(true);
    }

    const handleCancelAddNewFiles = () => {
        setIsAddingFiles(false);
    }

    /**
     * Handle selection of file names
     */
    const selectFile = (corpusId: number) => {
        setSelectedFile(corpusId);
    }

    /**
     * Handle delete file
     */
    const handleDeleteFile = (corpusId: number) => {
        onSubmitDeleteFile()
    }
    

    /**
     * Handle local state for deleting a whole subcorpus
     */
    const handleDeleteSubcorpus = () => {

    }

    return (
        <>
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
                                        onChange={(e) => onNameChange(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <button
                                        className='corpus-name-update-button'
                                        type='button'
                                        disabled={!canSubmitNameChange}
                                        onClick={submitNameChange}
                                    >
                                        <FontAwesomeIcon icon={faCircleCheck} />
                                    </button>
                                    <button
                                        className='corpus-name-cancel-button'
                                        type='button'
                                        onClick={cancelChangeName}
                                    >
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </button>
                                </div>
                            </div>
                        :
                            <div onClick={handleChangeName}>{subCorpusFiles.subCorpus.group_name}</div>
                    }
                    <div className='group-name-display-file-number'>
                        {/* Area for adding files and deleting the whole subcorpus */}
                        <div>{subCorpusFiles.corpusFiles.length} {subCorpusFiles.corpusFiles.length === 1 ? 'file' : 'files'}</div>
                        <div onClick={handleAddFiles}>Add files</div>
                        <div onClick={handleDeleteSubcorpus}>Delete All</div>
                    </div>
                    
                    {
                        isAddingFiles &&
                            <div className='group-input-area'>
                                <input 
                                    type='file'
                                    id='new-file-upload'
                                    name='files'
                                    multiple
                                    accept='.txt'
                                    className='file-adder-button'
                                    onChange={onFileChange}
                                />
                                <button
                                    className={canSubmitFiles ? `file-uploader-button` : `file-uploader-button-disabled`}
                                    type='button'
                                    onClick={() => {onSubmitFiles(); handleCancelAddNewFiles()}}
                                    disabled={!canSubmitFiles}
                                >
                                    { canSubmitFiles ? `Add files` : `Select files first` }
                                </button>
                                <button
                                    className='cancel-add-new-files'
                                    type='button'
                                    onClick={handleCancelAddNewFiles}
                                >
                                    Cancel
                                </button>
                            </div>
                    }
                </div>
                <div className='file-display-container'>
                    {/* Files display area. If a file is clicked, it highlights the file and will call for the text to be displayed. */}
                    {
                        subCorpusFiles.corpusFiles.map((corpusFile) => (
                            // Ensures that the class name is conditionally applied to a selected item
                            <div
                                className={ corpusFile.id === selectedFileID ? 'file-selected' : 'file-not-selected' }
                                key={corpusFile.id}
                            >
                                <div className='file-name' onClick={() => selectFile(corpusFile.id)}>
                                    <div>{corpusFile.file_name}</div>
                                    {
                                        corpusFile.id === selectedFileID
                                        ? <div onClick={() => handleDeleteFile(corpusFile.id)}>Delete File</div>
                                        : ''
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>

                

            </div>
        
        </>
    )
};