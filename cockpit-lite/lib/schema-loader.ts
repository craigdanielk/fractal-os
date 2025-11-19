import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";

const notion = new Client({ auth: process.env.NOTION_INTEGRATION_SECRET });

const CACHE_PATH = path.join(process.cwd(), "cockpit-lite/lib/notion-schema-cache.json");

export type NotionSchema = {
    [dbId: string]: {
        title: string;
        properties: {
            [propName: string]: {
                id: string;
                type: string;
                target?: string;
            };
        };
    };
};

export async function loadSchema(dbId: string) {
    const schema = await notion.databases.retrieve({ database_id: dbId });

    const mappedProps: any = {};

    for (const [propName, prop] of Object.entries(schema.properties)) {
        // @ts-ignore
        mappedProps[propName] = {
            // @ts-ignore
            id: prop.id,
            // @ts-ignore
            type: prop.type,
            // relation target DB
            // @ts-ignore
            target: prop.type === "relation" ? prop.relation?.database_id : undefined,
        };
    }

    return {
        title: schema.title?.[0]?.plain_text || "Untitled",
        properties: mappedProps,
    };
}

export async function refreshSchemas(dbIds: string[]) {
    const out: NotionSchema = {};

    for (const dbId of dbIds) {
        out[dbId] = await loadSchema(dbId);
    }

    fs.writeFileSync(CACHE_PATH, JSON.stringify(out, null, 2));
    return out;
}

export function readSchema(): NotionSchema | null {
    if (!fs.existsSync(CACHE_PATH)) return null;
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
}
