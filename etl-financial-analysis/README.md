# ETL + Análise financeira pessoal

Projeto de análise das minhas finanças pessoais (dados sintéticos pra não expôr os reais, mas o pipeline é o mesmo que uso).

Junta 3 fontes: CSV de transações, cotações do Ibovespa via yfinance e planilha de orçamento. Faz limpeza, detecta anomalias com Z-score e tenta prever gastos futuros.

## O que faz

1. **Extração** → puxa CSV (encoding latin-1, datas misturadas), cotações do Ibovespa e planilha de orçamento
2. **Limpeza** → trata valores em "R$ 1.200,50", padroniza categorias, remove duplicatas, detecta anomalias
3. **Regressão** → testa Linear Regression e Random Forest pra prever gasto mensal
4. **Séries temporais** → decomposição sazonal, média móvel, correlação com Ibovespa

## Notebooks

- `extract_sources.ipynb` — extração das 3 fontes → parquet
- `clean_and_validate.ipynb` — limpeza e detecção de anomalias (Z-score)
- `revenue_forecast.ipynb` — regressão pra prever gastos mensais
- `timeseries_analysis.ipynb` — análise temporal, sazonalidade, orçado vs realizado

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
  processed/ → parquet limpos
outputs/     → gráficos gerados
```

## Tech

Python, Pandas, NumPy, SciPy, Matplotlib, yfinance, scikit-learn
[LinkedIn](https://www.linkedin.com/in/ronisonricardo) · [GitHub](https://github.com/ronisonricardo)
