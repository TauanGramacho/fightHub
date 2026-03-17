import { renderNavbar, renderModals, renderToast, renderFooter, renderFAB } from './components/GlobalComponents.js';
import { renderHomeScreen } from './screens/HomeScreen.js';
import { renderFightersScreen } from './screens/FightersScreen.js';
import { renderFighterProfileScreen } from './screens/FighterProfileScreen.js';
import { renderTeamsScreen, renderTeamProfileScreen } from './screens/TeamsScreen.js';
import { renderEventsScreen, renderEventProfileScreen } from './screens/EventsScreen.js';
import { renderRankingsScreen } from './screens/RankingsScreen.js';
import { renderLoginScreen, renderRegisterScreen, renderEmailConfirmScreen } from './screens/AuthScreens.js';
import { renderEliteProfilesScreen, renderCompareScreen } from './screens/EliteProfilesScreen.js';

import { 
  state, FIGHTERS, TEAMS, EVENTS, RANKINGS_DATA, FIGHT_HISTORY, 
  initSupabase, loadFightersFromSupabase, syncFighterDivisionFromWeight,
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
window.syncFighterDivisionFromWeight = syncFighterDivisionFromWeight;
window.toggleMobileMenu = globals.toggleMobileMenu;
window.closeMobileMenu = globals.closeMobileMenu;
window.toggleFAB = globals.toggleFAB;
window.closeFAB = globals.closeFAB;

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
  'event-profile': renderEventProfileScreen,
  'rankings': renderRankingsScreen,
  'elite-profiles': renderEliteProfilesScreen,
  'compare': renderCompareScreen,
  'login': renderLoginScreen,
  'register': renderRegisterScreen,
  'confirm-email': renderEmailConfirmScreen
};

function parseHashRoute() {
  const rawHash = window.location.hash.replace(/^#/, '');
  if (!rawHash) return { pageId: 'home', params: {} };

  const [pageId, query = ''] = rawHash.split('?');
  const params = Object.fromEntries(new URLSearchParams(query));

  if (pageId === 'fighter-profile' && !params.id) {
    const lastFighterId = localStorage.getItem('fighthub_last_active_fighter_id');
    if (lastFighterId) params.id = lastFighterId;
  }

  if (pageId === 'team-profile' && !params.id) {
    const lastTeamId = localStorage.getItem('fighthub_last_active_team_id');
    if (lastTeamId) params.id = lastTeamId;
  }

  if (pageId === 'event-profile' && !params.id) {
    const lastEventId = localStorage.getItem('fighthub_last_active_event_id');
    if (lastEventId) params.id = lastEventId;
  }

  return { pageId, params };
}

function buildHash(pageId, params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  ).toString();

  return query ? `${pageId}?${query}` : pageId;
}

window.renderFightersList = function(list) {
  const fighters = (list || FIGHTERS).filter((fighter, index, all) => {
    const fighterId = String(fighter.id);
    return all.findIndex((item) => String(item.id) === fighterId) === index;
  });
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
  if (hgrid) {
    const featuredFighters = [...FIGHTERS]
      .sort((a, b) => {
        const winsDiff = (b.wins || 0) - (a.wins || 0);
        if (winsDiff !== 0) return winsDiff;

        const lossesDiff = (a.losses || 0) - (b.losses || 0);
        if (lossesDiff !== 0) return lossesDiff;

        const drawsDiff = (b.draws || 0) - (a.draws || 0);
        if (drawsDiff !== 0) return drawsDiff;

        return (a.rank || Number.MAX_SAFE_INTEGER) - (b.rank || Number.MAX_SAFE_INTEGER);
      })
      .slice(0, 5);

    hgrid.innerHTML = featuredFighters
      .map((fighter, index) => globals.fighterCardHTML(fighter, { badgeRank: index + 1 }))
      .join('');
  }

  const egrid = document.getElementById('home-events');
  if(egrid) egrid.innerHTML = EVENTS.filter(e=>e.status==='upcoming').slice(0,3).map(globals.eventItemHTML).join('');

  const tgrid = document.getElementById('home-teams');
  if(tgrid) tgrid.innerHTML = TEAMS.slice(0,4).map(globals.teamCardHTML).join('');
}

window.renderEventsList = function(filter) {
  let list = EVENTS;
  if (filter && filter !== 'all') list = EVENTS.filter(e => e.status === filter);
  const el = document.getElementById('events-list');
  if(el) el.innerHTML = list.map(globals.eventItemHTML).join('');
}

window.renderTeamsList = function() {
  const grid = document.getElementById('teams-grid');
  if(grid) grid.innerHTML = TEAMS.map(globals.teamCardHTML).join('');
}

