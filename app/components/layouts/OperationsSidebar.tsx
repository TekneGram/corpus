"use client"
// Fonts
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface OperationsSidebarProps {
    handleStartingNewProject: (state:boolean) => void;
}
const OperationsSidebar:React.FC<OperationsSidebarProps> = ({ handleStartingNewProject }) => {

    return (
        <aside className='operations-sidebar' data-testid="operations-sidebar">
            
            <button 
                className='add-project-button'
                onClick={() => handleStartingNewProject(true)}
                aria-label="Add new project"
                data-testid="add-project-button"
            >
                <FontAwesomeIcon icon={faPlus} />
            </button>
              
        </aside>
    );
}

export default OperationsSidebar;