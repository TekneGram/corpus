import { createContext, useContext, useEffect, useReducer, ReactNode, Dispatch } from 'react';

import { loadAllProjectTitles } from "../ipcRenderer/newProjects";

const ProjectTitlesContext = createContext<SelectableProjectTitle[]>([]);
const ProjectTitlesDispatchContext = createContext<Dispatch<ProjectTitlesActions>|undefined>(undefined);

type ProjectTitle = {
    id: number;
    project_name: string;
};

interface SelectableProjectTitle extends ProjectTitle {
    isSelected: boolean 
};

type ProjectTitlesActions = 
    | { type: "initialize"; projectTitles: SelectableProjectTitle[] }
    | { type: "sorted"; sortType: "asc" | "desc" }
    | { type: "setSelected"; id: number }
    | { type: "refreshed"; projectTitles: SelectableProjectTitle[]}

interface ProjectTitlesProviderProps {
    children: ReactNode;
}

export const ProjectTitlesProvider: React.FC<ProjectTitlesProviderProps> = ({ children }) => {

    const [projectTitles, dispatch] = useReducer<React.Reducer<SelectableProjectTitle[], ProjectTitlesActions>>(
        projectTitlesReducer, // this is the reducer function
        [] // this is the initial state
    );

    useEffect(() => {
        const handleLoadProjectTitles = async () => {
            const dbProjectTitles: ProjectTitle[] = await loadAllProjectTitles();
            const dbSelectedProjectTitles = dbProjectTitles.map(project => ({ ...project, isSelected: false}))
            dispatch({ type: 'initialize', projectTitles: dbSelectedProjectTitles }); // dispatch carries the action
        }
        handleLoadProjectTitles();
    }, [dispatch]);
    
    return (
        <ProjectTitlesContext.Provider value={projectTitles}>
            <ProjectTitlesDispatchContext.Provider value={dispatch}>
                {children}
            </ProjectTitlesDispatchContext.Provider>
        </ProjectTitlesContext.Provider>
    )
}

export const useProjectTitles = () => {
    return useContext(ProjectTitlesContext);
}

export const useProjectTitlesDispatch = () => {
    const context = useContext(ProjectTitlesDispatchContext);
    // This is a type guard against the possibility that ProjectTitlesDispatchContext is undefined
    if (context === undefined) {
        throw new Error("useProjectTitlesDispatch must be used within a ProjectTitleProvider");
    }
    return context;
}

const projectTitlesReducer = (projectTitles: SelectableProjectTitle[], action: ProjectTitlesActions): SelectableProjectTitle[] => {
    switch (action.type) {
        case 'initialize': {
            return action.projectTitles;
        }
        case 'sorted': {
            const sortedTitles = [...projectTitles].sort((a,b) => {
                if (action.sortType === "asc") {
                    return a.project_name.localeCompare(b.project_name);
                } else {
                    return b.project_name.localeCompare(a.project_name);
                }
            });
            return sortedTitles;
        }
        case 'setSelected': {
            return projectTitles.map((projectTitle) => {
                return projectTitle.id === action.id ? {...projectTitle, isSelected: true} : {...projectTitle, isSelected: false};
            });
        }
        case 'refreshed': {
            return action.projectTitles;
        }
        default: {
            return projectTitles;
        }
    }
}