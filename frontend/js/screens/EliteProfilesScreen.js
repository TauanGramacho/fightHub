export function renderEliteProfilesScreen() {
  return `
  <div id="page-elite-profiles">
    <div class="elite-hero">
      <div class="elite-hero-mark">FIGHTHUB</div>
      <div class="elite-hero-logo elite-hero-logo-primary" aria-hidden="true">
        <div class="elite-logo-shield">
          <span class="elite-logo-word elite-logo-word-top">FIGHT</span>
          <span class="elite-logo-divider"></span>
          <span class="elite-logo-word elite-logo-word-bottom">HUB</span>
        </div>
      </div>
      <h1 class="elite-hero-title">Vitrine de Elite</h1>
      <p class="elite-hero-copy">Descubra atletas premium em ascensao, compare trajetorias e acompanhe os perfis aprovados mais relevantes do kickboxing nacional.</p>
      <div class="elite-hero-actions">
        <button class="btn btn-outline" onclick="showToast('A Vitrine aprova apenas atletas com perfil completo, plano premium e analise liberada pela equipe FightHub.')">Como Funciona</button>
        <button class="btn btn-red" onclick="showPage('compare')">Montar Comparacao</button>
      </div>
      <div class="elite-logo-gallery">
        <div class="elite-logo-option">
          <div class="elite-hero-logo">
            <div class="elite-logo-shield">
              <span class="elite-logo-word elite-logo-word-top">FIGHT</span>
              <span class="elite-logo-divider"></span>
              <span class="elite-logo-word elite-logo-word-bottom">HUB</span>
            </div>
          </div>
          <div class="elite-logo-name">Escudo Fight Hub</div>
        </div>
        <div class="elite-logo-option">
          <div class="elite-hero-logo">
            <div class="elite-logo-ring">
              <span class="elite-logo-ring-fighter elite-logo-ring-fighter-left">
                <span class="elite-logo-ring-head"></span>
                <span class="elite-logo-ring-arm elite-logo-ring-arm-front"></span>
                <span class="elite-logo-ring-arm elite-logo-ring-arm-back"></span>
                <span class="elite-logo-ring-body"></span>
                <span class="elite-logo-ring-leg elite-logo-ring-leg-front"></span>
                <span class="elite-logo-ring-leg elite-logo-ring-leg-back"></span>
              </span>
              <span class="elite-logo-ring-fighter elite-logo-ring-fighter-right">
                <span class="elite-logo-ring-head"></span>
                <span class="elite-logo-ring-arm elite-logo-ring-arm-front"></span>
                <span class="elite-logo-ring-arm elite-logo-ring-arm-back"></span>
                <span class="elite-logo-ring-body"></span>
                <span class="elite-logo-ring-leg elite-logo-ring-leg-front"></span>
                <span class="elite-logo-ring-leg elite-logo-ring-leg-back"></span>
              </span>
            </div>
          </div>
          <div class="elite-logo-name">Ringue</div>
        </div>
        <div class="elite-logo-option">
          <div class="elite-hero-logo">
            <div class="elite-logo-badge">
              <span class="elite-logo-badge-top">ELITE</span>
              <span class="elite-logo-badge-stars">. . .</span>
              <span class="elite-logo-badge-ribbon">SELO ELITE</span>
            </div>
          </div>
          <div class="elite-logo-name">Selo Elite</div>
        </div>
      </div>
    </div>
    <div class="search-bar-section elite-search-bar">
      <input class="search-input" id="elite-search" placeholder="Buscar atleta, equipe ou categoria..." oninput="renderEliteProfilesPage()">
      <button class="btn btn-red" onclick="renderEliteProfilesPage()">Buscar</button>
    </div>
    <div class="section">
      <div class="section-header">
        <div class="section-title">Selecao Tecnica</div>
        <div class="section-sub" id="elite-count">0 perfis em exibicao</div>
      </div>
      <div id="elite-profiles-list" class="elite-profiles-list"></div>
    </div>
  </div>
  `;
}

export function renderCompareScreen() {
  return `
  <div id="page-compare">
    <div style="background:var(--dark);padding:32px 40px 0;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:2px;margin-bottom:4px;">Comparador de Lutadores</h2>
      <p style="color:var(--gray-light);font-size:14px;margin-bottom:24px;">Selecione dois atletas e veja o confronto tecnico lado a lado.</p>
    </div>
    <div class="search-bar-section">
      <input class="search-input" id="compare-search" placeholder="Buscar lutador para comparar..." oninput="renderCompareCandidates()">
      <button class="btn btn-outline" onclick="clearCompareFighters()">Limpar</button>
    </div>
    <div class="section">
      <div class="compare-selection" id="compare-selection"></div>
      <div class="section-header" style="margin-top:24px;">
        <div class="section-title">Adicionar ao Comparativo</div>
        <div class="section-sub">Escolha ate 2 atletas</div>
      </div>
      <div class="fighters-grid" id="compare-candidates"></div>
    </div>
  </div>
  `;
}
