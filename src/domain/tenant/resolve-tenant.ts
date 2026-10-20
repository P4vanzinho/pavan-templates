import type { Tenant, TenantResolution } from "./tenant";

/** Remove porta, ponto final e diferença de caixa do header Host. */
export function normalizeHostname(host: string): string {
	const withoutPort = host.trim().toLowerCase().replace(/:\d+$/, "");
	return withoutPort.endsWith(".") ? withoutPort.slice(0, -1) : withoutPort;
}

/**
 * Seleciona o tenant pelo hostname. Só hostnames verificados de tenants ativos
 * servem conteúdo; qualquer outro caso retorna um motivo explícito.
 */
export function resolveTenant(host: string, tenants: readonly Tenant[]): TenantResolution {
	const hostname = normalizeHostname(host);

	for (const tenant of tenants) {
		const match = tenant.hostnames.find((entry) => entry.hostname === hostname);
		if (!match) continue;
		if (!match.verified) return { kind: "unverified-host", hostname };
		if (tenant.status !== "active") return { kind: "disabled", hostname };
		return { kind: "found", tenant };
	}

	return { kind: "unknown-host", hostname };
}
