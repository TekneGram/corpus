import React, { createContext, useContext, useReducer, useState, useEffect } from "react";

// Type definitions
type CorpusAnalysisEntry = {
    corpusID: number;
    needsResetting: 0 | 1;
};

type Action =
    | { type: "MARK_CHANGED"; corpusID: number }
    | { type: "MARK_RESET"; corpusID: number }

type CorpusAnalysisState = CorpusAnalysisEntry[];

type CorpusAnalysisContextType = {
    state: CorpusAnalysisState;
    updateCorpus: (action: Action) => Promise<void>;
};

// Context
const CorpusAnalysisContext = createContext<CorpusAnalysisContextType | undefined>(undefined);

// Reducer
function corpusAnalysisReducer(state: CorpusAnalysisState, action: Action): CorpusAnalysisState {
    switch (action.type) {
        case "MARK_CHANGED":
            return state.map((entry) =>
                entry.corpusID === action.corpusID
                    ? { ...entry, needsResetting: 1 }
                : entry
            );
        case "MARK_RESET":
            return state.map((entry) =>
                entry.corpusID === action.corpusID
                    ? { ...entry, needsResetting: 0 }
                : entry
            );
        default:
            return state;
    }
}

// API call
async function persistChangeToAPI(corpusID: number, needsResetting: 0 | 1) {
    const result = await fetch("/api/update-corpus-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ corpusID, needsResetting }),
    });
    if (!result.ok) throw new Error("Failed to persist to server.");
}

// Provider
export const CorpusAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [corpusList, setCorpusList] = useState<CorpusAnalysisEntry[] | null>(null);
    const [state, dispatch] = useReducer(corpusAnalysisReducer, []);

    useEffect(() => {
        const fetchCorpusList = async () => {
            const result = await fetch("/api/get-corpus-list");
            const data = await result.json();
            setCorpusList(data);
            dispatch({ type: "INIT", payload: data } as any);
        };
        fetchCorpusList();
    }, []);

    // Handle init action
    function extendedReducer(state: CorpusAnalysisState, action: Action | any): CorpusAnalysisState {
        if (action.type === "INIT") return action.payload;
        return corpusAnalysisReducer(state, action);
    }

    // Replace the reducer with the extended reducer
    const [_, realDispatch] = useReducer(extendedReducer, []);

    // Custom async update function
    const updateCorpus = async (action: Action) => {
        const prevState = [...state];
        realDispatch(action);

        try {
            const newValue = action.type === "MARK_CHANGED" ? 1 : 0;
            await persistChangeToAPI(action.corpusID, newValue);
        } catch (error) {
            console.error("API update failed: ", error);
            // rollback to previous state
            setTimeout(() => realDispatch({ type: "INIT", payload: prevState }), 0);
        }
    };

    return (
        <CorpusAnalysisContext.Provider value={{ state, updateCorpus }}>
            {children}
        </CorpusAnalysisContext.Provider>
    );
};

// Hook
export function useCorpusAnalysisContext() {
    const context = useContext(CorpusAnalysisContext);
    if (!context) throw new Error("useCorpusAnalysisContext must be used within a CorpusAnalysisProvider");
    return context;
}