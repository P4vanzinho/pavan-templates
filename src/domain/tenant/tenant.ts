import type { TemplateId } from "../templates/template-id";

export type TenantStatus = "active" | "disabled";

export interface TenantHostname {
	hostname: string;
	verified: boolean;
}

export interface Tenant {
	/** Identificador estável, usado nos IDs de documentos do Sanity. */
	id: string;
	name: string;
	template: TemplateId;
	status: TenantStatus;
	hostnames: readonly TenantHostname[];
}

export type TenantResolution =
	| { kind: "found"; tenant: Tenant }
	| { kind: "unknown-host"; hostname: string }
	| { kind: "unverified-host"; hostname: string }
	| { kind: "disabled"; hostname: string };
