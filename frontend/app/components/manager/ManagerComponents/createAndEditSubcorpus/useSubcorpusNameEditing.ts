import { useState } from "react";

export const useSubcorpusNameEditing = (initialName: string) => {
    const [subcorpusName, setSubcorpusName] = useState<string>(initialName);
    const [originalName, setOriginalName] = useState(initialName);

    const isValid = subcorpusName.trim().length > 3;

    const startEditing = () => {
        setOriginalName(subcorpusName);
    }

    const cancelEditing = () => {
        setSubcorpusName(originalName);
    }
    
    const commitEditing = () => {
        setOriginalName(subcorpusName);
    }

    return {
        setSubcorpusName, 
        subcorpusName, 
        isValid,
        startEditing,
        cancelEditing,
        commitEditing
    };
}