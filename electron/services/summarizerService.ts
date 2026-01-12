import { checkCorpusFilesExistInDB } from './../../../old/frontend_old/app/api/summarizeCorpus';
import CPPProcess from './cppSpawn';
import type { HasFiles, Corpus, CorpusState, CorpusPreppedState, WordCounts, CorpusPreppedStateWithCommand, CorpusWithCommand } from '@shared/types/manageCorpusTypes';
import { isCorpusPreppedState, isHasFiles, isWordCounts } from 'electron/typeguards/manageCorpusGuards';

class SummarizerService {
    constructor() {

    }

    private async runCPPProcess<T>(
        payload: object,
        isValid: (value: unknown) => value is T,
        errorContext: string
    ): Promise<T> {
        const cppProcess = new CPPProcess("summarizer");

        return new Promise<T>((resolve, reject) => {
            cppProcess.runProcess(
                JSON.stringify({ payload }),
                (error: Error | null, output: string | null) => {
                    if (error) {
                        reject(
                            new Error(
                                `${errorContext}: ${error.message}`
                            )
                        );
                        return;
                    }
                    try {
                        if (!output) {
                            throw new Error("No output from c++ process");
                        }

                        const parsed: unknown = JSON.parse(output);

                        if (!isValid(parsed)) {
                            throw new Error(
                                `Invalid c++ response shape for. ${errorContext}`
                            );
                        }

                        resolve(parsed);
                    } catch (err) {
                        reject(err);
                    }
                }
            );
        }).catch((err) => {
            console.error(errorContext, err);
            throw err;
        });
    }

    async checkCorpusFilesExistInDB(corpus: Corpus): Promise<HasFiles> {
        const corpusWithCommand = {
            ...corpus,
            "command": "checkCorpusFilesExistInDB"
        };

        return this.runCPPProcess<HasFiles>(
            corpusWithCommand,
            isHasFiles,
            "Error checking whether corpus files exist in database"
        );
    }

    async checkCorpusPreppedState(corpusPreppedState: CorpusPreppedState): Promise<CorpusPreppedState> {
        const corpusPreppedStateWithCommand: CorpusPreppedStateWithCommand = {
            ...corpusPreppedState,
            "command": "checkCorpusPreppedState"
        };

        return this.runCPPProcess<CorpusPreppedState>(
            corpusPreppedStateWithCommand,
            isCorpusPreppedState,
            "Error checking whether the corpus is prepped."
        );
    }

    async insertCorpusPreppedState(corpusPreppedState: CorpusPreppedState): Promise<CorpusPreppedState> {
        const corpusPreppedStateWithCommand: CorpusPreppedStateWithCommand = {
            ...corpusPreppedState,
            "command": "insertCorpusPreppedState"
        };

        return this.runCPPProcess<CorpusPreppedState>(
            corpusPreppedStateWithCommand,
            isCorpusPreppedState,
            "Error inserting the corpus prepped state."
        );
    }

    async updateCorpusPreppedState(corpusPreppedState: CorpusPreppedState): Promise<CorpusPreppedState> {
        const corpusPreppedStateWithCommand: CorpusPreppedStateWithCommand = {
            ...corpusPreppedState,
            "command": "updateCorpusPreppedState"
        };

        return this.runCPPProcess<CorpusPreppedState>(
            corpusPreppedStateWithCommand,
            isCorpusPreppedState,
            "Error updating the corpus prepped state."
        );
    }

    async fetchWordCountData(corpus: Corpus): Promise<WordCounts> {
        const corpusWithCommand: CorpusWithCommand = {
            ...corpus,
            "command": "fetchWordCountData"
        };

        return this.runCPPProcess<WordCounts>(
            corpusWithCommand,
            isWordCounts,
            "Error fetching the word counts!"
        )
    }
}

export default SummarizerService;