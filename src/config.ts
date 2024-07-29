type Config = {
    projDir?: string;
    theme?: string;
    showFailedOnStart: boolean;
    verbose: boolean;
};

const config: Config = {
    theme: 'light',
    showFailedOnStart: false,
    verbose: false,
};

export const Config = {
    setConfig: <K extends keyof Config>(key: K, value: Config[K]): void => {
        config[key] = value;
    },

    getConfig: <K extends keyof Config>(key: K): Readonly<Config[K]> =>
        config[key],
};