window.renderRankings = function(wc) {
  const normalize = (s) => String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[−–—âˆ’Ã¢Ë†â€™]/g, '-')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();

  const inferDivision = (fighter) => {
    const rawWeight = typeof fighter.weight === 'string' ? parseInt(fighter.weight, 10) : fighter.weight_kg;
    const weight = Number(rawWeight);
    if (!Number.isFinite(weight) || weight <= 0) return fighter.div || '';
    if (weight <= 52) return 'Peso Mosca (-52kg)';
    if (weight <= 56) return 'Peso Galo (-56kg)';
    if (weight <= 60) return 'Peso Pena (-60kg)';
    if (weight <= 65) return 'Peso Leve (-65kg)';
    if (weight <= 71) return 'Peso Meio-Medio (-71kg)';
    if (weight <= 75) return 'Peso Medio (-75kg)';
    if (weight <= 81) return 'Peso Meio-Pesado (-81kg)';
    return 'Peso Pesado (+81kg)';
  };

  const rawCategory = wc || 'Peso Mosca (-52kg)';
  const normalizedKey = normalize(rawCategory);
  const directData = RANKINGS_DATA[normalizedKey];
  const matchedEntry = Object.entries(RANKINGS_DATA).find(([key]) => normalize(key) === normalizedKey);
  const fallbackData = FIGHTERS
    .filter((fighter) => normalize(inferDivision(fighter) || fighter.div) === normalizedKey)
    .sort((a, b) => {
      const winsDiff = (b.wins || 0) - (a.wins || 0);
      if (winsDiff !== 0) return winsDiff;
      const lossesDiff = (a.losses || 0) - (b.losses || 0);
      if (lossesDiff !== 0) return lossesDiff;
      return (b.draws || 0) - (a.draws || 0);
    })
    .map((fighter) => ({
      name: fighter.name,
      team: fighter.team || '-',
      country: fighter.nat || '-',
      w: fighter.wins || 0,
      l: fighter.losses || 0,
      last: '-',
    }));

  const baseData = Array.isArray(directData)
    ? directData
    : Array.isArray(matchedEntry?.[1])
      ? matchedEntry[1]
      : [];

  const data = [...baseData];
  fallbackData.forEach((fighterRow) => {
    const exists = data.some((row) => normalize(row.name) === normalize(fighterRow.name));
    if (!exists) {
      data.push(fighterRow);
    }
  });

  const body = document.getElementById('ranking-body');
  const title = document.getElementById('ranking-wc-title');

  if (title) title.textContent = rawCategory;
  if (!body) return;

  if (!data.length) {
    body.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--gray-light);">Sem dados para esta categoria.</td></tr>';
    return;
  }

  body.innerHTML = data.map((r, i) => {
    const last = ['W', 'L', 'D'].includes(String(r.last || '').toUpperCase()) ? String(r.last).toUpperCase() : '-';
    return `
      <tr>
        <td>${i + 1}</td>
        <td style="color:var(--white);font-weight:600;">${r.name || '-'}</td>
        <td>${r.team || '-'}</td>
        <td>${r.country || '-'}</td>
        <td>${r.w ?? 0}</td>
        <td>${r.l ?? 0}</td>
        <td>${last === '-' ? '-' : `<span class="res-badge ${last}">${last}</span>`}</td>
      </tr>
    `;
  }).join('');
}

// ... Additional helper/render functions might be needed later

function initApp() {
  globals.initTheme();
  document.getElementById('nav-container').innerHTML = renderNavbar();
  document.getElementById('modals-container').innerHTML = renderModals();
  document.getElementById('toast-container').innerHTML = renderToast();
  document.getElementById('footer-container').innerHTML = renderFooter();
  document.getElementById('fab-container-wrapper').innerHTML = renderFAB();

  globals.initModalListeners();
  initSupabase();

  const { pageId, params } = parseHashRoute();
  showPage(pageId, params);
}

function showPage(pageId, params = {}) {
  const container = document.getElementById('main-content');
  if (routes[pageId]) {
    container.innerHTML = routes[pageId]();
    window.location.hash = buildHash(pageId, params);
    window.scrollTo(0, 0);

    // Call page-specific render hooks after injecting HTML
    if (pageId === 'home') window.renderHome();
    if (pageId === 'fighters') window.renderFightersList();
    if (pageId === 'teams') window.renderTeamsList();
    if (pageId === 'events') window.renderEventsList();
    if (pageId === 'rankings') window.renderRankings();
    if (pageId === 'elite-profiles' && (globals.renderEliteProfilesPageV2 || globals.renderEliteProfilesPage)) {
      (globals.renderEliteProfilesPageV2 || globals.renderEliteProfilesPage)();
    }
    if (pageId === 'compare' && globals.renderComparePage) globals.renderComparePage();
    if (pageId === 'fighter-profile' && params.id) globals.showFighterProfile(Number(params.id), { skipNavigation: true });
    if (pageId === 'team-profile' && params.id) globals.showTeamProfile(Number(params.id), { skipNavigation: true });
    if (pageId === 'event-profile' && params.id) globals.showEventProfile(Number(params.id), { skipNavigation: true });
    
    // For profiles, we need a separate hook parameter based on click, 
    // which should be handled by window.showFighterProfile() etc.
  } else {
    container.innerHTML = routes['home']();
    window.renderHome();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
document.addEventListener('supabaseReady', () => {
  const { pageId, params } = parseHashRoute();
  if ((pageId === 'fighter-profile' || pageId === 'team-profile' || pageId === 'event-profile') && params.id) {
    showPage(pageId, params);
  }
});

