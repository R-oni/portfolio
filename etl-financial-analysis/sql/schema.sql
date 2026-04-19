-- DDL do banco financeiro.db
-- Gerado automaticamente pelo clean_and_validate.ipynb
-- Documentando aqui pra referência

CREATE TABLE IF NOT EXISTS transacoes (
    data         TEXT,
    categoria    TEXT,
    tipo         TEXT,
    valor        REAL,
    descricao    TEXT,
    metodo_pgto  TEXT,
    z_score      REAL,
    anomalia     INTEGER  -- 0 ou 1
);

CREATE TABLE IF NOT EXISTS ibovespa (
    data            TEXT,
    "Open"          REAL,
    "High"          REAL,
    "Low"           REAL,
    "Close"         REAL,
    "Volume"        REAL,
    retorno_diario  REAL
);

CREATE TABLE IF NOT EXISTS orcamento (
    "Mês"               TEXT,
    Limite              REAL,
    Receita_Planejada   REAL
);

-- Índices úteis
CREATE INDEX IF NOT EXISTS idx_transacoes_data ON transacoes(data);
CREATE INDEX IF NOT EXISTS idx_transacoes_categoria ON transacoes(categoria);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON transacoes(tipo);
CREATE INDEX IF NOT EXISTS idx_ibovespa_data ON ibovespa(data);
