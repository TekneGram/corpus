import { SelectableProjectTitle } from "@shared/types/manageCorpusTypes";;

export type ProjectTitlesActions = 
| { type: "initialize"; projectTitles: SelectableProjectTitle[] }
| { type: "sorted"; sortType: "asc" | "desc" }
| { type: "setSelected"; id: number }
| { type: "refreshed"; projectTitles: SelectableProjectTitle[]}
| { type: "update-project-title"; id: number; project_name: string };