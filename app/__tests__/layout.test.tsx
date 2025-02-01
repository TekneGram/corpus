import { describe, expect, it, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';
import { useCorpusMetaData, useCorpusDispatch } from '../context/CorpusContext';
import * as ProjectsContext from '@/app/context/ProjectsContext';

describe("RootLayout component", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
    });

    it('renders children inside RootLayout', () => {
        render(
            <RootLayout>
                <div data-testid="child-element">Child Content</div>
            </RootLayout>
        );
    
        const childElement = screen.getByTestId('child-element');
        expect(childElement).not.toBeNull();
        expect(childElement.textContent).toBe("Child Content");
    });
    
    // Mock consumer component to test context
    function MockConsumer() {
        const corpusMetaData = useCorpusMetaData();
        const dispatch = useCorpusDispatch();
    
        return (
            <div>
                <div data-testid="corpus-meta">
                    {JSON.stringify(corpusMetaData)}
                </div>
                <div data-testid="corpus-dispatch">
                    {typeof dispatch === 'function' ? 'Dispatch is a function' : 'No Dispatch'}
                </div>
            </div>
        );
    }
    
    it('CorpusProvider wraps children and provides context', () => {
        render(
            <RootLayout>
                <MockConsumer />
            </RootLayout>
        );
    
        const corpusMetaDataElement = screen.getByTestId('corpus-meta');
        const corpusDispatchElement = screen.getByTestId('corpus-dispatch');
    
        // Assert the initial corpus metadata state
        expect(corpusMetaDataElement.textContent).toContain('{"projectTitle":{"id":0,"project_name":""},"corpus":{"id":0,"corpus_name":""},"files":[]}');
    
        // Assert that the dispatch is a function
        expect(corpusDispatchElement.textContent).toBe('Dispatch is a function');
    });
    
    it('renders Header correctly', () => {
        // Mock the context for project titles since a project title is set in the header bar
        vi.spyOn(ProjectsContext, 'useProjectTitles').mockReturnValue([
            { id: 1, project_name: "Project A", isSelected: false },
            { id: 2, project_name: 'Project B', isSelected: true },
        ]);
        const { container } = render(
            <RootLayout>
                <div />
            </RootLayout>
        );
    
        // Header Component
        const header = container.querySelector('header');
        expect(header).not.toBeNull();
        const heading = header?.querySelector('h1');
        expect(heading).not.toBeNull();
        expect(heading?.textContent).toBe('Project B');
    });

    it('renders the Toastify component correctly', () => {
        render(
            <RootLayout>
                <div />
            </RootLayout>
        );
        const toastContainer = document.querySelector('.Toastify');
        expect(toastContainer).not.toBeNull();
    });

    it('renders the OperationsSidebar correctly', async () => {
        render (
            <RootLayout>
                <div>Test Content</div>
            </RootLayout>
        );
        expect(await screen.getByTestId('operations-sidebar')).toBeInTheDocument();
        expect(await screen.getByTestId('add-project-button')).toBeInTheDocument();
    });

    it('renders the ProjectsSidebar correctly', async () => {
        render (
            <RootLayout>
                <div>Test Content</div>
            </RootLayout>
        );
        expect(await screen.getByTestId('projects-sidebar')).toBeInTheDocument();
        expect(await screen.getByTestId('project-titles-bar')).toBeInTheDocument();
    });
})
