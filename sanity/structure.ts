import type { StructureResolver } from "sanity/structure";
import { tenants } from "../src/infrastructure/tenants/tenant-registry";
import { lumeHomeId, siteSettingsId } from "./document-ids";

/** Content agrupado por site, com cada página singleton aberta direto pelo seu ID. */
export const structure: StructureResolver = (S) =>
	S.list()
		.title("Conteúdo")
		.items(
			tenants.map((tenant) =>
				S.listItem()
					.id(tenant.id)
					.title(tenant.name)
					.child(
						S.list()
							.title(tenant.name)
							.items([
								S.listItem()
									.title("Configurações do site")
									.child(S.document().schemaType("siteSettings").documentId(siteSettingsId(tenant.id))),
								...(tenant.template === "lume"
									? [
											S.listItem()
												.title("Home")
												.child(S.document().schemaType("lumeHome").documentId(lumeHomeId(tenant.id))),
										]
									: []),
							]),
					),
			),
		);
