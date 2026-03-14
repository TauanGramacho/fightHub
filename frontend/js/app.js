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

window.renderHome = function() {
  const elFighters = document.getElementById('stat-fighters');
  const elTeams = document.getElementById('stat-teams');
  const elEvents = document.getElementById('stat-events');
  const elFights = document.getElementById('stat-fights');
  
  if(elFighters) elFighters.textContent = FIGHTERS.length.toLocaleString('pt-BR');
  if(elTeams) elTeams.textContent = TEAMS.length.toLocaleString('pt-BR');
  if(elEvents) elEvents.textContent = EVENTS.length.toLocaleString('pt-BR');
  
  if(elFights) {
    // Calcula um número aproximado de lutas somando vitórias, derrotas e empates dos atletas
    const totalFights = FIGHTERS.reduce((acc, f) => acc + (f.wins || 0) + (f.losses || 0) + (f.draws || 0), 0);
    // Dividimos por 2 pois cada confronto envolve dois lutadores teoricamente
    elFights.textContent = Math.ceil(totalFights / 2).toLocaleString('pt-BR');
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
    
    // For profiles, we need a separate hook parameter based on click, 
    // which should be handled by window.showFighterProfile() etc.
  } else {
    container.innerHTML = routes['home']();
    window.renderHome();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
