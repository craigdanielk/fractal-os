import { readSchema } from "./schema-loader";

export function mapProps(dbId: string, notionProps: any) {
    const schema = readSchema();
    if (!schema || !schema[dbId]) {
        return notionProps; // fallback
    }

    const map = schema[dbId].properties;

    const mapped: Record<string, any> = {};

    for (const [propName, propValue] of Object.entries(notionProps)) {
        const schemaEntry = map[propName];
        if (!schemaEntry) continue;

        mapped[propName] = {
            id: schemaEntry.id,
            type: schemaEntry.type,
            value: propValue,
        };
    }

    return mapped;
}
