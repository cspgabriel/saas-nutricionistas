import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'slides.json'), 'utf8'));
const OUT = path.resolve(__dirname, '../out');
fs.mkdirSync(OUT, { recursive: true });

const W = 1080, H = 1350;
const B = data.brand;

const FONT = `'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif`;

function shell(inner, bg, color = B.ink) {
  return `<!doctype html><html><head><meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;-webkit-font-smoothing:antialiased}
    html,body{width:${W}px;height:${H}px;font-family:${FONT};color:${color};background:${bg};overflow:hidden}
    .frame{width:${W}px;height:${H}px;padding:96px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
    .frame.center{justify-content:center;align-items:center;text-align:center}
    h1{font-weight:900;letter-spacing:-.03em;line-height:1.04}
    h2{font-weight:800;letter-spacing:-.02em;line-height:1.08}
    p{font-weight:500;line-height:1.35}
    .tag{display:inline-block;font-size:18px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;padding:10px 18px;border-radius:999px}
    .logo{position:absolute;bottom:64px;left:96px;display:flex;align-items:center;gap:14px;font-size:24px;font-weight:800;letter-spacing:-.02em}
    .logo .badge{width:48px;height:48px;border-radius:12px;background:${B.green};color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;box-shadow:0 8px 24px rgba(16,185,129,.35)}
    .blob{position:absolute;border-radius:50%;filter:blur(120px);opacity:.35;pointer-events:none}
    .btn{display:inline-flex;align-items:center;gap:12px;background:#fff;color:${B.green};font-weight:800;font-size:36px;padding:28px 44px;border-radius:999px;box-shadow:0 24px 60px rgba(0,0,0,.18)}
    .card{background:#fff;border-radius:32px;padding:48px;box-shadow:0 24px 48px rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.04)}
    .li{display:flex;gap:20px;align-items:flex-start;font-size:34px;font-weight:600;line-height:1.3}
    .li + .li{margin-top:26px}
    .arrow{position:absolute;right:96px;bottom:96px;font-size:64px;color:${B.green};font-weight:900}
  </style></head><body><div class="frame">${inner}</div></body></html>`;
}

const logo = `<div class="logo"><div class="badge">📋</div><span>NutriSystem</span></div>`;
const logoWhite = `<div class="logo" style="color:#fff"><div class="badge" style="background:#fff;color:${B.green}">📋</div><span>NutriSystem</span></div>`;

