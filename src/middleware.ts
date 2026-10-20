import { defineMiddleware } from "astro:middleware";
import { resolveTenant } from "./domain/tenant/resolve-tenant";
import { renderSiteNotFound } from "./features/tenant-routing/site-not-found";
import { tenants } from "./infrastructure/tenants/tenant-registry";

export const onRequest = defineMiddleware((context, next) => {
	const resolution = resolveTenant(context.url.host, tenants);
	if (resolution.kind !== "found") {
		console.warn(
			JSON.stringify({ event: "tenant.unresolved", reason: resolution.kind, hostname: resolution.hostname }),
		);
		return renderSiteNotFound();
	}

	context.locals.tenant = resolution.tenant;
	return next();
});
