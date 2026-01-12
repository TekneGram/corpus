import { checkCorpusFilesExistInDB } from './../../../old/frontend_old/app/api/summarizeCorpus';
import CPPProcess from './cppSpawn';
import type { HasFiles, Corpus, CorpusState, CorpusPreppedState } from '@shared/types/manageCorpusTypes';
import { isCorpusPreppedState, isHasFiles } from 'electron/typeguards/manageCorpusGuards';

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

    async checkCorpusPreppedState(corpus: CorpusPreppedState): Promise<CorpusPreppedState> {
        const corpusWithCommand = {
            ...corpus,
            "command": "checkCorpusPreppedState"
        };

        return this.runCPPProcess<CorpusPreppedState>(
            corpusWithCommand,
            isCorpusPreppedState,
            "Error checking whether the corpus is prepped."
        );
    }

    async insertCorpusPreppedState(corpus: CorpusPreppedState): Promise<CorpusPreppedState> {
        const corpusWithCommand = {
            ...corpus,
            "command": "insertCorpusPreppedState"
        };

        return this.runCPPProcess<CorpusPreppedState>(
            corpusWithCommand,
            isCorpusPreppedState,
            "Error inserting the corpus prepped state."
        );
    }

    async updateCorpusPreppedState(corpus: CorpusPreppedState): Promise<CorpusPreppedState> {
        const corpusWithCommand = {
            ...corpus,
            "command": "updateCorpusPreppedState"
        };

        return this.runCPPProcess<CorpusPreppedState>(
            corpusWithCommand,
            isCorpusPreppedState,
            "Error updating the corpus prepped state."
        );
    }
}

export default SummarizerService;