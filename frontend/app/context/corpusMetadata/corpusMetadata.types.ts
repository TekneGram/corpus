import { CorpusMetaData, CorpusFile } from "@shared/types/manageCorpusTypes";

export type CorpusMetaDataActions = 
| { type: 'initialize'; corpusMetadata: CorpusMetaData }
| { type: 'update-corpus-name'; corpusId: number; corpusName: string }
| { type: 'add-new-subcorpus'; subCorpusName: string; subCorpusId: number }
| { type: 'add-corpus-file'; subCorpusId: number; corpusFile: CorpusFile }
| { type: 'update-subcorpus-name'; subCorpusId: number; subCorpusName: string }
| { type: 'delete-file', subCorpusId: number; fileId: number }
| { type: 'delete-subcorpus', subCorpusId: number };