export function renderTeamsScreen() {
  return `
  <div style="background:var(--dark);padding:32px 40px 24px;">
    <h2 style="font-family:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:2px;margin-bottom:4px;">Equipes</h2>
    <p style="color:var(--gray-light);font-size:14px;">Academias e equipes de kickboxing cadastradas</p>
  </div>
  <div class="search-bar-section">
    <input class="search-input" placeholder="Buscar equipe por nome ou cidade..." id="teams-search" oninput="filterTeams()">
    <select class="filter-select">
      <option>Todos os Estados</option>
      <option>São Paulo</option><option>Rio de Janeiro</option><option>Minas Gerais</option><option>Paraná</option><option>Bahia</option>
    </select>
  </div>
  <div class="section"><div class="teams-grid" id="teams-grid"></div></div>
  `;
}

export function renderTeamProfileScreen() {
  return `
  <div class="breadcrumb">
    <a onclick="showPage('teams')">Equipes</a>
    <span class="sep">›</span>
    <span class="current" id="team-breadcrumb">Perfil</span>
  </div>
  <div style="background:var(--dark);padding:40px;display:flex;gap:32px;align-items:center;flex-wrap:wrap;">
    <div id="team-profile-logo" style="width:100px;height:100px;background:var(--dark3);border:1px solid var(--dark4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:40px;flex-shrink:0;"></div>
    <div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--red);margin-bottom:8px;" id="team-profile-location"></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:56px;letter-spacing:2px;line-height:0.9;margin-bottom:12px;" id="team-profile-name">—</div>
      <div style="font-size:13px;color:var(--gray-light);" id="team-profile-meta"></div>
      <div style="display:flex;gap:32px;margin-top:20px;">
        <div><div style="font-family:'Bebas Neue',sans-serif;font-size:36px;" id="tp-fighters">0</div><div style="font-size:11px;color:var(--gray-light);text-transform:uppercase;letter-spacing:1px;">Lutadores</div></div>
        <div><div style="font-family:'Bebas Neue',sans-serif;font-size:36px;" id="tp-wins">0</div><div style="font-size:11px;color:var(--gray-light);text-transform:uppercase;letter-spacing:1px;">Vitórias</div></div>
        <div><div style="font-family:'Bebas Neue',sans-serif;font-size:36px;" id="tp-titles">0</div><div style="font-size:11px;color:var(--gray-light);text-transform:uppercase;letter-spacing:1px;">Títulos</div></div>
      </div>
    </div>
  </div>
  <div style="padding:24px 40px;">
    <div class="section-title" style="margin-bottom:20px;">Lutadores da Equipe</div>
    <div class="fighters-grid" id="team-fighters-grid"></div>
  </div>
  `;
}
