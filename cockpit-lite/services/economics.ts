import { DB } from "./schema";
import { query } from "./notion";

export interface EconomicsModel {
  id: string;
  title: string;
  raw: any;
}

function num(p: any) {
  return p?.number || 0;
}

export async function getEconomics(): Promise<EconomicsModel[]> {
  const res = await query(DB.economics);
  return res.results.map((page: any) => {
    const props = page.properties || {};
    const { mapProps } = require("../lib/prop-mapper");
    const mapped = mapProps(DB.economics, props);

    return {
      id: page.id,
      title: mapped["Name"]?.value?.title?.[0]?.plain_text ?? "Untitled",
      raw: mapped,
    };
  });
}

