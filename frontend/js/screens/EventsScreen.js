export function renderEventsScreen() {
  return `
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
  `;
}
