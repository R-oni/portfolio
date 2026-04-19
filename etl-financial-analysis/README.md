# ETL + Análise financeira pessoal

Projeto de análise das minhas finanças pessoais (dados sintéticos pra não expôr os reais, mas o pipeline é o mesmo que uso).

Junta 3 fontes: CSV de transações, cotações do Ibovespa via yfinance e planilha de orçamento. Faz limpeza, detecta anomalias com Z-score e tenta prever gastos futuros.

## O que faz

1. **Extração** → puxa CSV (encoding latin-1, datas misturadas), cotações do Ibovespa e planilha de orçamento
2. **Limpeza + SQL** → trata valores em "R$ 1.200,50", padroniza categorias, remove duplicatas, detecta anomalias e carrega tudo num SQLite
3. **Regressão** → testa Linear Regression e Random Forest pra prever gasto mensal (dados lidos via SQL)
4. **Séries temporais** → decomposição sazonal, média móvel, correlação com Ibovespa

## Notebooks

- `extract_sources.ipynb` — extração das 3 fontes → parquet
- `clean_and_validate.ipynb` — limpeza, detecção de anomalias (Z-score) e carga no SQLite
- `revenue_forecast.ipynb` — regressão pra prever gastos mensais (usa `pd.read_sql`)
- `timeseries_analysis.ipynb` — análise temporal, sazonalidade, orçado vs realizado

## SQL

Os dados limpos ficam em `data/processed/financeiro.db` (SQLite). Os notebooks de análise leem direto do banco via SQL.

Tem também scripts standalone em `sql/`:
- `sql/schema.sql` — estrutura das tabelas
- `sql/analises.sql` — 8 queries de análise (top categorias, orçado vs realizado, anomalias, etc)

## Como rodar

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# gerar os dados de exemplo
python generate_source_data.py

# abrir os notebooks
jupyter lab
```

Os notebooks rodam em ordem (extract → clean → forecast → timeseries).

## Estrutura

```
data/
  source/    → CSV e Excel originais
  raw/       → parquet brutos
  processed/ → parquet limpos + financeiro.db (SQLite)
sql/         → scripts SQL standalone
outputs/     → gráficos gerados
```

## Tech

Python, Pandas, NumPy, SciPy, SQL (SQLite), Matplotlib, scikit-learn, yfinance
[LinkedIn](https://www.linkedin.com/in/ronisonricardo) · [GitHub](https://github.com/ronisonricardo)
