import { useState } from "react";

export const useSubcorpusNameEditing = () => {
    const [subcorpusName, setSubcorpusName] = useState<string>('');

    const isValid = subcorpusName.trim().length > 3;

    return { setSubcorpusName, subcorpusName, isValid };
}