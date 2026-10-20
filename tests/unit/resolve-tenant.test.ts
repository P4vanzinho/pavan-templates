import { describe, expect, it } from "vitest";
import { normalizeHostname, resolveTenant } from "../../src/domain/tenant/resolve-tenant";
import type { Tenant } from "../../src/domain/tenant/tenant";

const tenant = (overrides: Partial<Tenant>): Tenant => ({
	id: "lume-demo",
	name: "Lume",
	template: "lume",
	status: "active",
	hostnames: [{ hostname: "lume.localhost", verified: true }],
	...overrides,
});

describe("normalizeHostname", () => {
	it("remove porta, ponto final e diferença de caixa", () => {
		expect(normalizeHostname("Lume.LocalHost:4321")).toBe("lume.localhost");
		expect(normalizeHostname("cliente.com.br.")).toBe("cliente.com.br");
	});
});

describe("resolveTenant", () => {
	it("resolve o tenant de um hostname verificado", () => {
		const lume = tenant({});
		expect(resolveTenant("lume.localhost:4321", [lume])).toEqual({ kind: "found", tenant: lume });
	});

	it("não resolve hostname desconhecido", () => {
		expect(resolveTenant("outro.localhost", [tenant({})])).toEqual({
			kind: "unknown-host",
			hostname: "outro.localhost",
		});
	});

	it("não serve conteúdo para hostname não verificado", () => {
		const pending = tenant({ hostnames: [{ hostname: "cliente.com.br", verified: false }] });
		expect(resolveTenant("cliente.com.br", [pending]).kind).toBe("unverified-host");
	});

	it("não serve conteúdo para tenant desativado", () => {
		expect(resolveTenant("lume.localhost", [tenant({ status: "disabled" })]).kind).toBe("disabled");
	});

	it("não confunde hostnames parecidos", () => {
		expect(resolveTenant("lume.localhost.evil.com", [tenant({})]).kind).toBe("unknown-host");
		expect(resolveTenant("x.lume.localhost", [tenant({})]).kind).toBe("unknown-host");
	});
});
