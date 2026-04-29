# Explicação Técnica — Pipeline Python → Dashboard

> Analista: Rónison | Desafio MIS — Beedoo | Fev/2025

---

## Módulo 0 — Glossário: O que significa cada termo da vaga e dos dados

> Estes são os termos que aparecem na descrição da vaga de Analista de MIS e na planilha Beedoo Indicadores. Entender cada um é o pré-requisito para trabalhar com dados de call center.

---

### Termos da Operação de Cobrança

| Sigla / Termo | Nome completo | O que significa na prática |
|---|---|---|
| **CPC** | Contato Produtivo Confirmado | Ligação em que o operador falou efetivamente com a pessoa certa (o devedor). Não conta tentativa sem resposta. |
| **Boleto Convertido** | — | Boleto gerado a partir de uma negociação bem-sucedida. O cliente aceitou pagar. |
| **Boleto Enviado** | — | Boleto efetivamente enviado ao cliente (e-mail, SMS, WhatsApp). |
| **Boleto Pago** | — | Boleto que o cliente pagou de fato. É o resultado final da cadeia de cobrança. |
| **Eficiência** | Taxa de Eficiência de Cobrança | `Boleto Pago / Boleto Enviado`. Quantos dos boletos enviados foram pagos. Quanto maior, melhor. |
| **ICM** | Índice Composto de Métricas | Índice criado pela Beedoo que combina produtividade e qualidade num único número. É o "placar geral" do operador. |
| **Média de Qualidade** | — | Nota de qualidade do atendimento, escala 0 a 1. Avalia script, cordialidade e postura. Vem de monitoria (escuta de ligações). |
| **Dias Úteis** | — | Quantidade de dias úteis no mês. Base para calcular absenteísmo. |
| **Dias Não Trabalhados** | Absenteísmo | Dias de ausência: faltas, atestados, suspensões. |
| **CI** | Colaborador Interno | Nome genérico para o funcionário/operador no sistema de RH. |

---

### Termos da Operação de Atendimento

| Sigla / Termo | Nome completo | O que significa na prática |
|---|---|---|
| **TMA** | Tempo Médio de Atendimento | Tempo médio por ligação do início ao fim (fala + pós-atendimento). Formato `HH:MM:SS`. Meta típica: 6–8 min. |
| **TME** | Tempo Médio de Espera | Tempo que o cliente aguarda na fila antes de ser atendido. Não está nesta planilha, mas é KPI padrão de call center. Meta: abaixo de 30s. |
| **TTO** | Tempo Total Operacional | Soma de todo o tempo produtivo do operador no dia. Usado para calcular ocupação. |
| **NPS** | Net Promoter Score | "De 0 a 10, quanto indicaria nossa empresa?" — Promotores (9–10), Neutros (7–8), Detratores (0–6). NPS líquido = Promotores − Detratores. |
| **CSAT** | Customer Satisfaction Score | Nota de satisfação com o atendimento. Escala 0–5 aqui. Mede se o cliente ficou satisfeito com aquela interação. |
| **DSAT** | Customer Dissatisfaction Score | Proporção de clientes insatisfeitos. `Respostas Detratoras / Total de Respostas`. |
| **FCR** | First Call Resolution | Resolução no Primeiro Contato. O problema foi resolvido sem o cliente precisar ligar de novo. `Respostas Positivas / Total`. Meta: acima de 75%. |
| **Rechamada** | Taxa de Rechamada | Clientes que voltaram a ligar sobre o mesmo assunto. FCR invertido — problema não resolvido na primeira vez. |
| **Transferência** | Taxa de Transferência | % de atendimentos transferidos para outra área. Alto índice pode indicar falta de capacitação do operador. |
| **Vol. Atendimento** | Volume de Atendimento | Quantidade total de ligações realizadas pelo operador no período. |
| **Vendas Efetivadas** | Indicador de Vendas | Produtos/serviços vendidos durante os atendimentos. Métrica de cross-sell/upsell. |
| **Reclamações Procedentes** | — | Reclamações de clientes consideradas válidas após análise. Impacta qualidade e pode gerar ações disciplinares. |

