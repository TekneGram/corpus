"use client"

// Fonts
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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
import { toast } from "react-toastify";


const Manager = () => {

    const projectTitles: SelectableProjectTitle[] = useProjectTitles();
    let corpusMetadata = useCorpusMetaData();
    let corpusDispatch = useCorpusDispatch();

    // The purpose of this useEffect is to populate the state of the corpusName from context
    const [editingCorpusName, setEditingCorpusName] = useState<boolean>(false);
    const [corpusName, setCorpusName] = useState<string>('');
    useEffect(() => {
        setCorpusName((prevName) => {
            return corpusMetadata.corpus.corpus_name.length > 0 
            ? corpusMetadata.corpus.corpus_name// initial state on creating a project
            : 'Click to name';
        });
    }, [setCorpusName, corpusMetadata]); 

    
    console.log("The corpusName is:", corpusName);

    const handleEditCorpusName = () => {
        setEditingCorpusName(!editingCorpusName);
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

        // Set the corpus name for this project
        if (corpusMetadata.corpus.corpus_name === '') {
            // Post new corpus name
            const result = await postCorpusName(corpusDetails);
            // If result fails show a toast error
            if (result.status === 'fail') {
                toast.error("Could not add your corpus name. Please try again.");
            } else {
                if (corpusDispatch) {
                    postCorpusName(corpusDetails);
                    corpusDispatch({
                        type: "update-corpus-name", 
                        corpusName: corpusName
                    });
                }
                toast.success("Corpus name added successfully.");
            }

            
        } else {
            // Update the corpus name on the database
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
            }
        }
    }

    return (
        <div className = 'manager-container'>
            
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
                                ><FontAwesomeIcon icon={faPlus} /></button>
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
                        >
                            Add group
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                    

                </div>
                <FileUpload />
                <FileUpload />
                <FileUpload />
                <FileUpload />
                
            </div>

            <div>
                <p>This is where you will see info</p>
                <p>Probably somewhere in the middle, related to your corpus</p>
            </div>
        </div>
    );
};

export default Manager;