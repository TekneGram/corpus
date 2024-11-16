"use client"
// Fonts
import { faCircleCheck, faX, faArrowUpAZ, faArrowDownZA, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// CSS

// Types
import { ProjectTitle } from "@/app/types/types";

// APIs
//import { saveProjectTitleToDatabase } from "../../ipcRenderer/newProjects";
import { saveProjectTitleToDatabase } from "@/app/api/manageCorpus";
import { loadProjectMetadata, loadAllProjectTitles } from "@/app/api/manageCorpus";

// Context and state management
import { useState, useRef, useReducer, useEffect } from 'react';
import { useProjectTitles, useProjectTitlesDispatch } from '../../context/ProjectsContext';
import { useCorpusMetaData, useCorpusDispatch } from '@/app/context/CorpusContext';

// Child components
import { toast } from 'react-toastify';


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
    const corpusMetadata = useCorpusMetaData();

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

    const selectedProject = projectTitles.find((project) => project.isSelected);

    useEffect(() => {
        if (!selectedProject) return;
        const fetchMetadata = async () => {
            // set a loading icon
            try {
                const metadata = await loadProjectMetadata(selectedProject.id);
                if (metadata) {
                    dispatchCorpusMetaData({
                        type: 'initialize',
                        corpusMetadata: metadata,
                    });
                }
            } catch (error) {
                // We failed to get new metadata, so set the selected project id back
                // to its original one
                dispatch({ type: "setSelected", id: corpusMetadata.projectTitle.id});
                console.error("Error fetching metadata", error);
                toast.error("Error fetching the project info.");
                
            } finally {
                // remove the loading icon
            }
        };
        fetchMetadata();
    }, [selectedProject, dispatchCorpusMetaData]);

    const toggleSelected = async(id: number) => {
        dispatch({ type: "setSelected", id: id });
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
    const [newProjectSaved, setNewProjectSaved] = useState<boolean>(false);
    const handleNewProjectTitleChange = (value: string) => {
        setNewProjectTitle(value);
    }

    const handleStartNewProject = async () => {
        const title = newProjectTitle.trim();
        if(title.length > 3) {
            try {
                await saveProjectTitleToDatabase(title);
                toast.success("Project created: " + title);
                setNewProjectTitle("");
                handleStartingNewProject(false);
                setNewProjectSaved(true);
            } catch (error) {
                console.error("Error creating a project:", error);
                toast.error("Failed to create project.");
            }
        } else {
            toast("Your title needs to be at least 4 letters long");
        }
    }

    const handleStopAddingNewProject= () => {
        setNewProjectTitle('');
        handleStartingNewProject(false);
    }

    useEffect(() => {
        if (!newProjectSaved) return;
        const fetchProjects = async () => {
            try {
                const allProjects: ProjectTitle[] = await loadAllProjectTitles();
                const allProjectsSelected = allProjects.map((project) => ({
                    ...project,
                    isSelected: false,
                }));
                dispatch({
                    type: "refreshed",
                    projectTitles: allProjectsSelected
                });
            } catch (error) {
                console.error("Error fetching projects: ", error);
                toast.error("Failed to load project titles!");
            } finally {
                setNewProjectSaved(false);
            }
        };
        fetchProjects();
    }, [newProjectSaved, dispatch]);

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