---

### Termos da Vaga (MIS e BI)

| Sigla / Termo | Nome completo | O que significa na prática |
|---|---|---|
| **MIS** | Management Information System | Equipe/sistema responsável por transformar dados brutos em informação gerencial. O analista de MIS é quem gera dashboards e relatórios para gestores tomarem decisão. |
| **KPI** | Key Performance Indicator | Indicador-chave de desempenho. Qualquer métrica escolhida para medir se um objetivo está sendo atingido. ICM, TMA e CSAT são KPIs. |
| **BI** | Business Intelligence | Conjunto de processos e ferramentas (Power BI, Tableau, etc.) para transformar dados em inteligência de negócio. |
| **Dashboard** | — | Painel visual com KPIs e gráficos. Permite tomada de decisão rápida sem precisar abrir planilha. |
| **Insight** | — | Conclusão acionável extraída dos dados. Não é "o número caiu" — é "caiu porque X, e a ação recomendada é Y". |
| **Absenteísmo** | — | `Dias Não Trabalhados / Dias Úteis`. Alto absenteísmo impacta dimensionamento e qualidade do serviço. |
| **Turnover** | — | Rotatividade: `Demissões no período / Total de funcionários`. KPI de RH de call center, não está nesta planilha. |
| **Nível de Serviço** | SLA / Service Level | % de ligações atendidas dentro do tempo alvo. Ex: "80% das ligações em até 20 segundos". Padrão do setor. |
| **Ocupação** | Taxa de Ocupação | % do tempo do operador em ligação vs disponível. Muito alta = sem respiro; muito baixa = ociosidade. |
| **Monitoria** | Monitoria de Qualidade | Escuta e avaliação das ligações por um analista de qualidade. Gera a "Média de Qualidade" da planilha. |

---

## Módulo 1 — O Pipeline: da Planilha ao Dashboard

```
┌──────────────────────────┐
│  Beedoo Indicadores.xlsx │   ← Fonte de dados original
│  aba: COBRANÇA           │
│  aba: ATENDIMENTO        │
└────────────┬─────────────┘
             │  lido por
             ▼
┌─────────────────────────┐
│     gerar_dados.py      │   ← Script Python (processador)
│  - pandas               │
│  - json / re            │
└────────────┬────────────┘
             │  gera
             ▼
┌─────────────────────────┐
│         data.js          │   ← Arquivo de dados JavaScript
│  const cobData = [...]   │
│  const atenData = [...]  │
└────────────┬────────────┘
             │  carregado por
             ▼
┌─────────────────────────┐
│   dashboard_python.html  │   ← Dashboard visual (Chart.js)
│  <script src="data.js"> │
│  KPIs + Gráficos + Tabela│
└─────────────────────────┘
```

---

### 1.1 — Fonte: `Beedoo Indicadores.xlsx`

A planilha possui **duas abas** com cabeçalhos duplos (duas linhas de header):

#### Aba `COBRANÇA` — 53 operadores

| Posição | Nome original na planilha      | Campo no sistema                          |
| --------- | ------------------------------ | ----------------------------------------- |
| 0         | Nome do CI                     | `op` — nome do operador                |
| 1         | Mês Ref.                      | (mês de referência, não exportado)     |
| 2         | CPC (Trabalhado) — Conversão | `cpc` — contatos trabalhados           |
| 3         | Boleto (Convertido)            | `conv` — boletos gerados               |
| 4         | Boleto Enviado — Eficiência  | `env` — boletos enviados               |
| 5         | Boleto Pago                    | `pago` — boletos pagos                 |
| 6         | Média de Qualidade            | `qual` — nota de qualidade (0–1)      |
| 7         | ICM                            | `icm` — índice composto de desempenho |
| 9         | Dias Não Trabalhados          | `abs` — ausências no mês             |

#### Aba `ATENDIMENTO` — 15 operadores

