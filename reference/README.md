# Réplicas de referência — CaraMelo e Lume

Espelhamento dos arquivos publicados em 19/10/2026 a partir de:

- CaraMelo: https://caramelo-confeitaria-dms.sharpdog128.chatgpt.site/ → `caramelo/`
- Lume: https://lume-fotografia-template-dms.sharpdog128.chatgpt.site/ → `lume/`

São os arquivos que estavam publicados (HTML, CSS e JS sem build, imagens, fontes e libs em `vendor/`), não o projeto original do ChatGPT. Servem de referência visual e funcional para a implementação em Astro descrita em `../plans/pavan-sites.md`.

## Como rodar

```sh
node serve.mjs lume 4401
node serve.mjs caramelo 4402
```

Abra http://localhost:4401 e http://localhost:4402 (a porta 4321 fica para o app). O Lume usa caminhos absolutos (`/js/app.js`) e precisa ser servido na raiz. Abrir pelo `file://` não funciona.

`serve.mjs` reproduz a hospedagem original: `/rota` redireciona (307) para `/rota/`, cada rota serve o próprio `index.html` e caminhos inexistentes respondem 404 com `404.html`.

## Cobertura

- **CaraMelo:** página única (`/`), com as 9 imagens de produto carregadas pelo `content.js` e o placeholder de fallback.
- **Lume:** as 16 rotas declaradas em `js/content.js` (`/`, `/portfolio` e 4 categorias, `/sobre`, `/contato`, `/galeria`, `/privacidade`, 6 `/ensaio/:slug`) e a página 404. Também as 8 fotos montadas em tempo de execução por `image(key)`.
- Os manifestos `*-manifest.json` têm URL de origem, caminho local, tamanho e sha256 do que o crawler encontrou. As entradas em `failures` com `${...}` ou texto solto são falsos positivos dos templates de string. As imagens que elas representam foram baixadas à parte.

## Alterações em relação à origem

- Removido o script de challenge da Cloudflare (`/cdn-cgi/...`) que a hospedagem injeta no fim de cada HTML. Nada mais foi modificado.
- O CaraMelo continua carregando Fraunces e Manrope do Google Fonts, como na origem. Sem internet, ele cai nas fontes de fallback.
- Os formulários e o pedido já eram simulados na origem ("Nenhum dado será enviado"), então não foi preciso criar mocks.

## Verificação feita

Playwright (Chromium) a 1440×900 e 390×844, original e réplica com mesmo viewport e mesmo scroll, nas 10 rotas representativas do Lume e na home do CaraMelo, tirando print do topo e do fim depois de rolar a página inteira. Resultados:

- Altura do documento, título, tamanho do texto e imagens quebradas iguais em todas as rotas.
- Diferença de pixels de 0,00% nos 44 pares de screenshots.
- Nenhum recurso faltando. O único 404 é o da rota de teste inexistente, que também dá 404 na origem.
- Na réplica, nenhuma requisição para domínios externos além do Google Fonts no CaraMelo.

Não testado clique por clique: carrinho e fluxo de pedido do CaraMelo, lightbox e download da galeria do Lume, menu mobile e prefers-reduced-motion. O JavaScript é o mesmo da origem e todos os assets foram encontrados, mas essas interações não foram exercitadas.
