import { SelectableProjectTitle } from "../../types/types";
import { ProjectTitlesActions } from "../contextTypes/contextTypes";

export const projectTitlesReducer = (projectTitles: SelectableProjectTitle[], action: ProjectTitlesActions): SelectableProjectTitle[] => {
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
        case 'update-project-title': {
            return projectTitles.map((projectTitle) => {
                return projectTitle.id === action.id ? {...projectTitle, project_name: action.project_name} : projectTitle;
            });
        }
        default: {
            return projectTitles;
        }
    }
};