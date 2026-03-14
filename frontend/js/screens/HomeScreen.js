export function renderHomeScreen() {
  return /*html*/`
  <div id="page-home">
    <div class="hero">
      <div class="hero-text">
        <div class="hero-eyebrow">⚡ A maior base de dados de kickboxing do Brasil</div>
        <h1>O QUE ACONTECE<br>NO <em>RINGUE</em><br>FICA AQUI</h1>
        <p>Rankings, perfis de atletas, histórico de lutas, equipes e eventos. Tudo sobre kickboxing em um só lugar.</p>
        <div class="hero-btns">
          <button class="btn btn-red" onclick="showPage('rankings')">Ver Rankings</button>
          <button class="btn btn-outline" onclick="showPage('fighters')">Buscar Lutadores</button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="stat-card"><div class="num" id="stat-fighters">0</div><div class="label">Atletas Cadastrados</div></div>
        <div class="stat-card"><div class="num" id="stat-teams">0</div><div class="label">Equipes Registradas</div></div>
        <div class="stat-card"><div class="num" id="stat-fights">0</div><div class="label">Lutas Registradas</div></div>
        <div class="stat-card"><div class="num" id="stat-events">0</div><div class="label">Eventos Registrados</div></div>
      </div>
    </div>
    <div class="section">
      <div class="section-header">
        <div class="section-title">Lutadores em Destaque</div>
        <div class="section-sub">Top ranqueados</div>
        <a class="see-all" onclick="showPage('fighters')">Ver Todos →</a>
      </div>
      <div class="fighters-grid" id="home-fighters"></div>
    </div>
    <div class="section" style="background:var(--dark)">
      <div class="section-header">
        <div class="section-title">Próximos Eventos</div>
        <a class="see-all" onclick="showPage('events')">Ver Todos →</a>
      </div>
      <div class="events-list" id="home-events"></div>
    </div>
    <div class="section">
      <div class="section-header">
        <div class="section-title">Equipes em Destaque</div>
        <a class="see-all" onclick="showPage('teams')">Ver Todas →</a>
      </div>
      <div class="teams-grid" id="home-teams"></div>
    </div>
  </div>
  `;
}