| Posição | Nome original na planilha          | Campo no sistema                        |
| --------- | ---------------------------------- | --------------------------------------- |
| 0         | Nome                               | `op` — nome do operador              |
| 1         | Média de Qualidade                | `qual`                                |
| 2         | Detrator (NPS)                     | `npsD`                                |
| 3         | Neutro                             | `npsN`                                |
| 4         | Promotor                           | `npsP`                                |
| 5         | Total NPS                          | `total`                               |
| 6         | Volume de CPF Rechamadores         | `rechamada`                           |
| 7         | Volume de Atendimento              | `vol`                                 |
| 8         | Transferência                     | `transf`                              |
| 9         | ICM                                | `icm`                                 |
| 11        | Dias Não Trabalhados              | `abs`                                 |
| 12        | TMA                                | `tma` — tempo médio de atendimento  |
| 13        | CSAT Convencional                  | `csat` — nota de satisfação (0–5) |
| 14        | Volume Respostas Promotoras (CSAT) | `csatRes`                             |
| 15        | Total Respostas (CSAT)             | `csatTot`                             |
| 16        | Volume Respostas Detratoras (DSAT) | `dsatRes`                             |
| 17        | Total Respostas (DSAT)             | `dsatTot`                             |
| 18        | Vendas Efetivadas                  | `vendas`                              |
| 19        | CPC Trabalhado                     | `cpc`                                 |
| 20        | Volume Reclamações Procedentes   | `reclam`                              |
| 21        | Volume Respostas Positivas (FCR)   | `respPos`                             |
| 22        | Volume Respostas Total (FCR)       | `respTot`                             |

> **Por que `header=[0,1]`?** A planilha usa duas linhas de cabeçalho mescladas. O pandas precisa ler ambas para montar o MultiIndex de colunas. O acesso é então feito por posição (`r.iloc[N]`) para evitar depender dos nomes exatos.

---

### 1.2 — Processador: `gerar_dados.py`

O script realiza três tarefas principais:

#### Leitura

```python
cob_df  = pd.read_excel("Beedoo Indicadores.xlsx", sheet_name="COBRANÇA",    header=[0,1])
aten_df = pd.read_excel("Beedoo Indicadores.xlsx", sheet_name="ATENDIMENTO", header=[0,1])
```

Cada aba é lida como um DataFrame com MultiIndex de colunas.

#### Funções utilitárias

```python
to_num(v, decimals, as_int)   # converte célula para número; retorna 0 se vazio/erro
fmt_name(v)                   # "Operador 1" → "Op 1"
fmt_tma(v)                    # "0 days 00:05:04" → "00:05:04"
```

- **`to_num`** — garante que células vazias, `NaN` ou texto não quebrem o dashboard (retorna `0`)
- **`fmt_name`** — normaliza o nome usando regex: `re.sub(r"(?i)operador\s+", "Op ", s)`
- **`fmt_tma`** — o pandas lê durações como `"0 days HH:MM:SS"`, então extrai só o `HH:MM:SS` com regex

#### Escrita

```python
with open("data.js", "w", encoding="utf-8") as f:
    f.write(f"const cobData = {json.dumps(cobData, ensure_ascii=False, indent=2)};\n")
    f.write(f"const atenData = {json.dumps(atenData, ensure_ascii=False, indent=2)};\n")
```

Produz um arquivo `.js` válido com dois arrays JavaScript prontos para uso.

---

### 1.3 — Saída: `data.js`

Exemplo do que é gerado (formato real):

```js
// Gerado automaticamente por gerar_dados.py — não edite manualmente
const cobData = [
  { "op": "Op 1", "cpc": 95, "conv": 19, "env": 19, "pago": 14,
    "qual": 0.78, "icm": 2.02, "abs": 0 },
  { "op": "Op 2", "cpc": 120, "conv": 24, "env": 24, "pago": 16,
    "qual": 1.0, "icm": 1.88, "abs": 0 },
  ...
];

const atenData = [
  { "op": "Op 1", "qual": 0.78, "npsD": 5, "npsN": 0, "npsP": 25,
    "vol": 61, "icm": 1.200, "tma": "00:05:04", "csat": 3.98, ... },
  ...
];
```

