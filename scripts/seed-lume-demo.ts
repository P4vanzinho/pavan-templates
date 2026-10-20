/// <reference types="node" />
// Cria o conteúdo inicial do tenant lume-demo a partir da réplica em reference/lume.
// Uso: npx sanity exec scripts/seed-lume-demo.ts --with-user-token
import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import { getCliClient } from "sanity/cli";
import { lumeHomeId, siteSettingsId } from "../sanity/document-ids";
import { sanityApiVersion } from "../sanity/env";

const tenant = "lume-demo";
const client = getCliClient({ apiVersion: sanityApiVersion });

const heroImage = await client.assets.upload(
	"image",
	createReadStream(resolve("reference/lume/assets/images/vento.webp")),
	{
		filename: "lume-vento.webp",
	},
);

await client
	.transaction()
	.createIfNotExists({
		_id: siteSettingsId(tenant),
		_type: "siteSettings",
		tenant,
		title: "Lume",
		description:
			"Lume — fotografia para guardar o que importa. Um template de fotografia autoral com portfólio, ensaios e galeria do cliente.",
		theme: { paper: "#f4f1e9", ink: "#33382f", accent: "#96582f" },
	})
	.createIfNotExists({
		_id: lumeHomeId(tenant),
		_type: "lumeHome",
		tenant,
		heroTitle: "A vida passa.",
		heroTitleEmphasis: "A imagem fica.",
		heroDescription: "Um gesto. Uma luz. Um jeito de lembrar.",
		heroImage: {
			_type: "image",
			asset: { _type: "reference", _ref: heroImage._id },
			alt: "Retrato de uma mulher à luz do entardecer, entre falésias e o mar.",
		},
	})
	.commit();

// Ponto de foco no rosto, equivalente ao object-position 50% 32% da réplica.
await client
	.patch(lumeHomeId(tenant))
	.setIfMissing({ "heroImage.hotspot": { _type: "sanity.imageHotspot", x: 0.5, y: 0.32, width: 1, height: 1 } })
	.commit();

console.log(`Conteúdo inicial de ${tenant} criado.`);
