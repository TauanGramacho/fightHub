import { state, FIGHTERS, TEAMS, EVENTS, RANKINGS_DATA, FIGHT_HISTORY, loadFightersFromSupabase } from './store.js';

// =============================================
// TOAST
// =============================================
export function showToast(msg, error = false) {
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.className = 'toast' + (error ? ' error' : '');
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => t.classList.remove('show'), 3500);
}

// =============================================
// MODALS
// =============================================
export function openModal(id) {
  if (!state.currentUser) { showToast('Faça login para continuar', true); window.showPage('login'); return; }
  const m = document.getElementById(id);
  if(m) m.classList.add('open');
}

export function closeModal(id) {
  const m = document.getElementById(id);
  if(m) m.classList.remove('open');
}

// Close modals when clicking outside
export function initModalListeners() {
  document.querySelectorAll('.modal-overlay').forEach(m => {
    m.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('open'); });
  });
}

// =============================================
// MOBILE MENU
// =============================================
export function toggleMobileMenu() {
  const menu = document.getElementById('nav-mobile-menu');
  if (menu) menu.classList.toggle('open');
}

export function closeMobileMenu() {
  const menu = document.getElementById('nav-mobile-menu');
  if (menu) menu.classList.remove('open');
}


// =============================================
// NAVIGATION & TABS
// =============================================
export function switchTab(e, tabId) {
  const page = e.target.closest('.page') || document.getElementById('main-content');
  page.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  page.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

export function switchEventsTab(e, filter) {
  const page = document.getElementById('main-content');
  page.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  window.renderEventsList(filter);
}

export function selectWC(el, wc) {
  document.querySelectorAll('.wc-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  window.renderRankings(wc);
}

// =============================================
// HELPER FUNCS FOR INPUTS
// =============================================
export function clampInput(input, min, max) {
  let val = parseInt(input.value, 10);
  if (isNaN(val)) return;
  if (val > max) input.value = max;
}
export function clearZero(input) {
  if (input.value === '0') input.value = '';
}
export function restoreZero(input) {
  if (input.value === '') input.value = '0';
}
export function previewFighterPhoto(input) {
  const file = input.files[0];
  const preview = document.getElementById('af-foto-preview');
  const labelText = document.getElementById('af-foto-label');
  
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      showToast("A foto deve ter no máximo 2MB.", true);
      input.value = ""; return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">`;
      preview.style.display = 'block'; labelText.style.display = 'none';
      input.dataset.base64 = e.target.result;
    }
    reader.readAsDataURL(file);
  } else {
    preview.style.display = 'none'; labelText.style.display = 'block';
    input.dataset.base64 = "";
  }
}

export function resetFighterForm() {
  ['af-nome', 'af-sobrenome', 'af-apelido', 'af-altura', 'af-peso', 'af-bio'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const nat = document.getElementById('af-nat'); if(nat) nat.value = '🇧🇷 Brasil';
  const cat = document.getElementById('af-cat'); if(cat) cat.value = 'Peso Leve (−65kg)';
  const equipe = document.getElementById('af-equipe'); if(equipe) equipe.value = '';
  
  ['af-wins', 'af-losses', 'af-draws'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '0';
  });

  const fotoInput = document.getElementById('af-foto-file');
  if (fotoInput) {
    fotoInput.value = '';
    fotoInput.dataset.base64 = '';
  }
  const preview = document.getElementById('af-foto-preview');
  const label = document.getElementById('af-foto-label');
  if (preview) preview.style.display = 'none';
  if (label) label.style.display = 'block';
}

