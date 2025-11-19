export type FractalEvent = {

  tenantId: string;

  table: string;

  type: "INSERT" | "UPDATE" | "DELETE";

  old: any | null;

  new: any | null;

  ts: number;

};



export type NormalizedEvent = {

  tenantId: string;

  table: string;

  action: "create" | "update" | "delete";

  diff: Record<string, any>;

  id: string;

  ts: number;

};

