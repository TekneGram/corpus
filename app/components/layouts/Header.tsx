import { useProjectTitles } from "@/app/context/ProjectsContext";

interface SelectableProjectTitle {
    id: number;
    project_name: string;
    isSelected: boolean;
}

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