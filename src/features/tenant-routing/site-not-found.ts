// Resposta neutra para hostnames que não resolvem um tenant ativo e verificado.
// Não cita nenhum cliente nem diferencia o motivo, para não revelar quais domínios existem.
const body = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Site não encontrado</title>
<style>
:root{color-scheme:light dark;font-family:system-ui,sans-serif}
body{margin:0;min-height:100svh;display:grid;place-items:center;padding:24px;text-align:center}
h1{font-size:1.5rem;margin:0 0 8px}p{margin:0;opacity:.7}
</style>
</head>
<body><main><h1>Site não encontrado</h1><p>Este endereço não está associado a nenhum site publicado.</p></main></body>
</html>`;

export function renderSiteNotFound(): Response {
	return new Response(body, {
		status: 404,
		headers: {
			"content-type": "text/html; charset=utf-8",
			"cache-control": "no-store",
			"x-pavan-tenant": "unresolved",
		},
	});
}
