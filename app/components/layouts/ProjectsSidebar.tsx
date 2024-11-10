import { useState, useRef } from 'react';
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProjectSidebarProps {
    startingNewProject: boolean;
}

const ProjectsSidebar: React.FC<ProjectSidebarProps> = ({ startingNewProject }) => {

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
                        />
                        <button 
                            className='new-project-button'
                            type='submit'
                        >
                            <FontAwesomeIcon icon={faCircleCheck} />
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