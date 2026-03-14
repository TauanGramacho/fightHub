export function renderRankingsScreen() {
  return `
  <div id="page-rankings">
    <div style="background:var(--dark);padding:32px 40px 0;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:2px;margin-bottom:4px;">Rankings</h2>
      <p style="color:var(--gray-light);font-size:14px;margin-bottom:20px;">Rankings oficiais por categoria de peso — atualizado mensalmente</p>
    </div>
    <div class="weight-class-selector" id="wc-selector">
      <button class="wc-btn active" onclick="selectWC(this,'Peso Pena (−60kg)')">Peso Pena</button>
      <button class="wc-btn" onclick="selectWC(this,'Peso Leve (−65kg)')">Peso Leve</button>
      <button class="wc-btn" onclick="selectWC(this,'Peso Meio-Médio (−71kg)')">Meio-Médio</button>
      <button class="wc-btn" onclick="selectWC(this,'Peso Médio (−75kg)')">Peso Médio</button>
      <button class="wc-btn" onclick="selectWC(this,'Peso Meio-Pesado (−81kg)')">Meio-Pesado</button>
      <button class="wc-btn" onclick="selectWC(this,'Peso Pesado (+81kg)')">Peso Pesado</button>
      <button class="wc-btn" onclick="selectWC(this,'Peso Galo (−56kg)')">Peso Galo</button>
      <button class="wc-btn" onclick="selectWC(this,'Peso Mosca (−52kg)')">Peso Mosca</button>
    </div>
    <div class="section">
      <div id="ranking-wc-title" style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:16px;"></div>
      <table class="ranking-table">
        <thead><tr>
          <th>#</th><th>Lutador</th><th>Equipe</th><th>País</th>
          <th>V</th><th>D</th><th>Último</th>
        </tr></thead>
        <tbody id="ranking-body"></tbody>
      </table>
    </div>
  </div>
  `;
}
