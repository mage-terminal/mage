export type mageLocaleTranslateFnOptions = string[] | Record<string, unknown>;

export type mageLocaleTranslateFn = (path: string, options?: mageLocaleTranslateFnOptions) => string;

export type mageLocale = Record<string, string | ((...args: unknown[]) => string)>;
