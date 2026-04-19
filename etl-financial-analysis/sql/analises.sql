-- ============================================================
-- Análises financeiras no SQLite
-- Rodar: sqlite3 data/processed/financeiro.db < sql/analises.sql

-- ============================================================

-- 1. Top categorias de gasto (excluindo anomalias)
SELECT categoria,
       COUNT(*) as transacoes,
       ROUND(SUM(valor), 2) as total,
       ROUND(AVG(valor), 2) as media,
       ROUND(MAX(valor), 2) as maximo
FROM transacoes
WHERE anomalia = 0 AND LOWER(tipo) = 'despesa'
GROUP BY categoria
ORDER BY total DESC;


-- 2. Evolução mensal de gastos
SELECT strftime('%Y-%m', data) as mes,
       COUNT(*) as qtd,
       ROUND(SUM(valor), 2) as total_gasto,
       ROUND(AVG(valor), 2) as ticket_medio
FROM transacoes
WHERE LOWER(tipo) = 'despesa' AND anomalia = 0
GROUP BY strftime('%Y-%m', data)
ORDER BY mes;


-- 3. Orçado vs realizado por mês
SELECT o.ano_mes,
       ROUND(o.limite, 2) as orcado,
       ROUND(r.total_gasto, 2) as realizado,
       ROUND(r.total_gasto - o.limite, 2) as diferenca,
       CASE
           WHEN r.total_gasto > o.limite THEN 'ESTOUROU'
           ELSE 'OK'
       END as status
FROM (
    SELECT strftime('%Y-%m', "Mês") as ano_mes, Limite as limite
    FROM orcamento
) o
LEFT JOIN (
    SELECT strftime('%Y-%m', data) as ano_mes,
           SUM(valor) as total_gasto
    FROM transacoes
    WHERE LOWER(tipo) = 'despesa' AND anomalia = 0
    GROUP BY strftime('%Y-%m', data)
) r ON o.ano_mes = r.ano_mes
WHERE r.total_gasto IS NOT NULL
ORDER BY o.ano_mes;


-- 4. Anomalias identificadas
SELECT data, categoria, valor, descricao, z_score
FROM transacoes
WHERE anomalia = 1
ORDER BY ABS(valor) DESC;


-- 5. Método de pagamento mais usado por categoria
SELECT categoria,
       metodo_pgto,
       COUNT(*) as vezes,
       ROUND(SUM(valor), 2) as total
FROM transacoes
WHERE metodo_pgto != '' AND anomalia = 0
GROUP BY categoria, metodo_pgto
ORDER BY categoria, vezes DESC;


-- 6. Gastos nos dias da semana (0=dom, 6=sab)
SELECT CASE CAST(strftime('%w', data) AS INTEGER)
           WHEN 0 THEN 'Domingo'
           WHEN 1 THEN 'Segunda'
           WHEN 2 THEN 'Terça'
           WHEN 3 THEN 'Quarta'
           WHEN 4 THEN 'Quinta'
           WHEN 5 THEN 'Sexta'
           WHEN 6 THEN 'Sábado'
       END as dia_semana,
       COUNT(*) as transacoes,
       ROUND(AVG(valor), 2) as media
FROM transacoes
WHERE LOWER(tipo) = 'despesa' AND anomalia = 0
GROUP BY strftime('%w', data)
ORDER BY CAST(strftime('%w', data) AS INTEGER);


-- 7. Meses com correlação - gastos vs ibovespa
SELECT g.mes,
       g.total_gasto,
       ROUND(i.ibov_media, 0) as ibovespa_media
FROM (
    SELECT strftime('%Y-%m', data) as mes,
           SUM(valor) as total_gasto
    FROM transacoes
    WHERE LOWER(tipo) = 'despesa' AND anomalia = 0
    GROUP BY strftime('%Y-%m', data)
) g
JOIN (
    SELECT strftime('%Y-%m', data) as mes,
           AVG("Close") as ibov_media
    FROM ibovespa
    GROUP BY strftime('%Y-%m', data)
) i ON g.mes = i.mes
ORDER BY g.mes;


-- 8. Receitas vs despesas por trimestre
SELECT strftime('%Y', data) || '-Q' ||
       CASE
           WHEN CAST(strftime('%m', data) AS INTEGER) <= 3 THEN '1'
           WHEN CAST(strftime('%m', data) AS INTEGER) <= 6 THEN '2'
           WHEN CAST(strftime('%m', data) AS INTEGER) <= 9 THEN '3'
           ELSE '4'
       END as trimestre,
       ROUND(SUM(CASE WHEN LOWER(tipo) = 'receita' THEN valor ELSE 0 END), 2) as receitas,
       ROUND(SUM(CASE WHEN LOWER(tipo) = 'despesa' THEN valor ELSE 0 END), 2) as despesas,
       ROUND(SUM(CASE WHEN LOWER(tipo) = 'receita' THEN valor ELSE -valor END), 2) as saldo
FROM transacoes
WHERE anomalia = 0
GROUP BY trimestre
ORDER BY trimestre;