// =============================================
// HTML TEMPLATE RENDERERS
// =============================================
export function fighterCardHTML(f) {
  const imgHtml = f.photo_url 
    ? `<img src="${f.photo_url}" style="width:100%;height:100%;object-fit:cover;">`
    : `<span style="font-size:70px;opacity:0.12;position:absolute;">${f.flag||'🥊'}</span>
       <span style="font-size:60px;z-index:1;">🥊</span>`;

  return `<div class="fighter-card" onclick="showFighterProfile(${f.id})">
    <div class="fighter-card-img" style="background:var(--dark3);position:relative;overflow:hidden;">
      ${f.rank ? `<div class="fighter-rank">#${f.rank}</div>` : ''}
      ${imgHtml}
    </div>
    <div class="fighter-card-body">
      <div class="fighter-name">${f.name}</div>
      <div class="fighter-nick">${f.nick}</div>
      <div class="fighter-meta">${f.div.split('(')[0].trim()} · ${f.team||'Sem Equipe'}</div>
      <div class="fighter-record">
        <span class="rec-w">${f.wins}V</span>
        <span style="color:var(--dark4)"> – </span>
        <span class="rec-l">${f.losses}D</span>
        <span style="color:var(--dark4)"> – </span>
        <span class="rec-d">${f.draws}E</span>
      </div>
    </div>
  </div>`;
}

export function eventItemHTML(e) {
  const d = new Date(e.date + 'T12:00:00');
  const months = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  const statusClass = {upcoming:'status-upcoming',past:'status-results',live:'status-live'}[e.status]||'';
  const statusLabel = {upcoming:'Próximo',past:'Resultados',live:'AO VIVO'}[e.status]||'';
  return `<div class="event-item" onclick="showPage('events')">
    <div class="event-date">
      <div class="month">${months[d.getMonth()]}</div>
      <div class="day">${d.getDate()}</div>
      <div class="year">${d.getFullYear()}</div>
    </div>
    <div>
      <div class="event-name">${e.name}</div>
      <div class="event-org">${e.org}</div>
      <div class="event-location">📍 ${e.city} · ${e.fights} lutas</div>
    </div>
    <div class="event-status ${statusClass}">${statusLabel}</div>
  </div>`;
}

export function teamCardHTML(t) {
  const imgHtml = t.logo_url 
    ? `<img src="${t.logo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
    : t.emoji;

  return `<div class="team-card" onclick="showTeamProfile(${t.id})">
    <div class="team-logo" style="overflow:hidden;">${imgHtml}</div>
    <div>
      <div class="team-name">${t.name}</div>
      <div class="team-location">📍 ${t.location}</div>
      <div style="font-size:12px;color:var(--gray-light);margin-top:4px;">${t.meta}</div>
      <div class="team-stats">
        <div><div class="team-stat-val">${t.fighters}</div><div class="team-stat-lbl">Atletas</div></div>
        <div><div class="team-stat-val">${t.wins}</div><div class="team-stat-lbl">Vitórias</div></div>
        <div><div class="team-stat-val">${t.titles}</div><div class="team-stat-lbl">Títulos</div></div>
      </div>
    </div>
  </div>`;
}

