export function concatClasses(classMap: string []): string {
    return classMap.reduce((acc, curr) => `${acc} ${curr}`, '');
}

export async function sha256(data:string):Promise<string> {
    const encoder = new TextEncoder();
    const encodedPW = encoder.encode(data);
    const digested = await crypto.subtle.digest('SHA-256', encodedPW);
    const hashArray = Array.from(new Uint8Array(digested));
    const hashedPW = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashedPW;
}
