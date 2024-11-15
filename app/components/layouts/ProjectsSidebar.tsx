import { useState, useRef, useReducer, useEffect } from 'react';
import { faCircleCheck, faX, faArrowUpAZ, faArrowDownZA, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveProjectTitleToDatabase, loadAllProjectTitles, loadProjectMetadata } from "../../ipcRenderer/newProjects";

import { useProjectTitles, useProjectTitlesDispatch } from '../../context/ProjectsContext';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';
import { toast } from 'react-toastify';

type ProjectTitle = {
    id: number;
    project_name: string;
};

type SelectableProjectTitle = ProjectTitle & { isSelected: boolean };

interface ProjectSidebarProps {
    startingNewProject: boolean;
    handleStartingNewProject: (state:boolean) => void;
};

const ProjectsSidebar: React.FC<ProjectSidebarProps> = ({ 
    startingNewProject, 
    handleStartingNewProject
}) => {
    // Use the context for state:
    const dispatch = useProjectTitlesDispatch();
    const projectTitles = useProjectTitles();
    const dispatchCorpusMetaData = useCorpusDispatch();

    /**
     * Functionality to handle sorting the project titles
     */
    const handleSortAscending = () => {
        dispatch({
            type: "sorted",
            sortType: "asc",
        });
    }

    const handleSortDescending = () => {
        dispatch({
            type: "sorted",
            sortType: "desc"
        })
    }

    /**
     * Functionality to handle the toggle of selected states on project titles
     */
    const toggleSelected = async(id: number) => {
        dispatch({ type: "setSelected", id: id });
        try {
            const metadata = await loadProjectMetadata(id);
            if(metadata !== undefined && dispatchCorpusMetaData) {
                dispatchCorpusMetaData({ // this is a non-null assertion
                    type: 'initialize',
                    corpusMetadata: metadata
                });
            }
        } catch (error) {
            console.error('Error getting corpus metadata for your project');
            toast.error("Error getting corpus metadata for your project: " + error);
        }
    }

    /**
     * Functionality to handle changing width of sidebar by dragging
     */
    const [projectsBarWidth, setProjectsBarWidth] = useState(300);
    const isDragging = useRef(false); // Keeps its value between renders but can't be displayed in JSX

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
     * Functionality to handle adding a new project
     */
    const [newProjectTitle, setNewProjectTitle] = useState<string>('');
    const handleNewProjectTitleChange = (value: string) => {
        setNewProjectTitle(value);
    }

    const refreshAllProjectTitles = async () => {
        const allProjects: ProjectTitle[] = await loadAllProjectTitles();
        const allProjectsSelected = allProjects.map((project) => {
            return { ...project, isSelected: false};
        });
        dispatch({ type: 'refreshed', 'projectTitles': allProjectsSelected });
    };

    const handleStartNewProject = () => {
        const title = newProjectTitle.trim();
        if(title.length > 3) {
            alert("Your project title is: " + newProjectTitle);
            // Create a database entry to start a new project
            saveProjectTitleToDatabase(title);
            // Update the Projects Sidebar view to show a clickable project title
            setNewProjectTitle('');
            handleStartingNewProject(false);
            // Refresh the project titles
            refreshAllProjectTitles();

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

    /**
     * Functionality for selecting title
     */

    return (
        <>
            <aside className='projects-sidebar' style = {{ width: projectsBarWidth }}>
            
                {/* For creating a new project */}
                {startingNewProject && (
                    <div className={`new-project-area`}>
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
                <div className='project-titles-bar'>
                    <button
                        className="sort-project-titles-button"
                        onClick={handleSortAscending}
                    >
                        <FontAwesomeIcon icon={faArrowUpAZ} />
                    </button>
                    <button
                        className="sort-project-titles-button"
                        onClick={handleSortDescending}
                    >
                        <FontAwesomeIcon icon={faArrowDownZA} />
                    </button>
                </div>
                {projectTitles.map(projectTitle => (
                    <div 
                        key={projectTitle.id}
                        className='project-title-entry'
                    >
                        <div className={`project-title-bar ${projectTitle.isSelected ? 'project-selected' : ''}`} onClick={() => toggleSelected(projectTitle.id)}>
                            <span className='project-title'>{projectTitle.project_name}</span>
                        </div>
                        
                    </div>
                ))}

            </aside>

            {/* For resizing the sidebar */}
            <div className='divider' onMouseDown={handleChangeWidth}>

            </div>

        </>
    );
};

export default ProjectsSidebar;