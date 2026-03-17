export function renderFighterProfileScreen() {
  return `
  <div class="breadcrumb">
    <a onclick="showPage('fighters')">Lutadores</a>
    <span class="sep">></span>
    <span class="current" id="profile-breadcrumb">Perfil</span>
  </div>
  <div class="profile-header">
    <div class="profile-bg"></div>
    <div class="profile-bg-img" id="profile-avatar">F</div>
    <div class="profile-content">
      <div class="profile-eyebrow">
        <span id="profile-flag">BR</span>
        <span id="profile-division-tag">Peso Leve</span>
      </div>
      <div class="profile-name" id="profile-name">-</div>
      <div class="profile-nick" id="profile-nick">""</div>
      <div class="profile-record">
        <div class="record-block"><div class="record-num w" id="profile-w">0</div><div class="record-lbl">Vitorias</div></div>
        <div class="record-sep">-</div>
        <div class="record-block"><div class="record-num l" id="profile-l">0</div><div class="record-lbl">Derrotas</div></div>
        <div class="record-sep">-</div>
        <div class="record-block"><div class="record-num d" id="profile-d">0</div><div class="record-lbl">Empates</div></div>
      </div>
      <div class="profile-tags" id="profile-tags"></div>
        <div class="profile-actions">
          <button class="btn btn-red" id="profile-follow-btn" onclick="toggleFollowActiveFighter()">+ Seguir</button>
          <button class="btn btn-outline" id="profile-compare-btn" onclick="compareActiveFighter()">Comparar</button>
          <button class="btn btn-outline" id="profile-edit-photo-btn" style="display:none;" onclick="openOwnPhotoEditor()">Editar foto</button>
        </div>
      <div class="profile-side-panels">
        <div id="profile-follow-summary"></div>
        <div id="profile-showcase-panel"></div>
      </div>
    </div>
  </div>
  <div class="profile-info-grid">
    <div class="info-cell"><div class="val" id="pi-dob">-</div><div class="key">Data de Nascimento</div></div>
    <div class="info-cell"><div class="val" id="pi-age">-</div><div class="key">Idade</div></div>
    <div class="info-cell"><div class="val" id="pi-nat">-</div><div class="key">Nacionalidade</div></div>
    <div class="info-cell"><div class="val" id="pi-height">-</div><div class="key">Altura</div></div>
    <div class="info-cell"><div class="val" id="pi-weight">-</div><div class="key">Peso</div></div>
    <div class="info-cell"><div class="val" id="pi-team" style="cursor:pointer;color:var(--red);" onclick="goToTeam()">-</div><div class="key">Equipe</div></div>
  </div>
  <div class="tabs">
    <button class="tab-btn active" onclick="switchTab(event,'tab-about')">Sobre</button>
    <button class="tab-btn" onclick="switchTab(event,'tab-fights')">Historico de Lutas</button>
    <button class="tab-btn" onclick="switchTab(event,'tab-stats')">Estatisticas</button>
  </div>
  <div class="tab-content active" id="tab-about"><div class="section" style="max-width:700px;"><p id="about-text" style="color:var(--white-dim);line-height:1.8;font-size:15px;"></p></div></div>
  <div class="tab-content" id="tab-fights"><div id="fight-history"></div></div>
    <div class="tab-content" id="tab-stats"><div class="section"><div class="profile-stats-grid" id="stats-grid"></div><div id="profile-network"></div></div></div>
    `;
}
