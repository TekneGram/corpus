import { createContext, useContext, useEffect, useReducer, ReactNode, Dispatch } from 'react';
import { ProjectTitle, SelectableProjectTitle } from '@app-types/types';
import { ProjectTitlesActions } from '@context/projectTitles/projectTitles.types';
import { loadAllProjectTitles } from '@app-api/manageCorpus';
import { projectTitlesReducer } from './projectTitlesReducer';

export const ProjectTitlesContext = createContext<SelectableProjectTitle[]>([]);
export const ProjectTitlesDispatchContext = createContext<Dispatch<ProjectTitlesActions>|undefined>(undefined);

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