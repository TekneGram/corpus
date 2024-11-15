"use client"

// Fonts
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// CSS
import '../../manager.css';

// import types
import { SelectableProjectTitle } from '../../types/types';

// APIs to server
import { postCorpusName, patchCorpusName } from '@/app/ipcRenderer/corpusEdits';

// import useContext aliases and state management
import { useProjectTitles } from '@/app/context/ProjectsContext';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';
import { useState, useEffect } from 'react';

// Child Components
import FileUpload from "./FileUpload";


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
    const updateCorpusName = () => {
        // Get the id of the currently selected project
        const projectId = projectTitles.filter(projectTitle => projectTitle.isSelected === true)[0].id;
        const corpusDetails = {
            corpusName: corpusName,
            projectId: projectId
        };

        // Set the corpus name for this project
        if (corpusMetadata.corpus.corpus_name === '') {
            if(corpusDispatch) {
                corpusDispatch({
                    type: "update-corpus-name", 
                    corpusName: corpusName
                });
                postCorpusName(corpusDetails);
            }
            
        } else {
            // This time we just want to patch the name
            if(corpusDispatch) {
                corpusDispatch({
                    type: "update-corpus-name", 
                    corpusName: corpusName
                });
                patchCorpusName(corpusDetails);
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