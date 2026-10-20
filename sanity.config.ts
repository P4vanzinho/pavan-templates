import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { sanityDataset, sanityProjectId } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const singletonTypes = new Set(["siteSettings", "lumeHome"]);

export default defineConfig({
	name: "pavan-sites",
	title: "Pavan Sites",
	projectId: sanityProjectId,
	dataset: sanityDataset,
	plugins: [structureTool({ structure })],
	schema: {
		types: schemaTypes,
		// Páginas singleton são abertas pela estrutura; não aparecem em "criar novo".
		templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
	},
	document: {
		actions: (actions, { schemaType }) =>
			singletonTypes.has(schemaType)
				? actions.filter(({ action }) => action !== "duplicate" && action !== "delete")
				: actions,
	},
});
