import { SummaryMetaData, CurrentCorpusStatus, WordCounts } from "@shared/types/manageCorpusTypes";

export type SummaryMetaDataActions = 
| { type: 'initialize'; summaryMetaData: SummaryMetaData }
| { type: 'update-corpus-status'; currentCorpusStatus: CurrentCorpusStatus }
| { type: 'update-word-counts'; wordCounts: WordCounts };