// =============================================
// PROFILES
// =============================================
export function showFighterProfile(id) {
  const f = FIGHTERS.find(x => x.id === id);
  if (!f) return;
  state.activeFighterId = id;
  
  window.showPage('fighter-profile');
  
  // Need to wait for DOM to mount
  setTimeout(() => {
    document.getElementById('profile-breadcrumb').textContent = f.name;
    document.getElementById('profile-flag').textContent = f.flag||'🌍';
    document.getElementById('profile-division-tag').textContent = f.div.split('(')[0].trim();
    document.getElementById('profile-name').textContent = f.name;
    document.getElementById('profile-nick').textContent = f.nick;
    document.getElementById('profile-w').textContent = f.wins;
    document.getElementById('profile-l').textContent = f.losses;
    document.getElementById('profile-d').textContent = f.draws;
    document.getElementById('pi-dob').textContent = f.dob || '—';
    document.getElementById('pi-age').textContent = f.age ? f.age + ' anos' : '—';
    document.getElementById('pi-nat').textContent = f.nat || '—';
    document.getElementById('pi-height').textContent = f.height || '—';
    document.getElementById('pi-weight').textContent = f.weight || '—';
    
    if (f.photo_url) {
      document.getElementById('profile-avatar').innerHTML = `<img src="${f.photo_url}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
      document.getElementById('profile-avatar').textContent = '🥊';
    }

    const teamEl = document.getElementById('pi-team');
    teamEl.textContent = f.team || 'Sem Equipe';
    teamEl.style.cursor = f.teamId ? 'pointer' : 'default';
    teamEl.style.color = f.teamId ? 'var(--red)' : 'var(--white)';
    
    document.getElementById('profile-tags').innerHTML = (f.tags||[]).map(t =>
      `<div class="tag ${t.includes('#1')?'red':''}">${t}</div>`).join('');
      
    // fights
    const fights = FIGHT_HISTORY[id] || [];
    document.getElementById('fight-history').innerHTML = fights.length
      ? fights.map(fh => `<div class="fight-row">
          <div class="fight-result ${fh.result}">${fh.result === 'W' ? 'VITÓRIA' : fh.result === 'L' ? 'DERROTA' : 'EMPATE'}</div>
          <div><div class="fight-opponent">${fh.opp}</div></div>
          <div style="font-size:12px;color:var(--gray-light);">${fh.round}</div>
          <div><div class="fight-method">${fh.method}</div></div>
          <div class="fight-event">${fh.event}</div>
          <div class="fight-date">${fh.date}</div>
        </div>`).join('')
      : '<div style="padding:24px 20px;color:var(--gray-light);font-size:14px;">Nenhuma luta registrada.</div>';
      
    document.getElementById('about-text').textContent = f.bio || 'Sem informações adicionais.';
  }, 50);
}

export function showTeamProfile(id) {
  const t = TEAMS.find(x => x.id === id);
  if (!t) return;
  state.activeTeamId = id;
  
  window.showPage('team-profile');
  
  setTimeout(() => {
    document.getElementById('team-breadcrumb').textContent = t.name;
    document.getElementById('team-profile-name').textContent = t.name;
    document.getElementById('team-profile-location').textContent = '📍 ' + t.location;
    document.getElementById('team-profile-meta').textContent = `Treinador: ${t.coach} · Fundada em ${t.founded} · ${t.meta}`;
    document.getElementById('tp-fighters').textContent = t.fighters;
    document.getElementById('tp-wins').textContent = t.wins;
    document.getElementById('tp-titles').textContent = t.titles;
    
    if (t.logo_url) {
      document.getElementById('team-profile-logo').innerHTML = `<img src="${t.logo_url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      document.getElementById('team-profile-logo').textContent = t.emoji;
    }

    const teamFighters = FIGHTERS.filter(f => f.teamId === id);
    document.getElementById('team-fighters-grid').innerHTML = teamFighters.length
      ? teamFighters.map(fighterCardHTML).join('')
      : '<div style="color:var(--gray-light);font-size:14px;padding:16px 0;">Nenhum lutador cadastrado nesta equipe.</div>';
  }, 50);
}

export function goToTeam() {
  const f = FIGHTERS.find(x => x.id === state.activeFighterId);
  if (f && f.teamId) showTeamProfile(f.teamId);
}

export function addEvent() {
  const name = document.getElementById('ae-name').value.trim();
  const date = document.getElementById('ae-date').value;
  const org = document.getElementById('ae-org').value.trim();
  const city = document.getElementById('ae-city').value.trim();
  if (!name || !date) { showToast('Preencha nome e data do evento', true); return; }
  EVENTS.unshift({
    id: EVENTS.length + 1, name, org: org||'—', date, city: city||'—',
    status: new Date(date) > new Date() ? 'upcoming' : 'past',
    fights: parseInt(document.getElementById('ae-fights').value)||8
  });
  closeModal('modal-add-event');
  showToast('Evento "' + name + '" cadastrado (Apenas local por enquanto)!');
  window.showPage('events');
}

export function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  
  const eyeOpen = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const eyeClosed = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  if (input.type === 'password') {
    input.type = 'text';
    btn.innerHTML = eyeClosed;
    btn.style.color = 'var(--white)';
  } else {
    input.type = 'password';
    btn.innerHTML = eyeOpen;
    btn.style.color = 'var(--gray)';
  }
}

// =============================================
// MAKE EXPORTED FUNCS GLOBAL FOR INLINE HTML
// =============================================
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.switchTab = switchTab;
window.switchEventsTab = switchEventsTab;
window.selectWC = selectWC;
window.clampInput = clampInput;
window.clearZero = clearZero;
window.restoreZero = restoreZero;
window.previewFighterPhoto = previewFighterPhoto;
window.resetFighterForm = resetFighterForm;
window.fighterCardHTML = fighterCardHTML;
window.eventItemHTML = eventItemHTML;
window.teamCardHTML = teamCardHTML;
window.showFighterProfile = showFighterProfile;
window.showTeamProfile = showTeamProfile;
window.goToTeam = goToTeam;
window.addEvent = addEvent;
window.togglePassword = togglePassword;
