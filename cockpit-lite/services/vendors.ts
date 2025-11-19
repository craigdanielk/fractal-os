import { DB } from "./schema";
import { query } from "./notion";

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
}

function getText(prop: any) {
  if (!prop) return "";
  if (prop.title) return prop.title[0]?.plain_text || "";
  if (prop.rich_text) return prop.rich_text[0]?.plain_text || "";
  return "";
}

function getEmail(prop: any) {
  return prop?.email || "";
}

function getPhone(prop: any) {
  return prop?.phone_number || "";
}

export async function getVendors(): Promise<Vendor[]> {
  const res = await query(DB.vendors);
  return res.results.map((v: any) => {
    const props = v.properties;
    return {
      id: v.id,
      name: getText(props["Name"]),
      email: getEmail(props["Contact Email"]),
      phone: getPhone(props["Phone Number"]),
    };
  });
}