---

### 1.4 — Dashboard: `dashboard_python.html`

O HTML carrega `data.js` via tag `<script>`:

```html
<script src="data.js"></script>
```

A partir disso, o JavaScript nativo do HTML acessa `cobData` e `atenData` diretamente — **sem nenhum dado hardcoded**. Os arrays chegam no escopo global e alimentam:

| Bloco              | O que faz                                                   |
| ------------------ | ----------------------------------------------------------- |
| KPIs Cobrança     | Soma/média calculada em JS a partir de `cobData`         |
| KPIs Atendimento   | Soma/média calculada em JS a partir de `atenData`        |
| Gráficos Chart.js | `.map()` sobre os arrays para labels e dados              |
| Tabelas HTML       | `forEach` para gerar linhas dinamicamente                 |
| Insights           | Calculados em tempo real: top/bottom performers, dispersão |

Se `data.js` não existir, um banner de erro é exibido:

```html
<div id="load-error">⚠ data.js não encontrado. Execute python gerar_dados.py...</div>
```

#### Fluxo de atualização

```
Atualiza planilha → python gerar_dados.py → data.js regenerado → abre/recarrega dashboard_python.html
```

---

## Módulo 2 — Os Cálculos Matemáticos

> Todos os indicadores abaixo foram solicitados ou implicitamente definidos pelo RH no desafio. A interpretação seguiu as definições dos campos da planilha.

---

### 2.1 — Cobrança

#### Eficiência (por operador)

$$
\text{Eficiência} = \frac{\text{Boleto Pago}}{\text{Boleto Enviado}}
$$

Mede quantos dos boletos **efetivamente enviados** foram pagos. Representa a conversão final da cadeia de cobrança.

> Exemplo — Op 4: 11 pagos / 12 enviados = **91,7%**

---

#### Taxa de Conversão (CPC → Boleto)

$$
\text{Taxa de Conversão} = \frac{\text{Boleto Convertido}}{\text{CPC Trabalhado}}
$$

Mede qual fração dos contatos trabalhados resultou em boleto gerado.

> Exemplo — Op 18: 49 convertidos / 250 CPCs = **19,6%**

---

#### Eficiência Média da Equipe

$$
\text{Eficiência Média} = \frac{\sum \text{Boletos Pagos (todos)}}{\sum \text{Boletos Enviados (todos)}}
$$

Calculada sobre os **totais** (não média de médias), para refletir o resultado real da operação.

---

#### ICM — Índice Composto de Desempenho (Cobrança)

O ICM vem **diretamente da planilha**. Ele combina produtividade e qualidade conforme fórmula interna da Beedoo. O dashboard o utiliza como **principal ranking** de performance.

Classificação adotada no dashboard:

| Faixa de ICM | Classificação | Cor         |
| ------------ | --------------- | ----------- |
| ≥ 1,2       | Alto            | 🟢 Verde    |
| 0,6 – 1,19  | Médio          | 🟡 Amarelo  |
| < 0,6        | Baixo           | 🔴 Vermelho |

---

#### Absenteísmo

$$
\text{Absenteísmo (\%)} = \frac{\text{Dias Não Trabalhados}}{\text{Dias Úteis}}
$$

No dashboard é exibida a contagem de operadores com pelo menos 1 dia não trabalhado.

---

### 2.2 — Atendimento

#### NPS — Net Promoter Score

$$
\text{NPS Líquido} = \text{Promotores} - \text{Detratores}
$$

O NPS clássico é percentual, mas aqui o RH forneceu volumes absolutos. O dashboard calcula o **saldo líquido** (Promotores − Detratores) por operador e para a equipe.

> Equipe: 241 promotores − 32 detratores = **+209**

---

#### CSAT — Customer Satisfaction Score

Valor fornecido diretamente na planilha (escala 0–5). Representa a média das avaliações de satisfação dos clientes atendidos por cada operador.

