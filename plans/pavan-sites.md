# Plan: Pavan Sites — plataforma multi-tenant de templates

> Source PRD: [prd-pavan-sites.md](prd-pavan-sites.md)

Este plano transforma o PRD em fatias verticais demonstráveis. Cada fase atravessa conteúdo, runtime, UI, integrações e testes. A execução deve aplicar `clean-code-solid` continuamente e `landing-page-quality-system` depois de cada réplica, antes do aceite visual. A etapa de `replicate-public-website` já foi concluída: os protótipos estão espelhados em `reference/` e são a fonte de verdade visual (ver `reference/README.md`).

## Architectural decisions

- **Runtime:** Astro com SSR, `@astrojs/cloudflare` e Cloudflare Workers como destino principal. React será usado por ilhas interativas, com TypeScript estrito, Tailwind CSS, shadcn/ui, Biome, Motion, Lenis, Swiper, React Hook Form e Zod.
- **Sanity:** `@sanity/astro` fornece o client e a edição visual no site. O **Studio é uma aplicação separada** do Worker (`sanity.config.ts` na raiz, `npm run studio:dev` local e `sanity deploy` na fase 11), com um workspace por projeto Sanity. O Studio terá Content e Presentation, com preview de rascunhos, edição visual e atualização após mutações; a Presentation abre o site do tenant em iframe.
- **Rotas públicas:** o pathname público pertence ao template; o tenant é resolvido pelo hostname. Inventário confirmado nas réplicas:
  - Lume: `/`, `/portfolio`, `/portfolio/:categoria` (`retratos`, `casamentos`, `editorial`, `espacos`), `/ensaio/:slug`, `/sobre`, `/contato`, `/galeria`, `/privacidade` e página 404.
  - CaraMelo: `/` (página única com âncoras `#vitrine`, `#jeito`, `#encomenda`; produto, carrinho e pedido em diálogos).
- **Rotas de integração:** draft mode terá endpoints server-side de ativação e desativação; formulários terão endpoints server-side por intenção, como contato e pedido. Tokens nunca serão enviados ao browser.
- **Tenant:** `Tenant` é a entidade raiz que relaciona slug, template, tema, hostnames verificados, projeto/dataset Sanity e destino de e-mail. Um hostname não verificado não pode resolver conteúdo de produção.
- **Templates:** Lume e CaraMelo serão módulos de composição independentes. O registro de templates será tipado e explícito. Estrutura, motion e acessibilidade permanecem no código; textos, imagens, listas, ordem e visibilidade ficam no Sanity.
- **Um projeto Sanity por cliente:** os tenants de demonstração ficam no projeto da Pavan (`2dpfd2es`). Cada cliente real recebe um projeto Sanity próprio na organização da Pavan, e só os editores daquele cliente são membros dele. É assim que um editor vê apenas o próprio site, porque permissões por documento exigem o plano Enterprise. O app escolhe o projeto e o dataset a partir do tenant resolvido.
- **Schema de conteúdo:** haverá configurações globais, páginas singleton e coleções reutilizáveis. Os schemas comuns serão compartilhados somente quando a responsabilidade e a semântica forem realmente iguais; schemas específicos permanecerão dentro do template correspondente.
- **Storage:** imagens e arquivos ficam nos assets do Sanity (CDN e transformações de imagem incluídos). R2 está adiado: só entra se surgir necessidade concreta, como originais pesados para download na galeria do cliente.
- **E-mail:** Resend será chamado apenas no servidor. Os envios saem de um endereço do domínio da Pavan (ainda a comprar), com `reply-to` para o e-mail do cliente; domínios de envio por cliente ficam para depois. Cada envio carregará tenant, página de origem e dados validados do formulário.
- **Cache:** respostas públicas poderão ser cacheadas por hostname e pathname. Draft mode deverá ignorar cache público e sempre consultar conteúdo de rascunho. A forma de invalidação está em *Decisões pendentes*.
- **Domínios:** subdomínios da Pavan serão o caminho inicial de preview e publicação. Domínios próprios entrarão por Custom Hostnames na Cloudflare, com validação de DNS, SSL e associação explícita ao tenant.
- **Privacidade e LGPD:** toda coleta de dados será minimizada e documentada por finalidade, base legal, destino e prazo de retenção. O cliente do site será tratado como controlador em geral; a Pavan atuará como operadora quando processar dados em nome dele e como controladora dos próprios dados administrativos. Essa relação será formalizada antes da produção.
- **Dados pessoais:** WhatsApp, e-mail, nome, mensagens, pedidos e fotografias identificáveis serão tratados como dados pessoais. O produto não coletará dados sensíveis por padrão, não usará consentimento genérico para finalidades diferentes e manterá marketing separado do formulário operacional.
- **Privacidade por tenant:** cada tenant terá política de privacidade, canal para direitos dos titulares, configurações de retenção e lista de fornecedores aplicáveis. O conteúdo da política poderá ser editado no Sanity, mas os requisitos mínimos serão protegidos pelo código.
- **Segurança de formulários:** payloads serão validados no servidor, limitados em tamanho, protegidos contra abuso e não serão registrados integralmente. Rate limiting, anti-bot, verificação de origem, cookies seguros e headers de segurança serão parte do fluxo, não uma melhoria posterior.
- **Segurança de integrações:** segredos de Sanity, Resend e Cloudflare ficarão em secrets server-side. Logs usarão allowlist e redaction; tokens, cookies, corpos de requisição e dados pessoais não serão registrados.
- **Incidentes:** haverá procedimento documentado para detectar, conter, investigar, comunicar e corrigir incidentes. O cliente controlador será avisado conforme contrato e a comunicação à ANPD e aos titulares será avaliada quando houver risco ou dano relevante.
- **Dados de imagem:** galerias e fotografias precisarão de autorização de uso de imagem definida pelo cliente. Conteúdo envolvendo crianças ou adolescentes será tratado como caso de risco que exige revisão antes da publicação.
- **Organização do repositório:** a separação será intencional:

  ```text
  src/
    domain/          regras e tipos puros de tenants e templates
    application/     casos de uso e orquestração
    infrastructure/  Sanity, Cloudflare, Resend e cache
    pages/           rotas Astro e endpoints
    middleware/      resolução e proteção de tenant
    templates/       composição específica de lume e caramelo
    components/      UI compartilhada e primitives
    features/        fluxos completos como preview e formulários
    styles/          tokens e estilos globais
    types/           contratos públicos e internos
    utils/            transformações puras e helpers reutilizáveis
  sanity/             schemas, estrutura e Presentation (o Studio usa sanity.config.ts na raiz)
  tests/              unitários, integração e navegador
  docs/               manifestos, quality records e decisões
  scripts/             seed, validação e manutenção
  ```

