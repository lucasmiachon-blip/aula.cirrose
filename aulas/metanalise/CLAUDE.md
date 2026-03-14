# Meta-analise — Regras Especificas

Parent: ver CLAUDE.md na raiz.

## WT State (atualizar a cada sessao)

- **Branch:** feat/metanalise-mvp
- **Ultimo merge main:** baf1816 (2026-03-09)
- **Classe C pendente:** 0 arquivos em main
- **Infra sync:** Pendente — absorver main apos repatriacao (Fase 2)

## Worktree

- **Branch pattern:** `feat/metanalise-{feature}-mvp`
- **WT location:** `../aulas-magnas-wt-metanalise-{feature}`
- **shared/ restrictions:** READ-ONLY. Deferir mudancas para sessao em main.
- **Pre-merge checklist:**
  - [ ] `git diff --name-only main...HEAD | grep shared/` retorna vazio
  - [ ] Build passa sem erros
  - [ ] `git status` limpo
- **Merge protocol:** No main: `git merge --no-ff feat/metanalise-{feature}-mvp`
- **Cleanup:** `bash .claude/scripts/worktree-cleanup.sh metanalise-{feature}`

## Escopo

- 45-60 min, residentes (basico-intermediario)
- Foco: LEITURA CRITICA de forest plots (nao producao)
- Modelo: pairwise classico (nao NMA/Bayesian/IPD)
- 9 MAs selecionadas (ver metanalise-scope.md)
- Conceitos avancados (prediction intervals, TSA) = teaser apenas
- Sempre mostrar forest plot REAL do paper
