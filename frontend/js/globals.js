import {
  state,
  FIGHTERS,
  TEAMS,
  EVENTS,
  RANKINGS_DATA,
  FIGHT_HISTORY,
  mapRowToFighter,
  loadFightersFromSupabase,
  isCurrentUserAdmin,
  updateFighterShowcase,
  uploadFighterPhoto,
  updateFighterPhotoProfile,
} from './store.js';

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

function getFighterTotalFights(fighter) {
  return (fighter.wins || 0) + (fighter.losses || 0) + (fighter.draws || 0);
}

function getFeaturedRanking(fighter) {
  return [
    fighter.wins || 0,
    -(fighter.losses || 0),
    fighter.draws || 0,
    -(fighter.rank || Number.MAX_SAFE_INTEGER),
  ];
}

function isShowcaseApproved(fighter) {
  if (!fighter?.showcase_enabled || fighter?.showcase_status !== 'approved') return false;
  if (!fighter?.showcase_expires_at) return true;
  return new Date(fighter.showcase_expires_at).getTime() > Date.now();
}

function getShowcaseEligibility(fighter) {
  const issues = [];
  if (!fighter) return { eligible: false, issues: ['Perfil nao encontrado.'] };
  if (!fighter.photo_url) issues.push('adicionar uma foto profissional');
  if (!fighter.team || fighter.team === 'Sem Equipe') issues.push('informar a equipe');
  if (!fighter.div || fighter.div === 'â€”') issues.push('definir a categoria');
  if (!fighter.bio || fighter.bio.trim().length < 30) issues.push('completar a bio do atleta');
  if (getFighterTotalFights(fighter) < 1) issues.push('ter pelo menos 1 luta registrada');
  return { eligible: issues.length === 0, issues };
}

function getShowcaseStatusMeta(fighter) {
  const status = fighter?.showcase_status || 'hidden';
  if (status === 'approved' && isShowcaseApproved(fighter)) {
    return { label: 'Vitrine ativa', tone: 'success', copy: 'Seu perfil esta visivel para todos na Vitrine.' };
  }
  if (status === 'pending') {
    return { label: 'Analise pendente', tone: 'warning', copy: 'Seu pedido premium foi recebido e aguarda aprovacao.' };
  }
  if (status === 'rejected') {
    return { label: 'Ajustes necessarios', tone: 'danger', copy: 'Complete o perfil e envie uma nova solicitacao para voltar a analise.' };
  }
  return { label: 'Fora da Vitrine', tone: 'muted', copy: 'Ative seu plano premium e solicite analise para aparecer aqui.' };
}

function getApprovedShowcaseTags(fighter) {
  if (!isShowcaseApproved(fighter)) return [];
  return ['Vitrine Premium', 'Selo Elite'];
}

function getSortedEliteFighters() {
  return [...FIGHTERS]
    .filter((fighter) => isShowcaseApproved(fighter))
    .sort((a, b) => {
      const priorityDiff = (b.showcase_priority || 0) - (a.showcase_priority || 0);
      if (priorityDiff !== 0) return priorityDiff;

      const winsDiff = (b.wins || 0) - (a.wins || 0);
      if (winsDiff !== 0) return winsDiff;
  
      const lossesDiff = (a.losses || 0) - (b.losses || 0);
      if (lossesDiff !== 0) return lossesDiff;

    const drawsDiff = (b.draws || 0) - (a.draws || 0);
    if (drawsDiff !== 0) return drawsDiff;

      return (a.rank || Number.MAX_SAFE_INTEGER) - (b.rank || Number.MAX_SAFE_INTEGER);
    });
}

function getEventResultRows(event) {
  const eventResults = {
    1: [
      { red: 'Rafael Fiziev', blue: 'Bruno Machado', outcome: 'Main Event · KO R2', detail: 'Título peso leve em disputa' },
      { red: 'Ana Lima', blue: 'Keiko Tanaka', outcome: 'Decisão Unânime', detail: 'Superfight feminino' },
      { red: 'Diego Ferreira', blue: 'Marcus Almeida', outcome: 'Card confirmado', detail: 'Eliminatória meio-médio' },
    ],
    2: [
      { red: 'Caio Borralho', blue: 'Fernando Costa', outcome: 'Decisão Dividida', detail: 'Final nacional' },
      { red: 'Ana Lima', blue: 'Sofia Mendez', outcome: 'Decisão Unânime', detail: 'Disputa peso galo' },
    ],
    6: [
      { red: 'Marcus Santos', blue: 'Artem Vovchanchyn', outcome: 'Resultados oficiais', detail: 'Peso pesado · luta principal' },
      { red: 'Diego Ferreira', blue: 'Kiro Tanaka', outcome: 'Resultados oficiais', detail: 'Co-main event' },
    ],
  };

  if (eventResults[event.id]) return eventResults[event.id];

  const sorted = getSortedEliteFighters();
  const fallback = [];
  for (let index = 0; index < Math.min(sorted.length - 1, Math.max(2, event.fights || 0)); index += 2) {
    if (!sorted[index] || !sorted[index + 1]) break;
    fallback.push({
      red: sorted[index].name,
      blue: sorted[index + 1].name,
      outcome: event.status === 'past' ? 'Resultado em atualização' : 'Luta prevista',
      detail: `${sorted[index].div} · ${event.org || 'FightHub'}`
    });
  }

  return fallback;
}

function formatEventDate(date) {
  const value = new Date(`${date}T12:00:00`);
  if (Number.isNaN(value.getTime())) return date || '-';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(value);
}

function getEventStatusLabel(status) {
  return {
    upcoming: 'Proximo',
    past: 'Resultados',
    live: 'Ao vivo',
  }[status] || 'Evento';
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

export function toggleFAB() {
  const actions = document.getElementById('fab-actions');
  const mainBtn = document.getElementById('fab-main');
  if (!actions || !mainBtn) return;
  const isOpen = actions.classList.toggle('open');
  mainBtn.classList.toggle('open', isOpen);
}

export function closeFAB() {
  const actions = document.getElementById('fab-actions');
  const mainBtn = document.getElementById('fab-main');
  if (actions) actions.classList.remove('open');
  if (mainBtn) mainBtn.classList.remove('open');
}

const THEME_KEY = 'fighthub_theme';

export function applyTheme(theme) {
  const nextTheme = theme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);
}

export function initTheme() {
  const storedTheme = localStorage.getItem(THEME_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    applyTheme(storedTheme);
    return;
  }

  applyTheme('dark');
}

export function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  applyTheme(currentTheme === 'light' ? 'dark' : 'light');
}


// =============================================
// NAVIGATION & TABS
// =============================================
export function switchTab(e, tabId) {
  const page = e.target.closest('.page') || document.getElementById('main-content');
  if (!page) return;
  page.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  page.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  e.target.classList.add('active');
  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');
}

