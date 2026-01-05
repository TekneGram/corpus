// LEGACY CODE. Demonstrates a simple tab component that is hard coded for 4 tabs.

// CSS
import '@styles/globals.css';

// Context and state management
import { useState, useEffect } from 'react';


interface TabProps {
    tabNum: number;
    handleSetActiveTab: (tabNum: number) => void;
    activeTab: number;
};

const Tab:React.FC<TabProps> = ({ tabNum, handleSetActiveTab, activeTab }) => {
    
    const [tabTitle, setTabTitle] = useState<string[]>(['Manage', 'Summarize', 'Sample', 'Analyze']);
    const [isActiveTab, setIsActiveTab] = useState<boolean>(false);

    useEffect(() => {
        if (tabNum === activeTab) {
            setIsActiveTab(true);
        } else {
            setIsActiveTab(false);
        }
    }, [tabNum, activeTab, setIsActiveTab]);

    return (
        <button
            onClick={() => handleSetActiveTab(tabNum)}
            className={`main-page-tab ${isActiveTab ? 'tab-active': ''}`}
        >
            {tabTitle[tabNum - 1]}
        </button>
    );
};

export default Tab;