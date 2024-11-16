import { createContext, useContext, useEffect, useReducer, ReactNode, Dispatch } from 'react';
import { ProjectTitle, SelectableProjectTitle } from '@/app/types/types';
import { ProjectTitlesActions } from './contextTypes/contextTypes';
import { loadAllProjectTitles } from '../api/manageCorpus';
import { projectTitlesReducer } from './reducers/projectTitlesReducer';

const ProjectTitlesContext = createContext<SelectableProjectTitle[]>([]);
const ProjectTitlesDispatchContext = createContext<Dispatch<ProjectTitlesActions>|undefined>(undefined);

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
};

export const useProjectTitles = () => {
    return useContext(ProjectTitlesContext);
};

export const useProjectTitlesDispatch = () => {
    const context = useContext(ProjectTitlesDispatchContext);
    // This is a type guard against the possibility that ProjectTitlesDispatchContext is undefined
    if (context === undefined) {
        throw new Error("useProjectTitlesDispatch must be used within a ProjectTitleProvider");
    }
    return context;
};