export function renderFighterProfileScreen() {
  return `
  <div class="breadcrumb">
    <a onclick="showPage('fighters')">Lutadores</a>
    <span class="sep">›</span>
    <span class="current" id="profile-breadcrumb">Perfil</span>
  </div>
  <div class="profile-header">
    <div class="profile-bg"></div>
    <div class="profile-bg-img" id="profile-avatar">🥊</div>
    <div class="profile-content">
      <div class="profile-eyebrow">
        <span id="profile-flag">🇧🇷</span>
        <span id="profile-division-tag">Peso Leve</span>
      </div>
      <div class="profile-name" id="profile-name">—</div>
      <div class="profile-nick" id="profile-nick">""</div>
      <div class="profile-record">
        <div class="record-block"><div class="record-num w" id="profile-w">0</div><div class="record-lbl">Vitórias</div></div>
        <div class="record-sep">–</div>
        <div class="record-block"><div class="record-num l" id="profile-l">0</div><div class="record-lbl">Derrotas</div></div>
        <div class="record-sep">–</div>
        <div class="record-block"><div class="record-num d" id="profile-d">0</div><div class="record-lbl">Empates</div></div>
      </div>
      <div class="profile-tags" id="profile-tags"></div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <button class="btn btn-red" onclick="requireAuth('Seguir Lutador')">+ Seguir</button>
        <button class="btn btn-outline" onclick="requireAuth('Comparar')">Comparar</button>
      </div>
    </div>
  </div>
  <div class="profile-info-grid">
    <div class="info-cell"><div class="val" id="pi-dob">—</div><div class="key">Data de Nascimento</div></div>
    <div class="info-cell"><div class="val" id="pi-age">—</div><div class="key">Idade</div></div>
    <div class="info-cell"><div class="val" id="pi-nat">—</div><div class="key">Nacionalidade</div></div>
    <div class="info-cell"><div class="val" id="pi-height">—</div><div class="key">Altura</div></div>
    <div class="info-cell"><div class="val" id="pi-weight">—</div><div class="key">Peso</div></div>
    <div class="info-cell"><div class="val" id="pi-team" style="cursor:pointer;color:var(--red);" onclick="goToTeam()">—</div><div class="key">Equipe</div></div>
  </div>
  <div class="tabs">
    <button class="tab-btn active" onclick="switchTab(event,'tab-fights')">Histórico de Lutas</button>
    <button class="tab-btn" onclick="switchTab(event,'tab-stats')">Estatísticas</button>
    <button class="tab-btn" onclick="switchTab(event,'tab-about')">Sobre</button>
  </div>
  <div class="tab-content active" id="tab-fights"><div id="fight-history"></div></div>
  <div class="tab-content" id="tab-stats"><div class="section"><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:16px;" id="stats-grid"></div></div></div>
  <div class="tab-content" id="tab-about"><div class="section" style="max-width:700px;"><p id="about-text" style="color:var(--white-dim);line-height:1.8;font-size:15px;"></p></div></div>
  `;
}
