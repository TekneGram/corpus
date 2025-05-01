"use client"
import React from 'react';

// Fonts
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// CSS
import '@/manager.css';

// import useContext aliases and state management
import { useCorpusMetaData } from '@/app/context/CorpusContext';
import { useState } from 'react';

// Child Components
import CorpusEdit from "./ManagerComponents/CorpusEdit"; // Edits the corpus name
import FileUpload from "./ManagerComponents/FileUpload"; // Uploads files to a subcorpus
import FileDisplay from "./ManagerComponents/FileDisplay"; // Displays the file names in a subcorpus

const Manager = () => {
    /**
     * CONTEXT
     */
    let corpusMetadata = useCorpusMetaData();
    const [addingGroup, setAddingGroup] = useState<boolean>(false);


    /**
     * FUNCTIONALITY for adding a new subcorpus
     */
    const handleAddGroup = () => {
        setAddingGroup(true);
    }

    // Cancel adding a new subcorpus
    const cancelAddNewSubcorpus = () => {
        setAddingGroup(false);
    }

    return (
        <div className = 'manager-container'>
            
        {   corpusMetadata.projectTitle.id !== 0 && 
            
            <div className = {`manage-group-area ${``}`}>
                
                <div className = 'corpus-edit-area'>
                    <CorpusEdit />
                    
                    <div className='add-group-area'>
                        <button
                            className='add-group-button'
                            type='button'
                            onClick={handleAddGroup}
                        >
                            <div>Add group</div>
                            <div className="add-group-button-icon">
                                <FontAwesomeIcon icon={faPlus} />
                            </div>
                        </button>
                    </div>
        
                </div>
                
                {
                    corpusMetadata.files.length > 0 &&
                    <>
                        {
                            corpusMetadata.files.map((files) => (
                                <div className='file-upload-area' key={files.subCorpus.id}>
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
                            <FileUpload cancelAddNewSubcorpus={cancelAddNewSubcorpus} />
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