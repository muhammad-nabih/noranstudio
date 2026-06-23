
// lib/herlps.ts

import { client } from "@/lib/sanity"; 

export default async function getFooterData() {
  return await client.fetch(`*[_type == "footer"][0]`);
}
