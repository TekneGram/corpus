# TekneGram

## dev mode
from `./corpus/frontend`
```
npm run dev
```
From `./corpus`
```
npm run electron-dev
```

## to create a package (on apple silicon for now)
from `./corpus/frontend`
```
rm -rf dist
npm run build
```
From `./corpus`
```
npm run electron-pack
```

## Compile CPP binaries
Inside `corpus/native/CPP` directory:

#### corpusManager
To compile binaries:
```
cd native/CPP
mkdir build
cd build
cmake build ..
cmake --build .
```
OLD:

`g++ -o ./executables/corpusManager -std=c++11 corpusManagerMain.cpp DatabaseHandler.cpp CorpusAnalyzer.cpp JSONConvert.cpp -lsqlite3`

#### corpusSummarizer
`g++ -o ./executables/corpusSummarizer -std=c++11 corpusSummarizerMain.cpp ./summarizer/DatabaseSummarizer.cpp ./summarizer/JSONConvert.cpp JSONConvert.cpp ./summarizer/EnumHelpers.cpp -lsqlite3`

#### To build and package, move binaries:
`electron/bin/executables/` select folder for OS. To be automated later.

## Example vertical stack
The following stack highlights end to end processes in the Manage Corpus tab, including creating a corpus, uploading, viewing and deleting individual files, etc.

    electron/bin/executables/mac/corpusManager
    electron/services/corpusManager.ts
    electron/typeguards/manageCorpusGuards.ts
    electron/preload.ts
    frontend/app/api/manageCorpus.ts
    frontend/app/components/manager/Manager.tsx
    frontend/app/components/manager/ManagerComponents/SubcorpusDisplay.tsx
    frontend/app/components/manager/ManagerComponents/createAndEditSubcorpus/SubcorpusDisplayView.tsx
    frontend/context/corpusMetadata/CorpusContext.tsx
    frontend/context/corpusMetadata/corpusMetadata.types.ts
    frontend/context/corpusMetadata/corpusMetadataReducer.ts
    frontend/context/corpusMetadata/useCorpusMetadata.ts
    frontend/app/components/manager/ManagerComponents/fileHandlers/useFileUpload.ts
    native/CPP/CorpusMetadata.h
    native/CPP/DatabaseHandler.cpp
    native/CPP/DatabaseHandler.h
    native/CPP/JSONConvert.cpp
    native/CPP/corpusManagerMain.cpp
    native/CPP/executablesNew/corpusManager
    shared/types/manageCorpusTypes.ts

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

# Definitions
## Token
* A token is defined as a single word with a space between it.
* A hyphenated word, such as three-year is counted as two words.
* If a word has punctuation, its punctuation is stripped and that is counted as one word, such as the final word of a sentence.
* A contraction is considered to be two words, e.g., hasn't is two words: "has" and "n't".
* An abbreviation is one word, e.g., U.N. for United Nations is treated as one word
* Expressions like e.g., and i.e., are counted as one word.

## Type
* This is a unique word form in the corpus. Any token that occurs one or more times is counted once as a type.

## Lemma
* Grammatical forms of a word. For example, I like going to town and I liked the many towns yesterday. In that sentence we have "like" and "liked" which are morphological variations of a word with the same meaning "like". Similarly, the singular and plural "town" and "towns" are both lemmas of "town".
* In other words, a lemma is the group of all inflectional forms.

## Lexeme
* The example "During my time at high school I won volleyball matches 8 times and lost only 1 time." contains the lemma "time" in the plural and singular forms, so we have 1 lemma for time. However, we have 2 lexemes for time. Here the first "time" refers to a period, or range of time. The second and third "time" refer to frequency, or how often. Since these have two different meanings, we say that there are 2 lexemes of time.
* A lexeme is like the different entries in a dictionary when defining a single word. Each word can have more than one meaning.