$$
\text{CSAT Médio} = \frac{\sum \text{CSAT}_i}{n}
$$

Classificação adotada:

| Faixa       | Interpretação |
| ----------- | --------------- |
| ≥ 4,5      | Excelente       |
| 3,5 – 4,49 | Bom             |
| < 3,5       | Crítico        |

---

#### CSAT Satisfação (taxa de promotores)

$$
\text{CSAT Satisfação} = \frac{\text{Respostas Promotoras (CSAT)}}{\text{Total de Respostas (CSAT)}}
$$

Indica a proporção de clientes que avaliaram positivamente.

---

#### DSAT — Customer Dissatisfaction Rate

$$
\text{DSAT} = \frac{\text{Respostas Detratoras}}{\text{Total de Respostas (DSAT)}}
$$

Inverso do CSAT — mede a proporção de insatisfeitos.

---

#### Rechamada (%)

$$
\text{Rechamada (\%)} = \frac{\text{Volume de CPFs Rechamadores}}{\text{Volume de Atendimento}}
$$

Mede quantos clientes precisaram ligar novamente — indicador de FCR invertido. Quanto menor, melhor.

---

#### Transferência (%)

$$
\text{Transferência (\%)} = \frac{\text{Atendimentos Transferidos}}{\text{Volume de Atendimento}}
$$

Fornecido diretamente pela planilha como valor decimal (ex: 0,16 = 16%). Exibido em % no dashboard.

---

#### FCR — First Call Resolution (Taxa de Resolução no Primeiro Contato)

$$
\text{FCR} = \frac{\text{Respostas Positivas (FCR)}}{\text{Total de Respostas (FCR)}}
$$

Indica a proporção de atendimentos resolvidos sem necessidade de retorno do cliente.

> Exemplo — Op 1: 26 respostas positivas / 29 total = **89,7%** de FCR

---

#### TMA — Tempo Médio de Atendimento

Fornecido pela planilha em formato `HH:MM:SS`. O dashboard converte para segundos para calcular a média da equipe:

$$
\text{TMA Médio} = \frac{\sum \text{TMA}_i \text{ (em segundos)}}{n}
$$

Depois converte de volta para `HH:MM:SS` para exibição.

---

#### ICM — Atendimento

Mesmo conceito do ICM de Cobrança — índice composto fornecido pela planilha. Classificação adotada:

| Faixa de ICM | Classificação | Cor         |
| ------------ | --------------- | ----------- |
| ≥ 1,0       | Alto            | 🟢 Verde    |
| 0,6 – 0,99  | Médio          | 🟡 Amarelo  |
| < 0,6        | Baixo           | 🔴 Vermelho |

---

### 2.3 — Resumo Visual dos Indicadores

```
COBRANÇA
─────────────────────────────────────────────────────────────────
 CPC Trabalhado  →  [contato com cliente, foco em conversão]
      │
      ▼
 Boleto Convertido  →  Taxa Conversão = Conv / CPC
      │
      ▼
 Boleto Enviado  ─────────────────────┐
      │                               │
      ▼                               ▼
 Boleto Pago  →  Eficiência = Pago / Enviado

 + ICM (composto, da planilha) = ranking principal
 + Média de Qualidade (0–1) = avaliação qualitativa
 + Dias Não Trabalhados = absenteísmo

ATENDIMENTO
─────────────────────────────────────────────────────────────────
 Volume de Atendimento
      ├── Rechamada (%)   = Rechamadores / Volume
      ├── Transferência (%) = fornecida pela planilha
      └── FCR (%)         = Respostas Positivas / Total Respostas

 NPS Líquido = Promotores − Detratores
 CSAT (0–5)  = média de avaliações de satisfação
 DSAT (%)    = Detratores / Total Respostas DSAT
 TMA         = Tempo Médio de Atendimento (HH:MM:SS)

 + ICM (composto, da planilha) = ranking principal
 + Média de Qualidade (0–1)
```

---

*Gerado como parte do desafio prático MIS — Beedoo · Analista: Rónison*
