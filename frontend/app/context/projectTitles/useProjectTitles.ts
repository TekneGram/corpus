import { useContext } from 'react';

import {
    ProjectTitlesContext,
    ProjectTitlesDispatchContext
} from './ProjectTitlesContext';

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