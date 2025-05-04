"use client"

// CSS
import '../../globals.css';

// Child components
import TabsGeneralContainer from '../tabs/TabsGeneralContainer';
import WordCount from './SummarizerComponents/WordCount';

const Summarizer: React.FC = () => {

    const tabData = [
        { title: "Word Counter", content: <WordCount /> },
        { title: "Collocations", content: <div>This tab is for summarizing collocations. </div> },
        { title: "3-bundles", content: <div>This tab is for summarizing 3-word lexical bundles. </div> },
        { title: '4-bundles', content: <div> This tab is for summarizing 4-word lexical bundles. </div> }
    ];

    return (
        <TabsGeneralContainer tabs={tabData} />
    )
}

export default Summarizer;