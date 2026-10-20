# PRD — Pavan Sites: plataforma de templates multi-tenant

## Problem Statement

A Pavan quer transformar os templates visuais que já foram criados em protótipos independentes em um produto reutilizável para publicar sites de diferentes segmentos.

Hoje, cada template existe como uma aplicação isolada. Essa abordagem dificulta a manutenção, aumenta o custo de replicar correções e não oferece uma experiência consistente para que clientes editem o próprio conteúdo. Também não há uma forma centralizada de associar um template, um conjunto de conteúdo, arquivos, e-mails e um domínio próprio a cada cliente.

Os dois primeiros templates são **Lume**, para fotografia, e **CaraMelo**, para confeitaria. Eles devem manter a aparência, as seções, as animações e as interações dos protótipos atuais, mas serão reconstruídos em uma base React moderna, com componentes reutilizáveis e conteúdo vindo do Sanity.

A experiência de edição deve atingir o padrão já validado no projeto Fox Constructions: Studio em um endereço único da Pavan, navegação organizada em **Content**, prévia real em **Presentation**, edição visual por clique, rascunhos, publicação e atualização da prévia sem perder o contexto de navegação.

## Solution

Construir a plataforma **Pavan Sites**, uma aplicação React multi-tenant que renderiza diferentes templates a partir do domínio ou subdomínio recebido.

O produto terá uma única base de aplicação e uma arquitetura orientada a tenants. Cada tenant representa um site publicado e define:

- template visual;
- tema, fontes e identidade;
- projeto e dataset do Sanity;
- destinatários e configurações de e-mail;
- subdomínio da Pavan ou domínio próprio do cliente.

Os templates Lume e CaraMelo serão implementados primeiro, usando os protótipos como referência visual e comportamental. A primeira versão não redesenhará os sites: ela converterá a experiência existente para uma base configurável, preservando a personalidade de cada template.

A base técnica será Astro em modo SSR, com adapter oficial para Cloudflare Workers e integração React. O Sanity Studio será uma aplicação separada do Worker, preservando a experiência de Content e Presentation do Fox sem carregar a stack do Fox para o produto Pavan. A camada pública consultará conteúdo publicado; a Presentation utilizará rascunhos e edição visual.

O stack padrão será composto por TypeScript estrito, Tailwind CSS, shadcn/ui, Biome, Motion, Lenis, Swiper, React Hook Form, Zod e bibliotecas de ícones. A biblioteca será usada quando resolver uma necessidade real do produto; não haverá componentes artesanais para substituir capacidades já oferecidas por dependências adequadas.

## User Stories

