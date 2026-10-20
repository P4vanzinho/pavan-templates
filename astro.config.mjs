// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { defineConfig } from "astro/config";
import { sanityApiVersion, sanityDataset, sanityProjectId } from "./sanity/env";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	server: { port: 4321 },
	integrations: [
		sanity({
			projectId: sanityProjectId,
			dataset: sanityDataset,
			apiVersion: sanityApiVersion,
			useCdn: true,
		}),
		react(),
	],
	vite: {
		// Tenants locais respondem em subdomínios de localhost, como lume.localhost.
		server: { allowedHosts: [".localhost"] },
	},
});
