# HANDOFF — Cirrose (projeto)

> Só pendências. Detalhes → CHANGELOG.md, ERROR-LOG.md. Claude.ai → HANDOFF-CLAUDE-AI.md

---

## Prioridades (ordem — HTML só no final)

**Regra:** Mexer HTML só depois de todo o resto perfeito e funcionando.

1. **Loops seguros** — Ver viabilidade de loops rodando enquanto Lucas estuda:
   - QA de slides (screenshots, lint, a11y)
   - Mudanças incrementais (build, deploy)
   - Perplexity / pesquisa para outros agentes em segundo plano
   - Melhora da narrativa (biblia, storyboard)
   - Outros: sync Notion, reference-checker, etc.
2. **Verbosity** — AUDIT-VISUAL.md (404 linhas): split ou index; docs-audit reference.md critério
3. **Biblia narrativa** — docs/biblia-narrativa.md (302 linhas): index ou split por bloco
4. **Alinhamento Notion** — docs/SYNC-NOTION-REPO.md; References DB; Slides DB status
5. **Conflitos** — verificar redundâncias restantes (.cursor vs .claude, paths)
6. **HTML** — só após 1–5 ok: ERRO-008, AUDIT-VISUAL fixes, speaker notes PT

---

## Pendências (detalhe)

- ERRO-008 — Case panel redundante em s-hook
- AUDIT — Fixes I2–I10 (AUDIT-VISUAL.md)
- Speaker notes EN → PT
- NNT IC 95%: 4 slides [TBD] (08, 10, 11, 12) — ver tasks/NNT-IC95-REPORT.md

---

## Offline

`npm run build:cirrose`, `npm run lint:slides`, `npm run preview` — funcionam offline.

---

*03/mar*
