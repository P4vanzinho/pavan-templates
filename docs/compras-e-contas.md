# Compras e contas externas — Pavan Sites

O que precisa ser comprado ou criado fora do código, quando e quanto custa. Preços conferidos em outubro de 2026; serviços em dólar cobram no cartão internacional. Confirme o valor na página oficial antes de assinar.

## Resumo

| Item | Para quê | Quando precisa | Custo | Situação |
|---|---|---|---|---|
| Domínio da Pavan | Endereço da marca, subdomínios de preview dos clientes, envio de e-mails | Fase 7 (e-mail) e fase 11 (deploy) | R$ 40/ano (.com.br) | **Comprar** |
| Cloudflare | Hospedagem do site, DNS, SSL e domínios dos clientes | Conta grátis já; plano pago na fase 11 | Grátis para começar; US$ 5/mês no deploy | Criar conta |
| Sanity | Conteúdo e painel de edição | Já em uso | Grátis por projeto | ✅ Feito (`2dpfd2es`) |
| Resend | Envio dos e-mails de contato e pedido | Fase 7 | Grátis até 3.000 e-mails/mês | Criar conta |
| Cloudflare Turnstile | Anti-bot dos formulários | Fase 7 | Grátis | Vem com a conta Cloudflare |
| GitHub | Código e testes automáticos | Já em uso | Grátis | ✅ Feito (`P4vanzinho/pavan-templates`) |

**Custo para começar:** cerca de R$ 40 por ano, mais US$ 5 por mês a partir do deploy.

---

## 1. Domínio da Pavan — comprar

O endereço principal da marca, por exemplo `pavan.com.br`. Ele também é usado para:

- **Prévia dos clientes:** cada site ganha um subdomínio, como `cliente.pavan.com.br`, antes de ter domínio próprio.
- **E-mails:** os formulários enviam a partir de algo como `sites@pavan.com.br`, com resposta indo direto para o cliente.

**Onde comprar:** [registro.br](https://registro.br), o órgão oficial do .br. Custa R$ 40 por ano, e a renovação mantém o preço. Exige CPF ou CNPJ. Revendedores costumam cobrar barato no primeiro ano e mais caro na renovação, então prefira o registro.br.

**Depois de comprar:** no painel do registro.br, troque os "servidores DNS" para os da Cloudflare. Eu explico o passo a passo quando chegar a hora; enquanto isso, só compre.

**Dica:** confira antes se o nome escolhido também está livre como `.com` e como perfil no Instagram.

## 2. Cloudflare — criar conta agora, pagar só no deploy

Onde o site vai ficar publicado. Também cuida do DNS, do certificado SSL (cadeado) e da ligação dos domínios dos clientes.

- **Agora:** crie uma conta grátis em [cloudflare.com](https://dash.cloudflare.com/sign-up). Nada mais por enquanto.
- **Fase 11 (deploy):** assinar o **Workers Paid**, de US$ 5 por mês por conta. Não cobra banda nem tráfego de saída.
- **Domínios dos clientes:** usam o recurso *Cloudflare for SaaS*. Um número inicial de domínios costuma estar incluído e os seguintes têm um custo mensal pequeno por domínio. **A confirmar no painel antes da fase 11.**

## 3. Sanity — já está feito

O projeto `2dpfd2es` é o da Pavan, usado nas demonstrações.

- O plano **Free** atende: até 20 pessoas no painel, 10 mil documentos e datasets públicos. Ao atingir um limite, ele bloqueia em vez de cobrar.
- **Cada cliente real terá um projeto Sanity próprio** (fase 8), também no plano Free. É isso que impede um cliente de ver o conteúdo de outro.
- O plano **Growth** custa US$ 15 por editor por mês. Só passa a valer se um cliente precisar de dataset privado ou de mais documentos, e esse custo pode ser repassado a ele.

## 4. Resend — criar conta na fase 7

Serviço que envia os e-mails dos formulários: contato do Lume e pedido do CaraMelo.

- **Grátis:** 3.000 e-mails por mês, com limite de 100 por dia. Suficiente para os primeiros clientes.
- **Pro:** US$ 20 por mês para 50 mil e-mails, sem limite diário.
- **Precisa do domínio da Pavan** (item 1): o Resend pede alguns registros de DNS para provar que o domínio é seu. Por isso o domínio vem antes.

**Decidido por enquanto:** todos os e-mails saem do domínio da Pavan, com "responder para" apontando para o cliente. Enviar pelo domínio de cada cliente fica para depois.

## 5. Cloudflare Turnstile — grátis

É o "não sou um robô" invisível dos formulários, criado dentro da mesma conta Cloudflare na fase 7. Não tem custo.

## 6. Opcional: e-mail profissional da Pavan

Para ter `contato@pavan.com.br` sem pagar caixa de e-mail, o **Cloudflare Email Routing** (grátis) encaminha as mensagens para o seu Gmail. Uma caixa própria, como Google Workspace ou Zoho, é paga e só faz sentido mais tarde.

---

## O que é do cliente, não da Pavan

- **Domínio próprio do cliente:** o cliente compra e renova no nome dele, no registro.br, por R$ 40 por ano. A Pavan só pede que ele aponte o DNS para o site.
- **Contas do cliente:** nenhuma. Ele só recebe convite para editar o próprio site no Sanity.

## Ordem sugerida

1. **Agora:** criar a conta Cloudflare (grátis) e escolher o nome do domínio.
2. **Antes da fase 7:** comprar o domínio e criar a conta Resend.
3. **Na fase 11:** assinar o Workers Paid e confirmar o custo dos domínios de clientes.
