/** plural(1, 'car') -> "1 car", plural(3, 'car') -> "3 cars". */
export function plural(count: number, noun: string, pluralNoun = `${noun}s`): string {
    return `${count} ${count === 1 ? noun : pluralNoun}`
}
