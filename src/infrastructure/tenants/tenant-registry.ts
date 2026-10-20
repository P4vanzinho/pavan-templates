import type { Tenant } from "../../domain/tenant/tenant";

/**
 * Cadastro de tenants da fase 1. Fica em código até o ciclo de vida do tenant
 * (fase 9) mover este cadastro para uma fonte editável.
 */
export const tenants: readonly Tenant[] = [
	{
		id: "lume-demo",
		name: "Lume — demonstração",
		template: "lume",
		status: "active",
		hostnames: [{ hostname: "lume.localhost", verified: true }],
	},
];