- **Direção de dependências:** domínio não conhece serviços externos; casos de uso dependem de contratos; adapters de Sanity, Resend e Cloudflare ficam na infraestrutura; templates e componentes recebem dados já tipados.
- **Desenvolvimento local primeiro:** as fases 1 a 10 rodam localmente no runtime do Worker (workerd, via o adapter Cloudflare do Astro, e bindings locais quando necessários), com tenants resolvidos por hostnames locais como `lume.localhost` e `caramelo.localhost`. Nenhuma fase antes da última depende de conta de produção, deploy ou DNS.
- **Deploy (fase 11):** um único Worker serve todos os templates e tenants. Cadastro de tenant, conteúdo e tema não geram deploy; mudanças de código geram um deploy único. Cada branch tem preview com tenants de exemplo; produção usa versões do Worker com liberação gradual e rollback.
- **Referência visual:** `reference/lume` e `reference/caramelo`, servidas por `reference/serve.mjs`, são o baseline da regressão visual e a origem dos dados do seed inicial.
- **Tamanho do Worker:** o CI mede o bundle do Worker a cada build (`wrangler deploy --dry-run`). Na fase 1, sem o Studio, ele tem cerca de 373 KB compactado; o limite é 3 MB no plano gratuito e 10 MB no pago.
- **Qualidade:** cada fatia termina com typecheck, Biome, testes focados, build e validação visual/funcional proporcional ao que foi entregue. Não haverá componentes gigantes condicionados por todos os templates.

## Decisões pendentes

| Decisão | Recomendação | Precisa estar decidida antes de |
|---|---|---|
| Onde fica o cadastro de tenants (hoje em código) | Cloudflare D1, um banco SQL pequeno do próprio Worker, editado por uma tela ou comando da Pavan | Fase 9 |
| Como o cache é invalidado ao publicar | Cache API da Cloudflare por hostname e rota, invalidada por um webhook do Sanity a cada publicação | Fase 3 (critério de cache) |
| Galeria do cliente do Lume na versão real (privada? senha? download de originais?) | Definir com o primeiro cliente fotógrafo | Fase 5 |

