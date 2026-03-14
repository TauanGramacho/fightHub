export function renderNavbar() {
  return /*html*/`
  <nav id="main-nav">
    <div class="nav-logo" onclick="showPage('home')">FIGHT<span>HUB</span></div>
    <div class="nav-links">
      <a onclick="showPage('home')" data-page="home">Início</a>
      <a onclick="showPage('fighters')" data-page="fighters">Lutadores</a>
      <a onclick="showPage('teams')" data-page="teams">Equipes</a>
      <a onclick="showPage('events')" data-page="events">Eventos</a>
      <a onclick="showPage('rankings')" data-page="rankings">Rankings</a>
    </div>
    <div class="nav-right" id="nav-auth">
      <button class="btn btn-outline" onclick="showPage('login')">Entrar</button>
      <button class="btn btn-red" onclick="showPage('register')">Cadastrar</button>
    </div>
    <div class="nav-right" id="nav-user" style="display:none">
      <span style="font-size:13px;color:var(--gray-light);font-family:'Barlow Condensed',sans-serif;letter-spacing:1px;">Olá, <strong style="color:var(--white);" id="user-greeting"></strong></span>
      <button class="btn btn-outline" onclick="openModal('modal-add-fighter')">+ Lutador</button>
      <button class="btn btn-outline" onclick="openModal('modal-add-event')">+ Evento</button>
      <button class="btn btn-red" onclick="logout()">Sair</button>
    </div>
  </nav>
  `;
}

