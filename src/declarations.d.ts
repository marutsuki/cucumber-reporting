/**
 * Workaround for the library where the the package and the definitely typed package
 * differs in casing, causing certain tasks to fail.
 */
declare module 'JSONstream' {
    export function parse(path: string): NodeJS.ReadWriteStream;
}
