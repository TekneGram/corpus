import TabsGeneralContainer from "@/components/tabs/TabsGeneralContainer";
import Manager from "@/components/manager/Manager";
import Summarizer from "@/components/summarizer/Summarizer";

export default function Home() {
    const tabData = [
        { title: "Manage", content: <Manager /> },
        { title: "Summarize", content: <Summarizer /> },
        { title: "Sample", content: <div>This tab is for preparing corpus samples. </div> },
        { title: "Analyze", content: <div>This tab is for analyzing the corpus. </div> },
        { title: "Visualize", content: <div>This tab is for visualising the results. </div> }
    ];

    return (
        <div className='w-full'>
            <TabsGeneralContainer tabs={tabData} />
        </div>
    );
}