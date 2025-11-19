import { DB } from "./schema";
import { query } from "./notion";

export interface EconomicsModel {
  id: string;
  revenue: number;
  labour: number;
  overhead: number;
  direct: number;
  margin: number;
}

function num(p: any) {
  return p?.number || 0;
}

export async function getEconomics(): Promise<EconomicsModel[]> {
  const res = await query(DB.economics);
  return res.results.map((e: any) => {
    const props = e.properties;
    return {
      id: e.id,
      revenue: num(props["Revenue"]),
      labour: num(props["Labour Cost"]),
      overhead: num(props["Overhead %"]),
      direct: num(props["Direct Expenses"]),
      margin: num(props["Margin Targets"]),
    };
  });
}