1. Como operador da Pavan, quero cadastrar um tenant, para publicar um novo site sem duplicar a aplicação.
2. Como operador da Pavan, quero escolher Lume ou CaraMelo como template de um tenant, para iniciar a configuração a partir de uma identidade pronta.
3. Como operador da Pavan, quero informar a identidade, cores, fontes e contatos de um tenant, para personalizar o template sem alterar sua estrutura de código.
4. Como operador da Pavan, quero definir um subdomínio da Pavan para cada tenant, para disponibilizar uma prévia ou uma publicação inicial sem comprar outro domínio.
5. Como operador da Pavan, quero associar um domínio próprio verificado ao tenant, para publicar o site no endereço do cliente.
6. Como operador da Pavan, quero acompanhar o estado de validação de DNS e SSL de um domínio, para saber quando o site está pronto para produção.
7. Como operador da Pavan, quero trocar o domínio associado a um tenant, para corrigir configurações sem recriar o site.
8. Como operador da Pavan, quero desativar um tenant, para interromper sua publicação sem apagar seu conteúdo.
9. Como operador da Pavan, quero criar conteúdo inicial a partir dos dados dos protótipos, para que Lume e CaraMelo tenham uma instalação demonstrável desde o primeiro acesso.
10. Como operador da Pavan, quero duplicar uma configuração inicial de template, para acelerar a criação de novos sites do mesmo segmento.
11. Como operador da Pavan, quero consultar a lista de tenants e seus templates, para localizar rapidamente cada site em manutenção.
12. Como operador da Pavan, quero identificar qual projeto Sanity e destinatário de e-mail pertencem a cada tenant, para diagnosticar uma publicação com segurança.
13. Como operador da Pavan, quero abrir o Studio em um endereço único da Pavan, para administrar o conteúdo de todos os sites a partir de um só lugar.
14. Como editor do cliente, quero encontrar as configurações globais, a Home e as coleções em uma navegação Content clara, para editar o site sem conhecer a estrutura técnica.
15. Como editor do cliente, quero ver apenas os documentos e coleções do meu site, para não correr o risco de alterar outro tenant.
16. Como editor do cliente, quero editar textos, imagens, links, contatos e metadados, para manter o site atualizado sem ajuda técnica.
17. Como editor do cliente, quero editar listas de produtos, sabores, ensaios, projetos, depoimentos ou perguntas, para que o conteúdo apresentado corresponda ao meu negócio.
18. Como editor do cliente, quero criar um novo item em uma coleção, para ampliar o conteúdo publicado sem alterar código.
19. Como editor do cliente, quero reordenar itens de uma lista, para controlar a ordem em que aparecem no site.
20. Como editor do cliente, quero ocultar temporariamente um item ou uma seção, para retirar conteúdo sem apagá-lo.
21. Como editor do cliente, quero receber validações quando faltar um campo obrigatório, para publicar um conteúdo completo.
22. Como editor do cliente, quero fazer upload de imagens com descrição e enquadramento, para manter qualidade visual e acessibilidade.
23. Como editor do cliente, quero editar o texto alternativo de imagens, para atender visitantes que usam leitores de tela.
24. Como editor do cliente, quero salvar alterações como rascunho, para revisar o conteúdo antes de disponibilizá-lo publicamente.
25. Como editor do cliente, quero abrir a aba Presentation, para visualizar a página real com o conteúdo que estou editando.
26. Como editor do cliente, quero escolher Home ou outra página disponível dentro da Presentation, para revisar o contexto correto.
27. Como editor do cliente, quero alternar a largura da prévia, para conferir o resultado em desktop, tablet e mobile.
28. Como editor do cliente, quero clicar em um texto, imagem ou card na prévia, para abrir diretamente o documento e o campo correspondente.
29. Como editor do cliente, quero ver alterações de rascunho na prévia sem publicá-las, para validar o resultado com segurança.
30. Como editor do cliente, quero que a prévia seja atualizada depois de uma alteração, para conferir o novo conteúdo sem perder minha posição de navegação.
31. Como editor do cliente, quero publicar alterações quando estiverem aprovadas, para que visitantes passem a vê-las no site público.
32. Como editor do cliente, quero descartar ou substituir um rascunho, para corrigir uma edição sem contaminar o conteúdo publicado.
33. Como visitante, quero abrir o site pelo domínio ou subdomínio correto, para ver o template associado àquele cliente.
34. Como visitante, quero acessar diretamente as rotas públicas do site, para que links compartilhados e resultados de busca funcionem.
35. Como visitante, quero que o Lume preserve sua experiência de fotografia, incluindo hero, galerias, carrosséis, transições e páginas de ensaio, para reconhecer a identidade do protótipo.
36. Como visitante, quero que o CaraMelo preserve sua experiência de confeitaria, incluindo hero, vitrine, sabores, depoimentos, fluxo de pedido e contato, para reconhecer a identidade do protótipo.
37. Como visitante, quero navegar pelos sites em mobile, tablet e desktop, para usar a experiência em diferentes dispositivos.
38. Como visitante, quero interagir com carrosséis por toque, arraste, setas e teclado, para escolher a forma mais confortável de navegar.
39. Como visitante, quero que animações, parallax, transições e rolagem suave mantenham a fluidez dos protótipos, para ter uma experiência premium.
40. Como visitante, quero que o site respeite `prefers-reduced-motion`, para poder navegar sem movimento excessivo.
41. Como visitante, quero acessar menus mobile, accordions, filtros, seletores e modais com foco e teclado, para usar as interfaces sem mouse.
42. Como visitante, quero que o foco visível siga uma ordem lógica, para entender onde estou ao navegar por Tab.
43. Como visitante, quero que imagens tenham carregamento, recorte e fallback adequados, para evitar áreas quebradas ou mudanças bruscas de layout.
44. Como visitante, quero que os formulários exibam erros claros e estados de envio, para corrigir dados sem perder o que já preenchi.
45. Como visitante, quero enviar um contato ou pedido, para iniciar uma conversa com o negócio apresentado no site.
46. Como dono do negócio, quero receber os contatos e pedidos por e-mail, para responder sem precisar abrir o CMS.
47. Como dono do negócio, quero que o formulário identifique o tenant e a origem do site, para saber de qual publicação veio cada mensagem.
48. Como dono do negócio, quero editar o destinatário de mensagens dentro das configurações permitidas, para direcionar os contatos à pessoa correta.
49. Como desenvolvedor Pavan, quero compartilhar componentes de layout, acessibilidade e motion, para corrigir comportamentos comuns em um só lugar.
50. Como desenvolvedor Pavan, quero manter componentes específicos de cada template separados, para evitar que uma alteração no Lume quebre o CaraMelo.
51. Como desenvolvedor Pavan, quero declarar os templates em um registro tipado, para impedir que um tenant referencie um template inexistente.
52. Como desenvolvedor Pavan, quero que consultas Sanity sejam tipadas e executadas no servidor, para reduzir divergências entre schema, conteúdo e renderização.
53. Como desenvolvedor Pavan, quero que chaves de Sanity e Resend nunca cheguem ao navegador, para manter os serviços protegidos.
54. Como desenvolvedor Pavan, quero que os arquivos de cada tenant fiquem no projeto Sanity do próprio tenant, para evitar colisões e facilitar manutenção.
55. Como desenvolvedor Pavan, quero que um domínio não verificado não consiga selecionar um tenant arbitrário, para impedir vazamento de conteúdo entre clientes.
56. Como desenvolvedor Pavan, quero executar verificação de tipos, lint, formatação, build e testes no CI, para detectar regressões antes da publicação.
57. Como desenvolvedor Pavan, quero comparar os novos templates com os protótipos em resoluções definidas, para validar fidelidade visual antes de entregar um site.
58. Como operador da Pavan, quero consultar o status de publicação e erros de uma integração, para resolver falhas de CMS, domínio, arquivos ou e-mail.
59. Como administrador da Pavan, quero remover ou arquivar um tenant com uma ação protegida, para controlar o ciclo de vida sem exclusões acidentais.
60. Como editor do cliente, quero que a interface do Studio use nomes claros e pouca documentação auxiliar, para conseguir trabalhar sem treinamento técnico extenso.

