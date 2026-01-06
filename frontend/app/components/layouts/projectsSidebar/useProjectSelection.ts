import { useEffect } from "react";
import { toast } from "react-toastify";
import { loadProjectMetadata } from "@app-api/manageCorpus";
import { useProjectTitles, useProjectTitlesDispatch } from "@context/projectTitles/useProjectTitles";
import { useCorpusMetaData, useCorpusDispatch } from "@context/corpusMetadata/useCorpusMetadata";

export const useProjectSelection = () => {
    const projectTitles = useProjectTitles();
    const dispatch = useProjectTitlesDispatch();
    const corpusMetadata = useCorpusMetaData();
    const dispatchCorpus = useCorpusDispatch();

    const selectedProject = projectTitles.find(p => p.isSelected);

    useEffect(() => {
        if (!selectedProject) return;

        const fetchMetadata = async () => {
            try {
                const metadata = await loadProjectMetadata(selectedProject.id);
                if (metadata) {
                    dispatchCorpus({ type: 'initialize', corpusMetadata: metadata });
                }
            } catch (error) {
                dispatch({ type: "setSelected", id: corpusMetadata.projectTitle.id });
                toast.error("Error fetching the project info.");
                console.error(error);
            }
        };

        fetchMetadata();
    }, [selectedProject]);

    const selectProject = (id: number) => {
        dispatch({ type: "setSelected", id });
    };

    return { selectProject };
}