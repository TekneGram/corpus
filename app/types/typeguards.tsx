import { Corpus } from "./types";

export const isCorpus = (output: unknown): output is Corpus => {
    return typeof output === 'object' && output !== null && 'id' in output;
}