// data.jsx — seed data for Studio Flávia Prudêncio
// Realistic Brazilian names and schedules

const STUDENTS = [
  { id: 1, nome: "Ana Beatriz Carvalho",  plano: "Mensal 2x",      situacao: "em-dia",   faltas: 1, reposicoes: 2, prox: "Qui, 28/05 • 09h", inicio: "12/02/2026", fim: "12/06/2026", tel: "(31) 99812-4421", cpf: "082.451.330-08", endereco: "Rua das Acácias 142, Jardim Canadá" },
  { id: 2, nome: "Bruno Henrique Lopes",  plano: "Trimestral 3x",  situacao: "em-dia",   faltas: 0, reposicoes: 0, prox: "Hoje • 16h",       inicio: "01/03/2026", fim: "01/06/2026", tel: "(31) 98170-3322", cpf: "554.122.881-09", endereco: "Av. Brasil 902, Centro" },
  { id: 3, nome: "Camila Vasconcelos",    plano: "Semestral 2x",   situacao: "em-dia",   faltas: 2, reposicoes: 1, prox: "Sex, 29/05 • 17h", inicio: "20/11/2025", fim: "20/05/2026", tel: "(31) 99554-1180", cpf: "121.660.554-22", endereco: "Rua Tuiuti 88, Centro" },
  { id: 4, nome: "Daniel Moreira Costa",  plano: "Mensal 3x",      situacao: "pendente", faltas: 3, reposicoes: 2, prox: "Sáb, 30/05 • 08h", inicio: "01/05/2026", fim: "01/06/2026", tel: "(31) 98221-7733", cpf: "224.018.776-31", endereco: "Rua Padre Eustáquio 410" },
  { id: 5, nome: "Eduarda Pinheiro",      plano: "Mensal 1x",      situacao: "em-dia",   faltas: 0, reposicoes: 1, prox: "Seg, 01/06 • 19h", inicio: "10/04/2026", fim: "10/06/2026", tel: "(31) 99988-1100", cpf: "335.221.998-44", endereco: "Rua Sapucaí 56, Floresta" },
  { id: 6, nome: "Felipe Andrade Souza",  plano: "Fisioterapia",   situacao: "em-dia",   faltas: 0, reposicoes: 0, prox: "Qua, 27/05 • 15h", inicio: "—",          fim: "—",            tel: "(31) 98101-2200", cpf: "447.991.331-66", endereco: "Av. Afonso Pena 1200" },
  { id: 7, nome: "Gabriela Rezende Lima", plano: "Trimestral 2x",  situacao: "em-dia",   faltas: 1, reposicoes: 0, prox: "Ter, 26/05 • 10h", inicio: "10/03/2026", fim: "10/06/2026", tel: "(31) 99772-6601", cpf: "550.881.226-72", endereco: "Rua Levindo Lopes 78" },
  { id: 8, nome: "Henrique Tavares",      plano: "Mensal 2x",      situacao: "pendente", faltas: 2, reposicoes: 1, prox: "Qui, 28/05 • 18h", inicio: "01/05/2026", fim: "01/06/2026", tel: "(31) 99003-4422", cpf: "660.443.118-83", endereco: "Rua Pernambuco 1500" },
  { id: 9, nome: "Isabela Marques",       plano: "Semestral 3x",   situacao: "em-dia",   faltas: 0, reposicoes: 3, prox: "Sex, 29/05 • 09h", inicio: "01/01/2026", fim: "01/07/2026", tel: "(31) 98612-7710", cpf: "771.226.554-90", endereco: "Rua Antônio de Albuquerque 320" },
  { id:10, nome: "João Pedro Almeida",    plano: "Mensal 3x",      situacao: "em-dia",   faltas: 1, reposicoes: 0, prox: "Seg, 01/06 • 07h", inicio: "15/04/2026", fim: "15/06/2026", tel: "(31) 99445-1102", cpf: "882.337.665-11", endereco: "Rua Pium-í 500" },
  { id:11, nome: "Larissa Bittencourt",   plano: "Trimestral 1x",  situacao: "em-dia",   faltas: 0, reposicoes: 0, prox: "Qua, 27/05 • 20h", inicio: "10/03/2026", fim: "10/06/2026", tel: "(31) 99001-5577", cpf: "993.448.776-22", endereco: "Rua Curitiba 2200" },
  { id:12, nome: "Marcelo Pacheco",       plano: "Inativo",        situacao: "inativo",  faltas: 0, reposicoes: 0, prox: "—",                 inicio: "—",          fim: "12/03/2026", tel: "(31) 98007-3311", cpf: "001.557.886-33", endereco: "Rua Bahia 980" },
];

