# Handoff: Studio Flávia Prudêncio

> Pacote de entrega para um desenvolvedor (humano ou usando Claude Code) implementar este produto a partir dos protótipos de design.

---

## 1. Sobre estes arquivos

Os arquivos em `design_files/` **são protótipos em HTML/React (via Babel inline)** — protótipos de design mostrando aparência e comportamento pretendidos. **Não são código de produção a ser copiado diretamente.** Sua tarefa é **recriar estes designs no ambiente de produção escolhido** (ex.: Next.js + TypeScript + Tailwind, ou Vue 3 + Pinia, ou Remix — o que fizer mais sentido para o stack do projeto), usando os padrões e bibliotecas do codebase.

Se ainda **não existe codebase**, recomendamos:

- **Front-end**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Back-end**: API REST ou tRPC, banco PostgreSQL
- **Auth**: Auth.js (NextAuth) ou Clerk
- **Para abrir no celular**: este produto é fortemente mobile-first no Portal do Aluno — considere PWA (manifest + service worker) antes de pensar em app nativo.

---

## 2. Fidelidade

**Alta fidelidade (hi-fi).** Os mocks têm cores, tipografia, espaçamento e estados finais. O dev deve reproduzir o visual com precisão usando as bibliotecas do codebase.

---

## 3. Visão geral do produto

Studio Flávia Prudêncio é um studio de fisioterapia + pilates clínico em Belo Horizonte. O sistema tem **três faces**:

| Módulo | Quem usa | Onde mora |
|---|---|---|
| **Visão pública** (landing) | Visitantes / leads | Site público — rotas `/`, `/planos`, `/contato` |
| **Portal do aluno** | Alunos matriculados | App autenticado — rotas `/portal/*` |
| **Painel admin** | Flávia (dona) + recepção | App autenticado restrito — rotas `/admin/*` |

> ⚠️ **IMPORTANTE — não copie a barra de "Visão pública / Portal do aluno / Painel admin" do topo do protótipo!**
> Aquilo é apenas um **andaime de protótipo** (`TopBar` em `app.jsx`) para o cliente conseguir navegar entre os três módulos numa página só. **Não faz parte do produto.** No produto real:
> - Cada módulo é uma **rota separada com sua própria autenticação**.
> - O usuário não "troca de visão" — ele acessa a URL que tem permissão.
> - O switcher Mobile/Desktop também é andaime; substitua por CSS responsivo de verdade.
> - O `TweaksPanel` (canto inferior direito) também é só prototipagem; remover.

---

## 4. Arquivos do protótipo

```
design_files/
├── index.html                  ← shell HTML: fontes, CSS global, tokens, montagem React
├── app.jsx                     ← root + TopBar + TweaksPanel (ANDAIMES — remover na produção)
├── data.jsx                    ← seed data hardcoded — substituir por API/DB
├── shared.jsx                  ← componentes compartilhados (Icon, Modal, SideSheet, Toast etc.)
│
├── landing.jsx                 ← Landing page (desktop)
├── landing-mobile.jsx          ← Landing page (mobile)
│
├── portal.jsx                  ← Portal do aluno (mobile — versão primária)
├── portal-desktop.jsx          ← Portal do aluno (desktop)
│
├── admin.jsx                   ← Painel admin (desktop — versão primária)
├── admin-mobile.jsx            ← Painel admin (mobile)
│
├── tweaks-panel.jsx            ← Andaime de protótipo — IGNORAR
└── Studio Flavia Prudencio (standalone).html  ← versão bundle offline (referência)
```

Para abrir o protótipo localmente: servir a pasta `design_files/` com qualquer static server (ex.: `npx serve design_files/`).

---

## 5. Design tokens

Todos definidos em `index.html` dentro de `:root`. Reproduza-os como variáveis CSS, tema Tailwind ou tokens do design system do projeto.

### Cores

```css
/* Verdes (paleta da marca) */
--green-900: #0F3326   /* base escura, sidebar admin, CTA banner */
--green-800: #1F4A3D   /* acento primário (default), botões */
--green-700: #2C5E4A
--green-600: #3D7461
--green-500: #5C9684

/* Teals (apoio claro) */
--teal-200:  #C8E6DC
--teal-100:  #DFEEE8
--teal-50:   #EFF7F3   /* backgrounds suaves */

/* Neutros */
--ink-900: #0E1512   /* texto principal */
--ink-700: #39463F   /* texto secundário */
--ink-500: #6B7872   /* texto terciário, captions */
--ink-300: #A6AEAA
--ink-200: #D1D6D3   /* bordas inputs */
--ink-100: #E7EBE9   /* bordas cards, divisórias */
--ink-50:  #F4F6F5   /* background sutil */

--bg: #FBFCFB        /* background da página */

/* Status / feedback */
--warn:   #E0A800
--danger: #C13B3B
--info:   #3A6EA5
```

