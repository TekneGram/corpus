import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';
import { useCorpusMetaData, useCorpusDispatch } from '../context/CorpusContext';

test('renders children inside RootLayout', () => {
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

test('CorpusProvider wraps children and provides context', () => {
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