export function renderModals() {
  return `
  <!-- MODAL ADD FIGHTER -->
  <div class="modal-overlay" id="modal-add-fighter">
    <div class="modal">
      <button class="modal-close" onclick="closeModal('modal-add-fighter')">✕</button>
      <div class="modal-title">Cadastrar Lutador</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nome</label><input class="form-input" id="af-nome" placeholder="NOME" style="text-transform:uppercase;" oninput="this.value=this.value.toUpperCase()"></div>
        <div class="form-group"><label class="form-label">Sobrenome</label><input class="form-input" id="af-sobrenome" placeholder="SOBRENOME" style="text-transform:uppercase;" oninput="this.value=this.value.toUpperCase()"></div>
      </div>
      <div class="form-group"><label class="form-label">Apelido</label><input class="form-input" id="af-apelido" placeholder='"The King"'></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Data de Nascimento</label><input class="form-input" type="date" id="af-dob"></div>
        <div class="form-group"><label class="form-label">Nacionalidade</label>
          <select class="form-input" id="af-nat">
            <option value="🇧🇷 Brasil" selected>🇧🇷 Brasil</option>
            <option value="🇦🇷 Argentina">🇦🇷 Argentina</option>
            <option value="🇨🇱 Chile">🇨🇱 Chile</option>
            <option value="🇨🇴 Colômbia">🇨🇴 Colômbia</option>
            <option value="🇺🇾 Uruguai">🇺🇾 Uruguai</option>
            <option value="🇵🇾 Paraguai">🇵🇾 Paraguai</option>
            <option value="🇵🇪 Peru">🇵🇪 Peru</option>
            <option value="🇻🇪 Venezuela">🇻🇪 Venezuela</option>
            <option value="🇧🇴 Bolívia">🇧🇴 Bolívia</option>
            <option value="🇪🇨 Equador">🇪🇨 Equador</option>
            <option value="🇲🇽 México">🇲🇽 México</option>
            <option value="🇺🇸 Estados Unidos">🇺🇸 Estados Unidos</option>
            <option value="🇨🇦 Canadá">🇨🇦 Canadá</option>
            <option value="🇵🇹 Portugal">🇵🇹 Portugal</option>
            <option value="🇪🇸 Espanha">🇪🇸 Espanha</option>
            <option value="🇫🇷 França">🇫🇷 França</option>
            <option value="🇬🇧 Reino Unido">🇬🇧 Reino Unido</option>
            <option value="🇩🇪 Alemanha">🇩🇪 Alemanha</option>
            <option value="🇮🇹 Itália">🇮🇹 Itália</option>
            <option value="🇳🇱 Holanda">🇳🇱 Holanda</option>
            <option value="🇧🇪 Bélgica">🇧🇪 Bélgica</option>
            <option value="🇷🇺 Rússia">🇷🇺 Rússia</option>
            <option value="🇺🇦 Ucrânia">🇺🇦 Ucrânia</option>
            <option value="🇵🇱 Polônia">🇵🇱 Polônia</option>
            <option value="🇹🇭 Tailândia">🇹🇭 Tailândia</option>
            <option value="🇯🇵 Japão">🇯🇵 Japão</option>
            <option value="🇨🇳 China">🇨🇳 China</option>
            <option value="🇰🇷 Coreia do Sul">🇰🇷 Coreia do Sul</option>
            <option value="🇮🇳 Índia">🇮🇳 Índia</option>
            <option value="🇵🇭 Filipinas">🇵🇭 Filipinas</option>
            <option value="🇮🇩 Indonésia">🇮🇩 Indonésia</option>
            <option value="🇦🇺 Austrália">🇦🇺 Austrália</option>
            <option value="🇳🇿 Nova Zelândia">🇳🇿 Nova Zelândia</option>
            <option value="🇦🇪 Emirados Árabes">🇦🇪 Emirados Árabes</option>
            <option value="🇹🇷 Turquia">🇹🇷 Turquia</option>
            <option value="🇮🇷 Irã">🇮🇷 Irã</option>
            <option value="🇲🇦 Marrocos">🇲🇦 Marrocos</option>
            <option value="🇳🇬 Nigéria">🇳🇬 Nigéria</option>
            <option value="🇸🇦 Arábia Saudita">🇸🇦 Arábia Saudita</option>
            <option value="🇰🇿 Cazaquistão">🇰🇿 Cazaquistão</option>
            <option value="🇺🇿 Uzbequistão">🇺🇿 Uzbequistão</option>
            <option value="🇨🇺 Cuba">🇨🇺 Cuba</option>
            <option value="🇯🇲 Jamaica">🇯🇲 Jamaica</option>
            <option value="🇸🇪 Suécia">🇸🇪 Suécia</option>
            <option value="🇨🇲 Camarões">🇨🇲 Camarões</option>
            <option value="🇬🇭 Gana">🇬🇭 Gana</option>
            <option value="🇷🇴 Romênia">🇷🇴 Romênia</option>
            <option value="🇭🇺 Hungria">🇭🇺 Hungria</option>
            <option value="🇨🇿 República Tcheca">🇨🇿 República Tcheca</option>
            <option value="🇸🇷 Sérvia">🇸🇷 Sérvia</option>
            <option value="🇭🇷 Croácia">🇭🇷 Croácia</option>
            <option value="🇬🇪 Geórgia">🇬🇪 Geórgia</option>
            <option value="🇦🇲 Armênia">🇦🇲 Armênia</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Altura (cm)</label><input class="form-input" type="number" id="af-altura" placeholder="175" min="100" max="240" oninput="clampInput(this,0,240)"></div>
        <div class="form-group"><label class="form-label">Peso (kg)</label><input class="form-input" type="number" id="af-peso" placeholder="65" min="30" max="130" oninput="clampInput(this,0,130)"></div>
      </div>
      <div class="form-group"><label class="form-label">Categoria de Peso</label>
        <select class="form-input" id="af-cat">
          <option>Peso Mosca (−52kg)</option><option>Peso Galo (−56kg)</option>
          <option>Peso Pena (−60kg)</option><option selected>Peso Leve (−65kg)</option>
          <option>Peso Meio-Médio (−71kg)</option><option>Peso Médio (−75kg)</option>
          <option>Peso Meio-Pesado (−81kg)</option><option>Peso Pesado (+81kg)</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Equipe</label>
        <select class="form-input" id="af-equipe">
          <option value="">Sem Equipe</option>
          <option>Chute Boxe Academy</option><option>Pitbull Brothers</option>
          <option>Predadores Team</option><option>Dragão Team</option><option>Iron Fist Academy</option>
        </select>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Vitórias</label><input class="form-input" type="number" id="af-wins" value="0" min="0" max="100" oninput="clampInput(this,0,100)" onfocus="clearZero(this)" onblur="restoreZero(this)"></div>
        <div class="form-group"><label class="form-label">Derrotas</label><input class="form-input" type="number" id="af-losses" value="0" min="0" max="100" oninput="clampInput(this,0,100)" onfocus="clearZero(this)" onblur="restoreZero(this)"></div>
        <div class="form-group"><label class="form-label">Empates</label><input class="form-input" type="number" id="af-draws" value="0" min="0" max="100" oninput="clampInput(this,0,100)" onfocus="clearZero(this)" onblur="restoreZero(this)"></div>
      </div>
      <div class="form-group">
        <label class="form-label">Foto do Atleta</label>
        <label for="af-foto-file" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:20px;border:2px dashed var(--dark4);cursor:pointer;transition:border-color .2s;" onmouseover="this.style.borderColor='var(--red)'" onmouseout="this.style.borderColor='var(--dark4)'">
          <div id="af-foto-preview" style="display:none;max-width:120px;max-height:120px;overflow:hidden;"></div>
          <div id="af-foto-label" style="color:var(--gray);font-size:13px;text-align:center;">📷 Clique para selecionar uma foto<br><span style="font-size:11px;">JPG, PNG ou WebP • Máx. 2MB</span></div>
        </label>
        <input type="file" id="af-foto-file" accept="image/jpeg,image/png,image/webp" style="display:none;" onchange="previewFighterPhoto(this)">
      </div>
      <div class="form-group"><label class="form-label">Sobre o Atleta</label>
        <textarea class="form-input" rows="3" id="af-bio" style="resize:vertical;" placeholder="Breve descrição..."></textarea>
      </div>
      <button class="btn btn-red" style="width:100%;padding:14px;font-size:14px;margin-top:8px;" onclick="addFighter()">Cadastrar Lutador</button>
    </div>
  </div>

  <!-- MODAL ADD EVENT -->
  <div class="modal-overlay" id="modal-add-event">
    <div class="modal">
      <button class="modal-close" onclick="closeModal('modal-add-event')">✕</button>
      <div class="modal-title">Cadastrar Evento</div>
      <div class="form-group"><label class="form-label">Nome do Evento</label><input class="form-input" id="ae-name" placeholder="FightHub Championship 2025"></div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Data</label><input class="form-input" type="date" id="ae-date"></div>
        <div class="form-group"><label class="form-label">Organização</label><input class="form-input" id="ae-org" placeholder="CBKB"></div>
      </div>
      <div class="form-group"><label class="form-label">Cidade / Local</label><input class="form-input" id="ae-city" placeholder="São Paulo, SP — Ginásio do Ibirapuera"></div>
      <div class="form-group"><label class="form-label">Número de Lutas</label><input class="form-input" type="number" id="ae-fights" value="8"></div>
      <button class="btn btn-red" style="width:100%;padding:14px;font-size:14px;margin-top:8px;" onclick="addEvent()">Cadastrar Evento</button>
    </div>
  </div>
  `;
}

