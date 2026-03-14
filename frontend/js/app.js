import { renderNavbar, renderModals, renderToast, renderFooter } from './components/GlobalComponents.js';
import { renderHomeScreen } from './screens/HomeScreen.js';
import { renderFightersScreen } from './screens/FightersScreen.js';
import { renderFighterProfileScreen } from './screens/FighterProfileScreen.js';
import { renderTeamsScreen, renderTeamProfileScreen } from './screens/TeamsScreen.js';
import { renderEventsScreen } from './screens/EventsScreen.js';
import { renderRankingsScreen } from './screens/RankingsScreen.js';
import { renderLoginScreen, renderRegisterScreen, renderEmailConfirmScreen } from './screens/AuthScreens.js';

import { 
  state, FIGHTERS, TEAMS, EVENTS, RANKINGS_DATA, FIGHT_HISTORY, 
  initSupabase, loadFightersFromSupabase,
  doLogin, doRegister, logout, requireAuth, addFighter, resendConfirmation
} from './store.js';
import * as globals from './globals.js';

window.showPage = showPage;
window.state = state;
window.FIGHTERS = FIGHTERS;
window.TEAMS = TEAMS;
window.EVENTS = EVENTS;
window.RANKINGS_DATA = RANKINGS_DATA;
window.FIGHT_HISTORY = FIGHT_HISTORY;
window.loadFightersFromSupabase = loadFightersFromSupabase;

window.doLogin = doLogin;
window.doRegister = doRegister;
window.logout = logout;
window.requireAuth = requireAuth;
window.addFighter = addFighter;
window.resendConfirmation = resendConfirmation;

window.renderHome = () => {
  if (document.getElementById('page-home')) {
    showPage('home');
  }
};

const routes = {
  'home': renderHomeScreen,
  'fighters': renderFightersScreen,
  'fighter-profile': renderFighterProfileScreen,
  'teams': renderTeamsScreen,
  'team-profile': renderTeamProfileScreen,
  'events': renderEventsScreen,
  'rankings': renderRankingsScreen,
  'login': renderLoginScreen,
  'register': renderRegisterScreen,
  'confirm-email': renderEmailConfirmScreen
};

window.renderFightersList = function(list) {
  const fighters = list || FIGHTERS;
  const grid = document.getElementById('fighters-grid');
  if (grid) {
    grid.innerHTML = fighters.map(globals.fighterCardHTML).join('') || 
      '<div style="color:var(--gray-light);padding:24px;">Nenhum lutador encontrado.</div>';
    
    const countEl = document.getElementById('fighters-count');
    if (countEl) countEl.textContent = fighters.length + ' lutador(es) encontrado(s)';
  }
}

window.renderHome = async function() {
  const elFighters = document.getElementById('stat-fighters');
  const elTeams = document.getElementById('stat-teams');
  const elEvents = document.getElementById('stat-events');
  const elFights = document.getElementById('stat-fights');
  
  // Tenta puxar contagens reais do Supabase
  if (window.supabase && typeof window.supabase.from === 'function') {
    try {
      const [fRes, tRes, eRes] = await Promise.all([
        window.supabase.from('fighters').select('id', { count: 'exact', head: true }),
        window.supabase.from('teams').select('id', { count: 'exact', head: true }),
        window.supabase.from('events').select('id', { count: 'exact', head: true }),
      ]);
      
      if (elFighters) elFighters.textContent = (fRes.count || FIGHTERS.length).toLocaleString('pt-BR');
      if (elTeams) elTeams.textContent = (tRes.count || TEAMS.length).toLocaleString('pt-BR');
      if (elEvents) elEvents.textContent = (eRes.count || EVENTS.length).toLocaleString('pt-BR');
      
      if (elFights) {
        const totalFights = FIGHTERS.reduce((acc, f) => acc + (f.wins || 0) + (f.losses || 0) + (f.draws || 0), 0);
        elFights.textContent = Math.ceil(totalFights / 2).toLocaleString('pt-BR');
      }
    } catch(e) {
      // Fallback para dados locais
      if(elFighters) elFighters.textContent = FIGHTERS.length.toLocaleString('pt-BR');
      if(elTeams) elTeams.textContent = TEAMS.length.toLocaleString('pt-BR');
      if(elEvents) elEvents.textContent = EVENTS.length.toLocaleString('pt-BR');
      if(elFights) {
        const totalFights = FIGHTERS.reduce((acc, f) => acc + (f.wins || 0) + (f.losses || 0) + (f.draws || 0), 0);
        elFights.textContent = Math.ceil(totalFights / 2).toLocaleString('pt-BR');
      }
    }
  } else {
    if(elFighters) elFighters.textContent = FIGHTERS.length.toLocaleString('pt-BR');
    if(elTeams) elTeams.textContent = TEAMS.length.toLocaleString('pt-BR');
    if(elEvents) elEvents.textContent = EVENTS.length.toLocaleString('pt-BR');
    if(elFights) {
      const totalFights = FIGHTERS.reduce((acc, f) => acc + (f.wins || 0) + (f.losses || 0) + (f.draws || 0), 0);
      elFights.textContent = Math.ceil(totalFights / 2).toLocaleString('pt-BR');
    }
  }

  const hgrid = document.getElementById('home-fighters');
  if(hgrid) hgrid.innerHTML = FIGHTERS.slice(0,6).map(globals.fighterCardHTML).join('');

  const egrid = document.getElementById('home-events');
  if(egrid) egrid.innerHTML = EVENTS.filter(e=>e.status==='upcoming').slice(0,3).map(globals.eventItemHTML).join('');

  const tgrid = document.getElementById('home-teams');
  if(tgrid) tgrid.innerHTML = TEAMS.slice(0,4).map(globals.teamCardHTML).join('');
}

