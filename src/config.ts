type Config = {
    projDir?: string;
    theme?: string;
};

const config: Config = {
    theme: 'light',
};

export const Config = {
    setConfig: <K extends keyof Config>(key: K, value: Config[K]): void => {
        config[key] = value;
    },

    getConfig: <K extends keyof Config>(key: K): Readonly<Config[K]> =>
        config[key],
};
