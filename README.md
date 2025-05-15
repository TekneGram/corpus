# TekneGram

## To compile CPP programs into executables
Inside corpus/CPP directory:

#### corpusManager
g++ -o ./executables/corpusManager -std=c++11 corpusManagerMain.cpp DatabaseHandler.cpp CorpusAnalyzer.cpp JSONConvert.cpp -lsqlite3

#### corpusSummarizer
g++ -o ./executables/corpusSummarizer -std=c++11 corpusSummarizerMain.cpp ./summarizer/
DatabaseSummarizer.cpp ./summarizer/JSONConvert.cpp JSONConvert.cpp -lsqlite3

## To run
Install node modules: npm install

To start the backend: npm run start:backend

To run the desktop app: npm run dev:electron

## layout.tsx
When up and running, the general layout of the app looks like this:

-----------------------1-----------------------

-2- --3-- ------------------4------------------

-2- --3-- ------------------4------------------

-2- --3-- ------------------4------------------

-2- --3-- ------------------4------------------

-2- --3-- ------------------4------------------

-2- --3-- ------------------4------------------

-1- : `<Header />`

-2- : `<OperationsSideBar />` (Start a new project here)

-3- : `<ProjectsSidebar />` (Select projects you are working on)

-4- : `<main> { children } </main>` (Manage projects, analyze data, visualize charts)

## page.tsx
Inside -4- `<main> { children } </main>`, page.tsx instantiates the `<TabsContainer />` component. This component can be found in app/components/tabs/TabsContainer.tsx

## `<TabsContainer /> and <Tab />`: How they work
The `<TabsContainer />` component contains three `<Tab />` components. Which tab component is active is tracked with local state called `activeTab`. A function called `handleSetActiveTab` handles setting the state. The component renders two divs, one on top and one on the bottom. The top div (`tabs-container` class) contains the clickable tab elements. The bottom div (`tab-page-container` class) contains the content which is displayed conditional on which tab is active. In the top div, the <Tab /> components are rendered. The `handleSetActiveTab` function is passed as a prop to allow the component to communicate whether it has been selected. Similarly, the `activeTab` state is passed to allow conditional rendering of styles depending on whether it is active or not.

The first tab allows conditional rendering of the `<Manager /> component.

## `<Manager />` component
The `<Manager />` component is where a selected project is managed
* Create subcorpora.
* Upload corpus text files
* Add and delete text files
* Name your corpus
* Name your subcorpus

## `<FileUpload />` and `<FileDisplay />` components
These are contained within the `<Manager />` component. The `<FileDisplay />` component renders a list of each subcorpus' files. The `<FileUpload />` component allows the user to upload files associated with a specific subcorpus.

## Software Design Features
Overall design of the software follows an MVC approach. The front end uses React's context provider and reducer to manage the state of the app. The flow chart below shows the case for one component. As the user interacts with the component, an update is dispatched to the reducer to perform changes to the context. Information is sent to the server where, depending on the action, a route is chosen (using Express). A controller calls a model, which in turn spawns a CPP or an R process, interacting with the database and processing data. This is sent back up through the route to the reducer. The reducer then updates the context provider and finalizes the view for the user.

![Alt text](Flowchart.png))
