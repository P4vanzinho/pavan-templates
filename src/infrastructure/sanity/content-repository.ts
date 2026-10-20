import { sanityClient } from "sanity:client";
import { lumeHomeId, siteSettingsId } from "../../../sanity/document-ids";
import type { LumeHomeContent, SiteSettings } from "../../types/content";

const imageProjection = `{ "url": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "focus": coalesce(hotspot{ x, y }, { "x": 0.5, "y": 0.5 }) }`;

const siteSettingsQuery = `*[_id == $id && tenant == $tenant][0]{ title, description, theme }`;

const lumeHomeQuery = `*[_id == $id && tenant == $tenant][0]{
	heroTitle,
	heroTitleEmphasis,
	heroDescription,
	"heroImage": heroImage${imageProjection}
}`;

/** Consultas de conteúdo publicado, sempre filtradas pelo tenant resolvido. */
export function getSiteSettings(tenantId: string): Promise<SiteSettings | null> {
	return sanityClient.fetch(siteSettingsQuery, { id: siteSettingsId(tenantId), tenant: tenantId });
}

export function getLumeHome(tenantId: string): Promise<LumeHomeContent | null> {
	return sanityClient.fetch(lumeHomeQuery, { id: lumeHomeId(tenantId), tenant: tenantId });
}