### Tipografia

- **Família primária**: `Poppins` (300, 400, 500, 600, 700) — Google Fonts
- **Família mono**: `JetBrains Mono` (400, 500) — usada em placeholders e tabular numbers
- **Smoothing**: `-webkit-font-smoothing: antialiased`
- **Letter-spacing dos headings**: `-0.02em` a `-0.03em` (mais apertado quanto maior)
- **Tabular numbers**: `.num { font-variant-numeric: tabular-nums }` — usar em valores monetários, datas, horários

### Espaçamento / radius / sombras

```css
--r-sm: 8px;   --r-md: 12px;   --r-lg: 18px;   --r-xl: 24px;

--shadow-sm: 0 1px 2px rgba(15,51,38,.04), 0 1px 3px rgba(15,51,38,.06);
--shadow-md: 0 4px 14px rgba(15,51,38,.06), 0 10px 30px rgba(15,51,38,.05);
--shadow-lg: 0 12px 40px rgba(15,51,38,.10), 0 30px 70px rgba(15,51,38,.08);
```

Escala de espaçamento usada: múltiplos de 4 (4, 8, 12, 14, 16, 18, 22, 24, 28, 32, 40, 48, 56, 64).

---

## 6. Componentes base

Implementar como componentes reutilizáveis no design system do app:

| Componente | Definido em | Notas |
|---|---|---|
| `Icon` | `shared.jsx` | Set de ~40 line icons inline SVG. Use lucide-react ou Heroicons no app real. |
| `StudioLogo` | `shared.jsx` | Marca circular "FP" + nome. Pode virar SVG estático. |
| `Modal` | `shared.jsx` | Overlay com backdrop blur, anima popIn, fecha com Esc + clique fora |
| `SideSheet` | `shared.jsx` | Drawer lateral direito; vira bottom sheet no mobile (CSS no `index.html`) |
| `IOSStatusBar` | `shared.jsx` | **Andaime do protótipo** — só pro frame de iPhone. Não usar. |
| `useToast` | `shared.jsx` | Hook simples; toast aparece 2.4s no bottom |
| `DropZone` | `shared.jsx` | Upload de arquivo drag-and-drop (anamnese, atestados) |
| `StatusPill` | `shared.jsx` | Chip colorido para status (`em-dia` / `pendente` / `inativo` / `pago` / `baixado`) |
| `formatBRL` | `shared.jsx` | Formatador `R$ 1.234,56` |

### Botões (`.btn`)

- `.btn` — base: pill-shaped (border-radius 999), 12px/20px padding, font-weight 500, transição em 120ms
- `.btn-primary` — fundo `--green-800`, texto branco, shadow
- `.btn-ghost` — borda sutil, texto verde
- `.btn-soft` — fundo `--teal-100`, texto `--green-800`
- `.btn-danger` — branco com borda + texto `--danger`
- `.btn-sm` — variante compacta (8px/14px padding)

### Inputs (`.field`)

- Container vertical com `<label>` (12px / weight 500 / `--ink-700`), input, e `.hint` ou `.err`
- Input: borda `--ink-200`, radius 10px, padding 12/14, foco com borda verde + ring `rgba(92,150,132,.18)`
- Erro: borda `--danger`, mensagem 11.5px abaixo

### Chips (`.chip`)

- Pill 4px/10px padding, 11.5px / weight 500
- Variantes: `.chip-teal` / `.chip-green` / `.chip-warn` / `.chip-danger` / `.chip-info`
- Opcional `.chip-dot` (6px círculo)

### Cards (`.card`)

- Background `#fff`, borda `--ink-100`, radius `--r-lg` (18px), shadow-sm

---

## 7. Módulo 1 — Visão pública (landing)

**Rota**: `/` (+ âncoras `#planos`, `#metodo`, `#contato`)
**Acesso**: público
**Arquivos de referência**: `landing.jsx` (desktop), `landing-mobile.jsx` (mobile)

