# Plano de absorção: gemini-qa3.mjs → scripts/gemini.mjs

## Features a absorver (prioridade alta)
- ROUND_CONTEXTS: objeto com histórico evolutivo por slide
- Cost estimation: log de tokens input/output × preço por chamada
- Per-round naming: output como _result_r{N}.json em vez de sobrescrever

## Features a avaliar depois
- File cleanup: DELETE do arquivo no Gemini após chamada
- CSS com comentários: extrair linhas // antes do bloco CSS

## Feature descartada
- Resumable upload: SDK já cobre via File API

## Sequência
1. Implementar features alta prioridade no scripts/gemini.mjs
2. Testar com 1 slide
3. Comparar output do canônico vs ad-hoc
4. Se equivalente: mover gemini-qa3.mjs para _archive/
5. Atualizar WT-OPERATING.md

## Status: PENDENTE — não executar sem aprovação
