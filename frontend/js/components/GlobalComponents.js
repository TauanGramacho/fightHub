export function renderNavbar() {
  return /*html*/`
  <nav id="main-nav">
    <div class="nav-logo" onclick="showPage('home')">FIGHT<span>HUB</span></div>
    <div class="nav-links">
      <a onclick="showPage('home')" data-page="home">Início</a>
      <a onclick="showPage('fighters')" data-page="fighters">Lutadores</a>
      <a onclick="showPage('elite-profiles')" data-page="elite-profiles">Vitrine</a>
      <a onclick="showPage('teams')" data-page="teams">Equipes</a>
      <a onclick="showPage('events')" data-page="events">Eventos</a>
      <a onclick="showPage('rankings')" data-page="rankings">Rankings</a>
    </div>
    <div class="nav-right" id="nav-auth">
      <button class="theme-toggle" type="button" onclick="toggleTheme()" aria-label="Alternar tema">
        <span class="theme-toggle-track">
          <span class="theme-toggle-label theme-toggle-label-light">Light</span>
          <span class="theme-toggle-label theme-toggle-label-dark">Dark</span>
          <span class="theme-toggle-thumb"></span>
        </span>
      </button>
      <button class="btn btn-outline" onclick="showPage('login')">Entrar</button>
      <button class="btn btn-red" onclick="showPage('register')">Cadastrar</button>
    </div>
    <div class="nav-right" id="nav-user" style="display:none">
      <span style="font-size:13px;color:var(--gray-light);font-family:'Barlow Condensed',sans-serif;letter-spacing:1px;">Olá, <strong style="color:var(--white);" id="user-greeting"></strong></span>
      <button class="theme-toggle" type="button" onclick="toggleTheme()" aria-label="Alternar tema">
        <span class="theme-toggle-track">
          <span class="theme-toggle-label theme-toggle-label-light">Light</span>
          <span class="theme-toggle-label theme-toggle-label-dark">Dark</span>
          <span class="theme-toggle-thumb"></span>
        </span>
      </button>
      <button class="btn btn-red" onclick="logout()">Sair</button>
    </div>
    <button class="nav-hamburger" id="nav-hamburger" onclick="toggleMobileMenu()" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </nav>
  <div class="nav-mobile-menu" id="nav-mobile-menu">
    <a onclick="showPage('home');closeMobileMenu()">Início</a>
    <a onclick="showPage('fighters');closeMobileMenu()">Lutadores</a>
    <a onclick="showPage('elite-profiles');closeMobileMenu()">Vitrine</a>
    <a onclick="showPage('teams');closeMobileMenu()">Equipes</a>
    <a onclick="showPage('events');closeMobileMenu()">Eventos</a>
    <a onclick="showPage('rankings');closeMobileMenu()">Rankings</a>
    <hr class="nav-mobile-divider">
    <button class="theme-toggle theme-toggle-mobile" type="button" onclick="toggleTheme()" aria-label="Alternar tema">
      <span class="theme-toggle-track">
        <span class="theme-toggle-label theme-toggle-label-light">Light</span>
        <span class="theme-toggle-label theme-toggle-label-dark">Dark</span>
        <span class="theme-toggle-thumb"></span>
      </span>
    </button>
    <div id="nav-mobile-auth">
      <button class="btn btn-outline" style="width:100%;margin-bottom:8px;" onclick="showPage('login');closeMobileMenu()">Entrar</button>
      <button class="btn btn-red" style="width:100%;" onclick="showPage('register');closeMobileMenu()">Cadastrar</button>
    </div>
    <div id="nav-mobile-user" style="display:none;">
      <div style="color:var(--gray-light);font-size:13px;padding:8px 16px;">Olá, <strong style="color:var(--white);" id="user-greeting-mobile"></strong></div>
      <button class="btn btn-red" style="width:100%;margin-top:4px;" onclick="logout();closeMobileMenu()">Sair</button>
    </div>
  </div>
  <div class="modal-overlay" id="modal-showcase-payment">
    <div class="modal">
      <button class="modal-close" onclick="closeModal('modal-showcase-payment')">X</button>
      <div class="modal-title" id="showcase-pay-title">Vitrine Premium</div>
      <div style="color:var(--white-dim);font-size:14px;line-height:1.7;margin-bottom:18px;" id="showcase-pay-subtitle"></div>
      <div class="compare-grid" style="align-items:start;">
        <div class="compare-card">
          <div class="compare-card-name" style="font-size:24px;">O que voce ganha</div>
          <div style="margin-top:14px;color:var(--white-dim);font-size:14px;line-height:1.8;">
            - Destaque na Vitrine Premium do FightHub<br>
            - Mais visibilidade para publico, equipes e promotores<br>
            - Presenca em uma area premium de descoberta e comparacao<br>
            - Entrada em analise editorial apos o pagamento
          </div>
          <div style="margin-top:18px;padding:14px;border:1px solid var(--dark4);background:var(--dark3);">
            <div class="form-label" style="margin-bottom:6px;">Valor</div>
            <div style="font-family:'Bebas Neue',sans-serif;font-size:38px;letter-spacing:1px;color:var(--gold);" id="showcase-pay-amount">R$ 10,00</div>
          </div>
          <div style="margin-top:14px;color:var(--white-dim);font-size:13px;line-height:1.7;" id="showcase-pay-summary"></div>
        </div>
        <div class="compare-card">
          <div style="display:flex;justify-content:center;margin-bottom:14px;">
            <img id="showcase-pay-qr" src="" alt="QR Code Pix" style="width:220px;height:220px;background:#fff;padding:10px;border-radius:8px;">
          </div>
          <div class="form-group">
            <label class="form-label">Chave Pix</label>
            <div class="form-input" id="showcase-pay-key" style="word-break:break-all;"></div>
          </div>
          <div class="form-group">
            <label class="form-label">Pix copia e cola</label>
            <textarea class="form-input" id="showcase-pay-code" rows="5" readonly style="resize:none;"></textarea>
          </div>
          <div style="color:var(--gray-light);font-size:12px;line-height:1.6;margin:-4px 0 14px;">
            Em celulares, use Compartilhar Pix para enviar direto ao app do banco quando o aparelho oferecer essa opcao.
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="btn btn-outline" style="flex:1;" onclick="copyShowcasePixCode()">Copiar codigo</button>
            <button class="btn btn-outline" style="flex:1;" onclick="shareShowcasePixCode()">Compartilhar Pix</button>
            <button class="btn btn-red" style="flex:1;" id="showcase-pay-confirm" onclick="confirmShowcasePixPayment()">Ja paguei, enviar para analise</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="modal-showcase-benefits">
    <div class="modal">
      <button class="modal-close" onclick="closeModal('modal-showcase-benefits')">X</button>
      <div class="modal-title">Beneficios de Premium</div>
      <div style="color:var(--white-dim);font-size:14px;line-height:1.7;margin-bottom:18px;">
        Ao entrar na Vitrine Premium, o atleta passa a ocupar uma area mais nobre do FightHub, com mais autoridade visual e mais chances de ser encontrado por quem realmente procura talentos.
      </div>
      <div class="compare-grid">
        <div class="compare-card">
          <div class="compare-stat">
            <span>Destaque Premium</span>
            <strong>Perfil em evidencia</strong>
            <div style="margin-top:8px;color:var(--white-dim);font-size:13px;line-height:1.6;">Seu atleta aparece apenas entre os perfis aprovados da Vitrine, com mais autoridade visual.</div>
          </div>
        </div>
        <div class="compare-card">
          <div class="compare-stat">
            <span>Mais descoberta</span>
            <strong>Visibilidade ampliada</strong>
            <div style="margin-top:8px;color:var(--white-dim);font-size:13px;line-height:1.6;">Mais chances de ser encontrado por publico, equipes, promotores e parceiros que entram para pesquisar atletas.</div>
          </div>
        </div>
        <div class="compare-card">
          <div class="compare-stat">
            <span>Comparativo</span>
            <strong>Presenca nas comparacoes</strong>
            <div style="margin-top:8px;color:var(--white-dim);font-size:13px;line-height:1.6;">Seu perfil premium ganha mais relevancia nas areas de comparacao e descoberta tecnica do FightHub.</div>
          </div>
        </div>
        <div class="compare-card">
          <div class="compare-stat">
            <span>Prova social</span>
            <strong>Status aprovado</strong>
            <div style="margin-top:8px;color:var(--white-dim);font-size:13px;line-height:1.6;">Mostra que o atleta passou por curadoria e esta pronto para representar a propria imagem de forma profissional.</div>
          </div>
        </div>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap;margin-top:18px;">
        <button class="btn btn-outline" onclick="closeModal('modal-showcase-benefits')">Fechar</button>
        <button class="btn btn-red" onclick="closeModal('modal-showcase-benefits');openShowcasePaymentModal()">Assinar Vitrine Premium</button>
      </div>
    </div>
  </div>
  `;
}

