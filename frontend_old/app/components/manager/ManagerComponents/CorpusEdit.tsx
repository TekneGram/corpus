import React from 'react';

// CSS
import '@/manager.css';

// Fonts
import { faPlus, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// State management
import { useEffect, useState } from 'react';

// import useContext aliases
import { useProjectTitles } from '../../../context/ProjectsContext';
import { useCorpusMetaData, useCorpusDispatch } from '../../../context/CorpusContext';

// import types
import { SelectableProjectTitle, CorpusProjectRelation } from '../../../types/types';

// APIs to server
import { postCorpusName, patchCorpusName, loadProjectMetadata } from '../../../api/manageCorpus';

// Child components
import { toast } from 'react-toastify';

const CorpusEdit: React.FC = () => {

    /**
     * CONTEXT
     */
    const projectTitles: SelectableProjectTitle[] = useProjectTitles();
    let corpusMetadata = useCorpusMetaData();
    let corpusDispatch = useCorpusDispatch();

    /**
     * STATES
     */
    const [editingCorpusName, setEditingCorpusName] = useState<boolean>(false);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false); // for tracking UI state of add corpus name button
    const [corpusName, setCorpusName] = useState<string>('');
    const [originalCorpusName, setOriginalCorpusName] = useState<string>(''); // allows the user to cancel any name change midway through making a change

    /**
     * EFFECTS
     */
    useEffect(() => {
        setCorpusName((prevName) => {
            return corpusMetadata.corpus.corpus_name.length > 0
            ? corpusMetadata.corpus.corpus_name // initial state on creating a project
            : 'Click to name';
        });

        setOriginalCorpusName((prevName) => {
            return corpusMetadata.corpus.corpus_name.length > 0
            ? corpusMetadata.corpus.corpus_name // initial state on creating a project
            : 'Click to name';
        });

        setEditingCorpusName(false); // reset the view if there is a change
    }, [setCorpusName, corpusMetadata, setOriginalCorpusName]);

    /**
     * HANDLERS / FUNTIONALITY
     */

    // Change UI state
    const handleEditCorpusName = () => {
        setEditingCorpusName(true);
    };

    // Change UI state and revert to earlier data
    const cancelEditCorpusName = () => {
        setEditingCorpusName(false);
        setCorpusName(originalCorpusName);
        setButtonDisabled(false);
    }

    // Track corpus name changes
    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setCorpusName(event.target.value);
        if (corpusName.length > 23) {
            setCorpusName((prevName) => prevName.substring(0, 22));
        }
        /**
         * If the name is less than 4 characters, then deselect the add button
         */
        if (corpusName.length < 4) {
            setButtonDisabled(true);
        } else {
            setButtonDisabled(false);
        }
    }

    // Update local state based on returned information from database
    const updateCorpusName = async () => {
        // Get the id of the currently selected project
        const projectId = projectTitles.filter(projectTitle => projectTitle.isSelected === true)[0].id;
        if (!projectId) throw new Error('No project selected');
        
        const corpusDetails: CorpusProjectRelation = {
            project_id: projectId,
            corpus_name: corpusName,
        };

        // Set the corpus name for this project for the first time
        if (corpusMetadata.corpus.corpus_name === '') {
            // Post the new corpus name to the database
            const result = await postCorpusName(corpusDetails);
            // If result fails, show a toast error
            if (result.status === 'fail') {
                toast.error("Could not add your corpus name. Please try again.");
            } else {
                corpusDispatch({
                    type: 'update-corpus-name',
                    corpusId: result.cppOutput.id,
                    corpusName: corpusName
                });
                toast.success("Cropusname added successfully.");
                setOriginalCorpusName(corpusName);
            }
        } else {
            // Update the corpus name on the database if the corpus name has been changed
            const result = await patchCorpusName({ id: corpusMetadata.corpus.id, corpus_name: corpusName});

            // If fails to update on the database, inform the user
            if (result.status === 'fail') {
                toast.error("Could not update your corpus name. Please try again.");
            } else {
                if (corpusDispatch) {
                    corpusDispatch({
                        type: 'update-corpus-name',
                        corpusId: corpusMetadata.corpus.id,
                        corpusName: corpusName
                    });
                }
                toast.success("Corpus name updated successfully.");
                setOriginalCorpusName(corpusName);
            }
        }
    }
 
    return (
        <div className='corpus-title-area'>
            {
                editingCorpusName &&
                <div className="editing-corpus-name-area">
                    <div>
                        <input
                            className='corpus-name-input'
                            type='text'
                            value={corpusName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <button
                            className='corpus-name-update-button'
                            type='button'
                            disabled={buttonDisabled}
                            onClick={() => {
                                handleEditCorpusName();
                                updateCorpusName();
                            }}
                        >
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </button>
                        <button
                            className='corpus-name-cancel-button'
                            type='button'
                            onClick={() => {
                                cancelEditCorpusName();
                            }}
                        >
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    </div>
                </div>
            }
            {
                !editingCorpusName &&
                <span
                    className='corpus-title'
                    onClick={handleEditCorpusName}
                >
                    {corpusName}
                </span>
            }

        </div>
    );
};

export default CorpusEdit;