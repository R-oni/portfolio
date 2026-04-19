"""
Gera os dados-fonte pra simular cenário real.
O CSV propositalmente tem sujeira (formatos misturados, nulos, duplicatas)
pra forçar limpeza no notebook de transformação.

Rodar 1x antes dos notebooks.
"""

import os
import random
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

SEED = 42
random.seed(SEED)
np.random.seed(SEED)

os.makedirs("data/source", exist_ok=True)

# --- CSV de transações financeiras ---
# Propositalmente bagunçado: datas em formatos misturados, amount às vezes
# como string "R$ 1.200,50", categorias com espaço extra, nulos aleatórios

categorias_receita = ["Salário", "Freelance", "Rendimentos", "Bônus"]
categorias_despesa = [
    "Alimentação", "Transporte ", "Moradia", " Saúde",
    "Educação", "Lazer", "assinaturas", "Vestuário",
    "Impostos", "Manutenção", "alimentação",  # duplicata com casing diferente
]

date_formats = ["%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y", "%Y/%m/%d"]

rows = []
start = datetime(2022, 1, 1)
end = datetime(2024, 12, 31)
n_days = (end - start).days

for _ in range(2400):
    date = start + timedelta(days=random.randint(0, n_days))
    is_income = random.random() < 0.25

    if is_income:
        cat = random.choice(categorias_receita)
        amount = round(random.gauss(4500, 1800), 2)
        amount = max(amount, 200)
        tx_type = "receita"
    else:
        cat = random.choice(categorias_despesa)
        amount = round(random.gauss(350, 250), 2)
        amount = max(amount, 5)
        tx_type = "despesa"

    # formata a data num formato aleatório (simula merge de planilhas)
    fmt = random.choice(date_formats)
    date_str = date.strftime(fmt)

    # ~8% dos amounts vem como string "R$ X.XXX,XX" (copiar/colar de extrato)
    if random.random() < 0.08:
        amount_str = f"R$ {amount:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    else:
        amount_str = amount

    row = {
        "data": date_str,
        "categoria": cat,
        "tipo": tx_type,
        "valor": amount_str,
        "descricao": f"{cat.strip()} - pagamento" if random.random() > 0.3 else "",
        "metodo_pgto": random.choice(
            ["Pix", "Cartão de Crédito", "Débito", "Boleto", "Transferência", ""]
        ),
    }

    # ~3% dos registros tem campos nulos aleatórios
    if random.random() < 0.03:
        campo = random.choice(["categoria", "tipo", "metodo_pgto"])
        row[campo] = ""

    rows.append(row)

# injetar anomalias (valores absurdos)
for i in random.sample(range(len(rows)), 15):
    if random.random() < 0.5:
        rows[i]["valor"] = round(random.uniform(15000, 35000), 2)
    else:
        rows[i]["valor"] = round(random.uniform(-5000, -500), 2)

# duplicar ~30 linhas (simula append acidental)
dupes = random.sample(range(len(rows)), 30)
for i in dupes:
    rows.append(rows[i].copy())

df_csv = pd.DataFrame(rows)
df_csv = df_csv.sample(frac=1, random_state=SEED).reset_index(drop=True)

# salvar com encoding latin-1 (comum em exports brasileiros)
df_csv.to_csv("data/source/transacoes_financeiras.csv", index=False, encoding="latin-1")
print(f"OK transacoes_financeiras.csv - {len(df_csv)} registros (com sujeira)")


# --- Excel de orçamento ---
# esse é mais "limpo" pq viria do financeiro, mas tem uns detalhes
months = pd.date_range("2022-01", "2024-12", freq="MS")
budget_rows = []

for m in months:
    base_revenue = 12000 + np.random.normal(0, 1500)
    trend = (m.year - 2022) * 800 + m.month * 50
    receita = round(max(base_revenue + trend, 3000), 2)

    for cat in ["Operacional", "Marketing", "Pessoal", "Infraestrutura"]:
        pct = {"Operacional": 0.35, "Marketing": 0.15, "Pessoal": 0.38, "Infraestrutura": 0.12}[cat]
        despesa = round(receita * pct * np.random.uniform(0.85, 1.15), 2)
        budget_rows.append({
            "Mês": m.strftime("%Y-%m"),
            "Categoria": cat,
            "Receita Planejada": receita,
            "Despesa Planejada": despesa,
            "Saldo": round(receita - despesa, 2),
            "Obs": random.choice(["", "", "", "", "conferir", "valor estimado", ""]),
        })

df_xl = pd.DataFrame(budget_rows)
with pd.ExcelWriter("data/source/orcamento_2022_2024.xlsx", engine="openpyxl") as writer:
    df_xl.to_excel(writer, sheet_name="orcamento", index=False)
print(f"OK orcamento_2022_2024.xlsx - {len(df_xl)} linhas")

print("\nDados gerados.")