## Implementation Decisions

- **Aplicação base:** Astro com `output: "server"`, adapter `@astrojs/cloudflare`, TypeScript estrito e integração `@astrojs/react`. Astro será o shell de páginas, layout, SSR e roteamento; React será usado nas ilhas que precisam de interação, animação ou estado complexo.
- **Renderização:** conteúdo publicado será buscado no servidor e renderizado pelo Astro; componentes React client-side serão usados somente onde houver interação, animação ou edição visual necessária. A aplicação não transformará cada página inteira em um único componente React, preservando a vantagem de enviar pouco JavaScript.
- **Arquitetura multi-tenant:** uma aplicação resolve o tenant a partir do hostname e carrega template, tema, configuração de CMS e destinatário de e-mail desse tenant. O hostname será validado contra uma tabela de domínios ativos.
- **Registro de templates:** Lume e CaraMelo serão registrados como templates explícitos e tipados. Cada template terá composição, schema de conteúdo, tokens visuais e regras de navegação próprias, além de utilizar componentes compartilhados quando a responsabilidade for realmente comum.
- **Fidelidade dos protótipos:** a ordem das seções, textos iniciais, imagens, breakpoints, efeitos, transições, carrosséis, filtros, formulários e estados interativos dos protótipos serão a referência funcional da primeira versão. Melhorias visuais posteriores não fazem parte da migração inicial.
- **Sanity Studio:** o Studio será uma aplicação separada do Worker (publicada com `sanity deploy`), com um workspace por projeto Sanity e o mesmo modelo de navegação do Fox: ferramenta Content para documentos e coleções, ferramenta Presentation para prévia visual e seletor de páginas limitado às páginas do tenant.
- **Edição visual:** componentes editáveis receberão vínculos de edição visual com documento e caminho de campo. A implementação suportará campos de texto, imagens, cards e itens de listas sem depender de leitura do DOM para descobrir conteúdo.
- **Draft mode:** serão implementadas rotas protegidas e compatíveis com Web APIs para ativar e desativar draft mode. A prévia usará token de leitura somente no servidor, exibirá rascunhos no iframe e atualizará o conteúdo depois de mutações sem sair da página. A implementação seguirá o fluxo framework-agnostic do Sanity, em vez de depender dos helpers específicos do Next.
- **Modelagem de conteúdo:** cada template terá documentos globais, páginas singleton e coleções reutilizáveis. A estrutura de composição e regras de animação permanecerá no código; textos, imagens, legendas, itens, ordem, visibilidade e configurações editoriais ficarão no Sanity.
- **Estratégia de projetos Sanity:** os protótipos e tenants de demonstração usam o projeto da Pavan. Cada cliente real recebe obrigatoriamente um projeto Sanity próprio dentro da organização da Pavan, garantindo isolamento de membros, datasets e conteúdo sem duplicar o frontend. É esse isolamento que impede um editor de ver outro site, já que permissões por documento exigem o plano Enterprise.
- **Imagens e arquivos:** imagens e arquivos ficam nos assets do Sanity de cada tenant, com CDN e transformações de imagem. O uso do R2 está adiado e só será reavaliado diante de uma necessidade concreta, como originais pesados para download.
- **E-mail:** formulários enviarão dados para uma rota server-side ou Worker, que validará o payload e chamará o Resend. O e-mail sairá de um endereço do domínio da Pavan com `reply-to` do cliente, e conterá tenant, página de origem e campos enviados. A chave do Resend ficará apenas no servidor.
- **Bibliotecas:** Swiper será usado para carrosséis; shadcn/ui e Radix/Base UI serão usados para primitives e estados acessíveis; Tailwind será usado para tokens e composição; Motion será usado para animações; Lenis será usado para rolagem suave quando compatível; React Hook Form e Zod serão usados para formulários e validação; Biome será a ferramenta de lint e formatação.
- **Acessibilidade:** todos os componentes interativos deverão suportar teclado, foco visível, nomes acessíveis, estados de erro, `aria` apenas quando necessário e comportamento equivalente para reduced motion. Carrosséis e accordions deverão funcionar sem gesto de arraste.
- **Responsividade:** cada template será validado em mobile, tablet, desktop, telas grandes e viewport embutido da Presentation. Larguras, tipografia, imagens e espaçamentos deverão preservar o comportamento visual dos protótipos sem overflow horizontal.
- **SEO por tenant:** cada tenant terá título, descrição, imagem social, canonical, sitemap e robots configuráveis. O domínio resolvido será considerado na geração de URLs para impedir URLs canônicas cruzadas entre clientes.
- **Domínios próprios:** o fluxo inicial poderá ser operado pela Pavan. O domínio será cadastrado, validado e associado ao tenant antes de atender tráfego de produção. A Cloudflare ficará responsável por proxy, SSL e roteamento dos hostnames; a aplicação não confiará em um domínio apenas por receber o header `Host`.
- **Deploy:** o destino principal será Cloudflare Workers usando o adapter oficial do Astro. A prova técnica deverá validar SSR, draft mode, resolução de tenant, Resend e Presentation no runtime do Worker, e o tamanho do Worker será medido a cada build. Cloudflare Pages poderá ser usado para builds estáticos auxiliares, mas não será o runtime principal da plataforma.
- **Deploy único:** todos os templates e tenants são servidos pelo mesmo Worker e publicados em um único deploy. Cadastrar um tenant, editar conteúdo ou alterar tema não exige deploy; somente mudanças de código geram um novo deploy, que alcança todos os tenants afetados por aquele código.
- **Publicação segura:** cada branch terá um preview do Worker com tenants de exemplo de cada template antes da promoção para produção. Produção usará versões do Worker com liberação gradual e rollback imediato para reduzir o impacto de regressões em vários clientes ao mesmo tempo.
- **Observabilidade:** erros de resolução de tenant, Sanity, domínio, draft mode e e-mail deverão ser identificáveis por logs estruturados sem registrar tokens ou dados sensíveis desnecessários.
- **Testes:** haverá testes unitários para resolução de tenant, consultas e transformações de conteúdo; testes de componentes para estados interativos; testes de fluxo para draft mode e formulários; e testes de navegador para navegação pública e Presentation quando o ambiente estiver disponível.
- **Qualidade visual:** a validação comparará screenshots e estados equivalentes dos protótipos em resoluções acordadas. A referência são as réplicas locais em `reference/lume` e `reference/caramelo`, servidas por `reference/serve.mjs`; elas também alimentam testes de regressão visual dos tenants de exemplo a cada deploy. Animações serão avaliadas por sequência e comportamento, evitando comparar frames capturados em tempos diferentes.
- **Base Fox:** o fluxo do Fox será tratado como referência de produto para Studio, Presentation, edição visual, draft mode e organização de documentos. A stack Next.js do Fox não será uma restrição. O código será reimplementado com responsabilidades próprias da plataforma Pavan, sem acoplar o produto ao conteúdo ou à identidade do Fox.