export function renderToast() {
  return `<div class="toast" id="toast"></div>`;
}

export function renderFooter() {
  return `
  <footer style="background:var(--dark2);border-top:1px solid var(--dark3);padding:40px 0;margin-top:60px;font-family:'Barlow',sans-serif;">
    <div style="max-width:1200px;margin:0 auto;padding:0 24px;display:flex;flex-wrap:wrap;justify-content:space-between;gap:32px;">
      <div style="flex:1;min-width:250px;">
        <div style="font-family:'Bebas Neue',sans-serif;font-size:32px;color:var(--white);letter-spacing:1px;margin-bottom:8px;">CODENITY <span style="color:var(--red);">SOLUTIONS</span></div>
        <p style="color:var(--gray-light);font-size:14px;line-height:1.6;margin-bottom:16px;">
          Salvador — Bahia<br>
          Transformando ideias em software de alto impacto. Especialistas em engenharia web e soluções digitais sob medida.
        </p>
        <div style="font-size:13px;color:var(--gray-light);">
          Engenheiro de Software & Tech Lead: <a href="https://www.linkedin.com/in/tauan-gramacho-7b6661229/" target="_blank" style="color:var(--gold);text-decoration:none;font-weight:600;transition:color 0.2s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--gold)'">Tauan Gramacho</a>
        </div>
      </div>
      
      <div style="flex:1;min-width:250px;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:var(--white);letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">Contatos</div>
        <div style="display:flex;flex-direction:column;gap:12px;color:var(--gray-light);font-size:14px;">
          <a href="https://www.instagram.com/codenity.ti/" target="_blank" style="color:var(--gray-light);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.2s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--gray-light)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            codenity.ti
          </a>
          <a href="mailto:codenity.solutions@gmail.com" style="color:var(--gray-light);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.2s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--gray-light)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            codenity.solutions@gmail.com
          </a>
          <div style="display:flex;align-items:center;gap:8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            71 99148-8815
          </div>
          <a href="https://www.linkedin.com/in/tauan-gramacho-7b6661229/" target="_blank" style="color:var(--gray-light);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.2s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--gray-light)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            LinkedIn: Tauan Gramacho
          </a>
        </div>
      </div>
    </div>
    <div style="max-width:1200px;margin:32px auto 0;padding:24px 24px 24px;border-top:1px solid var(--dark4);display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;">
      <div style="font-size:12px;color:var(--gray);">© ${new Date().getFullYear()} FightHub & Codenity Solutions. Todos os direitos reservados.</div>
      <div style="font-size:12px;color:var(--gray);">Criado por Tauan Gramacho</div>
    </div>
  </footer>
  `;
}