---

## Phase 1: Tracer bullet do Worker e do primeiro tenant

**User stories**: 1, 2, 4, 13, 15, 33, 52, 55, 56.

### What to build

Criar o projeto Astro SSR em `pavan-sites`, com as fronteiras de pastas definidas acima, e colocar um caminho completo no ar: um tenant de exemplo do Lume é resolvido pelo hostname, a Home mínima consulta um documento do Sanity (título, imagem de hero e tema) e é renderizada no servidor, e o Studio separado abre com a estrutura do tenant. Tudo roda localmente no runtime do Worker, sem deploy.

### Acceptance criteria

- [x] O app executa localmente no runtime do Worker (workerd), não apenas no servidor de desenvolvimento do Node.
- [x] `lume.localhost` resolve o tenant de exemplo; um hostname cadastrado resolve o tenant correto; hostname desconhecido recebe uma resposta segura e identificável, sem conteúdo de nenhum tenant.
- [x] A Home exibe título, imagem e tema vindos do Sanity.
- [x] O Studio abre separado do site (`npm run studio:dev`) e nenhum token aparece no bundle público.
- [x] Typecheck, Biome, testes unitários de resolução de tenant e build passam.

---

## Phase 2: Rede de segurança local e CI

**User stories**: 56, 57.

### What to build

Montar a rede de segurança antes de crescer o código, ainda sem deploy. Um único comando roda typecheck, Biome, testes e build; um teste de regressão visual sobe a aplicação local e as réplicas de `reference/` e compara as rotas implementadas nos viewports acordados. O mesmo conjunto roda no CI (GitHub Actions em `P4vanzinho/pavan-templates`) a cada push, sem publicar nada, e mede o tamanho do Worker.

### Acceptance criteria

- [ ] Um comando local executa typecheck, Biome, testes e build.
- [ ] A regressão visual roda em 1440 px e 390 px contra as réplicas e gera um relatório de diferenças.
- [ ] O CI executa os mesmos passos em cada push e bloqueia merge quando falha.
- [ ] O CI registra o tamanho compactado do Worker e falha se passar de 2,5 MB.
- [ ] Nenhum passo depende de credenciais de produção.

---

## Phase 3: Fluxo editorial padrão Fox em uma fatia

**User stories**: 14–32, 60.

### What to build

Implementar a experiência editorial completa em uma fatia pequena do Lume: o hero e uma coleção curta (por exemplo, os destaques de ensaios). O Studio separado oferece Content com nomes claros e Presentation com a página real do tenant em iframe; o clique na prévia abre o documento e o campo correspondente; draft mode mostra rascunhos apenas na prévia; publicar atualiza o site público sem perder a navegação.

### Acceptance criteria

- [ ] Content organiza configurações globais, Home e a coleção sem termos técnicos para o editor.
- [ ] Presentation navega entre as páginas do tenant, alterna viewport e abre o campo correto por clique.
- [ ] Um rascunho aparece na prévia e não aparece no site público.
- [ ] Publicar atualiza o site público e invalida o cache daquele hostname.
- [ ] Criar, reordenar, ocultar e validar itens da coleção funciona pelo Studio.
- [ ] As rotas de draft mode são protegidas e o token de leitura de rascunho fica só no servidor.

---

## Phase 4: Home completa do Lume

**User stories**: 35, 37–44, 49–53, 57.

### What to build

Transpor todas as seções da Home do Lume para composições Astro com ilhas React, preservando tipografia, hero, carrosséis, parallax, transição de rota (cortina), cursor customizado, menu mobile, lightbox e estados responsivos da réplica. Todo conteúdo editável vem dos schemas do template. Depois da réplica, aplicar `landing-page-quality-system`.

### Acceptance criteria

- [ ] Todas as seções da Home da réplica estão implementadas e com conteúdo vindo do Sanity.
- [ ] Carrosséis e lightbox funcionam por toque, mouse, trackpad, setas e teclado.
- [ ] Animações de entrada, scroll e transição terminam em estados que não escondem conteúdo, e `prefers-reduced-motion` é respeitado.
- [ ] A regressão visual contra `reference/lume` fica dentro da tolerância acordada em mobile, tablet, desktop e wide desktop.
- [ ] Não há overflow horizontal, erro de hidratação ou recurso ausente.
- [ ] O quality record registra breakpoints, estados e desvios.