### Seções (de cima pra baixo)

1. **Nav fixo** — logo à esquerda, links (Planos / Método / Contato) + CTA "Agende sua avaliação" à direita. No mobile, vira hamburger.
2. **Hero** — h1 grande (~64px desktop / ~40px mobile) com palavra em itálico decorativa, parágrafo, dois botões (CTA primário + "Ver planos"), 3 stats abaixo (12 anos / 320+ alunos / 4 por horário). À direita, foto vertical (aspecto 4/5) com dois cards sobrepostos (badge "Próxima turma" + chip "Atendimento individualizado").
3. **Pilares (`#metodo`)** — fundo `--teal-50`, eyebrow + h2 + grid de 3 cards (Avaliação corporal / Turmas pequenas / Progressão guiada), cada um com ícone em quadrado teal.
4. **Pricing (`#planos`)** — grid de 4 cards: Mensal / Trimestral / Semestral / Fisioterapia (destacado em verde escuro com pill "Destaque"). Cada card lista 1x/2x/3x semana com preços.
5. **CTA banner** — bloco verde escuro arredondado, "Comece com uma avaliação corporal sem custo", + 3 etapas (Avaliação postural / Anamnese / Plano sugerido).
6. **Footer (`#contato`)** — logo + endereço + contato + horários, 4 colunas no desktop, empilhado no mobile.

### Modal de cadastro

Disparado por qualquer CTA. Dois passos:

1. **Form** — Nome completo / E-mail / Endereço / CEP / CPF / Telefone 1 / Telefone 2 (opcional). Máscaras: CEP `00000-000`, CPF `000.000.000-00`, telefone `(00) 00000-0000`. Validação inline com mensagem de erro abaixo do campo.
2. **Sucesso** — ícone de envelope, mock de preview do e-mail enviado com link "Criar minha senha", botões "Acessar sua área" / "Voltar para a página".

### Dados consumidos
- `PRICING` (em `data.jsx`) — para os cards de planos

---

## 8. Módulo 2 — Portal do aluno

**Rota**: `/portal/*`
**Acesso**: aluno autenticado (login + senha — criados via link do e-mail de boas-vindas)
**Arquivos de referência**: `portal.jsx` (mobile — **versão primária**), `portal-desktop.jsx` (desktop)

> O portal é **mobile-first**. Desktop é uma adaptação. Em produção é PWA recomendado.

### Telas

| Tela | Rota sugerida | Propósito |
|---|---|---|
| **Anamnese** | `/portal/anamnese` | Wizard obrigatório no 1º acesso — escala de dor, histórico, queixas, upload de exames. Não pode ser pulada. |
| **Dashboard / Home** | `/portal/` | Próxima aula, contadores (faltas / reposições), CTAs primários (Cancelar / Repor / Ver plano), atalho WhatsApp |
| **Reposição** | `/portal/reposicao` | Lista de slots disponíveis (`REPOSICAO_SLOTS`), aluno escolhe um. Confirma e decrementa saldo. |
| **Minhas aulas** | `/portal/aulas` | Calendário/lista das próximas aulas fixas + reposições agendadas |
| **Meu plano** | `/portal/plano` | Detalhes do plano vigente, histórico de pagamentos (`PAGAMENTOS`), botão "Alterar plano" |
| **Perfil** | `/portal/perfil` | Dados pessoais, reabrir anamnese, baixar termo de compromisso, logout |

### Componentes específicos
- `BottomNav` — nav inferior com 4 abas (Home / Aulas / Plano / Perfil). Fixa, com ícone ativo destacado.
- `CancelModal` — lógica condicional: se `minutesUntilClass < 60`, exige justificativa e conta como falta; senão libera reposição.
- `WhatsAppConfirmModal` — confirma antes de abrir `https://wa.me/5531998124421?text=...`
- `AlterarPlanoModal` — escolhe novo plano, envia solicitação (não troca direto — passa por aprovação da Flávia)

### Regras de negócio
- Aluno só vê o portal completo após completar anamnese.
- Saldo de reposições é controlado pelo backend (decrementa ao agendar, incrementa ao cancelar com antecedência).
- Cancelamento com < 60min antes da aula = falta computada.
- Limites de faltas/reposições por plano (a definir com a cliente).

---

## 9. Módulo 3 — Painel admin