function render(slide) {
  switch (slide.kind) {
    case 'cover-green': {
      const inner = `
        <div class="blob" style="background:#34d399;width:600px;height:600px;top:-200px;right:-200px"></div>
        <div class="blob" style="background:#a7f3d0;width:600px;height:600px;bottom:-300px;left:-200px"></div>
        <div style="margin-top:20px"><span class="tag" style="background:rgba(255,255,255,.18);color:#fff">${slide.brand || 'NUTRISYSTEM'}</span></div>
        <div style="margin-bottom:120px;flex:1;display:flex;align-items:center"><h1 style="font-size:78px;color:#fff;max-width:920px;line-height:1.05">${slide.title}</h1></div>
        ${logoWhite}`;
      return shell(inner, B.green, '#fff');
    }
    case 'iphone-mockup': {
      // Mockup iPhone inspirado em Dietitian: lista de refeições + próximas consultas
      const themes = { white: ['#fff', B.ink], surface: [B.surface, B.ink], dark: [B.ink, '#fff'] };
      const [bg, fg] = themes[slide.theme] || themes.white;
      const iphone = `
        <div style="position:relative;width:520px;height:1060px;margin:0 auto">
          <div style="position:absolute;inset:0;background:#111;border-radius:64px;padding:14px;box-shadow:0 40px 80px rgba(0,0,0,.18)">
            <div style="width:100%;height:100%;background:#fff;border-radius:52px;overflow:hidden;position:relative;display:flex;flex-direction:column">
              <div style="height:48px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 36px;font-size:18px;font-weight:700;color:#111">
                <span>9:41</span>
                <div style="position:absolute;left:50%;transform:translateX(-50%);top:14px;width:120px;height:32px;background:#000;border-radius:24px"></div>
                <span style="display:flex;gap:6px;align-items:center">📶 🔋</span>
              </div>
              <div style="padding:24px 36px 8px;display:flex;justify-content:space-between;align-items:center">
                <div style="display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:10px;background:${B.green};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:18px">N</div><span style="font-size:22px;font-weight:800;color:${B.ink}">NutriSystem</span></div>
                <span style="font-size:22px">🔔</span>
              </div>
              <div style="padding:24px 36px;flex:1;background:#FAFAFC">
                <div style="font-size:16px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">Próxima refeição</div>
                <div style="background:#fff;border-radius:18px;padding:20px;margin-bottom:24px;border:1px solid #eef0f3">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><span style="color:${B.green};font-weight:800;font-size:20px">Almoço · 12:30</span><span style="background:${B.greenLight};color:${B.green};font-size:12px;font-weight:800;padding:4px 10px;border-radius:999px">HOJE</span></div>
                  <div style="font-size:15px;color:#374151;line-height:1.5">Carne patinho · 140g<br>Arroz integral · 140g<br>Legumes assados · 70g</div>
                </div>
                <div style="font-size:16px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px">Próximos pacientes</div>
                ${['Cíntia · 14:30','Taysa · 15:30','Lair · 16:30'].map((p, i) => `
                  <div style="background:#fff;border-radius:14px;padding:14px 18px;margin-bottom:10px;display:flex;align-items:center;gap:12px;border:1px solid #eef0f3">
                    <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,${['#34d399','#60a5fa','#fbbf24'][i]} 0%,${['#10b981','#3b82f6','#f59e0b'][i]} 100%)"></div>
                    <span style="font-size:16px;font-weight:600;color:${B.ink}">${p}</span>
                  </div>`).join('')}
              </div>
              <div style="height:64px;background:#fff;border-top:1px solid #eef0f3;display:flex;justify-content:space-around;align-items:center;font-size:22px">🏠 📅 ✨ 👥 ⚙️</div>
            </div>
          </div>
        </div>`;
      const inner = `
        <div>${slide.tag ? `<span class="tag" style="background:${B.greenLight};color:${B.green}">${slide.tag}</span>` : ''}
          <h1 style="font-size:72px;color:${fg};max-width:900px;line-height:1.06;margin-top:24px">${slide.h1}</h1>
          ${slide.body ? `<p style="font-size:28px;color:${B.inkSoft};margin-top:20px;max-width:880px">${slide.body}</p>` : ''}
        </div>
        ${iphone}`;
      return shell(`<div style="display:grid;grid-template-columns:1fr;grid-template-rows:auto 1fr;width:100%;height:100%;gap:32px">${inner}</div>`, bg, fg);
    }
    case 'patients-table': {
      // Tabela de pacientes inspirada em DietSystem — avatares + badges
      const rows = (slide.rows || []).map((r, i) => {
        const colors = ['#34d399','#60a5fa','#fbbf24','#f87171','#a78bfa'];
        const badgeBg = { Ativo: B.greenLight, Pendente: '#fef3c7', Pago: B.greenLight, Concluído: '#dbeafe' }[r.status] || B.greenLight;
        const badgeFg = { Ativo: B.green, Pendente: B.amber500, Pago: B.green, Concluído: '#2563eb' }[r.status] || B.green;
        return `<div style="display:flex;align-items:center;justify-content:space-between;padding:24px 28px;border-top:1px solid #f1f3f5">
          <div style="display:flex;align-items:center;gap:18px;flex:1">
            <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,${colors[i%5]} 0%,${B.green} 100%)"></div>
            <div><div style="font-size:24px;font-weight:700;color:${B.ink}">${r.name}</div><div style="font-size:18px;color:${B.inkSoft};margin-top:2px">${r.label}</div></div>
          </div>
          <div style="flex:0 0 220px"><div style="height:8px;background:#eef0f3;border-radius:999px;overflow:hidden"><div style="height:100%;width:${r.progress}%;background:${B.green}"></div></div><div style="font-size:14px;color:${B.inkSoft};margin-top:6px">${r.progress}% completo</div></div>
          <div style="flex:0 0 140px;text-align:right"><span style="background:${badgeBg};color:${badgeFg};font-size:16px;font-weight:800;padding:8px 16px;border-radius:999px">● ${r.status}</span></div>
        </div>`;
      }).join('');
      const inner = `
        <div>
          ${slide.tag ? `<span class="tag" style="background:${B.greenLight};color:${B.green}">${slide.tag}</span>` : ''}
          <h1 style="font-size:64px;margin-top:24px;max-width:900px;line-height:1.06">${slide.h1}</h1>
        </div>
        <div class="card" style="padding:0;overflow:hidden;background:#fff">
          <div style="padding:24px 28px;background:#FAFAFC;display:flex;align-items:center;justify-content:space-between;font-size:14px;font-weight:800;color:${B.inkSoft};letter-spacing:.12em;text-transform:uppercase"><span>Paciente</span><span style="flex:0 0 220px">Progresso</span><span style="flex:0 0 140px;text-align:right">Status</span></div>
          ${rows}
        </div>
        <div style="font-size:24px;color:${B.inkSoft};font-weight:500;max-width:900px">${slide.footer || ''}</div>`;
      return shell(`<div style="display:flex;flex-direction:column;gap:36px;height:100%;justify-content:space-between">${inner}</div>`, B.surface, B.ink);
    }
    case 'case-card': {
      // Card de case — foto avatar gradiente + nome + KPIs em pills (estilo dashboard SaaS)
      const inner = `
        <div>${slide.tag ? `<span class="tag" style="background:${B.greenLight};color:${B.green}">${slide.tag}</span>` : ''}
          <h1 style="font-size:64px;margin-top:24px;max-width:900px">${slide.h1}</h1>
        </div>
        <div class="card" style="display:flex;flex-direction:column;gap:32px;padding:56px">
          <div style="display:flex;align-items:center;gap:24px">
            <div style="width:96px;height:96px;border-radius:50%;background:linear-gradient(135deg,#34d399 0%,${B.green} 100%);box-shadow:0 12px 32px rgba(16,185,129,.25);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:40px">${slide.initials || 'J'}</div>
            <div><div style="font-size:36px;font-weight:800">${slide.name}</div><div style="font-size:22px;color:${B.inkSoft};margin-top:4px">${slide.role}</div></div>
          </div>
          <p style="font-size:28px;line-height:1.45;color:${B.ink}">"${slide.quote}"</p>
          <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:16px">
            ${(slide.kpis || []).map(k => `<div style="background:${B.greenLight};border-radius:18px;padding:24px"><div style="font-size:48px;font-weight:900;color:${B.green};letter-spacing:-.02em">${k.value}</div><div style="font-size:18px;color:${B.ink};font-weight:600;margin-top:4px">${k.label}</div></div>`).join('')}
          </div>
        </div>
        <div></div>`;
      return shell(`<div style="display:flex;flex-direction:column;gap:32px;height:100%">${inner}</div>`, B.surface, B.ink);
    }
    case 'cover-gradient': {
      const inner = `
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,${B.green} 0%,${B.purple} 100%)"></div>
        <div style="position:relative;margin-top:80px"><span class="tag" style="background:rgba(255,255,255,.22);color:#fff">${slide.tag}</span></div>
        <div style="position:relative;margin-bottom:120px"><h1 style="font-size:84px;color:#fff;max-width:900px;line-height:1.05">${slide.title}</h1></div>
        <div style="position:relative">${logoWhite.replace('<div class="logo"','<div class="logo" style="position:relative;left:0;bottom:0"')}</div>`;
      return shell(inner, B.ink, '#fff');
    }
    case 'title-body': {
      const themes = { white: ['#fff', B.ink], dark: [B.ink, '#fff'], surface: [B.surface, B.ink] };
      const [bg, fg] = themes[slide.theme] || themes.white;
      const accent = slide.theme === 'dark' ? B.green : B.green;
      const tag = slide.tag ? `<span class="tag" style="background:${slide.theme==='dark'?'rgba(255,255,255,.12)':B.greenLight};color:${slide.theme==='dark'?'#fff':B.green}">${slide.tag}</span>` : '';
      const inner = `
        <div>${tag}</div>
        <div>
          <h1 style="font-size:76px;color:${fg};max-width:900px;line-height:1.06">${slide.h1}</h1>
          ${slide.body ? `<p style="font-size:32px;color:${slide.theme==='dark'?'#d1d5db':B.inkSoft};margin-top:32px;max-width:880px">${slide.body}</p>` : ''}
        </div>
        ${slide.theme==='dark' ? logoWhite : logo}`;
      return shell(inner, bg, fg);
    }
    case 'feature-list': {
      const themes = { white: ['#fff', B.ink], surface: [B.surface, B.ink], dark: [B.ink, '#fff'], red: [B.red50, B.ink], greenLight: [B.greenLight, B.ink] };
      const [bg, fg] = themes[slide.theme] || themes.white;
      const tagColor = slide.theme === 'red' ? B.red500 : B.green;
      const tagBg = slide.theme === 'red' ? '#fee2e2' : B.greenLight;
      const tag = slide.tag ? `<span class="tag" style="background:${tagBg};color:${tagColor}">${slide.tag}</span>` : '';
      const items = slide.items.map(i => `<div class="li" style="color:${fg}">${i}</div>`).join('');
      const inner = `
        <div>${tag}${slide.h1?`<h2 style="font-size:64px;margin-top:24px;color:${fg};max-width:880px">${slide.h1}</h2>`:''}</div>
        <div>${items}</div>
        <div style="height:80px"></div>`;
      return shell(inner, bg, fg);
    }
    case 'dor': {
      const inner = `
        <div style="width:128px;height:128px;border-radius:32px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:64px;box-shadow:0 12px 32px rgba(0,0,0,.06)">${slide.icon}</div>
        <div>
          <h2 style="font-size:72px;color:${slide.fg};max-width:880px">${slide.h2}</h2>
          <p style="font-size:34px;color:${B.ink};margin-top:32px;max-width:880px">${slide.body}</p>
        </div>
        ${logo}`;
      return shell(inner, slide.bg, B.ink);
    }
    case 'stat': {
      const inner = `
        <div><span class="tag" style="background:rgba(16,185,129,.15);color:${B.green}">${slide.tag}</span></div>
        <div>
          <h1 style="font-size:280px;color:#fff;letter-spacing:-.05em">${slide.stat}</h1>
          <div style="width:120px;height:6px;background:${B.green};margin:32px 0"></div>
          <p style="font-size:38px;color:${B.green};max-width:880px;font-weight:700">${slide.subhead}</p>
        </div>
        <div>
          <p style="font-size:26px;color:#9ca3af;max-width:880px;line-height:1.4">${slide.footer}</p>
          ${logoWhite.replace('<div class="logo"','<div class="logo" style="position:relative;left:0;bottom:0;margin-top:40px"')}
        </div>`;
      return shell(inner, B.ink, '#fff');
    }
    case 'ba': {
      const isAntes = slide.side === 'antes';
      const bg = isAntes ? B.surface : B.greenLight;
      const tagColor = isAntes ? B.inkSoft : B.green;
      const tagBg = isAntes ? '#e5e7eb' : '#bbf7d0';
      const inner = `
        <div><span class="tag" style="background:${tagBg};color:${tagColor}">${slide.tag}</span></div>
        <div class="card" style="background:#fff;border-radius:24px">
          <div style="display:flex;gap:8px;margin-bottom:32px">
            <div style="width:12px;height:12px;border-radius:50%;background:#f87171"></div>
            <div style="width:12px;height:12px;border-radius:50%;background:#fbbf24"></div>
            <div style="width:12px;height:12px;border-radius:50%;background:#34d399"></div>
          </div>
          <div style="height:24px;background:#e5e7eb;border-radius:8px;margin-bottom:16px;width:60%"></div>
          <div style="height:16px;background:#f3f4f6;border-radius:8px;margin-bottom:12px"></div>
          <div style="height:16px;background:#f3f4f6;border-radius:8px;margin-bottom:12px;width:80%"></div>
          <div style="height:16px;background:#f3f4f6;border-radius:8px;margin-bottom:24px;width:90%"></div>
          ${isAntes
            ? `<div style="height:160px;background:#f3f4f6;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#9ca3af;font-size:24px">Word · prontuário em branco</div>`
            : `<div style="height:160px;background:${B.greenLight};border-radius:12px;display:flex;align-items:center;justify-content:center;color:${B.green};font-size:24px;font-weight:700">✨ IA estruturando anamnese...</div>`}
        </div>
        <p style="font-size:36px;color:${B.ink};font-weight:600;max-width:880px">${slide.body}</p>`;
      return shell(inner, bg, B.ink);
    }
    case 'steps': {
      const items = slide.steps.map((s, i) => `<div class="li" style="font-size:34px"><span style="background:${B.green};color:#fff;width:48px;height:48px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0">${i+1}</span>${s}</div>`).join('');
      const inner = `
        <div><h1 style="font-size:72px">${slide.h1}</h1></div>
        <div>${items}</div>
        ${logo}`;
      return shell(inner, '#fff', B.ink);
    }
    case 'icon-card': {
      const themes = { white: ['#fff', B.ink], surface: [B.surface, B.ink] };
      const [bg, fg] = themes[slide.theme] || themes.white;
      const inner = `
        <div style="width:128px;height:128px;border-radius:32px;background:${B.greenLight};color:${B.green};display:flex;align-items:center;justify-content:center;font-size:64px">${slide.icon}</div>
        <div>
          <h2 style="font-size:64px;color:${fg};max-width:880px">${slide.h2}</h2>
          <p style="font-size:32px;color:${B.inkSoft};margin-top:28px;max-width:880px">${slide.body}</p>
        </div>
        ${logo}`;
      return shell(inner, bg, fg);
    }
    case 'cta-green': {
      const inner = `
        <div class="blob" style="background:#fff;width:500px;height:500px;top:-200px;right:-200px;opacity:.15"></div>
        <div></div>
        <div class="center" style="text-align:center;width:100%">
          <h1 style="font-size:88px;color:#fff;max-width:900px;margin:0 auto">${slide.h1}</h1>
          <div style="margin-top:48px"><span class="btn">${slide.button} →</span></div>
          ${slide.footnote ? `<p style="font-size:24px;color:rgba(255,255,255,.85);margin-top:32px">${slide.footnote}</p>` : ''}
        </div>
        ${logoWhite}`;
      return shell(inner, B.green, '#fff');
    }
    case 'quote-photo': {
      const inner = `
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,#0f172a 0%,${B.green} 100%);opacity:.92"></div>
        <div style="position:absolute;inset:0;background:radial-gradient(circle at 30% 40%,rgba(255,255,255,.15) 0%,transparent 50%)"></div>
        <div style="position:relative"><span class="tag" style="background:rgba(255,255,255,.18);color:#fff">${slide.tag}</span></div>
        <div style="position:relative"><h1 style="font-size:72px;color:#fff;max-width:880px">${slide.title}</h1></div>
        <div style="position:relative">${logoWhite.replace('<div class="logo"','<div class="logo" style="position:relative;left:0;bottom:0"')}</div>`;
      return shell(inner, B.ink, '#fff');
    }
    case 'quote-green': {
      const inner = `
        <div style="font-size:200px;line-height:1;color:rgba(255,255,255,.25);font-weight:900">"</div>
        <div>
          <p style="font-size:48px;color:#fff;font-weight:700;line-height:1.25;max-width:900px">${slide.quote}</p>
          <p style="font-size:28px;color:rgba(255,255,255,.85);margin-top:32px">— ${slide.author}</p>
        </div>
        ${logoWhite}`;
      return shell(inner, B.green, '#fff');
    }
    case 'cta-final': {
      const bullets = slide.bullets.map(b => `<div class="li" style="font-size:34px;color:rgba(255,255,255,.95)">${b}</div>`).join('');
      const inner = `
        <div class="blob" style="background:#a7f3d0;width:600px;height:600px;top:-300px;right:-200px;opacity:.25"></div>
        ${logoWhite.replace('<div class="logo"','<div class="logo" style="position:relative;left:0;bottom:0;margin-bottom:24px"')}
        <div>
          <h1 style="font-size:104px;color:#fff;max-width:900px">${slide.h1}</h1>
          <div style="margin-top:40px">${bullets}</div>
        </div>
        <div>
          <div class="card" style="background:#fff;display:inline-flex;align-items:center;gap:16px;padding:32px 44px;border-radius:24px"><span style="color:${B.green};font-size:34px;font-weight:800">${slide.url}</span></div>
          <p style="font-size:22px;color:rgba(255,255,255,.85);margin-top:24px">${slide.footnote}</p>
        </div>`;
      return shell(inner, B.green, '#fff');
    }
    default:
      return shell(`<div><h1>Missing: ${slide.kind}</h1></div>`, '#fff');
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

let count = 0;
for (const post of data.posts) {
  const postDir = path.join(OUT, post.id);
  fs.mkdirSync(postDir, { recursive: true });
  for (let i = 0; i < post.slides.length; i++) {
    const html = render(post.slides[i]);
    await page.setContent(html, { waitUntil: 'networkidle' });
    const n = String(i + 1).padStart(2, '0');
    const file = path.join(postDir, `slide-${n}.png`);
    await page.screenshot({ path: file, fullPage: false, clip: { x: 0, y: 0, width: W, height: H } });
    console.log(`✓ ${post.id}/slide-${n}.png`);
    count++;
  }
}

await browser.close();
console.log(`\nDone. ${count} slides em ${OUT}`);
