import { ProjectsSidebarView } from "./projectsSidebar/ProjectsSidebarView";
import { useResizeableSidebar } from "./projectsSidebar/useResizeableSidebar";
import { useProjectSelection } from "./projectsSidebar/useProjectSelection";
import { useProjectCreation } from "./projectsSidebar/useProjectCreation";
import { useProjectEditing } from "./projectsSidebar/useProjectEditing";
import { useProjectTitles, useProjectTitlesDispatch } from "@context/projectTitles/useProjectTitles";

interface ProjectsSidebarProps {
    startingNewProject: boolean;
    handleStartingNewProject: (v: boolean) => void;
}

const ProjectsSidebar: React.FC<ProjectsSidebarProps> = ({
    startingNewProject,
    handleStartingNewProject
}) => {
    const { width, startDragging } = useResizeableSidebar();
    const { selectProject } = useProjectSelection();
    const { title, setTitle, createProject, cancel } = useProjectCreation(() => handleStartingNewProject(false));
    const { editingId, startEditing, updateDraft, confirm, cancel: cancelEdit } = useProjectEditing();

    const projects = useProjectTitles();
    const dispatch = useProjectTitlesDispatch();

    return (
        <ProjectsSidebarView
            width={width}
            startResize={startDragging}
            startingNewProject={startingNewProject}
            newTitle={title}
            setNewTitle={setTitle}
            createProject={createProject}
            cancelCreate={cancel}
            projects={projects}
            sortAsc={() => dispatch({ type: "sorted", sortType: "asc" })}
            sortDesc={() => dispatch({ type: "sorted", sortType: "desc" })}
            selectProject={selectProject}
            editingId={editingId}
            startEditing={startEditing}
            updateDraft={updateDraft}
            confirmEdit={confirm}
            cancelEdit={cancelEdit}
        />
    )
}

export default ProjectsSidebar;