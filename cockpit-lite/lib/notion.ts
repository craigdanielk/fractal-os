import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getDB(dbId: string) {
  return notion.databases.query({ database_id: dbId });
}

export async function getPage(pageId: string) {
  return notion.pages.retrieve({ page_id: pageId });
}

export async function extract(prop: any) {
  if (!prop) return null;
  if (prop.type === "title") return prop.title[0]?.plain_text || "";
  if (prop.type === "rich_text") return prop.rich_text[0]?.plain_text || "";
  if (prop.type === "number") return prop.number;
  if (prop.type === "select") return prop.select?.name || null;
  if (prop.type === "multi_select") return prop.multi_select?.map(x => x.name);
  if (prop.type === "date") return prop.date?.start || null;
  if (prop.type === "relation") return prop.relation?.map(x => x.id);
  return null;
}

export { notion };