---

## Phase 5: Rotas internas do Lume

**User stories**: 34, 35, 38–43.

### What to build

Implementar as rotas internas do inventário: `/portfolio` e suas categorias, `/ensaio/:slug`, `/sobre`, `/contato`, `/galeria`, `/privacidade` e a página 404. Ensaios e categorias viram coleções no Sanity; sobre, contato, galeria e privacidade viram páginas singleton. Cada rota funciona por navegação, acesso direto, reload e histórico, com a mesma transição da réplica.

### Acceptance criteria

- [ ] Cada rota do inventário responde por acesso direto e reload; rotas inexistentes retornam 404 com a página do template.
- [ ] Ensaios e categorias são editáveis, ordenáveis e têm campos de SEO.
- [ ] O carrossel de scroll dos ensaios e a galeria do cliente preservam as interações da réplica.
- [ ] Estados de vazio, carregamento e conteúdo incompleto têm comportamento explícito.
- [ ] A regressão visual cobre todas as rotas do Lume em mobile e desktop.

---

## Phase 6: Segundo template — vitrine do CaraMelo

**User stories**: 2, 3, 17–23, 36, 50, 51.

### What to build

Adicionar o CaraMelo ao registro de templates e publicar um tenant de exemplo dele na mesma aplicação. Implementar a Home completa: abertura animada, vitrine com abas de categoria, diálogo de detalhe de produto, história, depoimentos em carrossel, seletor de ocasião, FAQ e encerramento, além do carrinho com quantidades e etapas do pedido até a revisão, ainda sem envio. Produtos, depoimentos, FAQ e textos vêm do Sanity. Depois da réplica, aplicar `landing-page-quality-system`.

### Acceptance criteria

- [ ] Um tenant Lume e um tenant CaraMelo funcionam ao mesmo tempo, cada um pelo seu hostname, com temas distintos.
- [ ] Um tenant não pode referenciar um template inexistente (validado pelo registro tipado).
- [ ] Produtos, categorias, depoimentos e FAQ suportam ordem, visibilidade e quantidade variável.
- [ ] Carrinho e etapas do pedido preservam os estados da réplica sem perder dados preenchidos.
- [ ] A regressão visual contra `reference/caramelo` fica dentro da tolerância em todos os viewports.
- [ ] Nenhum componente específico do CaraMelo é importado pelo Lume e vice-versa.

---

## Phase 7: Formulários com envio real

**User stories**: 44–48, 53.

### What to build

Ligar o pedido do CaraMelo e o contato do Lume a endpoints server-side por intenção. O navegador valida com React Hook Form e Zod; o servidor valida de novo, limita o payload, aplica rate limiting, anti-bot e verificação de origem, e envia pelo Resend, a partir de um endereço do domínio da Pavan com `reply-to` do cliente, para o destinatário configurado no tenant, identificando tenant e página de origem.

### Acceptance criteria

- [ ] Um pedido e um contato chegam ao destinatário configurado com tenant, origem e campos validados.
- [ ] Erros de validação, envio em andamento, falha e sucesso são acessíveis e não apagam o que foi preenchido.
- [ ] Falha do Resend resulta em erro controlado, nunca em sucesso falso.
- [ ] Rate limiting e anti-bot bloqueiam abuso em teste automatizado.
- [ ] A chave do Resend não aparece no bundle nem nos logs; os logs não registram dados pessoais completos.

---

## Phase 8: Um projeto Sanity por cliente e isolamento entre tenants

**User stories**: 12, 15, 54, 55, 58.

### What to build

Fazer cada tenant apontar para o próprio projeto e dataset Sanity e ter o Studio separado com um workspace por projeto, de modo que um editor só acesse os projetos dos quais é membro. Criar um segundo projeto Sanity de teste, simulando um cliente real, e um script que prepara um projeto novo (schemas, CORS, conteúdo inicial). Garantir isolamento em todas as camadas: consultas, assets, cache e configurações. Expor ao operador qual projeto Sanity e destinatário pertencem a cada tenant.

### Acceptance criteria

