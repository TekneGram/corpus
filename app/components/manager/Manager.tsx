"use client"
import React from 'react';

// Fonts
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// CSS
import '@/manager.css';

// APIs
import { getCorpusFileText } from '@/app/api/manageCorpus';

// import useContext aliases and state management
import { useCorpusMetaData } from '@/app/context/CorpusContext';
import { useState, useEffect } from 'react';

// Child Components
import CorpusEdit from "./ManagerComponents/CorpusEdit"; // Edits the corpus name
import FileUpload from "./ManagerComponents/FileUpload"; // Uploads files to a subcorpus
import FileDisplay from "./ManagerComponents/FileDisplay"; // Displays the file names in a subcorpus
import TextDisplay from './ManagerComponents/TextDisplay';

const Manager = () => {
    /**
     * CONTEXT AND STATTE MANAGEMENT
     */
    let corpusMetadata = useCorpusMetaData();
    const [addingGroup, setAddingGroup] = useState<boolean>(false);
    const [selectedFileID, setSelectedFileID] = useState<number | null>(null); // For keeping track of the file ID selected in the FileDisplay child component.
    const [selectedFileText, setSelectedFileText] = useState<string>(""); // For displaying the text of the selected corpus file.
    const [showTextDisplay, setShowTextDisplay] = useState<boolean>(false); // For displaying the text of the selected corpus file.

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

    /**
     * FUNCTIONALITY for displaying text with a file ID
     * @param fileID
     * @returns
     */
    const showTextWithFileID = (fileID: number) => {
        setSelectedFileID(fileID); // set the selected file ID
    }

    useEffect(() => {
        // Keep track of changes in the file ID.
        if (selectedFileID !== null) {
            console.log("The file ID has changed: ", selectedFileID);
            // Call the API to get the text for the file ID
            getCorpusFileText(selectedFileID)
                .then((response) => {
                    console.log("This is the response: ", response);
                    if (response.status === "success") {
                        const text = (response.cppOutput as any).file_text ?? "";
                        console.log("This is the text I got: ", text);
                        setSelectedFileText(text);
                        setShowTextDisplay(true); // Tell the child component (TextDisplay) to show the text.
                    } else if (response.status === "fail") {
                        console.log("There was an error!");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching text: ", error);
                });
        }
    })

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
                                    <FileDisplay subCorpusFiles={files} showTextWithFileID={showTextWithFileID} />
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
        <div className='text-display-container'>
            <TextDisplay fileID={selectedFileID} setSelectedFileID={setSelectedFileID} fileText={selectedFileText} setSelectedFileText={setSelectedFileText} showTextDisplay={showTextDisplay} setShowTextDisplay={setShowTextDisplay} />
        </div>

        </div>
    );
};

export default Manager;