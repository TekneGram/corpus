"use client"

// Fonts
import { faPlus, faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// CSS
import '../../manager.css';

// import types
import { SelectableProjectTitle, CorpusProjectRelation } from '../../types/types';

// APIs to server
import { postCorpusName, patchCorpusName } from "@/app/api/manageCorpus";

// import useContext aliases and state management
import { useProjectTitles } from '@/app/context/ProjectsContext';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';
import { useState, useEffect } from 'react';

// Child Components
import FileUpload from "./FileUpload";
import FileDisplay from "./FileDisplay";
import { toast } from "react-toastify";


const Manager = () => {

    const projectTitles: SelectableProjectTitle[] = useProjectTitles();
    let corpusMetadata = useCorpusMetaData();
    let corpusDispatch = useCorpusDispatch();

    // The purpose of this useEffect is to populate the state of the corpusName from context
    const [editingCorpusName, setEditingCorpusName] = useState<boolean>(false);
    const [corpusName, setCorpusName] = useState<string>('');
    const [originalCorpusName, setOriginalCorpusName] = useState<string>(''); // used to allow the user to undo any changes while making a change
    useEffect(() => {
        setCorpusName((prevName) => {
            return corpusMetadata.corpus.corpus_name.length > 0 
            ? corpusMetadata.corpus.corpus_name// initial state on creating a project
            : 'Click to name';
        });
        setOriginalCorpusName((prevName) => {
            return corpusMetadata.corpus.corpus_name.length > 0 
            ? corpusMetadata.corpus.corpus_name// initial state on creating a project
            : 'Click to name';
        });
    }, [setCorpusName, corpusMetadata, setOriginalCorpusName]); 

    
    console.log("The corpusName is:", corpusName);

    const handleEditCorpusName = () => {
        setEditingCorpusName(!editingCorpusName);
    }

    const cancelEditCorpusName = () => {
        setEditingCorpusName(!editingCorpusName);
        setCorpusName(originalCorpusName);
    }

    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setCorpusName(event.target.value);
        if (corpusName.length > 23) {
            setCorpusName((prevName) => prevName.substring(0, 22));
        }
        /**
         * UPDATE THIS - it should not surprise the user!
         */
        if(corpusName.length === 0) {
            setCorpusName((prevName) => "Write something!");
        }
    }
    const updateCorpusName = async () => {
        // Get the id of the currently selected project
        const projectId = projectTitles.filter(projectTitle => projectTitle.isSelected === true)[0].id;
        if (!projectId) throw new Error("No project selected");
        
        const corpusDetails: CorpusProjectRelation = {
            project_id: projectId,
            corpus_name: corpusName,
        };

        // Set the corpus name for this project for the first time
        if (corpusMetadata.corpus.corpus_name === '') {
            // Post new corpus name
            const result = await postCorpusName(corpusDetails);
            // If result fails show a toast error
            if (result.status === 'fail') {
                toast.error("Could not add your corpus name. Please try again.");
            } else {
                if (corpusDispatch) {
                    corpusDispatch({
                        type: "update-corpus-name", 
                        corpusName: corpusName
                    });
                }
                toast.success("Corpus name added successfully.");
                setOriginalCorpusName(corpusName);
            }
        } else {
            // Update the corpus name on the database if the corpus name is being changed
            const result = await patchCorpusName({ id: corpusMetadata.corpus.id, corpus_name: corpusName });

            // If fails to update on the database, inform the user
            if (result.status === 'fail') {
                toast.error("Could not update your corpus name. Please try again.");
            } else {
                if(corpusDispatch) {
                    corpusDispatch({
                        type: "update-corpus-name", 
                        corpusName: corpusName
                    });
                }
                toast.success("Corpus name updated successfully.")
                setOriginalCorpusName(corpusName);
            }
        }
    }

    /**
     * Functionality for adding a new subcorpus
     */
    const [addingGroup, setAddingGroup] = useState<boolean>(false);
    const handleAddGroup = () => {
        setAddingGroup(true);
    }

    return (
        <div className = 'manager-container'>
            
        {   corpusMetadata.projectTitle.id !== 0 && 
            
            <div className = {`manage-group-area ${``}`}>
                
                <div className = 'corpus-edit-area'>
                    
                    <div className='corpus-title-area'>
                        {
                            editingCorpusName &&
                            <div>
                                <input
                                    className='corpus-name-input'
                                    type='text' 
                                    value={corpusName}
                                    onChange={handleInputChange}
                                />
                                <button 
                                    className='corpus-name-update-button'
                                    type='button'
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
                    
                    <div className='add-group-area'>
                        <button
                            className='add-group-button'
                            type='button'
                            onClick={handleAddGroup}
                        >
                            Add group
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
        
                </div>
                
                {
                    corpusMetadata.files.length > 0 &&
                    <>
                        {
                            corpusMetadata.files.map((files) => (
                                <div className='file-upload-area'>
                                    <FileDisplay subCorpusFiles={files} />
                                </div>
                            ))
                        }
                    </>
                }
                {
                    addingGroup === true &&
                    <>
                        <div className='file-upload-area'>
                            <FileUpload />
                        </div>
                    </>
                }
                
                
            </div>
        }

        {
            corpusMetadata.projectTitle.id === 0 &&
            <div>
                <p>Welcome to Teknegram</p>
                <p>Add a new project on the left with the + button.</p>
                <p>If you have projects, select a project to get started.</p>
            </div>
        }

        </div>
    );
};

export default Manager;