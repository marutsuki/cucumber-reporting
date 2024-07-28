export type Match = {
    location: string;
};

export type Status =
    | 'passed'
    | 'failed'
    | 'skipped'
    | 'pending'
    | 'undefined'
    | 'ambiguous'
    | 'ambiguous';

export type Result = {
    status: Status;
    duration: number;
    error_message?: string;
};

export type Embedding = {
    data: string;
    mime_type: string;
};

export type Argument = {
    rows: {
        cells: string[];
    }[];
};

export type Step = {
    keyword: string;
    line: number;
    name: string;
    match?: Match;
    result?: Result;
    embeddings?: Embedding[];
    arguments?: Argument[];
};

export type Tag = {
    name: string;
    line: number;
};

export type Scenario = {
    description: string;
    id: string;
    keyword: string;
    line: number;
    name: string;
    steps: Step[];
    tags: Tag[];
    type: string;
};

export type Feature = {
    id: string;
    line: number;
    description: string;
    elements: Scenario[];
    keyword: string;
    name: string;
    tags: Tag[];
    uri: string;
};
