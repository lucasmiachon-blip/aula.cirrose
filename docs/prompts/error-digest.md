ERROS COMUNS DO PROJETO — NAO COMETER:

1. NUNCA vw/vh em font-size dentro de slides deck.js. scaleDeck() usa transform:scale mas vw referencia viewport real — fonts estouram em viewports >1280px. Usar px fixo. (E52)
2. NUNCA flex:1 igualitario em containers com filhos de tamanho desigual. Usar flex ratios ou dividers. (E26)
3. Contraste stage-c: fundo creme claro (L=95%). Tokens *-light (L>85%) sao INVISIVEIS como foreground. Verificar contraste >=7:1 para texto primario. (E01/E09/E34/E37)
4. NUNCA display inline no <section> de slide — quebra navegacao deck.js. Layout vai em .slide-inner. (E07)
5. GSAP inline style (max specificity) sobrescreve CSS classes — race condition se ambos animam mesma propriedade. Usar API do gerenciador, nao GSAP direto. (E15/E46)
6. data-background-color NAO funciona em deck.js (legacy Reveal.js). Usar background-color no CSS com seletor #slide-id .slide-inner. (E31/E34/E39)
8. Source-tags longas (3+ citacoes): testar em 1280x720 E 1920x1080. white-space:normal + overflow-wrap:anywhere + max-width:55%. (E45)
9. Blackout overlay cinematico: alpha >=0.65 para contraste dramatico. Textos sobre overlay escuro DEVEM mudar para cores claras via GSAP (CSS mantem dark para fallback no-js). (E44)
10. width:100% + padding sem box-sizing:border-box = overflow. Apenas section e .slide-inner tem reset global. (E40)
