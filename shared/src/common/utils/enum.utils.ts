export function getEnumDescription(entity: object, title: string): string {
    const entries = Object.entries(entity)
        .filter(([key, value]) => typeof value === 'number');

    const list = entries
        .map(([name, value]) => `* **${value}**: ${name}`)
        .join('\n');

    return `**${title}**:\n${list}`;
}