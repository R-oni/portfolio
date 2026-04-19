"""
processar.py — ETL para o dashboard do Resort Termas do Sol
Le os CSVs mensais de receitas e despesas, calcula KPIs hoteleiros
(ocupação, ADR, RevPAR, TRevPAR, GOPPAR) e gera o dados.json.
"""

import csv
import json
import os
from collections import defaultdict

# Config do hotel
TOTAL_QUARTOS = 150
DIAS_MES = {
    'janeiro': 31, 'fevereiro': 28, 'março': 31,
    'abril': 30, 'maio': 31
}

MESES_ARQUIVO = ['janeiro', 'fevereiro', 'março', 'abril', 'maio']

# Budget de RevPAR por mês (meta)
REVPAR_BUDGET = {
    'janeiro': 330.0, 'fevereiro': 350.0, 'março': 200.0,
    'abril': 280.0, 'maio': 160.0
}

# Ocupação real por mês (% médio) — usado p/ estimar room-nights
# como os CSVs são amostrais, usamos a taxa real conhecida
OCUPACAO_REAL = {
    'janeiro': 82.0, 'fevereiro': 79.0, 'março': 58.0,
    'abril': 71.0, 'maio': 49.0
}

# ADR real por mês (mesma lógica)
ADR_REAL = {
    'janeiro': 385.0, 'fevereiro': 465.0, 'março': 310.0,
    'abril': 395.0, 'maio': 290.0
}

# Ocupação por dia da semana (típica por mês)
OCUPACAO_SEMANA = {
    'janeiro':   [78, 74, 76, 80, 89, 95, 84],
    'fevereiro': [72, 70, 73, 78, 90, 96, 81],
    'março':     [52, 48, 50, 55, 68, 78, 58],
    'abril':     [64, 62, 65, 70, 82, 90, 72],
    'maio':      [42, 38, 40, 46, 58, 72, 50]
}
DIAS_SEMANA = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

# ADR por tipo de quarto por mês
ADR_TIPO = {
    'janeiro':   {'Standard': 295, 'Superior': 415, 'Luxo': 585, 'Suíte Master': 950},
    'fevereiro': {'Standard': 365, 'Superior': 498, 'Luxo': 685, 'Suíte Master': 1100},
    'março':     {'Standard': 240, 'Superior': 335, 'Luxo': 460, 'Suíte Master': 780},
    'abril':     {'Standard': 305, 'Superior': 425, 'Luxo': 595, 'Suíte Master': 975},
    'maio':      {'Standard': 225, 'Superior': 310, 'Luxo': 435, 'Suíte Master': 720}
}


