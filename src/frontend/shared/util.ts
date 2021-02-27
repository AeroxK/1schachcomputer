export function concatClasses(classMap: string []): string {
    return classMap.reduce((acc, curr) => `${acc} ${curr}`, '');
}