**Rota**: `/admin/*`
**Acesso**: autenticado, com perfil (`recepcionista` ou `dona`)
**Arquivos de referência**: `admin.jsx` (desktop — **versão primária**), `admin-mobile.jsx` (mobile)

### Perfis e permissões (RBAC)

Definido em `PERMISSIONS` (`admin.jsx` linha 6):

```js
recepcionista: ["grade", "alunos", "recebimentos"]
dona:          ["grade", "alunos", "recebimentos", "caixa", "relatorios", "funcionarios"]
```

A recepcionista vê as áreas restritas no menu mas com ícone de cadeado; ao clicar, abre `LockedModal` explicando que é exclusivo da dona.

> ⚠️ O **switcher "Visualizar como (demo)"** no rodapé da sidebar é **andaime de protótipo** para a cliente conseguir testar os dois perfis. Em produção, o perfil vem do JWT/sessão e não pode ser trocado pela UI.

### Layout
- **Sidebar fixa esquerda** (252px, fundo `--green-900`) com:
  - Logo no topo
  - Seção "Operação" (sempre visível): Grade / Alunos / Recebimentos
  - Seção "Gestão" (só dona): Caixa & Despesas / Relatórios / Funcionários
  - Card do usuário logado no rodapé + (no protótipo) o switcher demo
- **Área principal** com padding 84px/32px

### Páginas

| Página | Rota | Conteúdo |
|---|---|---|
| **Grade diária** | `/admin/grade` | Visualização da agenda do dia. 4 slots por hora, navegação ontem/hoje/amanhã. Três variantes visuais expostas pelo tweak `gradeVariant` (`stacked` / `compact` / `kanban`) — escolha uma. |
| **Alunos** | `/admin/alunos` | Tabela de alunos (`STUDENTS`) com busca, filtros (situação), drawer lateral com detalhes/edição |
| **Recebimentos** | `/admin/recebimentos` | Entradas a receber (`FINANCEIRO_ENTRADAS`), botões para dar baixa, gerar cobrança, marcar PIX/Cartão/Dinheiro |
| **Caixa & Despesas** | `/admin/caixa` | (só dona) Saídas (`FINANCEIRO_SAIDAS`), categorias, saldo do mês |
| **Relatórios** | `/admin/relatorios` | (só dona) Gráficos: horários de pico, alunos que pararam, aulas dadas, faturamento, retenção, inadimplência (dados em `RELATORIOS` + `GERENCIAIS`) |
| **Funcionários** | `/admin/funcionarios` | (só dona) Não implementado no protótipo — apenas toast placeholder |

### Componentes específicos
- `AdminSidebar` — sidebar verde escura com `SidebarSection` + `SidebarItem` (suporta badge "Hoje" e ícone de cadeado)
- `LockedModal` — modal de "acesso restrito"
- Grade diária — três variantes a escolher com o cliente (recomendamos validar com a Flávia antes de fixar uma)

---

## 10. Estados de interação

- **Hover botões**: `translateY(-1px)` + escurece tom (primary) ou tinta teal-50 (ghost)
- **Foco inputs**: borda verde + ring `0 0 0 4px rgba(92,150,132,.18)`
- **Modais**: animação `popIn` 220ms cubic-bezier(.2,.8,.2,1), backdrop com `blur(2px)`
- **Side sheet**: slide-in da direita 250ms; **bottom sheet** no mobile (slide de baixo)
- **Toast**: aparece com `popIn`, desaparece após 2.4s
- **Loading**: classe `.skel` (shimmer 1.4s linear infinite)

---

## 11. Dados (seed → backend)

`data.jsx` contém **todos os dados de exemplo hardcoded** que devem ser substituídos por chamadas reais à API. Use-os como guia para o **shape do modelo de dados**:

- `STUDENTS` — modelo de aluno (nome, plano, situação, faltas, reposições, próxima aula, vigência, telefone, CPF, endereço)
- `SCHEDULE_DATA` — grade do dia, slots por hora, tipo (`fixo` / `repondo` / `fisio` / `block` / `free`)
- `REPOSICAO_SLOTS` — slots disponíveis para reposição (dia, data, hora, vagas restantes)
- `PRICING` — planos e valores (mensal/tri/semestral/fisio)
- `PAGAMENTOS` — histórico de pagamentos do aluno
- `FINANCEIRO_ENTRADAS` / `FINANCEIRO_SAIDAS` — movimentação de caixa
- `RELATORIOS` — séries para os gráficos operacionais
- `GERENCIAIS` — séries para os gráficos da dona (faturamento, retenção, inadimplência)

