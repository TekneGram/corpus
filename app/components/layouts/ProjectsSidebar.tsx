import { useState, useRef } from 'react';
import { faCircleCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveProjectTitleToDatabase } from "../../ipcRenderer/newProjects";

interface ProjectSidebarProps {
    startingNewProject: boolean;
    handleStartingNewProject: (state:boolean) => void;
}

const ProjectsSidebar: React.FC<ProjectSidebarProps> = ({ startingNewProject, handleStartingNewProject }) => {

    /**
     * Functionality to handle changing width of sidebar by dragging
     */
    const [projectsBarWidth, setProjectsBarWidth] = useState(300);
    const isDragging = useRef(false); // Keeps its value between renders

    const handleChangeWidth = () => {
        isDragging.current = true;
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging.current) {
            setProjectsBarWidth((prevWidth) => Math.max(prevWidth + e.movementX, 150));
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    }
    /**
     * End of dragging side bar
     */

    /**
     * Functionality to handle adding a new project
     */
    const [newProjectTitle, setNewProjectTitle] = useState<string>('');
    const handleNewProjectTitleChange = (value: string) => {
        setNewProjectTitle(value);
    }
    const handleStartNewProject = () => {
        const title = newProjectTitle.trim();
        if(title.length > 3) {
            alert("Your project title is: " + newProjectTitle);
            // Create a database entry to start a new project
            saveProjectTitleToDatabase(title);
            // Update the Projects Sidebar view to show a clickable project title
            setNewProjectTitle('');
            handleStartingNewProject(false);

        } else {
            alert("Your title needs to be at least 4 letters long");
        }
    }

    const handleStopAddingNewProject= () => {
        setNewProjectTitle('');
        handleStartingNewProject(false);
    }

    /**
     * End of functionality to handle adding a new project
     */

    return (
        <>
            <aside className='projects-sidebar' style = {{ width: projectsBarWidth }}>
                
                {/* For creating a new project */}
                {startingNewProject && (
                    <div className='new-project-area'>
                        <input 
                            className='new-project-input'
                            type="text"
                            placeholder="New project title"
                            value={newProjectTitle}
                            onChange={(e) => handleNewProjectTitleChange(e.target.value)} 
                        />
                        <button 
                            className='new-project-button'
                            type='submit'
                            onClick={handleStartNewProject}
                        >
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </button>
                        <button 
                            className='new-project-button'
                            type='submit'
                            onClick={handleStopAddingNewProject}
                        >
                            <FontAwesomeIcon icon={faX} />
                        </button>
                    </div>
                )}

            </aside>

            {/* For resizing the sidebar */}
            <div className='divider' onMouseDown={handleChangeWidth}>

            </div>

        </>
    );
};

export default ProjectsSidebar;