// Schedule blocks - admin grade diária
const SCHEDULE_HOURS = ["07","08","09","10","11","15","16","17","18","19","20","21"];
// 4 slots per hour, each is { type: 'free'|'fixo'|'repondo'|'block', name?, plano? }
const SCHEDULE_DATA = {
  "07": [
    { type: "fixo",     name: "João Pedro A.",    plano: "Mensal 3x" },
    { type: "fixo",     name: "Isabela Marques",  plano: "Semestral 3x" },
    { type: "free" },
    { type: "free" },
  ],
  "08": [
    { type: "fixo",     name: "Daniel M. Costa",  plano: "Mensal 3x" },
    { type: "fixo",     name: "Ana Beatriz C.",   plano: "Mensal 2x" },
    { type: "fixo",     name: "Larissa B.",       plano: "Trimestral 1x" },
    { type: "repondo",  name: "Bruno H. Lopes",   plano: "Reposição" },
  ],
  "09": [
    { type: "fixo",     name: "Gabriela R.",      plano: "Trimestral 2x" },
    { type: "fixo",     name: "Ana Beatriz C.",   plano: "Mensal 2x" },
    { type: "repondo",  name: "Eduarda P.",       plano: "Reposição" },
    { type: "free" },
  ],
  "10": [
    { type: "fixo",     name: "Gabriela R.",      plano: "Trimestral 2x" },
    { type: "fixo",     name: "Isabela Marques",  plano: "Semestral 3x" },
    { type: "fixo",     name: "Camila V.",        plano: "Semestral 2x" },
    { type: "fixo",     name: "Henrique T.",      plano: "Mensal 2x" },
  ],
  "11": [
    { type: "fixo",     name: "João Pedro A.",    plano: "Mensal 3x" },
    { type: "free" },
    { type: "free" },
    { type: "free" },
  ],
  "15": [
    { type: "fisio",    name: "Felipe Andrade",   plano: "Fisioterapia" },
    { type: "block",    name: "Almoço encerrado" },
    { type: "block",    name: "Almoço encerrado" },
    { type: "block",    name: "Almoço encerrado" },
  ],
  "16": [
    { type: "fixo",     name: "Bruno H. Lopes",   plano: "Trimestral 3x" },
    { type: "fixo",     name: "Daniel M. Costa",  plano: "Mensal 3x" },
    { type: "fixo",     name: "Camila V.",        plano: "Semestral 2x" },
    { type: "free" },
  ],
  "17": [
    { type: "fixo",     name: "Camila V.",        plano: "Semestral 2x" },
    { type: "fixo",     name: "Gabriela R.",      plano: "Trimestral 2x" },
    { type: "fixo",     name: "Larissa B.",       plano: "Trimestral 1x" },
    { type: "repondo",  name: "Ana Beatriz C.",   plano: "Reposição" },
  ],
  "18": [
    { type: "fixo",     name: "Henrique T.",      plano: "Mensal 2x" },
    { type: "fixo",     name: "Daniel M. Costa",  plano: "Mensal 3x" },
    { type: "fixo",     name: "Bruno H. Lopes",   plano: "Trimestral 3x" },
    { type: "fixo",     name: "João Pedro A.",    plano: "Mensal 3x" },
  ],
  "19": [
    { type: "fixo",     name: "Eduarda P.",       plano: "Mensal 1x" },
    { type: "fixo",     name: "Isabela Marques",  plano: "Semestral 3x" },
    { type: "fixo",     name: "Henrique T.",      plano: "Mensal 2x" },
    { type: "free" },
  ],
  "20": [
    { type: "fixo",     name: "Larissa B.",       plano: "Trimestral 1x" },
    { type: "fixo",     name: "Daniel M. Costa",  plano: "Mensal 3x" },
    { type: "repondo",  name: "Camila V.",        plano: "Reposição" },
    { type: "free" },
  ],
  "21": [
    { type: "fixo",     name: "Bruno H. Lopes",   plano: "Trimestral 3x" },
    { type: "free" },
    { type: "free" },
    { type: "free" },
  ],
};

// Available reposição slots (what the Aluno sees)
const REPOSICAO_SLOTS = [
  { id: "r1", dia: "Quarta",  data: "27/05", hora: "11h", vagas: 3 },
  { id: "r2", dia: "Quarta",  data: "27/05", hora: "16h", vagas: 1 },
  { id: "r3", dia: "Quinta",  data: "28/05", hora: "07h", vagas: 2 },
  { id: "r4", dia: "Quinta",  data: "28/05", hora: "19h", vagas: 1 },
  { id: "r5", dia: "Sexta",   data: "29/05", hora: "10h", vagas: 1 },
  { id: "r6", dia: "Sexta",   data: "29/05", hora: "20h", vagas: 2 },
  { id: "r7", dia: "Sábado",  data: "30/05", hora: "08h", vagas: 4 },
  { id: "r8", dia: "Sábado",  data: "30/05", hora: "09h", vagas: 2 },
];

const PRICING = [
  { id: "mensal",     titulo: "Mensal",     subtitle: "Sem fidelidade",       valores: [["1x semana","150"],["2x semana","220"],["3x semana","270"]] },
  { id: "tri",        titulo: "Trimestral", subtitle: "Pagamento 3 meses",    valores: [["1x semana","130"],["2x semana","195"],["3x semana","230"]] },
  { id: "sem",        titulo: "Semestral",  subtitle: "Pagamento 6 meses",    valores: [["1x semana","120"],["2x semana","180"],["3x semana","220"]] },
  { id: "fisio",      titulo: "Fisioterapia", subtitle: "Sessão individual", destaque: true, valores: [["Por sessão","90"]] },
];

