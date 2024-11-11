import { useState, useRef, useReducer, useEffect } from 'react';
import { faCircleCheck, faX, faArrowUpAZ, faArrowDownZA } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { saveProjectTitleToDatabase, loadAllProjectTitles } from "../../ipcRenderer/newProjects";

type ProjectTitle = {
    id: number;
    project_name: string;
};

interface ProjectSidebarProps {
    startingNewProject: boolean;
    handleStartingNewProject: (state:boolean) => void;
    projectTitles: ProjectTitle[];
    refreshProjectTitles: (state: ProjectTitle[]) => void;
};

type ProjectTitlesAction = {
    type: "sort" | "set";
    payload: "asc" | "desc" | ProjectTitle[];
}

function projectTitlesReducer(projectTitles:ProjectTitle[], action: ProjectTitlesAction): ProjectTitle[] {
    switch (action.type) {
        case 'sort':
            return [...projectTitles].sort((a, b) => {
                if (action.payload === "asc") {
                    return a.project_name.localeCompare(b.project_name);
                } else {
                    return b.project_name.localeCompare(a.project_name);
                }
            });
        case 'set':
            return projectTitles;
        default:
            return projectTitles;
    }
}

const ProjectsSidebar: React.FC<ProjectSidebarProps> = ({ 
    startingNewProject, 
    handleStartingNewProject, 
    projectTitles, 
    refreshProjectTitles 
}) => {

    /**
     * Functionality to handle sorting the project titles
     */
    const [projectTitlesState, dispatch] = useReducer<React.Reducer<ProjectTitle[], ProjectTitlesAction>>(projectTitlesReducer, projectTitles);
    const handleSortAscending = () => {
        dispatch({
            type: "sort",
            payload: "asc"
        });
    }

    const handleSortDescending = () => {
        dispatch({
            type: "sort",
            payload: "desc"
        })
    }

    useEffect(() => {
        dispatch({ type: "set", payload: projectTitles });
    }, [projectTitles])

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
     * End of dragging side bar
     */

    /**
     * Functionality to handle adding a new project
     */
    const [newProjectTitle, setNewProjectTitle] = useState<string>('');
    const handleNewProjectTitleChange = (value: string) => {
        setNewProjectTitle(value);
    }

    const reloadAllTopics = async () => {
        const allTopics = await loadAllProjectTitles();
        refreshProjectTitles(allTopics);
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
            // Refresh the project titles
            reloadAllTopics();

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
                {projectTitlesState.map(projectTitle => (
                    <div key={projectTitle.id}>
                        <p>{projectTitle.project_name}</p>
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