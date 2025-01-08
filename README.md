# TekneGram

## To run
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

-2- : `<OperationsSideBar />`

-3- : `<ProjectsSidebar />`

-4- : `<main> { children } </main>`

## page.tsx
Inside -4- `<main> { children } </main>`, page.tsx instantiates the `<TabsContainer />` component. This component can be found in app/components/tabs/TabsContainer.tsx


## Software Design Features
Overall design of the software follows an MVC approach. The front end uses React's context provider and reducer to manage the state of the app. The flow chart below shows the case for one component. As the user interacts with the component, an update is dispatched to the reducer to perform changes to the context. Information is sent to the server where, depending on the action, a route is chosen (using Express). A controller calls a model, which in turn spawns a CPP or an R process, interacting with the database and processing data. This is sent back up through the route to the reducer. The reducer then updates the context provider and finalizes the view for the user.

![Alt text](Flowchart.png))