def ler_csv(caminho):
    """Lê CSV com encoding utf-8 e retorna lista de dicts."""
    rows = []
    with open(caminho, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    return rows


def processar_mes(mes, receitas, despesas_mes):
    """Calcula todos os KPIs de um mês."""
    dias = DIAS_MES[mes]
    quartos_disp = TOTAL_QUARTOS * dias
    occ = OCUPACAO_REAL[mes]
    quartos_vend = round(quartos_disp * occ / 100)
    adr = ADR_REAL[mes]

    # Revenue por tipo (do CSV)
    receita_por_tipo = defaultdict(float)
    canais = defaultdict(float)
    hospedes_total = 0

    for r in receitas:
        tipo = r['tipo']
        valor = float(r['valor'])
        receita_por_tipo[tipo] += valor
        if tipo == 'hospedagem':
            canal = r.get('canal', 'Direto')
            canais[canal] += valor
            hospedes_total += int(r.get('hospedes', 0) or 0)

    # Receita de hospedagem real (pelo ADR × quartos vendidos)
    receita_hosp = round(quartos_vend * adr)

    # Receita total por departamento
    receita_ab = receita_por_tipo.get('ab', 0)
    receita_spa = receita_por_tipo.get('spa', 0)
    receita_eventos = receita_por_tipo.get('eventos', 0)
    receita_loja = receita_por_tipo.get('loja', 0)
    receita_total = receita_hosp + receita_ab + receita_spa + receita_eventos + receita_loja

    # Despesas
    total_despesas = sum(d['valor'] for d in despesas_mes)

    # KPIs
    gop = receita_total - total_despesas
    revpar = round(receita_hosp / quartos_disp, 2)
    trevpar = round(receita_total / quartos_disp, 2)
    goppar = round(gop / quartos_disp, 2)

    # Estimativa de hóspedes únicos (stay médio ~2.5 noites)
    clientes = round(quartos_vend / 2.5)

    # Canais de reserva (proporções do CSV escaladas para a receita real)
    total_csv_canais = sum(canais.values())
    if total_csv_canais > 0:
        canais_scaled = {k: round(v / total_csv_canais * receita_hosp) for k, v in canais.items()}
    else:
        canais_scaled = {'Direto': receita_hosp}

    return {
        'faturamento': receita_total,
        'receita_total': receita_total,
        'receita_hospedagem': receita_hosp,
        'quartos_disponiveis': quartos_disp,
        'quartos_vendidos': quartos_vend,
        'taxa_ocupacao': occ,
        'adr': adr,
        'revpar': revpar,
        'trevpar': trevpar,
        'gop': gop,
        'goppar': goppar,
        'revpar_budget': REVPAR_BUDGET[mes],
        'vendas': quartos_vend,
        'clientes': clientes,
        'receita_por_fonte': [
            {'nome': 'Hospedagem', 'valor': receita_hosp},
            {'nome': 'A&B', 'valor': round(receita_ab)},
            {'nome': 'Eventos', 'valor': round(receita_eventos)},
            {'nome': 'Spa', 'valor': round(receita_spa)},
            {'nome': 'Loja', 'valor': round(receita_loja)}
        ],
        'canais_reserva': [
            {'nome': k, 'valor': v} for k, v in
            sorted(canais_scaled.items(), key=lambda x: -x[1])
        ],
        'ocupacao_semana': [
            {'nome': DIAS_SEMANA[i], 'ocupacao': OCUPACAO_SEMANA[mes][i]}
            for i in range(7)
        ],
        'tipo_quarto_adr': [
            {'nome': tipo, 'adr': adr_val}
            for tipo, adr_val in ADR_TIPO[mes].items()
        ],
        'despesas': [
            {'categoria': d['categoria'], 'valor': d['valor']}
            for d in sorted(despesas_mes, key=lambda x: -x['valor'])
        ],
        'total_despesas': total_despesas,
        'servicos': [],
        'formas_pagamento': [],
        'atividade_semana': []
    }


def calcular_changes(dados, meses):
    """Calcula variações percentuais mês a mês."""
    for i, mes in enumerate(meses):
        if i == 0:
            # Primeiro mês: sem variação
            for key in ['changeFaturamento', 'changeOcupacao', 'changeADR',
                        'changeRevPAR', 'changeTRevPAR', 'changeGOPPAR',
                        'changeVendas', 'changeTicket', 'changeClientes', 'changeLucro']:
                dados[mes][key] = 0
            continue

        atual = dados[mes]
        anterior = dados[meses[i - 1]]

        def pct(a, b):
            return round((a - b) / b * 100, 1) if b != 0 else 0

        atual['changeFaturamento'] = pct(atual['receita_total'], anterior['receita_total'])
        atual['changeOcupacao'] = pct(atual['taxa_ocupacao'], anterior['taxa_ocupacao'])
        atual['changeADR'] = pct(atual['adr'], anterior['adr'])
        atual['changeRevPAR'] = pct(atual['revpar'], anterior['revpar'])
        atual['changeTRevPAR'] = pct(atual['trevpar'], anterior['trevpar'])
        atual['changeGOPPAR'] = pct(atual['goppar'], anterior['goppar'])
        atual['changeVendas'] = pct(atual['quartos_vendidos'], anterior['quartos_vendidos'])
        atual['changeClientes'] = pct(atual['clientes'], anterior['clientes'])

        ticket_atual = atual['receita_total'] / atual['quartos_vendidos'] if atual['quartos_vendidos'] else 0
        ticket_ant = anterior['receita_total'] / anterior['quartos_vendidos'] if anterior['quartos_vendidos'] else 0
        atual['changeTicket'] = pct(ticket_atual, ticket_ant)

        atual['changeLucro'] = pct(atual['gop'], anterior['gop'])


def main():
    pasta = os.path.dirname(os.path.abspath(__file__))
    dados = {}

    # Ler despesas
    despesas_raw = ler_csv(os.path.join(pasta, 'despesas.csv'))
    despesas_por_mes = defaultdict(list)
    for d in despesas_raw:
        mes = d['mes'].lower()
        despesas_por_mes[mes].append({
            'categoria': d['categoria'],
            'valor': float(d['valor'])
        })

    # Processar cada mês
    for mes in MESES_ARQUIVO:
        csv_path = os.path.join(pasta, f'{mes}.csv')
        if not os.path.exists(csv_path):
            print(f'[AVISO] {csv_path} não encontrado, pulando {mes}')
            continue

        receitas = ler_csv(csv_path)
        despesas_mes = despesas_por_mes.get(mes, [])
        dados[mes] = processar_mes(mes, receitas, despesas_mes)
        print(f'[OK] {mes}: RevPAR R$ {dados[mes]["revpar"]:.2f} | Occ {dados[mes]["taxa_ocupacao"]}% | GOP R$ {dados[mes]["gop"]:,.0f}')

    # Calcular variações
    meses_processados = [m for m in MESES_ARQUIVO if m in dados]
    calcular_changes(dados, meses_processados)

    # Salvar
    output = os.path.join(pasta, 'dados.json')
    with open(output, 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

    print(f'\n[OK] dados.json gerado com {len(dados)} meses')


if __name__ == '__main__':
    main()
