// CSS
import '@styles/globals.css';

// Child components
import TabsGeneralContainer from '../tabs/TabsGeneralContainer';
import WordCount from './SummarizerComponents/WordCount';

// The summarizer should call an API to get all the count data
// currently available for the corpus.
// The summarizer should be able to display word counts, collocations and three- and four-word lexical bundles information
// calculated from the corpus.
// The summarizer should also be able to display the data for each subcorpus.
// The summarizer should also be able to display the data for the whole corpus.

// There are THREE possible scenarios here:
// 1. The user has already performed the necessary operations in which case we should get and show the data.
// 2. The user has not performed the necessary operations in which case we should show a message to the user.
// 3. The user has performed the necessary operations but has also updated the corpus and altered the data, in which case
// we should show a message to the user and ask them to perform the operations again.

// Each individual component should be responsible for calling the data from the API and displaying it.

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