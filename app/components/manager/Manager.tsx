import { useState } from 'react';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileUpload from "./FileUpload";
import '../../manager.css';
import { postCorpusName } from '@/app/ipcRenderer/corpusEdits';
import { useProjectTitles } from '@/app/context/ProjectsContext';

interface SelectableProjectTitle {
    id: number;
    project_name: string;
    isSelected: boolean;
}


const Manager = () => {

    const projectTitles: SelectableProjectTitle[] = useProjectTitles();

    const [editingCorpusName, setEditingCorpusName] = useState<boolean>(false);
    const [corpusName, setCorpusName] = useState<string>('Click to name');
    const handleEditCorpusName = () => {
        setEditingCorpusName(!editingCorpusName);
    }
    const handleInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        setCorpusName(event.target.value);
        if (corpusName.length > 23) {
            setCorpusName((prevName) => prevName.substring(0, 22));
        }
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
        }
        
        // If the corpus name has already been gotten from the database, then we should call patchCorpusName
        postCorpusName(corpusDetails);
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
                                        updateCorpusName()
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