### Entidades de domínio sugeridas

```
Aluno          (id, nome, cpf, email, telefone1, telefone2, endereco, cep)
Plano          (id, tipo, frequencia, valor, fidelidade)
Matricula      (alunoId, planoId, dataInicio, dataFim, situacao)
Aula           (id, dataHora, alunoId?, tipo: fixo|reposicao|fisio|bloco)
Anamnese       (alunoId, json, dataPreenchimento, arquivos[])
Pagamento      (id, alunoId, valor, mes, status, forma, dataPagamento)
Despesa        (id, valor, categoria, descricao, data)
Usuario        (id, perfil: aluno|recepcionista|dona, email, senhaHash)
```

---

## 12. Assets externos

- **Fontes**: Poppins + JetBrains Mono (Google Fonts) — no produto real, considere self-host para LGPD/performance.
- **Foto do hero da landing**: gerada via Pollinations no protótipo. **Trocar por foto real do studio** antes de ir pra produção.
- **Logo "FP"**: marca placeholder construída com CSS. Pedir o logo definitivo à cliente.
- **Ícones**: SVG inline em `shared.jsx`. Recomendamos `lucide-react` no app real.

---

## 13. Integrações esperadas

- **WhatsApp Business API** — botão "Falar no WhatsApp" abre `wa.me/5531998124421`. O número precisa virar config.
- **E-mail transacional** — envio de link "Criar senha" após cadastro. SendGrid / Resend / Postmark.
- **Pagamentos** (a confirmar com cliente) — PIX direto via banco, ou gateway (Asaas, Pagar.me, Stripe).
- **Calendário/lembrete** — push (PWA) ou WhatsApp para lembrar de aula 1h antes.

---

## 14. O que **não** levar pro produto

Resumindo os andaimes de protótipo que devem ficar de fora:

- ❌ `TopBar` em `app.jsx` (módulo switcher no topo)
- ❌ Switcher Mobile/Desktop ao lado do TopBar
- ❌ `TweaksPanel` (canto inferior direito)
- ❌ Switcher "Visualizar como" no rodapé da sidebar admin (`recepcionista` ↔ `dona`)
- ❌ Botões "Simular 1º acesso (Anamnese)" / "Reabrir anamnese" no portal
- ❌ Frame de iPhone (`.phone` / `.phone-screen`) — é só pra mostrar o mobile no protótipo desktop
- ❌ Pasta inteira `tweaks-panel.jsx`
- ❌ Imagem do hero via Pollinations — trocar por foto real
- ❌ Dados hardcoded em `data.jsx` — substituir por API

---

## 15. Sugestão de roadmap de implementação

1. **Setup base** — Next.js + Tailwind + Auth.js + Prisma + PostgreSQL. Configurar tokens de design no Tailwind config.
2. **Componentes base** — Button, Input, Modal, Sheet, Toast, StatusPill, Card. Importar Poppins/JetBrains Mono.
3. **Landing pública** — estática, sem auth. Modal de cadastro grava lead no banco e envia e-mail.
4. **Auth** — login para aluno e admin (mesma tela ou separadas), middleware de rotas, perfis no JWT.
5. **Portal do aluno (MVP)** — Anamnese → Dashboard → Reposição → Plano. Mobile-first.
6. **Admin operação** — Grade, Alunos, Recebimentos. Já com RBAC funcionando.
7. **Admin gestão (dona)** — Caixa, Relatórios.
8. **PWA** — manifest + service worker, ícones, splash.
9. **Integrações** — WhatsApp, pagamentos, lembretes.

---

## 16. Contato com a designer / produto

Em caso de dúvida de comportamento que o protótipo não cubra:

1. Abra o standalone `Studio Flavia Prudencio (standalone).html` no browser — ele tem tudo embutido e funciona offline.
2. Cada caminho clicável do protótipo está coberto (cancelamento de aula com e sem antecedência, anamnese, mudança de plano, fluxo de cadastro do lead etc.) — explore antes de perguntar.
3. Quando perguntar, cite a tela + a ação (ex.: "Portal > Reposição > clique em slot com 0 vagas — qual o comportamento?").

Boa implementação!
