"use client"
import '../../globals.css';

interface TabGeneralProps {
    title: string;
    tabNum: number;
    handleSetActiveTab: (tabNum: number) => void;
    activeTab: number;
}

const TabGeneral: React.FC<TabGeneralProps> = ({ title, tabNum, handleSetActiveTab, activeTab }) => {
    const isActiveTab = tabNum === activeTab;

    return (
        <button
            onClick={() => handleSetActiveTab(tabNum)}
            className = {`main-page-tab ${isActiveTab ? 'tab-active' : ''}`}
        >
            {title}
        </button>
    );
};

export default TabGeneral;