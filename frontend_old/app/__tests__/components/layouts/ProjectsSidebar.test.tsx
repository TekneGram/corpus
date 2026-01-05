import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProjectsSidebar from '@/_frontend/app/components/layouts/ProjectsSidebar';

// Mock the context hooks


describe("ProjectsSidebar", () => {
    beforeEach(() => {
        vi.mock("@/app/context/ProjectsContext", () => ({
            useProjectTitles: () => [{ id: 1, name: "Test Project" }],
            useProjectTitlesDispatch: () => vi.fn(),
        }));
        
        vi.mock("@/app/context/CorpusContext", () => ({
            useCorpusMetaData: () => ({}),
            useCorpusDispatch: () => vi.fn(),
        }));

        vi.resetModules();
    });

    it("renders the sidebar with project titles bar", () => {
        render(
            <ProjectsSidebar 
                startingNewProject={false}
                handleStartingNewProject={vi.fn()}
            />
        );

        const sidebar = screen.getByTestId("projects-sidebar");
        expect(sidebar).toBeInTheDocument();

        // Check if the project titles bar is in the document
        const titlesBar = screen.getByTestId("project-titles-bar");
        expect(titlesBar).toBeInTheDocument();
    })
})