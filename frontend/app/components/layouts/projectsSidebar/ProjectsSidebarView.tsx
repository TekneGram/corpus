import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCircleCheck,
    faX,
    faArrowUpAZ,
    faArrowDownZA,
    faUserPen,
    faCircleXmark
} from "@fortawesome/free-solid-svg-icons";
import { SelectableProjectTitle } from "@shared/types/manageCorpusTypes";

interface ProjectSidebarViewProps {
    width: number;
    startResize: () => void;
    startingNewProject: boolean;
    newTitle: string;
    setNewTitle: (v: string) => void;
    createProject: () => void;
    cancelCreate: () => void;

    projects: SelectableProjectTitle[];
    sortAsc: () => void;
    sortDesc: () => void;
    selectProject: (id: number) => void;

    editingId: number | null;
    startEditing: (id: number) => void;
    updateDraft: (v: string) => void;
    confirmEdit: (id: number) => void;
    cancelEdit: (id: number) => void;
}

export const ProjectsSidebarView: React.FC<ProjectSidebarViewProps> = ({
    width,
    startResize,
    startingNewProject,
    newTitle,
    setNewTitle,
    createProject,
    cancelCreate,
    projects,
    sortAsc,
    sortDesc,
    selectProject,
    editingId,
    startEditing,
    updateDraft,
    confirmEdit,
    cancelEdit
}) => (
    <>
        <aside className="projects-sidebar" style= {{ width }}>
            {startingNewProject && (
                <div className="new-project-area">
                    <input
                        className='new-project-input'
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        placeholder="New project title"
                    />
                    <button onClick={createProject} className="new-project-button">
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                    <button onClick={cancelCreate} className="new-project-button">
                        <FontAwesomeIcon icon={faX} />
                    </button>
                </div>
                
            )}

            <div className="project-titles-bar">
                <button onClick={sortAsc}><FontAwesomeIcon icon={faArrowUpAZ} /></button>
                <button onClick={sortDesc}><FontAwesomeIcon icon={faArrowDownZA} /></button>
            </div>

            {projects.map(p =>
                editingId === p.id ? (
                    <div key={p.id} className="project-title-entry">
                        <input
                            value={p.project_name}
                            onChange={e => updateDraft(e.target.value)}
                        />
                        <button onClick={() => confirmEdit(p.id)}>
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </button>
                        <button onClick={() => cancelEdit(p.id)}>
                            <FontAwesomeIcon icon={faCircleXmark} />
                        </button>
                    </div>
                ) : (
                    <div
                        key={p.id}
                        className={`project-title-entry ${p.isSelected ? "project-selected" : ""}`}
                    >
                        <div onClick={() => selectProject(p.id)} className={`project-title-bar ${p.isSelected ? 'project-selected' : ''}`}>
                            {p.project_name}
                        </div>
                        <div onClick={() => startEditing(p.id)}>
                            <FontAwesomeIcon icon={faUserPen} />
                        </div>
                    </div>
                )
            )}
        </aside>
        <div className="divider" onMouseDown={startResize} />
    </>
)