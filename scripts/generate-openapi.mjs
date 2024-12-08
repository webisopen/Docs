import fs from "node:fs";
import { generateFiles } from "fumadocs-openapi";

const directory = "./content/guide/openstack/openagent/api";

const openapi = "https://agent.open.network/openapi.json";

// remove this dir before running the script
fs.rmSync(directory, { recursive: true, force: true });

await generateFiles({
  input: [openapi],
  output: directory,
  groupBy: "tag",
  per: "operation",
});

await generateFiles({
  input: [openapi],
  output: directory,
  groupBy: "tag",
  per: "file",
});

// add necessary frontmatter to the file:
// prepend `id: api` and `icon: Openapi` to the file's frontmatter
const content = fs.readFileSync(`${directory}/index.mdx`, "utf-8");
fs.writeFileSync(
  `${directory}/index.mdx`,
  `---
id: api
icon: Openapi${content.replace("---", "")}`
);
