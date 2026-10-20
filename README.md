# Pavan Sites

Plataforma multi-tenant de templates (Lume, CaraMelo). Produto e plano em `plans/`; contas e compras externas em `docs/compras-e-contas.md`; réplicas visuais de referência em `reference/`.

## Rodar localmente

```sh
npm install
npm run dev          # site
npm run studio:dev   # painel de edição (Sanity Studio)
```

- Site do tenant de exemplo: http://lume.localhost:4321
- Studio: http://localhost:3333 (aplicação separada do site)
- Qualquer outro endereço (inclusive `localhost`) responde "Site não encontrado".

O servidor de desenvolvimento executa no runtime do Cloudflare Worker (workerd).

## Comandos

- `npm run check` — typecheck, Biome, testes e build.
- `npm run seed:lume` — cria o conteúdo inicial do tenant `lume-demo` no Sanity (usa o login do Sanity CLI; não sobrescreve conteúdo existente).
