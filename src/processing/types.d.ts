import { FeatureStats } from 'src/data/stats';

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

export type BeforeAfter = {
    embeddings?: Embedding[];
    result: Result;
    match?: Match;
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
    before?: BeforeAfter[];
    after?: BeforeAfter[];
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

export type ProcessedResult = Omit<Result, 'status' | 'duration'> & {
    [val in Status]: boolean;
} & {
    duration: string;
};
export type ProcessedEmbedding = Embedding & {
    isPng: boolean;
    isJpeg: boolean;
    isText: boolean;
};

export type ProcessedBeforeAfter = Omit<
    BeforeAfter,
    'result' | 'embeddings'
> & {
    keyword: 'Before' | 'After';
    result?: ProcessedResult;
    embeddings?: ProcessedEmbedding[];
};

export type ProcessedStep = Omit<Step, 'result' | 'embeddings'> & {
    result?: ProcessedResult;
    embeddings?: ProcessedEmbedding[];
};

export type ProcessedScenario = Omit<Scenario, 'steps' | 'before' | 'after'> & {
    steps: ProcessedStep[];
    before?: ProcessedBeforeAfter[];
    after?: ProcessedBeforeAfter[];
    failed: boolean;
};

export type ProcessedFeature = Omit<Feature, 'elements'> & {
    elements: ProcessedScenario[];
    stats: FeatureStats;
    failed: boolean;
};
