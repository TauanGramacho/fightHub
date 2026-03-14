export function renderFightersScreen() {
  return `
  <div id="page-fighters">
    <div style="background:var(--dark);padding:32px 40px 0;">
      <h2 style="font-family:'Bebas Neue',sans-serif;font-size:40px;letter-spacing:2px;margin-bottom:4px;">Lutadores</h2>
      <p style="color:var(--gray-light);font-size:14px;margin-bottom:24px;">Busque e explore o banco de dados de atletas de kickboxing</p>
    </div>
    <div class="search-bar-section">
      <input class="search-input" placeholder="Buscar lutador por nome, apelido, equipe..." id="fighters-search" oninput="filterFighters()">
      <select class="filter-select" id="fighters-division" onchange="filterFighters()">
        <option value="">Todas as Categorias</option>
        <option>Peso Mosca (−52kg)</option><option>Peso Galo (−56kg)</option>
        <option>Peso Pena (−60kg)</option><option>Peso Leve (−65kg)</option>
        <option>Peso Meio-Médio (−71kg)</option><option>Peso Médio (−75kg)</option>
        <option>Peso Meio-Pesado (−81kg)</option><option>Peso Pesado (+81kg)</option>
      </select>
    </div>
    <div class="section">
      <div id="fighters-count" style="font-size:13px;color:var(--gray-light);margin-bottom:16px;font-family:'Barlow Condensed',sans-serif;letter-spacing:1px;text-transform:uppercase;"></div>
      <div class="fighters-grid" id="fighters-grid"></div>
    </div>
  </div>
  `;
}