const PAGAMENTOS = [
  { mes: "Maio/2026",     valor: "R$ 220,00", status: "pago",      data: "05/05/2026", forma: "PIX" },
  { mes: "Abril/2026",    valor: "R$ 220,00", status: "pago",      data: "05/04/2026", forma: "PIX" },
  { mes: "Março/2026",    valor: "R$ 220,00", status: "pago",      data: "07/03/2026", forma: "Cartão" },
  { mes: "Fevereiro/2026",valor: "R$ 220,00", status: "pago",      data: "05/02/2026", forma: "PIX" },
];

const FINANCEIRO_ENTRADAS = [
  { id:1, data: "20/05/2026", aluno: "Ana Beatriz Carvalho", desc: "Mensalidade Maio",      valor: 220, forma: "PIX",    status: "baixado" },
  { id:2, data: "19/05/2026", aluno: "Bruno Henrique Lopes", desc: "Trimestral (3/3)",       valor: 690, forma: "Cartão", status: "baixado" },
  { id:3, data: "18/05/2026", aluno: "Camila Vasconcelos",   desc: "Semestral",              valor: 1080,forma: "PIX",    status: "baixado" },
  { id:4, data: "—",          aluno: "Daniel Moreira Costa", desc: "Mensalidade Maio",       valor: 270, forma: "—",      status: "pendente" },
  { id:5, data: "—",          aluno: "Henrique Tavares",     desc: "Mensalidade Maio",       valor: 220, forma: "—",      status: "pendente" },
  { id:6, data: "15/05/2026", aluno: "Felipe Andrade",       desc: "Sessão fisioterapia",    valor: 90,  forma: "Dinheiro",status: "baixado" },
];

const FINANCEIRO_SAIDAS = [
  { id:1, data: "20/05/2026", desc: "Aluguel — Maio",        valor: 2800, categoria: "Aluguel" },
  { id:2, data: "12/05/2026", desc: "Conta de luz",          valor: 380,  categoria: "Utilidades" },
  { id:3, data: "10/05/2026", desc: "Material limpeza",      valor: 145,  categoria: "Materiais" },
  { id:4, data: "08/05/2026", desc: "Manutenção aparelho",   valor: 220,  categoria: "Manutenção" },
];

const RELATORIOS = {
  horariosPico: [
    { h:"07h",  qtd:4 }, { h:"08h", qtd:18 }, { h:"09h", qtd:14 }, { h:"10h", qtd:22 },
    { h:"11h",  qtd:6 }, { h:"15h", qtd:2  }, { h:"16h", qtd:16 }, { h:"17h", qtd:21 },
    { h:"18h",  qtd:24}, { h:"19h", qtd:23 }, { h:"20h", qtd:19 }, { h:"21h", qtd:10 },
  ],
  pararam: [
    { mes:"Jan", qtd:2 }, { mes:"Fev", qtd:1 }, { mes:"Mar", qtd:3 },
    { mes:"Abr", qtd:2 }, { mes:"Mai", qtd:4 },
  ],
  aulasDadas: [
    { mes:"Jan", qtd:248 }, { mes:"Fev", qtd:262 }, { mes:"Mar", qtd:281 },
    { mes:"Abr", qtd:270 }, { mes:"Mai", qtd:294 },
  ],
};

// Management / Dona-only charts
const GERENCIAIS = {
  faturamento: [
    { mes:"Dez", entrada: 13800, saida: 6800 },
    { mes:"Jan", entrada: 15200, saida: 7100 },
    { mes:"Fev", entrada: 14800, saida: 6500 },
    { mes:"Mar", entrada: 17400, saida: 7300 },
    { mes:"Abr", entrada: 18100, saida: 6900 },
    { mes:"Mai", entrada: 19250, saida: 7400 },
  ],
  retencao: [
    // % de alunos que renovaram após término do plano
    { mes:"Dez", pct: 78 }, { mes:"Jan", pct: 82 }, { mes:"Fev", pct: 79 },
    { mes:"Mar", pct: 85 }, { mes:"Abr", pct: 88 }, { mes:"Mai", pct: 86 },
  ],
  inadimplencia: [
    // valor pendente no mês
    { mes:"Dez", valor: 540 },  { mes:"Jan", valor: 690 },
    { mes:"Fev", valor: 420 },  { mes:"Mar", valor: 380 },
    { mes:"Abr", valor: 760 },  { mes:"Mai", valor: 490 },
  ],
};

window.STUDIO_DATA = {
  STUDENTS, SCHEDULE_HOURS, SCHEDULE_DATA, REPOSICAO_SLOTS,
  PRICING, PAGAMENTOS, FINANCEIRO_ENTRADAS, FINANCEIRO_SAIDAS, RELATORIOS, GERENCIAIS,
};
