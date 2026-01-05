import { useState } from "react";
import { toast } from "react-toastify";
import { updateProjectTitleInDatabase } from "@app-api/manageCorpus";
import { useProjectTitles, useProjectTitlesDispatch } from "@context/projectTitles/useProjectTitles";

export const useProjectEditing = () => {
  const projectTitles = useProjectTitles();
  const dispatch = useProjectTitlesDispatch();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [originalName, setOriginalName] = useState("");

  const startEditing = (id: number) => {
    const project = projectTitles.find(p => p.id === id);
    if (!project) return;
    setEditingId(id);
    setOriginalName(project.project_name);
    setDraftName(project.project_name);
  };

  const updateDraft = (value: string) => {
    setDraftName(value);
  }

  const confirm = async (id: number) => {
    const project = projectTitles.find(p => p.id === id);
    if (!editingId) return;

    const trimmed = draftName.trim();

    if (trimmed.length < 4) {
        toast.error("A project title must be 4 or more characters.")
        return;
    }

    try {
        const result = await updateProjectTitleInDatabase(editingId, trimmed);

        dispatch({
            type: "update-project-title",
            id: editingId,
            project_name: result.project_name
        });
        toast.success("Project title updated to: " + result.project_name);
    } catch (err) {
        toast.error("Failed to update the project title:", err);
        console.error(err);

        // Revert if backend fails
        dispatch({
            type: "update-project-title",
            id: editingId,
            project_name: originalName
        })
    } finally {
        reset();
    }
  };

  const cancel = (id: number) => {
    dispatch({
      type: "update-project-title",
      id,
      project_name: originalName
    });
    setEditingId(null);
    setOriginalName("");
  };

  const reset = () => {
    setEditingId(null);
    setDraftName("");
    setOriginalName("");
  }

  return { editingId, startEditing, updateDraft, confirm, cancel };
};
