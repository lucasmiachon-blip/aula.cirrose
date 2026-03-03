# HANDOFF — Claude.ai (colar no Project Knowledge)

> Cirrose · enxuto

---

## Sucesso até aqui

- **Preview:** `npm run dev` → port 3000, hot reload OK
- **s-title:** Brasão USP, pilares, navy fixo, print var(--bg-navy)
- **s-hook v5:** 2 beats (Antônio → labs+pergunta), reversível (←/↑), sem sombra, interação OK. Antônio (formal), "Caminhoneiro", sem título. Click/seta avança; seta esquerda/cima volta.
- **Preview subitens:** beat 0 e beat 1 mostram estados distintos (DOM local pós-init).

---

## Prioridades (ordem — HTML por último)

1. **Loops seguros** — Viabilidade: QA slides, mudanças, Perplexity/pesquisa em bg, melhora narrativa, sync Notion (enquanto Lucas estuda)
2. Verbosity — AUDIT-VISUAL.md (404 linhas)
3. Biblia narrativa — docs/biblia-narrativa.md (302 linhas)
4. Alinhamento Notion — SYNC-NOTION-REPO, References DB
5. Conflitos — redundâncias .cursor vs .claude
6. HTML — ERRO-008, AUDIT fixes, speaker notes PT (só após 1–5)

## Pendências

- ERRO-008, AUDIT I2–I10, speaker notes EN→PT
- NNT IC 95%: 4 slides [TBD] — tasks/NNT-IC95-REPORT.md

## Próxima sessão

Ver HANDOFF.md. Offline: build, lint, preview funcionam.

---

## Paths

| Doc                | Path                                                                  |
| ------------------ | --------------------------------------------------------------------- |
| Pendências projeto | `aulas/cirrose/HANDOFF.md`                                            |
| Changelog verboso  | `aulas/cirrose/CHANGELOG.md`                                          |
| Erros + raw code   | `aulas/cirrose/ERROR-LOG.md`                                          |
| Audit 28 slides    | `aulas/cirrose/AUDIT-VISUAL.md`                                       |
| Hook               | `slides/01-hook.html`, `slide-registry.js`, `cirrose.css` (s-hook v5) |
| Init               | `index.template.html` (wireAll antes anim.connect)                    |
| Preview            | `preview.html` (beat 0/1 via DOM local pós-connect)                 |

---

## Comandos

`npm run dev` · `npm run build:cirrose` · `npm run qa:screenshots:cirrose`
