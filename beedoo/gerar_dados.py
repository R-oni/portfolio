"""
Lê Beedoo Indicadores.xlsx e gera data.js com cobData e atenData
para o dashboard.html usar via Chart.js (sem JS hardcoded).

Uso:
    python gerar_dados.py
"""
import json
import re
import pandas as pd

XLSX = "Beedoo Indicadores.xlsx"
OUTPUT = "data.js"


def to_num(v, decimals=None, as_int=False):
    try:
        f = float(v)
        if as_int:
            return int(round(f))
        if decimals is not None:
            return round(f, decimals)
        return f
    except (TypeError, ValueError):
        return 0


def fmt_name(v):
    s = str(v).strip()
    return re.sub(r"(?i)operador\s+", "Op ", s)


def fmt_tma(v):
    if v is None:
        return "00:00:00"
    s = str(v).strip()
    # pandas reads time as "0 days HH:MM:SS" or plain "HH:MM:SS"
    m = re.search(r"(\d{1,2}:\d{2}:\d{2})", s)
    return m.group(1) if m else "00:00:00"


# ── COBRANÇA ──────────────────────────────────────────────────────────
# Columns by position (header=[0,1] merges the two header rows):
#  0=Nome  1=MêsRef  2=CPC  3=BoletoConv  4=BoletoEnv  5=BoletoPago
#  6=Qualidade  7=ICM  8=DiasÚteis  9=DiasNãoTrabalhados
cob_df = pd.read_excel(XLSX, sheet_name="COBRANÇA", header=[0, 1])

cobData = []
for _, r in cob_df.iterrows():
    cobData.append(
        {
            "op": fmt_name(r.iloc[0]),
            "cpc": to_num(r.iloc[2], as_int=True),
            "conv": to_num(r.iloc[3], as_int=True),
            "env": to_num(r.iloc[4], as_int=True),
            "pago": to_num(r.iloc[5], as_int=True),
            "qual": to_num(r.iloc[6], decimals=2),
            "icm": to_num(r.iloc[7], decimals=2),
            "abs": to_num(r.iloc[9], as_int=True),
        }
    )

# ── ATENDIMENTO ───────────────────────────────────────────────────────
# Columns by position:
#  0=Nome  1=Qual  2=NpsD  3=NpsN  4=NpsP  5=TotalNPS
#  6=Rechamada  7=VolAtend  8=Transf  9=ICM  10=DiasÚteis  11=DiasNãoTrab
#  12=TMA  13=CSAT  14=CsatRes  15=CsatTot  16=DsatRes  17=DsatTot
#  18=Vendas  19=CPC  20=Reclam  21=RespPos  22=RespTot
aten_df = pd.read_excel(XLSX, sheet_name="ATENDIMENTO", header=[0, 1])

atenData = []
for _, r in aten_df.iterrows():
    atenData.append(
        {
            "op": fmt_name(r.iloc[0]),
            "qual": to_num(r.iloc[1], decimals=2),
            "npsD": to_num(r.iloc[2], as_int=True),
            "npsN": to_num(r.iloc[3], as_int=True),
            "npsP": to_num(r.iloc[4], as_int=True),
            "total": to_num(r.iloc[5], as_int=True),
            "rechamada": to_num(r.iloc[6], as_int=True),
            "vol": to_num(r.iloc[7], as_int=True),
            "transf": to_num(r.iloc[8], decimals=3),
            "icm": to_num(r.iloc[9], decimals=3),
            "abs": to_num(r.iloc[11], as_int=True),
            "tma": fmt_tma(r.iloc[12]),
            "csat": to_num(r.iloc[13], decimals=2),
            "csatRes": to_num(r.iloc[14], as_int=True),
            "csatTot": to_num(r.iloc[15], as_int=True),
            "dsatRes": to_num(r.iloc[16], as_int=True),
            "dsatTot": to_num(r.iloc[17], as_int=True),
            "vendas": to_num(r.iloc[18], as_int=True),
            "cpc": to_num(r.iloc[19], as_int=True),
            "reclam": to_num(r.iloc[20], as_int=True),
            "respPos": to_num(r.iloc[21], as_int=True),
            "respTot": to_num(r.iloc[22], as_int=True),
        }
    )

# ── Escreve data.js ───────────────────────────────────────────────────
cob_json = json.dumps(cobData, ensure_ascii=False, indent=2)
aten_json = json.dumps(atenData, ensure_ascii=False, indent=2)

with open(OUTPUT, "w", encoding="utf-8") as f:
    f.write("// Gerado automaticamente por gerar_dados.py — não edite manualmente\n")
    f.write(f"const cobData = {cob_json};\n\n")
    f.write(f"const atenData = {aten_json};\n")

print(
    f"✓ {OUTPUT} gerado: "
    f"{len(cobData)} operadores Cobrança, "
    f"{len(atenData)} operadores Atendimento"
)
