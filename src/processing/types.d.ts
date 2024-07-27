type Match = {
    location: string;
};

type Status =
    | 'passed'
    | 'failed'
    | 'skipped'
    | 'pending'
    | 'undefined'
    | 'ambiguous'
    | 'ambiguous';

type Result = {
    status: Status;
    duration: number;
    error_message?: string;
};

type Step = {
    keyword: string;
    line: number;
    name: string;
    match?: Match;
    result?: Result;
};

type Tag = {
    name: string;
    line: number;
};

type Scenario = {
    description: string;
    id: string;
    keyword: string;
    line: number;
    name: string;
    steps: Step[];
    tags: Tag[];
    type: string;
};

type Feature = {
    id: string;
    line: number;
    description: string;
    elements: Scenario[];
    keyword: string;
    name: string;
    tags: Tag[];
    uri: string;
};