export function switchEventsTab(e, filter) {
  const page = document.getElementById('main-content');
  if (!page) return;
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
  if (val < min) input.value = min;
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
  if (!preview || !labelText) return;
  
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

const FIGHTER_PHOTO_PREFS_KEY = 'fighthub_fighter_photo_prefs';
const LAST_ACTIVE_FIGHTER_KEY = 'fighthub_last_active_fighter_id';
const LAST_ACTIVE_TEAM_KEY = 'fighthub_last_active_team_id';
const LAST_ACTIVE_EVENT_KEY = 'fighthub_last_active_event_id';
const FOLLOWED_FIGHTERS_KEY = 'fighthub_followed_fighters';
const COMPARE_FIGHTERS_KEY = 'fighthub_compare_fighters';
const SHOWCASE_PIX_KEY = '0d6d5402-1702-4ab5-8a90-e78df93f3d4b';
const SHOWCASE_PIX_AMOUNT = 10;

function sanitizePixField(value, maxLength) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ]/g, '')
    .trim()
    .slice(0, maxLength);
}

function crc16(str) {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i += 1) {
    crc ^= str.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function pixField(id, value) {
  const safeValue = String(value);
  return `${id}${String(safeValue.length).padStart(2, '0')}${safeValue}`;
}

function buildPixCopyCode() {
  const merchantName = sanitizePixField('FIGHT HUB', 25);
  const merchantCity = sanitizePixField('SALVADOR', 15);
  const txid = sanitizePixField(`VITRINE${state.activeFighterId || 'FH'}`, 25);
  const amount = SHOWCASE_PIX_AMOUNT.toFixed(2);

  const merchantAccountInfo =
    pixField('00', 'br.gov.bcb.pix') +
    pixField('01', SHOWCASE_PIX_KEY);

  const payloadWithoutCrc =
    pixField('00', '01') +
    pixField('26', merchantAccountInfo) +
    pixField('52', '0000') +
    pixField('53', '986') +
    pixField('54', amount) +
    pixField('58', 'BR') +
    pixField('59', merchantName) +
    pixField('60', merchantCity) +
    pixField('62', pixField('05', txid)) +
    '6304';

  return payloadWithoutCrc + crc16(payloadWithoutCrc);
}

async function ensureFighterLoaded(id) {
  const existing = FIGHTERS.find((item) => item.id === id);
  if (existing || !window.supabase) return existing || null;

  const { data, error } = await window.supabase
    .from('fighters')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;

  const mapped = mapRowToFighter(data);
  FIGHTERS.push(mapped);
  return mapped;
}

function loadPhotoPrefs() {
  try {
    return JSON.parse(localStorage.getItem(FIGHTER_PHOTO_PREFS_KEY) || '{}');
  } catch {
    return {};
  }
}

function savePhotoPrefs(allPrefs) {
  localStorage.setItem(FIGHTER_PHOTO_PREFS_KEY, JSON.stringify(allPrefs));
}

function readJsonStorage(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getCurrentUserStorageKey(key) {
  if (!state.currentUser?.id) return `${key}_guest`;
  return `${key}_${state.currentUser.id}`;
}

function getFollowedFighterIds() {
  return readJsonStorage(getCurrentUserStorageKey(FOLLOWED_FIGHTERS_KEY), []);
}

function setFollowedFighterIds(ids) {
  writeJsonStorage(getCurrentUserStorageKey(FOLLOWED_FIGHTERS_KEY), ids);
}

function getComparedFighterIds() {
  return readJsonStorage(COMPARE_FIGHTERS_KEY, []);
}

function setComparedFighterIds(ids) {
  writeJsonStorage(COMPARE_FIGHTERS_KEY, ids.slice(0, 2));
}

async function getFollowSummary(fighter) {
  const localFollowed = getFollowedFighterIds();
  const fallback = {
    isFollowing: localFollowed.includes(fighter.id),
    followersCount: 0,
    followingCount: localFollowed.length,
    followers: [],
    following: localFollowed
      .map((fighterId) => FIGHTERS.find((item) => item.id === fighterId)?.name)
      .filter(Boolean),
  };

  if (!window.supabase) return fallback;

  const [followersCountRes, followingCountRes] = await Promise.all([
    window.supabase
      .from('fighter_follows')
      .select('id', { count: 'exact', head: true })
      .eq('followed_fighter_id', fighter.id),
    fighter.auth_id
      ? window.supabase
          .from('fighter_follows')
          .select('id', { count: 'exact', head: true })
          .eq('follower_auth_id', fighter.auth_id)
      : Promise.resolve({ count: 0, error: null }),
  ]);

  let isFollowing = fallback.isFollowing;
  if (state.currentUser) {
    const followStateRes = await window.supabase
      .from('fighter_follows')
      .select('id')
      .eq('follower_auth_id', state.currentUser.id)
      .eq('followed_fighter_id', fighter.id)
      .maybeSingle();

    isFollowing = Boolean(followStateRes.data);
  }

  let followers = [];
  const followerRows = await window.supabase
    .from('fighter_follows')
    .select('follower_auth_id')
    .eq('followed_fighter_id', fighter.id)
    .limit(8);

  if (followerRows.data?.length) {
    const authIds = followerRows.data.map((row) => row.follower_auth_id).filter(Boolean);
    const [fighterOwners, users] = await Promise.all([
      window.supabase.from('fighters').select('auth_id, name').in('auth_id', authIds),
      window.supabase.from('users').select('auth_id, full_name').in('auth_id', authIds),
    ]);

    followers = authIds.map((authId) => {
      const ownedFighter = fighterOwners.data?.find((item) => item.auth_id === authId);
      const user = users.data?.find((item) => item.auth_id === authId);
      return ownedFighter?.name || user?.full_name || 'Usuario FightHub';
    });
  }

  let following = fallback.following;
  if (fighter.auth_id) {
    const followingRows = await window.supabase
      .from('fighter_follows')
      .select('followed_fighter_id')
      .eq('follower_auth_id', fighter.auth_id)
      .limit(8);

    if (followingRows.data) {
      following = followingRows.data
        .map((row) => FIGHTERS.find((item) => item.id === row.followed_fighter_id)?.name)
        .filter(Boolean);
    }
  }

  return {
    isFollowing,
    followersCount: followersCountRes.count || 0,
    followingCount: followingCountRes.count || 0,
    followers,
    following,
  };
}

async function syncFollowButtonAndNetwork(fighter) {
  const summary = await getFollowSummary(fighter);

  const followButton = document.getElementById('profile-follow-btn');
  if (followButton) {
    followButton.textContent = summary.isFollowing ? 'Seguindo' : '+ Seguir';
    followButton.className = summary.isFollowing ? 'btn btn-outline' : 'btn btn-red';
  }

  const statsGrid = document.getElementById('stats-grid');
  if (statsGrid) {
    const totalFights = getFighterTotalFights(fighter);
    const winRate = totalFights ? Math.round(((fighter.wins || 0) / totalFights) * 100) : 0;
    statsGrid.innerHTML = [
      ['Cartel', `${fighter.wins || 0}-${fighter.losses || 0}-${fighter.draws || 0}`],
      ['Aproveitamento', `${winRate}%`],
      ['Lutas', `${totalFights}`],
      ['Seguidores', `${summary.followersCount}`],
      ['Seguindo', `${summary.followingCount}`],
      ['Equipe', fighter.team || 'Sem equipe'],
    ].map(([label, value]) => `
      <div class="info-cell">
        <div class="val">${value}</div>
        <div class="key">${label}</div>
      </div>
      `).join('');
  }

  const summaryBox = document.getElementById('profile-follow-summary');
  if (summaryBox) {
    summaryBox.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;max-width:620px;">
        <div class="info-cell">
          <div class="val">${summary.followersCount}</div>
          <div class="key">Seguidores</div>
          <div style="margin-top:10px;color:var(--white-dim);font-size:13px;line-height:1.6;">
            ${summary.followers.length ? summary.followers.slice(0, 3).join('<br>') : 'Ainda sem seguidores visiveis.'}
          </div>
        </div>
        <div class="info-cell">
          <div class="val">${summary.followingCount}</div>
          <div class="key">Seguindo</div>
          <div style="margin-top:10px;color:var(--white-dim);font-size:13px;line-height:1.6;">
            ${summary.following.length ? summary.following.slice(0, 3).join('<br>') : 'Ainda nao segue outros atletas.'}
          </div>
        </div>
      </div>
    `;
  }

  const network = document.getElementById('profile-network');
  if (network) {
    network.innerHTML = `
      <div class="section-header" style="margin-top:24px;">
        <div class="section-title">Rede do Lutador</div>
        <div class="section-sub">Seguidores e acompanhamentos</div>
      </div>
      <div class="compare-grid">
        <div class="compare-card">
          <div class="compare-card-name">Seguidores</div>
          <div class="compare-card-sub">${summary.followersCount} no total</div>
          <div style="margin-top:16px;color:var(--white-dim);font-size:14px;">${summary.followers.length ? summary.followers.join('<br>') : 'Nenhum seguidor visivel ainda.'}</div>
        </div>
        <div class="compare-card">
          <div class="compare-card-name">Seguindo</div>
          <div class="compare-card-sub">${summary.followingCount} no total</div>
          <div style="margin-top:16px;color:var(--white-dim);font-size:14px;">${summary.following.length ? summary.following.join('<br>') : 'Nao segue nenhum lutador ainda.'}</div>
        </div>
      </div>
    `;
  }
}

function renderShowcasePanel(fighter) {
  const panel = document.getElementById('profile-showcase-panel');
  if (!panel) return;

  const meta = getShowcaseStatusMeta(fighter);
  const eligibility = getShowcaseEligibility(fighter);
  const canEditOwn = canCurrentUserEditFighter(fighter);
  const isAdmin = isCurrentUserAdmin();

  const toneStyles = {
    success: 'background:rgba(45,163,71,0.12);border-color:rgba(45,163,71,0.35);color:#9de3a9;',
    warning: 'background:rgba(245,166,35,0.12);border-color:rgba(245,166,35,0.35);color:#ffd58a;',
    danger: 'background:rgba(232,25,44,0.12);border-color:rgba(232,25,44,0.35);color:#ff8a97;',
    muted: 'background:rgba(255,255,255,0.03);border-color:var(--dark4);color:var(--gray-light);',
  };

  const issuesHtml = canEditOwn && !eligibility.eligible
    ? `<div style="margin-top:12px;color:var(--gray-light);font-size:13px;line-height:1.6;">Para entrar na Vitrine voce precisa:<br>${eligibility.issues.map((item) => `- ${item}`).join('<br>')}</div>`
    : '';

  const ownerActions = canEditOwn ? `
    <div style="margin-top:14px;color:var(--white-dim);font-size:14px;line-height:1.7;">
      Entrar na Vitrine Premium aumenta a visibilidade do atleta dentro do FightHub, fortalece a autoridade do perfil e coloca o lutador em uma area destacada para comparacoes, descoberta e busca por oportunidades.
      <div style="margin-top:10px;color:var(--gold);font-family:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Plano de destaque: R$ 10,00 via Pix + analise da equipe FightHub</div>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
      <button class="btn btn-red" onclick="openShowcasePaymentModal()">${fighter.showcase_plan === 'premium' && fighter.showcase_status === 'pending' ? 'Ver pagamento' : 'Assinar Vitrine Premium'}</button>
      <button class="btn btn-outline" onclick="openShowcaseBenefitsModal()">Beneficios de Premium</button>
      ${fighter.showcase_status === 'pending' ? `<button class="btn btn-outline" onclick="cancelShowcaseRequest()">Cancelar pedido</button>` : ''}
    </div>
  ` : '';

  const adminActions = isAdmin ? `
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px;">
      <button class="btn btn-red" onclick="approveShowcaseForActiveFighter()">Aprovar Vitrine</button>
      <button class="btn btn-outline" onclick="rejectShowcaseForActiveFighter()">Rejeitar</button>
      <button class="btn btn-outline" onclick="removeShowcaseFromActiveFighter()">Remover da Vitrine</button>
    </div>
  ` : '';

    panel.innerHTML = `
      <div style="border:1px solid var(--dark4);padding:18px 16px 16px;background:var(--dark2);max-width:620px;">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap;">
          <div>
            <div style="font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--gray-light);margin-bottom:8px;">Vitrine Premium</div>
            <div style="font-family:'Bebas Neue',sans-serif;font-size:30px;letter-spacing:1px;color:var(--white);line-height:1;">${meta.label}</div>
          </div>
          <div style="border:1px solid;padding:8px 12px;font-family:'Barlow Condensed',sans-serif;font-size:12px;letter-spacing:1px;text-transform:uppercase;${toneStyles[meta.tone] || toneStyles.muted}">
            Plano ${fighter.showcase_plan === 'premium' ? 'Premium' : 'Free'}
          </div>
        </div>
        <div style="margin-top:10px;color:var(--white-dim);font-size:14px;line-height:1.6;max-width:560px;">${meta.copy}</div>
        ${fighter.showcase_requested_at ? `<div style="margin-top:10px;color:var(--gray-light);font-size:12px;">Pedido enviado em ${new Date(fighter.showcase_requested_at).toLocaleDateString('pt-BR')}</div>` : ''}
        ${issuesHtml}
        ${ownerActions}
        ${adminActions}
      </div>
  `;
}

async function mutateActiveFighterShowcase(changes, successMessage) {
  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter) return;

  try {
    await updateFighterShowcase(fighter.id, changes);
    await loadFightersFromSupabase();
    await showFighterProfile(fighter.id, { skipNavigation: true });
    showToast(successMessage);
  } catch (error) {
    console.error('Showcase update failed:', error);
    showToast('Nao foi possivel atualizar a Vitrine agora.', true);
  }
}

async function toggleFollowRecord(fighter) {
  if (!window.supabase || !state.currentUser) {
    const followed = getFollowedFighterIds();
    const exists = followed.includes(fighter.id);
    const next = exists ? followed.filter((id) => id !== fighter.id) : [...followed, fighter.id];
    setFollowedFighterIds(next);
    return { usedFallback: true, followed: !exists };
  }

  const existing = await window.supabase
    .from('fighter_follows')
    .select('id')
    .eq('follower_auth_id', state.currentUser.id)
    .eq('followed_fighter_id', fighter.id)
    .maybeSingle();

  if (existing.error && existing.error.code !== 'PGRST116') {
    throw existing.error;
  }

  if (existing.data?.id) {
    const result = await window.supabase
      .from('fighter_follows')
      .delete()
      .eq('id', existing.data.id);

    if (result.error) throw result.error;
    return { usedFallback: false, followed: false };
  }

  const insertResult = await window.supabase
    .from('fighter_follows')
    .insert({
      follower_auth_id: state.currentUser.id,
      followed_fighter_id: fighter.id,
    });

  if (insertResult.error) {
    throw insertResult.error;
  }

  return { usedFallback: false, followed: true };
}

function setPhotoPrefsForFighter(fighterId, prefs) {
  const allPrefs = loadPhotoPrefs();
  allPrefs[String(fighterId)] = prefs;
  savePhotoPrefs(allPrefs);
}

function getPhotoPrefsForFighter(fighter) {
  const stored = loadPhotoPrefs()[String(fighter.id)] || {};
  return {
    position: fighter.photo_position || stored.position || '50% 50%',
    zoom:
      typeof fighter.photo_zoom === 'number'
        ? fighter.photo_zoom
        : typeof stored.zoom === 'number'
          ? stored.zoom
          : 1,
  };
}

function getFighterImageMarkup(fighter, options = {}) {
  if (!fighter.photo_url) return '';

  const prefs = getPhotoPrefsForFighter(fighter);
  const objectPosition = options.position || prefs.position || '50% 50%';
  const zoom = options.zoom || prefs.zoom || 1;
  const wrapperStyle =
    'width:100%;height:100%;overflow:hidden;position:relative;';
  const imageStyle = [
    'width:100%',
    'height:100%',
    'object-fit:cover',
    `object-position:${objectPosition}`,
    `transform:scale(${zoom})`,
    'transform-origin:center center',
    'display:block',
  ].join(';');

  return `<div style="${wrapperStyle}"><img src="${fighter.photo_url}" style="${imageStyle}"></div>`;
}

function normalizeName(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getCurrentUserFullName() {
  if (state.currentUserProfile?.full_name) return state.currentUserProfile.full_name;

  const meta = state.currentUser?.user_metadata || {};
  const fullName = meta.full_name || [meta.first_name, meta.last_name].filter(Boolean).join(' ');
  return fullName || null;
}

function canCurrentUserEditFighter(fighter) {
  if (!state.currentUser || !fighter) return false;
  if (state.currentUserFighterId) {
    return fighter.id === state.currentUserFighterId;
  }
  if (fighter.auth_id) {
    return fighter.auth_id === state.currentUser.id;
  }

  const currentUserName = normalizeName(getCurrentUserFullName());
  const fighterName = normalizeName(fighter.name);
  return Boolean(currentUserName && fighterName && currentUserName === fighterName);
}

function updateProfilePhotoPreview() {
  const preview = document.getElementById('epf-preview');
  if (!preview) return;

  const input = document.getElementById('epf-file');
  const xRange = document.getElementById('epf-pos-x');
  const yRange = document.getElementById('epf-pos-y');
  const zoomRange = document.getElementById('epf-zoom');
  const activeFighter = FIGHTERS.find((fighter) => fighter.id === state.activeFighterId);
  if (!activeFighter) return;

  const localPreview = input?.dataset.previewUrl;
  const url = localPreview || activeFighter.photo_url;
  const position = `${xRange?.value || 50}% ${yRange?.value || 50}%`;
  const zoom = Number(zoomRange?.value || 1);

  preview.style.backgroundImage = url ? `url("${url}")` : 'none';
  preview.style.backgroundPosition = position;
  preview.style.backgroundSize = `${zoom * 100}%`;
  preview.style.backgroundRepeat = 'no-repeat';
}

function seedPhotoEditorValues(fighter) {
  const prefs = getPhotoPrefsForFighter(fighter);
  const [x = '50%', y = '50%'] = String(prefs.position || '50% 50%').split(' ');
  const xRange = document.getElementById('epf-pos-x');
  const yRange = document.getElementById('epf-pos-y');
  const zoomRange = document.getElementById('epf-zoom');
  const input = document.getElementById('epf-file');
  const helper = document.getElementById('epf-current-photo');

  if (xRange) xRange.value = parseInt(x, 10) || 50;
  if (yRange) yRange.value = parseInt(y, 10) || 50;
  if (zoomRange) zoomRange.value = String(prefs.zoom || 1);
  if (input) {
    input.value = '';
    delete input.dataset.previewUrl;
  }
  if (helper) {
    helper.textContent = fighter.photo_url
      ? 'Ajuste a posição do rosto ou selecione uma nova imagem.'
      : 'Selecione uma imagem para este perfil.';
  }
  updateProfilePhotoPreview();
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function extractStateName(location) {
  const normalized = normalizeText(location);
  if (!normalized) return '';
  const parts = normalized.split(',');
  return parts.length > 1 ? parts[0].trim() : normalized;
}

export function filterFighters() {
  const searchInput = document.getElementById('fighters-search');
  const divisionSelect = document.getElementById('fighters-division');
  const search = normalizeText(searchInput?.value);
  const division = divisionSelect?.value || '';

  const filtered = FIGHTERS.filter((fighter) => {
    const haystack = [
      fighter.name,
      fighter.nick,
      fighter.team,
      fighter.div,
      fighter.nat,
    ]
      .map(normalizeText)
      .join(' ');

    const matchesSearch = !search || haystack.includes(search);
    const matchesDivision = !division || fighter.div === division;
    return matchesSearch && matchesDivision;
  });

  if (typeof window.renderFightersList === 'function') {
    window.renderFightersList(filtered);
  }
}

export function filterTeams() {
  const searchInput = document.getElementById('teams-search');
  const stateSelect = document.querySelector('#page-teams .filter-select');
  const search = normalizeText(searchInput?.value);
  const selectedState = normalizeText(
    stateSelect && stateSelect.selectedIndex > 0 ? stateSelect.value : ''
  );

  const filtered = TEAMS.filter((team) => {
    const haystack = [team.name, team.location, team.meta, team.coach]
      .map(normalizeText)
      .join(' ');

    const matchesSearch = !search || haystack.includes(search);
    const matchesState =
      !selectedState || extractStateName(team.location).includes(selectedState);

    return matchesSearch && matchesState;
  });

  const grid = document.getElementById('teams-grid');
  if (grid) {
    grid.innerHTML = filtered.length
      ? filtered.map(teamCardHTML).join('')
      : '<div style="color:var(--gray-light);font-size:14px;padding:16px 0;">Nenhuma equipe encontrada.</div>';
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
export function fighterCardHTML(f, options = {}) {
  const badgeRank = options.badgeRank ?? f.rank;
  const showcaseBadge = isShowcaseApproved(f)
    ? `<div class="fighter-showcase-badge">SELO ELITE</div>`
    : '';
  const imgHtml = f.photo_url 
    ? getFighterImageMarkup(f)
    : `<span style="font-size:70px;opacity:0.12;position:absolute;">${f.flag||'🥊'}</span>
       <span style="font-size:60px;z-index:1;">🥊</span>`;

  return `<div class="fighter-card" onclick="showFighterProfile(${f.id})">
    <div class="fighter-card-img" style="background:var(--dark3);position:relative;overflow:hidden;">
      ${badgeRank ? `<div class="fighter-rank">#${badgeRank}</div>` : ''}
      ${showcaseBadge}
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
  return `<div class="event-item" onclick="showEventProfile(${e.id})">
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
export async function showFighterProfile(id, options = {}) {
  let f = FIGHTERS.find(x => x.id === id);
  if (!f) {
    f = await ensureFighterLoaded(id);
  }
  if (!f) {
    if (!options.skipNavigation) {
      showToast('Nao foi possivel carregar este perfil.', true);
      window.showPage('fighters');
    }
    return;
  }
  state.activeFighterId = id;
  localStorage.setItem(LAST_ACTIVE_FIGHTER_KEY, String(id));

  if (!options.skipNavigation) {
    window.showPage('fighter-profile', { id });
    return;
  }
  
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
      document.getElementById('profile-avatar').innerHTML = getFighterImageMarkup(f);
    } else {
      document.getElementById('profile-avatar').textContent = '🥊';
    }

    const teamEl = document.getElementById('pi-team');
    teamEl.textContent = f.team || 'Sem Equipe';
    teamEl.style.cursor = f.teamId ? 'pointer' : 'default';
    teamEl.style.color = f.teamId ? 'var(--red)' : 'var(--white)';
    
      const profileTags = [...(f.tags || []), ...getApprovedShowcaseTags(f)];
      document.getElementById('profile-tags').innerHTML = profileTags.map(t =>
        `<div class="tag ${t.includes('#1') ? 'red' : (t === 'Vitrine Premium' || t === 'Selo Elite') ? 'premium' : ''}">${t}</div>`).join('');

    const editButton = document.getElementById('profile-edit-photo-btn');
    if (editButton) {
      editButton.style.display = canCurrentUserEditFighter(f) ? 'inline-flex' : 'none';
    }

    const compareButton = document.getElementById('profile-compare-btn');
    if (compareButton) {
      const compared = getComparedFighterIds().includes(f.id);
      compareButton.textContent = compared ? 'No Comparador' : 'Comparar';
    }
      
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
      
      document.getElementById('about-text').textContent = f.bio || 'Sem informacoes adicionais.';
      syncFollowButtonAndNetwork(f);
      renderShowcasePanel(f);
    }, 50);
  }

export async function toggleFollowActiveFighter() {
  if (!state.currentUser) {
    showToast('Faça login para seguir lutadores.', true);
    window.showPage('login');
    return;
  }

  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter) return;

  try {
    const result = await toggleFollowRecord(fighter);
    await showFighterProfile(fighter.id, { skipNavigation: true });
    showToast(result.followed ? `${fighter.name} agora esta nos seus seguidos.` : `${fighter.name} removido dos seguidos.`);
  } catch (error) {
    console.error('Follow toggle failed:', error);
    showToast('Nao foi possivel atualizar o follow agora.', true);
  }
}

export function compareActiveFighter() {
  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter) return;

  const compared = getComparedFighterIds();
  if (!compared.includes(fighter.id)) {
    if (compared.length >= 2) {
      showToast('O comparador aceita apenas 2 lutadores por vez.', true);
      window.showPage('compare');
      return;
    }

    setComparedFighterIds([...compared, fighter.id]);
    showToast(`${fighter.name} adicionado ao comparador.`);
  } else {
    showToast(`${fighter.name} já está no comparador.`);
  }

  window.showPage('compare');
}

export async function requestShowcaseEntry() {
  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter) return;

  if (!state.currentUser) {
    showToast('Faca login para solicitar a Vitrine.', true);
    window.showPage('login');
    return;
  }

  if (!canCurrentUserEditFighter(fighter)) {
    showToast('Voce so pode solicitar a Vitrine para o seu proprio perfil.', true);
    return;
  }

  const eligibility = getShowcaseEligibility(fighter);
  if (!eligibility.eligible) {
    showToast('Complete o perfil antes de pedir entrada na Vitrine.', true);
    renderShowcasePanel(fighter);
    return;
  }

  await mutateActiveFighterShowcase({
    showcase_plan: 'premium',
    showcase_enabled: false,
    showcase_status: 'pending',
    showcase_requested_at: new Date().toISOString(),
    showcase_approved_at: null,
    showcase_expires_at: null,
  }, 'Solicitacao enviada. Seu perfil premium entrou em analise.');
}

export function openShowcasePaymentModal() {
  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter) return;

  if (!state.currentUser) {
    showToast('Faca login para contratar a Vitrine.', true);
    window.showPage('login');
    return;
  }

  if (!canCurrentUserEditFighter(fighter)) {
    showToast('Voce so pode contratar a Vitrine para o seu proprio perfil.', true);
    return;
  }

  const eligibility = getShowcaseEligibility(fighter);
  const copyCode = buildPixCopyCode();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(copyCode)}`;

  const title = document.getElementById('showcase-pay-title');
  const subtitle = document.getElementById('showcase-pay-subtitle');
  const summary = document.getElementById('showcase-pay-summary');
  const amount = document.getElementById('showcase-pay-amount');
  const key = document.getElementById('showcase-pay-key');
  const code = document.getElementById('showcase-pay-code');
  const qr = document.getElementById('showcase-pay-qr');
  const cta = document.getElementById('showcase-pay-confirm');

  if (title) title.textContent = `Vitrine Premium - ${fighter.name}`;
  if (subtitle) subtitle.textContent = 'Mais visibilidade, destaque editorial e presenca em uma area premium de descoberta de atletas.';
  if (summary) {
    summary.innerHTML = eligibility.eligible
      ? 'Seu perfil ja atende aos criterios tecnicos. Depois do pagamento, voce confirma no app e o status vai para analise. Ao ser aprovado, o atleta entra na Vitrine Premium, ganha mais destaque editorial, mais descoberta e presenca nas areas premium do FightHub.'
      : `Antes do pagamento, ajuste seu perfil para cumprir estes pontos:<br>${eligibility.issues.map((item) => `- ${item}`).join('<br>')}`;
  }
  if (amount) amount.textContent = `R$ ${SHOWCASE_PIX_AMOUNT.toFixed(2).replace('.', ',')}`;
  if (key) key.textContent = SHOWCASE_PIX_KEY;
  if (code) code.value = copyCode;
  if (qr) {
    qr.src = qrUrl;
    qr.alt = 'QR Code Pix da Vitrine Premium';
  }
  if (cta) {
    cta.disabled = !eligibility.eligible;
    cta.textContent = eligibility.eligible ? 'Ja paguei, enviar para analise' : 'Complete o perfil antes de pagar';
  }

  openModal('modal-showcase-payment');
}

export function openShowcaseBenefitsModal() {
  openModal('modal-showcase-benefits');
}

export async function confirmShowcasePixPayment() {
  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter) return;

  const eligibility = getShowcaseEligibility(fighter);
  if (!eligibility.eligible) {
    showToast('Complete o perfil antes de solicitar a Vitrine.', true);
    return;
  }

  closeModal('modal-showcase-payment');
  await requestShowcaseEntry();
}

export function copyShowcasePixCode() {
  const input = document.getElementById('showcase-pay-code');
  if (!input) return;

  input.select();
  input.setSelectionRange(0, input.value.length);
  document.execCommand('copy');
  showToast('Codigo Pix copiado.');
}

export async function shareShowcasePixCode() {
  const input = document.getElementById('showcase-pay-code');
  if (!input?.value) return;

  const message = `Pagamento da Vitrine Premium FightHub - R$ ${SHOWCASE_PIX_AMOUNT.toFixed(2).replace('.', ',')}\n\nPix copia e cola:\n${input.value}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Pix Vitrine Premium FightHub',
        text: message,
      });
      return;
    } catch (error) {
      if (error?.name === 'AbortError') return;
    }
  }

  await navigator.clipboard?.writeText(message);
  showToast('Seu aparelho nao abriu o compartilhamento. O Pix foi copiado.');
}

export async function cancelShowcaseRequest() {
  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter || !canCurrentUserEditFighter(fighter)) return;

  await mutateActiveFighterShowcase({
    showcase_enabled: false,
    showcase_status: 'hidden',
    showcase_requested_at: null,
    showcase_approved_at: null,
  }, 'Pedido de Vitrine cancelado.');
}

export async function approveShowcaseForActiveFighter() {
  if (!isCurrentUserAdmin()) {
    showToast('Apenas administradores podem aprovar a Vitrine.', true);
    return;
  }

  await mutateActiveFighterShowcase({
    showcase_plan: 'premium',
    showcase_enabled: true,
    showcase_status: 'approved',
    showcase_approved_at: new Date().toISOString(),
    showcase_expires_at: null,
  }, 'Perfil aprovado e publicado na Vitrine.');
}

export async function rejectShowcaseForActiveFighter() {
  if (!isCurrentUserAdmin()) {
    showToast('Apenas administradores podem revisar a Vitrine.', true);
    return;
  }

  await mutateActiveFighterShowcase({
    showcase_enabled: false,
    showcase_status: 'rejected',
  }, 'Perfil marcado para ajustes antes da Vitrine.');
}

export async function removeShowcaseFromActiveFighter() {
  if (!isCurrentUserAdmin()) {
    showToast('Apenas administradores podem remover perfis da Vitrine.', true);
    return;
  }

  await mutateActiveFighterShowcase({
    showcase_enabled: false,
    showcase_status: 'hidden',
    showcase_approved_at: null,
  }, 'Perfil removido da Vitrine.');
}

export function showTeamProfile(id, options = {}) {
  const t = TEAMS.find(x => x.id === id);
  if (!t) return;
  state.activeTeamId = id;
  localStorage.setItem(LAST_ACTIVE_TEAM_KEY, String(id));

  if (!options.skipNavigation) {
    window.showPage('team-profile', { id });
    return;
  }
  
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

export function showEventProfile(id, options = {}) {
  const event = EVENTS.find((item) => item.id === id);
  if (!event) {
    showToast('Evento nao encontrado.', true);
    if (!options.skipNavigation) window.showPage('events');
    return;
  }

  state.activeEventId = id;
  localStorage.setItem(LAST_ACTIVE_EVENT_KEY, String(id));

  if (!options.skipNavigation) {
    window.showPage('event-profile', { id });
    return;
  }

  setTimeout(() => {
    const nameEl = document.getElementById('event-name');
    const breadcrumbEl = document.getElementById('event-breadcrumb');
    const orgTagEl = document.getElementById('event-org-tag');
    const locationDateEl = document.getElementById('event-location-date');
    const statusBadgeEl = document.getElementById('event-status-badge');
    const fightsCountEl = document.getElementById('event-fights-count');
    const cityShortEl = document.getElementById('event-city-short');
    const seasonEl = document.getElementById('event-season');
    const infoOrgEl = document.getElementById('event-info-org');
    const infoDateEl = document.getElementById('event-info-date');
    const infoCityEl = document.getElementById('event-info-city');
    const infoStatusEl = document.getElementById('event-info-status');
    const infoFightsEl = document.getElementById('event-info-fights');
    const infoSummaryEl = document.getElementById('event-info-summary');
    const resultsEl = document.getElementById('event-results-list');

    if (!nameEl || !resultsEl) return;

    const eventDate = formatEventDate(event.date);
    const statusClass = { upcoming: 'status-upcoming', past: 'status-results', live: 'status-live' }[event.status] || 'status-results';
    const statusLabel = getEventStatusLabel(event.status);
    const resultRows = getEventResultRows(event);

    if (breadcrumbEl) breadcrumbEl.textContent = event.name;
    if (orgTagEl) orgTagEl.textContent = event.org || 'FightHub';
    nameEl.textContent = event.name;
    if (locationDateEl) locationDateEl.textContent = `${event.city || '-'} - ${eventDate}`;
    if (statusBadgeEl) {
      statusBadgeEl.className = `event-status ${statusClass}`;
      statusBadgeEl.textContent = statusLabel;
    }
    if (fightsCountEl) fightsCountEl.textContent = String(event.fights || 0);
    if (cityShortEl) cityShortEl.textContent = String(event.city || '-').split(',')[0];
    if (seasonEl) seasonEl.textContent = String(event.date || '').slice(0, 4) || '-';
    if (infoOrgEl) infoOrgEl.textContent = event.org || '-';
    if (infoDateEl) infoDateEl.textContent = eventDate;
    if (infoCityEl) infoCityEl.textContent = event.city || '-';
    if (infoStatusEl) infoStatusEl.textContent = statusLabel;
    if (infoFightsEl) infoFightsEl.textContent = `${event.fights || 0} lutas`;
    if (infoSummaryEl) infoSummaryEl.textContent = `${statusLabel} com ${event.fights || 0} confrontos previstos`;

    resultsEl.innerHTML = resultRows.length
      ? resultRows.map((row, index) => `
          <div class="event-item">
            <div class="event-date">
              <div class="month">LUTA</div>
              <div class="day">${index + 1}</div>
              <div class="year">${String(event.date || '').slice(0, 4)}</div>
            </div>
            <div>
              <div class="event-name">${row.red} vs ${row.blue}</div>
              <div class="event-org">${row.outcome}</div>
              <div class="event-location">${row.detail}</div>
            </div>
            <div class="event-status ${statusClass}">${statusLabel}</div>
          </div>
        `).join('')
      : '<div style="color:var(--gray-light);padding:16px 0;">Nenhum confronto disponivel para este evento.</div>';
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

function buildComparisonCard(fighter) {
  if (!fighter) {
    return `
      <div class="compare-card compare-card-empty">
        <div class="compare-empty-label">Selecione um lutador</div>
        <p>Escolha um atleta abaixo para iniciar o comparativo.</p>
      </div>
    `;
  }

  return `
    <div class="compare-card">
      <div class="compare-card-head">
        <div>
          <div class="compare-card-name">${fighter.name}</div>
          <div class="compare-card-sub">${fighter.nick} · ${fighter.div}</div>
        </div>
        <button class="btn btn-outline" onclick="removeFighterFromCompare(${fighter.id})">Remover</button>
      </div>
      <div class="compare-stats-grid">
        <div class="compare-stat"><span>Vitórias</span><strong>${fighter.wins || 0}</strong></div>
        <div class="compare-stat"><span>Derrotas</span><strong>${fighter.losses || 0}</strong></div>
        <div class="compare-stat"><span>Empates</span><strong>${fighter.draws || 0}</strong></div>
        <div class="compare-stat"><span>Equipe</span><strong>${fighter.team || 'Sem equipe'}</strong></div>
        <div class="compare-stat"><span>Altura</span><strong>${fighter.height || '—'}</strong></div>
        <div class="compare-stat"><span>Peso</span><strong>${fighter.weight || '—'}</strong></div>
      </div>
    </div>
  `;
}

export function renderCompareCandidates() {
  const container = document.getElementById('compare-candidates');
  if (!container) return;

  const search = normalizeText(document.getElementById('compare-search')?.value);
  const compared = getComparedFighterIds();

  const list = FIGHTERS.filter((fighter) => {
    const haystack = [fighter.name, fighter.nick, fighter.team, fighter.div].map(normalizeText).join(' ');
    return !search || haystack.includes(search);
  });

  container.innerHTML = list.map((fighter) => {
    const selected = compared.includes(fighter.id);
    const disabled = !selected && compared.length >= 2;
    const buttonClass = selected ? 'btn btn-outline' : 'btn btn-red';
    const buttonLabel = selected ? 'Selecionado' : 'Adicionar';

    return `
      <div class="fighter-card">
        <div class="fighter-card-img" style="background:var(--dark3);position:relative;overflow:hidden;">
          ${fighter.photo_url ? getFighterImageMarkup(fighter) : `<span style="font-size:70px;opacity:0.12;position:absolute;">${fighter.flag || '🥊'}</span><span style="font-size:60px;z-index:1;">🥊</span>`}
        </div>
        <div class="fighter-card-body">
          <div class="fighter-name">${fighter.name}</div>
          <div class="fighter-nick">${fighter.nick}</div>
          <div class="fighter-meta">${fighter.div}</div>
          <button class="${buttonClass}" style="width:100%;margin-top:12px;" ${disabled ? 'disabled' : ''} onclick="addFighterToCompare(${fighter.id})">${buttonLabel}</button>
        </div>
      </div>
    `;
  }).join('');
}

export function renderComparePage() {
  const selection = document.getElementById('compare-selection');
  if (!selection) return;

  const comparedIds = getComparedFighterIds();
  const fighters = comparedIds.map((id) => FIGHTERS.find((fighter) => fighter.id === id)).filter(Boolean);

  selection.innerHTML = `
    <div class="compare-grid">
      ${buildComparisonCard(fighters[0])}
      ${buildComparisonCard(fighters[1])}
    </div>
  `;

  renderCompareCandidates();
}

export function addFighterToCompare(id) {
  const fighter = FIGHTERS.find((item) => item.id === id);
  if (!fighter) return;

  const compared = getComparedFighterIds();
  if (compared.includes(id)) {
    renderComparePage();
    return;
  }

  if (compared.length >= 2) {
    showToast('Remova um dos lutadores antes de adicionar outro.', true);
    return;
  }

  setComparedFighterIds([...compared, id]);
  renderComparePage();
}

export function removeFighterFromCompare(id) {
  const compared = getComparedFighterIds().filter((fighterId) => fighterId !== id);
  setComparedFighterIds(compared);
  renderComparePage();
}

export function clearCompareFighters() {
  setComparedFighterIds([]);
  renderComparePage();
}

export function renderEliteProfilesPage() {
  const container = document.getElementById('elite-profiles-list');
  const count = document.getElementById('elite-count');
  if (!container || !count) return;

  const search = normalizeText(document.getElementById('elite-search')?.value);
  const followed = getFollowedFighterIds();
  const sorted = getSortedEliteFighters();

  const filtered = sorted.filter((fighter) => {
    const haystack = [fighter.name, fighter.team, fighter.div, fighter.nick].map(normalizeText).join(' ');
    return !search || haystack.includes(search);
  });

  count.textContent = `${filtered.length} perfis em exibição`;

  container.innerHTML = filtered.map((fighter, index) => {
    const totalFights = getFighterTotalFights(fighter);
    const following = followed.includes(fighter.id);
    const history = FIGHT_HISTORY[fighter.id] || [];
    const lastFight = history[0]?.date || 'Sem registro recente';

    return `
      <article class="elite-profile-card">
        <div class="elite-profile-accent">#${index + 1} EM EVIDÊNCIA</div>
        <div class="elite-profile-main">
          <div class="elite-profile-summary">
            <h3>${fighter.name}</h3>
            <p><strong>Assinatura técnica:</strong> ${fighter.nick || 'Perfil competitivo'} </p>
            <p><strong>Ritmo competitivo:</strong> ${totalFights} lutas registradas</p>
            <p><strong>Última movimentação:</strong> ${lastFight}</p>
          </div>
          <div class="elite-profile-photo">
            ${fighter.photo_url ? getFighterImageMarkup(fighter) : `<span>${fighter.flag || '🥊'}</span>`}
          </div>
          <div class="elite-profile-meta">
            <div><strong>Categoria:</strong> ${fighter.div}</div>
            <div><strong>Equipe:</strong> ${fighter.team || 'Sem equipe'}</div>
            <div><strong>Cartel:</strong> ${fighter.wins || 0}V / ${fighter.losses || 0}D / ${fighter.draws || 0}E</div>
            <div><strong>Nacionalidade:</strong> ${fighter.nat || '—'}</div>
          </div>
          <div class="elite-profile-actions">
            <button class="${following ? 'btn btn-outline' : 'btn btn-red'}" onclick="toggleFollowById(${fighter.id})">${following ? 'Seguindo' : 'Seguir'}</button>
            <button class="btn btn-outline" onclick="addFighterToCompare(${fighter.id});showPage('compare')">Comparar</button>
            <button class="btn btn-red" onclick="showFighterProfile(${fighter.id})">Abrir Perfil</button>
          </div>
        </div>
      </article>
    `;
  }).join('') || '<div style="color:var(--gray-light);padding:24px 0;">Nenhum atleta encontrado para este filtro.</div>';
}

export async function toggleFollowById(id) {
  const fighter = FIGHTERS.find((item) => item.id === id);
  if (!fighter) return;

  if (!state.currentUser) {
    showToast('Faça login para seguir lutadores.', true);
    window.showPage('login');
    return;
  }

  try {
    const result = await toggleFollowRecord(fighter);
    if (state.activeFighterId === id && document.getElementById('profile-follow-btn')) {
      await showFighterProfile(id, { skipNavigation: true });
    }
    renderEliteProfilesPage();
    showToast(result.followed ? `${fighter.name} agora esta nos seus seguidos.` : `${fighter.name} removido dos seguidos.`);
  } catch (error) {
    console.error('Follow toggle failed:', error);
    showToast('Nao foi possivel atualizar o follow agora.', true);
  }
}

export function renderEliteProfilesPageV2() {
  const container = document.getElementById('elite-profiles-list');
  const count = document.getElementById('elite-count');
  if (!container || !count) return;

  const search = normalizeText(document.getElementById('elite-search')?.value);
  const followed = getFollowedFighterIds();
  const sorted = getSortedEliteFighters();

  const filtered = sorted.filter((fighter) => {
    const haystack = [fighter.name, fighter.team, fighter.div, fighter.nick].map(normalizeText).join(' ');
    return !search || haystack.includes(search);
  });

  count.textContent = `${filtered.length} perfis em exibicao`;

  if (!filtered.length) {
    container.innerHTML = `
      <div style="border:1px solid var(--dark4);background:var(--dark2);padding:24px;color:var(--gray-light);line-height:1.7;">
        Nenhum atleta aprovado na Vitrine para este filtro.
        ${state.currentUserFighterId ? `<div style="margin-top:14px;"><button class="btn btn-red" onclick="showPage('fighter-profile', { id: ${state.currentUserFighterId} })">Quero entrar na Vitrine</button></div>` : ''}
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((fighter, index) => {
    const totalFights = getFighterTotalFights(fighter);
    const following = followed.includes(fighter.id);
    const history = FIGHT_HISTORY[fighter.id] || [];
    const lastFight = history[0]?.date || 'Sem registro recente';

    return `
      <article class="elite-profile-card">
        <div class="elite-profile-accent">#${index + 1} EM EVIDENCIA</div>
        <div class="elite-profile-main">
          <div class="elite-profile-summary">
            <h3>${fighter.name}</h3>
            <p><strong>Assinatura tecnica:</strong> ${fighter.nick || 'Perfil competitivo'}</p>
            <p><strong>Ritmo competitivo:</strong> ${totalFights} lutas registradas</p>
            <p><strong>Ultima movimentacao:</strong> ${lastFight}</p>
          </div>
          <div class="elite-profile-photo">
            ${fighter.photo_url ? getFighterImageMarkup(fighter) : `<span>${fighter.flag || 'F'}</span>`}
          </div>
          <div class="elite-profile-meta">
            <div><strong>Categoria:</strong> ${fighter.div}</div>
            <div><strong>Equipe:</strong> ${fighter.team || 'Sem equipe'}</div>
            <div><strong>Cartel:</strong> ${fighter.wins || 0}V / ${fighter.losses || 0}D / ${fighter.draws || 0}E</div>
            <div><strong>Nacionalidade:</strong> ${fighter.nat || '-'}</div>
            <div><strong>Plano:</strong> ${fighter.showcase_plan === 'premium' ? 'Premium' : 'Free'}</div>
          </div>
          <div class="elite-profile-actions">
            <button class="${following ? 'btn btn-outline' : 'btn btn-red'}" onclick="toggleFollowById(${fighter.id})">${following ? 'Seguindo' : 'Seguir'}</button>
            <button class="btn btn-outline" onclick="addFighterToCompare(${fighter.id});showPage('compare')">Comparar</button>
            <button class="btn btn-red" onclick="showFighterProfile(${fighter.id})">Abrir Perfil</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

export function previewOwnProfilePhoto(input) {
  const file = input.files?.[0];
  if (!file) {
    delete input.dataset.previewUrl;
    updateProfilePhotoPreview();
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast('A imagem deve ter no máximo 5MB.', true);
    input.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    input.dataset.previewUrl = event.target?.result || '';
    updateProfilePhotoPreview();
  };
  reader.readAsDataURL(file);
}

export function openOwnPhotoEditor() {
  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter) return;

  if (!canCurrentUserEditFighter(fighter)) {
    showToast('Você só pode editar a foto do seu próprio perfil.', true);
    return;
  }

  seedPhotoEditorValues(fighter);
  openModal('modal-edit-profile-photo');
}

export async function saveOwnProfilePhoto() {
  const fighter = FIGHTERS.find((item) => item.id === state.activeFighterId);
  if (!fighter) return;

  if (!canCurrentUserEditFighter(fighter)) {
    showToast('Você só pode editar a foto do seu próprio perfil.', true);
    return;
  }

  const xRange = document.getElementById('epf-pos-x');
  const yRange = document.getElementById('epf-pos-y');
  const zoomRange = document.getElementById('epf-zoom');
  const fileInput = document.getElementById('epf-file');
  const saveButton = document.getElementById('epf-save-btn');
  const position = `${xRange?.value || 50}% ${yRange?.value || 50}%`;
  const zoom = Number(zoomRange?.value || 1);
  let photoUrl = fighter.photo_url;

  try {
    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = 'Salvando...';
    }

    if (fileInput?.files?.length) {
      photoUrl = await uploadFighterPhoto(fileInput.files[0]);
    }

    const updated = await updateFighterPhotoProfile(fighter.id, {
      photo_url: photoUrl,
      photo_position: position,
      photo_zoom: zoom,
    });

    const target = FIGHTERS.find((item) => item.id === fighter.id);
    if (target) {
      target.photo_url = updated.photo_url || photoUrl;
      target.photo_position = updated.photo_position || position;
      target.photo_zoom =
        typeof updated.photo_zoom === 'number' ? updated.photo_zoom : zoom;
    }

    setPhotoPrefsForFighter(fighter.id, {
      position,
      zoom,
    });

    closeModal('modal-edit-profile-photo');
    showFighterProfile(fighter.id);
    showToast('Foto do perfil atualizada com sucesso!');
  } catch (error) {
    console.error('Profile photo update failed:', error);
    setPhotoPrefsForFighter(fighter.id, {
      position,
      zoom,
    });
    showFighterProfile(fighter.id);
    showToast('A foto foi atualizada parcialmente. Ajuste local salvo neste navegador.', true);
  } finally {
    if (saveButton) {
      saveButton.disabled = false;
      saveButton.textContent = 'Salvar foto';
    }
  }
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
window.toggleTheme = toggleTheme;
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
window.showEventProfile = showEventProfile;
window.goToTeam = goToTeam;
window.addEvent = addEvent;
window.togglePassword = togglePassword;
window.filterFighters = filterFighters;
window.filterTeams = filterTeams;
window.openOwnPhotoEditor = openOwnPhotoEditor;
window.previewOwnProfilePhoto = previewOwnProfilePhoto;
window.saveOwnProfilePhoto = saveOwnProfilePhoto;
window.updateProfilePhotoPreview = updateProfilePhotoPreview;
window.toggleFollowActiveFighter = toggleFollowActiveFighter;
window.compareActiveFighter = compareActiveFighter;
window.renderComparePage = renderComparePage;
window.renderCompareCandidates = renderCompareCandidates;
window.addFighterToCompare = addFighterToCompare;
window.removeFighterFromCompare = removeFighterFromCompare;
window.clearCompareFighters = clearCompareFighters;
window.renderEliteProfilesPage = renderEliteProfilesPageV2;
window.toggleFollowById = toggleFollowById;
window.openShowcasePaymentModal = openShowcasePaymentModal;
window.openShowcaseBenefitsModal = openShowcaseBenefitsModal;
window.confirmShowcasePixPayment = confirmShowcasePixPayment;
window.copyShowcasePixCode = copyShowcasePixCode;
window.shareShowcasePixCode = shareShowcasePixCode;
window.requestShowcaseEntry = requestShowcaseEntry;
window.cancelShowcaseRequest = cancelShowcaseRequest;
window.approveShowcaseForActiveFighter = approveShowcaseForActiveFighter;
window.rejectShowcaseForActiveFighter = rejectShowcaseForActiveFighter;
window.removeShowcaseFromActiveFighter = removeShowcaseFromActiveFighter;
