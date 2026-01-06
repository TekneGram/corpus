// Fonts
import { faCircleCheck, faCircleXmark, faX, faArrowUpAZ, faArrowDownZA, faUserPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// CSS

// Types
import { ProjectTitle } from "@app-types/types";

// APIs
//import { saveProjectTitleToDatabase } from "../../ipcRenderer/newProjects";
import { saveProjectTitleToDatabase, updateProjectTitleInDatabase } from "@app-api/manageCorpus";
import { loadProjectMetadata, loadAllProjectTitles } from "@app-api/manageCorpus";

// Context and state management
import { useState, useRef, useReducer, useEffect } from 'react';
import { useProjectTitles, useProjectTitlesDispatch } from '@context/projectTitles/useProjectTitles';
import { useCorpusMetaData, useCorpusDispatch } from '@context/corpusMetadata/useCorpusMetadata';

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
                setNewProjectSaved(true); // This will trigger a useEffect which will load all the project titles again. However, this might be a bug!!!
                // Better might be to retrieve a full ProjectTitle type, with project_name and id from the database
                // and update the context
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
     * Functionality to handle editing a project title
     */
    const [editingProjectTitle, setEditingProjectTitle] = useState<Array<boolean>>((projectTitles.map(() => false)));
    const [aProjectName, setAProjectName] = useState<string>(''); // Stores the original project name so it can be cancelled after being changed.
    // useEffect(() => {
    //     console.log("Editing project titles: ", editingProjectTitle);
    // });
    const handleEditProjectTitle = (id: number) => {
        setAProjectName(projectTitles[id-1].project_name);
        setEditingProjectTitle(() => {
            return projectTitles.map((project) => {
                if (project.id === id) {
                    return true;
                } else {
                    return false;
                }
            });
        });
    }

    const updateProjectTitle = (value: string, id: number) => {
        dispatch({
            type: "update-project-title",
            id: id,
            project_name: value
        });
    }

    const confirmProjectTitleUpdate = async (id: number) => {
        const projectTitle = projectTitles.find((project) => {
            return project.id === id;
        })?.project_name;
        if (!projectTitle || projectTitle.length < 4) {
            // Handle the error - a project title cannot be an empty string
            // Return an error to the user telling them to enter a valid project title.
            toast.error("A Project Title cannot be empty.");
            dispatch({
                type: "update-project-title",
                id: id,
                project_name: aProjectName
            });
        } else {
            // Make a call to the backend with the new name.
            // Handle what happens if the call fails, namely, revert back to the original name.
            const result = await updateProjectTitleInDatabase(id, projectTitle);
            console.log(result);
            toast.success("Project title updated to: ", result.project_name);
        }

        setAProjectName('');
        setEditingProjectTitle(() => {
            return projectTitles.map(() => false);
        })
    }

    const cancelProjectTitleUpdate = (id: number) => {
        dispatch({
            type: "update-project-title",
            id: id,
            project_name: aProjectName
        });
        setAProjectName('');
        setEditingProjectTitle(() => {
            return projectTitles.map(() => false);
        });
    }

    /**
     * End of functionality to handle editing a project title
     */

    /**
     * Functionality for selecting title
     */

    return (
        <>
            <aside className='projects-sidebar' style = {{ width: projectsBarWidth }} data-testid="projects-sidebar">
            
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
                <div className='project-titles-bar' data-testid="project-titles-bar">
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
                    // Get the editing status from the setEditingProjectTitle state
                    // If it is false, then the project title is not being edited
                    // If it is true, then the project title is being edited, so show an input field and okay button.
                    // If the okay button is clicked, then set the editing status to false
                    <>
                        {
                            editingProjectTitle[projectTitle.id-1] ? (
                                <>
                                    <div 
                                        key={projectTitle.id} 
                                        className = 'project-title-entry'
                                    >
                                        <input 
                                            className="edit-project-title-input"
                                            type='text'
                                            value={projectTitle.project_name}
                                            onChange={(e) => updateProjectTitle(e.target.value, projectTitle.id)}
                                        />
                                        <button 
                                            onClick={() => confirmProjectTitleUpdate(projectTitle.id)}
                                        >
                                            <FontAwesomeIcon icon={faCircleCheck}/>
                                        </button>
                                        <button 
                                            onClick={() => cancelProjectTitleUpdate(projectTitle.id)}
                                        >
                                            <FontAwesomeIcon icon={faCircleXmark}/>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div 
                                        key={projectTitle.id}
                                        className={`project-title-entry ${projectTitle.isSelected ? 'project-selected' : ''}`}
                                    >
                                        <div className={`project-title-bar ${projectTitle.isSelected ? 'project-selected' : ''}`} 
                                            onClick={() => toggleSelected(projectTitle.id)}
                                        >
                                            <span className='project-title'>{projectTitle.project_name}</span>
                                        </div>
                                        <div className='project-title-entry-edit' onClick={() => handleEditProjectTitle(projectTitle.id)}><FontAwesomeIcon icon={faUserPen}/></div>
                                    </div>
                                </>
                            )
                        }
                    </>
                ))}

            </aside>

            {/* For resizing the sidebar */}
            <div className='divider' onMouseDown={handleChangeWidth}>

            </div>

        </>
    );
};

export default ProjectsSidebar;