## Out of Scope

- Criar um plano de negócio, precificação, cobrança recorrente ou marketplace de templates.
- Construir um painel financeiro ou um sistema de assinatura para clientes.
- Permitir que clientes criem ou editem a estrutura de um template livremente.
- Criar um editor visual de layout no estilo page builder.
- Migrar ou alterar o projeto de produção do Fox Constructions.
- Reproduzir páginas que não façam parte dos protótipos Lume e CaraMelo na primeira fase.
- Criar novos templates além de Lume e CaraMelo nesta primeira entrega.
- Transformar imediatamente os protótipos em um sistema de ecommerce com pagamentos, estoque, checkout ou logística.
- Comprar, renovar ou administrar financeiramente domínios dos clientes.
- Oferecer onboarding self-service completo para o cliente configurar DNS sem intervenção da Pavan.
- Oferecer analytics avançado, CRM, automações de marketing ou gestão de campanhas.
- Permitir acesso público a drafts ou expor tokens de Sanity e Resend no navegador.
- Reescrever o visual dos templates durante a migração para uma nova direção de design.

## Further Notes

- O produto pertence à empresa **Pavan**. Referências a Naranja aparecem somente como contexto de repositórios e não representam a marca, o domínio, a organização ou o proprietário do produto.
- O Fox Constructions é a referência técnica para a experiência de CMS: Content, Presentation, navegação de páginas, localização de documentos, edição visual e atualização de rascunhos.
- O Lume e o CaraMelo são as referências visuais e comportamentais iniciais. A conversão deve preservar seus estados atuais antes de introduzir melhorias de design ou novos recursos.
- Os protótipos originais foram publicados em `chatgpt.site` e o projeto de origem não está mais acessível. Em 19/10/2026 os arquivos publicados foram espelhados em `reference/` (cobertura, adaptações e limites em `reference/README.md`). Essas réplicas são a fonte de verdade visual da migração, inclusive para textos, imagens e dados iniciais do seed.
- A primeira entrega deve demonstrar um tenant completo de cada template, incluindo conteúdo no Sanity, edição no Studio, prévia com rascunho, publicação, assets e formulário.
- Para reduzir risco, a implementação deve começar por um vertical slice: resolução de tenant, Home de um template, Studio mínimo, Presentation, draft mode, uma coleção editável e uma publicação em subdomínio. Depois que esse fluxo estiver estável, o segundo template e as demais coleções entram na mesma base.
- O produto deve manter uma separação clara entre conteúdo e estrutura. O cliente edita dados; a Pavan mantém componentes, regras de composição, acessibilidade, animações e comportamento responsivo.
- Antes da produção em Cloudflare, será necessário validar o adapter `@astrojs/cloudflare`, as rotas de draft mode, o proxy de domínios e a emissão de SSL para hostnames customizados.
- Astro é uma decisão de deploy e composição, não uma exigência do Sanity. O Sanity oferece integração oficial com Astro, mas a Presentation exige SSR para ler o estado de preview e gerar os vínculos de edição. React continuará disponível para Swiper, Motion, formulários e componentes interativos.
- O PRD não define ainda o nome público do domínio principal da Pavan. O sistema deve funcionar com qualquer domínio raiz escolhido posteriormente.
