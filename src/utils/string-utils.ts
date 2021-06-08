const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomString(length = 6): string {
    return Array.from({length}).reduce<string>((acc, _) => {
        acc+= CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));

        return acc;
    }, '');
}
