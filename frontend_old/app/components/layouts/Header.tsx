"use client"
// Context and state management
import { useProjectTitles } from "../../context/ProjectsContext";

// Types
import { SelectableProjectTitle } from "../../types/types";


const Header = () => {

    const projectTitles: SelectableProjectTitle[] = useProjectTitles();
    const selectedProjectTitle: SelectableProjectTitle[] = projectTitles.filter((projectTitle) => {
        return projectTitle.isSelected === true;
    });

    return (
        <header className='page-header'>
            <h1>{selectedProjectTitle[0]?.project_name}</h1>
        </header>
    );
};

export default Header;