- [ ] O app lê o conteúdo do tenant no projeto e dataset configurados nele, sem projeto fixo no código.
- [ ] O Studio mostra um workspace por projeto, e um editor de teste convidado só para o projeto do cliente não enxerga o projeto da Pavan nem de outro cliente.
- [ ] Um projeto novo de cliente é preparado por script, sem passos manuais além da criação e do convite.
- [ ] Testes provam que o tenant A não lê documentos, assets, cache ou configurações do tenant B.
- [ ] O cache público diferencia hostname, pathname e draft.
- [ ] O operador consegue diagnosticar as integrações de um tenant sem acesso a segredos.

---

## Phase 9: Ciclo de vida do tenant e SEO por hostname

**User stories**: 1–4, 7–12, 33, 58, 59.

### What to build

Completar o fluxo operacional da Pavan, localmente: cadastrar tenant a partir de uma configuração inicial do template, ativar e desativar, trocar subdomínio, associar um hostname adicional e acompanhar seu estado de verificação (com a verificação real ficando para a fase 11). SEO por tenant: metadata, canonical, sitemap e robots gerados para o hostname resolvido.

### Acceptance criteria

- [ ] Um tenant novo é criado a partir da configuração inicial do template sem alterar código.
- [ ] Um hostname marcado como não verificado não serve conteúdo; ao ser marcado como verificado, passa a servir o tenant.
- [ ] Trocar ou desativar um hostname, ou o tenant inteiro, não apaga conteúdo.
- [ ] Arquivar ou remover um tenant exige ação protegida.
- [ ] Canonical, sitemap e robots usam o hostname correto e nunca apontam para outro cliente.
- [ ] Hostname desconhecido não revela conteúdo de nenhum tenant.

---

## Phase 10: LGPD e segurança

**User stories**: 37–44, 56–58.

### What to build

Fechar, ainda localmente, tudo o que precisa existir antes de tráfego real: revisão final com `clean-code-solid` e `landing-page-quality-system` nos dois templates, mapa de dados e checklist LGPD por tenant, procedimento de incidentes, headers de segurança, rotação de segredos e um roteiro curto para a equipe Pavan operar tenants, conteúdo, domínios e solicitações de titulares.

### Acceptance criteria

- [ ] Cada tenant tem política de privacidade, finalidade dos campos, base legal definida com o responsável jurídico, prazo de retenção e canal para titulares.
- [ ] Existe registro de controlador, operador e suboperadores (Sanity, Cloudflare, Resend) com termos avaliados.
- [ ] Há fluxo testado de acesso, correção e exclusão de dados, incluindo assets no Sanity.
- [ ] Há procedimento de incidentes com responsáveis, prazos e critérios de comunicação à ANPD e aos titulares.
- [ ] Cookies não essenciais e analytics só são ativados com transparência e consentimento adequado.
- [ ] O uso de imagens de pessoas, especialmente menores, tem autorização e revisão do cliente.
- [ ] Teclado, foco, reduced motion, labels e estados de loading, erro, vazio e sucesso foram revisados nos dois templates.
- [ ] A equipe consegue seguir o roteiro para criar um tenant, editar, pré-visualizar e publicar conteúdo.

---

## Phase 11: Deploy, publicação segura e domínios próprios

**User stories**: 4–6, 33, 56, 58.

### What to build

Levar a plataforma para a Cloudflare. Criar o Worker de produção com secrets e bindings reais; publicar o Studio separado (`sanity deploy`) com os workspaces e a Presentation apontando para os tenants publicados; ligar o CI a previews por branch com tenants de exemplo e à promoção para produção com liberação gradual e rollback; publicar os tenants de exemplo em subdomínios da Pavan; integrar Custom Hostnames para domínios de clientes, com instruções de DNS, validação de propriedade e SSL. Rodar a regressão visual e os testes de navegador contra o ambiente publicado.

### Acceptance criteria

- [ ] O Worker de produção roda com secrets configurados no ambiente, sem depender de credenciais locais nem de arquivos fora do repositório.
- [ ] Cada branch gera uma URL de preview com pelo menos um tenant de cada template.
- [ ] Produção recebe novas versões de forma gradual, e um rollback para a versão anterior foi executado e documentado.
- [ ] Um tenant Lume e um tenant CaraMelo estão publicados em subdomínios da Pavan.
- [ ] Um domínio próprio de teste só passa a servir o tenant depois da validação de hostname e SSL, e o operador acompanha esse estado.
- [ ] O Studio publicado, a Presentation, o draft mode, os formulários e o e-mail funcionam no ambiente publicado.
- [ ] A regressão visual e os testes de navegador passam contra o preview antes de cada promoção.

