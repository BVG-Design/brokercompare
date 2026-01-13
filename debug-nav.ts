
import { createClient } from "next-sanity";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: "2024-01-01",
    useCdn: false,
});

async function debugNav() {
    console.log("Fetching searchIntent documents...");
    try {
        const query = `*[_type == "searchIntent"]`;
        const items = await client.fetch(query);
        console.log("Found", items.length, "searchIntent items:");
        console.log(JSON.stringify(items, null, 2));

        const navQuery = `*[_type == "searchIntent" && showInNav == true] | order(order asc) { _id, title, slug, order }`;
        const navItems = await client.fetch(navQuery);
        console.log("\nItems matching NAV QUERY (showInNav == true):", navItems.length);
        console.log(JSON.stringify(navItems, null, 2));

    } catch (err) {
        console.error("Error fetching data:", err);
    }
}

debugNav();
