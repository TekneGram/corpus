import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { saveProjectTitleToDatabase, loadAllProjectTitles } from "@app-api/manageCorpus";
import { useProjectTitlesDispatch } from "@context/projectTitles/useProjectTitles";
import { ProjectTitle } from "@app-types/types";

export const useProjectCreation = (stopCreating: () => void) => {
  const dispatch = useProjectTitlesDispatch();
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState(false);

  const createProject = async () => {
    const trimmed = title.trim();
    if (trimmed.length < 4) {
      toast("Your title needs to be at least 4 letters long");
      return;
    }

    try {
      await saveProjectTitleToDatabase(trimmed);
      toast.success("Project created: " + trimmed);
      setTitle("");
      stopCreating();
      setSaved(true);
    } catch (e) {
      toast.error("Failed to create project.");
      console.error(e);
    }
  };

  useEffect(() => {
    if (!saved) return;

    const refresh = async () => {
      try {
        const projects: ProjectTitle[] = await loadAllProjectTitles();
        dispatch({
          type: "refreshed",
          projectTitles: projects.map(p => ({ ...p, isSelected: false }))
        });
      } catch (e) {
        toast.error("Failed to load project titles!");
      } finally {
        setSaved(false);
      }
    };

    refresh();
  }, [saved]);

  return {
    title,
    setTitle,
    createProject,
    cancel: () => {
      setTitle("");
      stopCreating();
    }
  };
};