window.renderEventsList = function(filter) {
  let list = EVENTS;
  if (filter) list = EVENTS.filter(e => e.status === filter);
  const el = document.getElementById('events-list');
  if(el) el.innerHTML = list.map(globals.eventItemHTML).join('');
}

window.renderTeamsList = function() {
  const grid = document.getElementById('teams-grid');
  if(grid) grid.innerHTML = TEAMS.map(globals.teamCardHTML).join('');
}

window.renderRankings = function(wc) {
  const normalize = (s) => s.trim().replace(/\s+/g, ' ').toLowerCase();
  const rawCategory = wc || 'Peso Pena (−60kg)';
  const normalizedKey = normalize(rawCategory);
  const data = RANKINGS_DATA[normalizedKey] || [];
  const body = document.getElementById('ranking-body');
  const title = document.getElementById('ranking-wc-title');
  
  if (title) title.textContent = rawCategory;
  if (body) {
    if (data.length === 0) {
      body.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--gray-light);">Sem dados para esta categoria.</td></tr>';
    } else {
      body.innerHTML = data.map((r, i) => `
        <tr>
          <td>${i + 1}</td>
          <td style="color:var(--white);font-weight:600;">${r.name}</td>
          <td>${r.team}</td>
          <td>${r.country}</td>
          <td>${r.w}</td>
          <td>${r.l}</td>
          <td><span class="res-badge ${r.last}">${r.last}</span></td>
        </tr>
      `).join('');
    }
  }
}

// ... Additional helper/render functions might be needed later

function initApp() {
  document.getElementById('nav-container').innerHTML = renderNavbar();
  document.getElementById('modals-container').innerHTML = renderModals();
  document.getElementById('toast-container').innerHTML = renderToast();
  document.getElementById('footer-container').innerHTML = renderFooter();

  globals.initModalListeners();
  initSupabase();

  const initialPage = window.location.hash.replace('#', '') || 'home';
  showPage(initialPage);
}

function showPage(pageId) {
  const container = document.getElementById('main-content');
  if (routes[pageId]) {
    container.innerHTML = routes[pageId]();
    window.location.hash = pageId;
    window.scrollTo(0, 0);

    // Call page-specific render hooks after injecting HTML
    if (pageId === 'home') window.renderHome();
    if (pageId === 'fighters') window.renderFightersList();
    if (pageId === 'teams') window.renderTeamsList();
    if (pageId === 'events') window.renderEventsList();
    if (pageId === 'rankings') window.renderRankings();
    
    // For profiles, we need a separate hook parameter based on click, 
    // which should be handled by window.showFighterProfile() etc.
  } else {
    container.innerHTML = routes['home']();
    window.renderHome();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
