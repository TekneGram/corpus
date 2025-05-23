"use client"
// CSS
import './globals.css';

import TabsGeneralContainer from "./components/tabs/TabsGeneralContainer";
import Manager from "./components/manager/Manager";
import Summarizer from "./components/summarizer/Summarizer";

const Home = () => {

  const tabData = [
    { title: "Manage", content: <Manager /> },
    { title: "Summarize", content: <Summarizer /> },
    { title: "Sample", content: <div>This tab is for preparing corpus samples. </div> },
    { title: "Analyze", content: <div>This tab is for analyzing the corpus. </div> },
    { title: 'Visualize', content: <div> This tab is for visualizing results from the corpus. </div> }
  ];

  return (
    <div className='w-full'>
      <TabsGeneralContainer tabs={tabData} />
    </div>
  )
}

export default Home;