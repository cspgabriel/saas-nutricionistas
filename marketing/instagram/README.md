# NutriSystem — Instagram (Kit de Lançamento)

Tudo o que precisa pra abrir o perfil **@nutrisystem.app** e rodar o primeiro mês.

## 📂 Estrutura

```
marketing/
├── brand-profile.json          # Identidade, voz, paleta, dores, hashtags
└── instagram/
    ├── 00-perfil-setup.md      # Bio, foto, highlights, ordem do grid
    ├── CALENDARIO-30D.md       # Plano editorial de 30 dias
    └── posts/
        ├── 01-manifesto.md     # Carrossel 6 slides — capa do grid
        ├── 02-tres-dores.md    # Carrossel 5 slides — identificação
        ├── 03-tempo-real.md    # Estático — post de dado (4h12min)
        ├── 04-prontuario.md    # Carrossel 6 slides — feature
        ├── 05-plano-alimentar.md  # Carrossel 5 — IA em 30s
        ├── 06-ia-explainer.md  # Carrossel 5 — objeção LGPD
        ├── 07-antes-depois.md  # Carrossel 4 — comparativo
        ├── 08-case-joana.md    # Carrossel 5 — prova social (placeholder)
        └── 09-cta-comecar.md   # Estático — pin do grid
```

## 🎨 Identidade visual (resumo)

- **Primary:** `#10B981` (verde-menta)
- **Ink:** `#1C1C1E`
- **Surface:** `#F5F5F7`
- **Fonte:** Geist Variable (sans, headlines Black 900)
- **Vibe:** Apple Health × Linear × Notion. Glassmorph sutil, cantos 16–30px, muito branco.
- **Evitar:** emoji de frutinha, fundo aquarela, fontes redondas tipo Quicksand.

## 🚀 Como executar

### Setup do perfil (1 dia)
1. Cria o perfil **@nutrisystem.app** com foto, bio e link de `00-perfil-setup.md`.
2. Gera as 6 capas de highlight no mesmo verde + ícone branco.
3. Posta os 9 posts em ordem inversa do grid (09 → 01) ou tudo de uma vez se for novo perfil.
4. Fixa o **post 01 (manifesto)**, **05 (IA)** e **08 (case)** nos 3 pins.

### Produção dos visuais
Cada arquivo `.md` em `posts/` traz:
- Estrutura slide a slide
- Cores exatas, fonte, tamanhos
- Copy pronta (slides + legenda + hashtags)

**Ferramentas sugeridas:**
- Figma (template a partir do design system do produto)
- Canva Pro (mais rápido pra time não-designer)
- Skill `instagram-carousel-generator` ou `agenciar-carousel` (se quiser gerar visuais por IA)

### Calendário
Segue `CALENDARIO-30D.md` — 4 posts/semana + stories.

## 📊 Métricas pra acompanhar (mês 1)

| Métrica | Meta |
|---|---|
| Seguidores orgânicos | +1.500 |
| Saves em carrossel | 4–7% do alcance |
| CTR link bio | >2% |
| Cadastros via IG | 60 |

## 🔁 Próximos passos

- [ ] Gravar 1 Reels por semana (roteiros em `CALENDARIO-30D.md`)
- [ ] Trocar `08-case-joana.md` por case real
- [ ] Criar versão English do kit pra mercado LATAM/PT-PT
- [ ] Setar UTM `utm_source=ig&utm_medium=organic&utm_campaign=launch` no link bio

---

Quer que eu **gere os visuais** (PNG dos slides), **escreva os roteiros completos** dos Reels, ou **monte a versão em inglês**? Só pedir.
