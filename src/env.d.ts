/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

declare namespace App {
	interface Locals {
		tenant: import("./domain/tenant/tenant").Tenant;
	}
}
