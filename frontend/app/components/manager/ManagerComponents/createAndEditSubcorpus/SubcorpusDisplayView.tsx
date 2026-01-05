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
}

export const SubcorpusDisplayView: React.FC<SubcorpusDisplayViewProps> = ({
    subCorpusFiles,
    subcorpusName,
    onNameChange,
    canSubmitNameChange,
    onSubmitNameChange,
    onCancelNameChange
}) => {

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
                </div>
            </div>
        
        </>
    )
};