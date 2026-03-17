export function renderEventsScreen() {
  return `
  <div id="page-events">
    <div style="background:var(--dark);padding:32px 40px 0;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:2px;margin-bottom:4px;">Eventos</h2>
      <p style="color:var(--gray-light);font-size:14px;margin-bottom:0;">Campeonatos, torneios e shows de kickboxing</p>
    </div>
    <div class="tabs" style="padding:0 40px;">
      <button class="tab-btn active" onclick="switchEventsTab(event,'upcoming')">Próximos</button>
      <button class="tab-btn" onclick="switchEventsTab(event,'past')">Passados</button>
      <button class="tab-btn" onclick="switchEventsTab(event,'all')">Todos</button>
    </div>
    <div class="section"><div class="events-list" id="events-list"></div></div>
  </div>
  `;
}

export function renderEventProfileScreen() {
  return `
  <div class="breadcrumb">
    <a onclick="showPage('events')">Eventos</a>
    <span class="sep">â€º</span>
    <span class="current" id="event-breadcrumb">Detalhes</span>
  </div>
  <div style="background:var(--dark);padding:40px;">
    <div style="display:flex;justify-content:space-between;gap:24px;align-items:flex-start;flex-wrap:wrap;">
      <div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:var(--red);margin-bottom:10px;" id="event-org-tag">Organização</div>
        <div style="font-family:'Bebas Neue',sans-serif;font-size:58px;letter-spacing:2px;line-height:0.95;margin-bottom:10px;" id="event-name">Evento</div>
        <div style="color:var(--gray-light);font-size:14px;" id="event-location-date">Cidade · Data</div>
      </div>
      <div id="event-status-badge" class="event-status status-upcoming">Próximo</div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-top:24px;">
      <div class="stat-card"><div class="num" id="event-fights-count">0</div><div class="label">Lutas Previstas</div></div>
      <div class="stat-card"><div class="num" id="event-city-short">—</div><div class="label">Cidade-Sede</div></div>
      <div class="stat-card"><div class="num" id="event-season">—</div><div class="label">Temporada</div></div>
    </div>
  </div>
  <div class="tabs">
    <button class="tab-btn active" onclick="switchTab(event,'tab-event-results')">Resultados</button>
    <button class="tab-btn" onclick="switchTab(event,'tab-event-info')">Dados do Evento</button>
  </div>
  <div class="tab-content active" id="tab-event-results">
    <div class="section">
      <div class="section-header">
        <div class="section-title">Card do Evento</div>
        <div class="section-sub">Resultados e confrontos</div>
      </div>
      <div id="event-results-list" class="events-list"></div>
    </div>
  </div>
  <div class="tab-content" id="tab-event-info">
    <div class="section">
      <div class="profile-info-grid">
        <div class="info-cell"><div class="val" id="event-info-org">—</div><div class="key">Organização</div></div>
        <div class="info-cell"><div class="val" id="event-info-date">—</div><div class="key">Data</div></div>
        <div class="info-cell"><div class="val" id="event-info-city">—</div><div class="key">Cidade</div></div>
        <div class="info-cell"><div class="val" id="event-info-status">—</div><div class="key">Status</div></div>
        <div class="info-cell"><div class="val" id="event-info-fights">—</div><div class="key">Total de Lutas</div></div>
        <div class="info-cell"><div class="val" id="event-info-summary">—</div><div class="key">Leitura Rápida</div></div>
      </div>
    </div>
  </div>
  `;
}