export function renderFAB() {
  return /*html*/`
  <!-- FAB: Floating Action Buttons (shown when user is logged in) -->
  <div class="fab-container" id="fab-container" style="display:none;">
    <!-- individual action buttons (hidden by default, appear on expand) -->
    <div class="fab-actions" id="fab-actions">
      <div class="fab-item">
        <span class="fab-tooltip">Novo Evento</span>
        <button class="fab-action-btn" onclick="openModal('modal-add-event')" aria-label="Cadastrar Evento">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="12" y1="14" x2="12" y2="18"></line><line x1="10" y1="16" x2="14" y2="16"></line></svg>
        </button>
      </div>
      <div class="fab-item">
        <span class="fab-tooltip">Novo Lutador</span>
        <button class="fab-action-btn" onclick="openModal('modal-add-fighter')" aria-label="Cadastrar Lutador">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
        </button>
      </div>
    </div>
    <!-- main FAB toggle button -->
    <button class="fab-main" id="fab-main" onclick="toggleFAB()" aria-label="Adicionar">
      <svg id="fab-icon-plus" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition:transform 0.3s;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
    </button>
  </div>
  `;
}
export function renderModals() {
  return `
  <!-- MODAL ADD FIGHTER -->
  <div class="modal-overlay" id="modal-add-fighter">
    <div class="modal">
      <button class="modal-close" onclick="closeModal('modal-add-fighter')">X</button>
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
      <button class="modal-close" onclick="closeModal('modal-add-event')">X</button>
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

  <!-- MODAL EDIT OWN PROFILE PHOTO -->
  <div class="modal-overlay" id="modal-edit-profile-photo">
    <div class="modal">
      <button class="modal-close" onclick="closeModal('modal-edit-profile-photo')">X</button>
      <div class="modal-title">Editar Foto do Perfil</div>
      <div class="form-group">
        <label class="form-label">Nova Foto</label>
        <input
          class="form-input"
          type="file"
          id="epf-file"
          accept="image/jpeg,image/png,image/webp"
          onchange="previewOwnProfilePhoto(this)"
        >
      </div>
      <div id="epf-current-photo" style="color:var(--gray-light);font-size:13px;margin-bottom:12px;"></div>
      <div class="profile-photo-editor-preview" id="epf-preview"></div>
      <div class="form-group">
        <label class="form-label">Posição Horizontal</label>
        <input class="form-input" type="range" min="0" max="100" value="50" id="epf-pos-x" oninput="updateProfilePhotoPreview()">
      </div>
      <div class="form-group">
        <label class="form-label">Posição Vertical</label>
        <input class="form-input" type="range" min="0" max="100" value="50" id="epf-pos-y" oninput="updateProfilePhotoPreview()">
      </div>
      <div class="form-group">
        <label class="form-label">Zoom</label>
        <input class="form-input" type="range" min="1" max="2.5" step="0.05" value="1" id="epf-zoom" oninput="updateProfilePhotoPreview()">
      </div>
      <button class="btn btn-red" id="epf-save-btn" style="width:100%;padding:14px;font-size:14px;margin-top:8px;" onclick="saveOwnProfilePhoto()">Salvar foto</button>
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
            71 99603-1345
          </div>
          <a href="https://www.linkedin.com/in/tauan-gramacho-7b6661229/" target="_blank" style="color:var(--gray-light);text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.2s;" onmouseover="this.style.color='var(--red)'" onmouseout="this.style.color='var(--gray-light)'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            Tauan Gramacho
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
