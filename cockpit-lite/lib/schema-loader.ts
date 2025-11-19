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
    try {
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
    } catch (error: any) {
        // Enhanced error logging
        const errorDetails = {
            dbId,
            errorType: error.constructor?.name || 'Unknown',
            message: error.message || String(error),
            code: error.code,
            status: error.status,
            cause: error.cause?.message || error.cause,
            stack: error.stack?.split('\n').slice(0, 3).join('\n'),
        };

        console.error('Failed to load Notion schema:', JSON.stringify(errorDetails, null, 2));

        if (error.code === 'unauthorized' || error.status === 401) {
            throw new Error(
                `Notion API authentication failed for database ${dbId}. ` +
                `Please verify NOTION_INTEGRATION_SECRET is correct and the integration has access to this database. ` +
                `Error: ${error.message}`
            );
        }
        
        if (error.code === 'object_not_found' || error.status === 404) {
            throw new Error(
                `Notion database not found: ${dbId}. ` +
                `Please verify the database ID is correct and the integration has access. ` +
                `Error: ${error.message}`
            );
        }

        // Handle network/connection errors
        if (error.message?.includes('fetch') || error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
            throw new Error(
                `Network error connecting to Notion API for database ${dbId}. ` +
                `Please check your internet connection and firewall settings. ` +
                `Error: ${error.message || error.cause?.message || 'Unknown network error'}`
            );
        }

        throw new Error(
            `Failed to load schema for Notion database ${dbId}: ${error.message || error}`
        );
    }
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
