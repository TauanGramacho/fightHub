// =============================================
// MOCK DATA & STATE
// =============================================

export const FIGHTERS = [
  { id:1, name:'Rafael Fiziev', nick:'"Ataman"', nat:'🇰🇿 Cazaquistão', div:'Peso Leve (−65kg)', dob:'1992-04-05', age:32, height:'175cm', weight:'65kg', team:'Pitbull Brothers', teamId:1, wins:11, losses:2, draws:0, rank:1, flag:'🇰🇿', bio:'Rafael Fiziev é um dos kickboxers mais explosivos da sua geração, conhecido por seus knockouts devastadores e movimentação ofensiva imprevisível. Domina o peso leve nacional desde 2022.', tags:['#1 Rank','Campeão Nacional','KO Specialist'] },
  { id:2, name:'Bruno Machado', nick:'"The Machine"', nat:'🇧🇷 Brasil', div:'Peso Leve (−65kg)', dob:'1994-08-22', age:30, height:'172cm', weight:'64kg', team:'Chute Boxe Academy', teamId:2, wins:18, losses:3, draws:1, rank:2, flag:'🇧🇷', bio:'Bruno Machado é uma das maiores promessas do kickboxing brasileiro. Conhecido pelo volume de golpes e resistência física extraordinária.', tags:['#2 Rank','Top Contender'] },
  { id:3, name:'Caio Borralho', nick:'"The Natural"', nat:'🇧🇷 Brasil', div:'Peso Médio (−75kg)', dob:'1995-03-10', age:29, height:'183cm', weight:'75kg', team:'Predadores Team', teamId:3, wins:14, losses:1, draws:0, rank:1, flag:'🇧🇷', bio:'Caio Borralho domina o peso médio com uma combinação devastadora de velocidade e potência técnica. Considerado um dos atletas mais completos do Brasil.', tags:['#1 Rank','Campeão Estadual','Invicto em 2024'] },
  { id:4, name:'Marcus Santos', nick:'"Iron Fist"', nat:'🇧🇷 Brasil', div:'Peso Pesado (+81kg)', dob:'1990-11-15', age:34, height:'190cm', weight:'92kg', team:'Dragão Team', teamId:4, wins:22, losses:5, draws:2, rank:3, flag:'🇧🇷', bio:'Veterano do kickboxing nacional, Marcus Santos é reconhecido pela força explosiva e longa experiência em grandes palcos nacionais e internacionais.', tags:['Veterano','Top 5'] },
  { id:5, name:'Ana Lima', nick:'"The Warrior"', nat:'🇧🇷 Brasil', div:'Peso Galo (−56kg)', dob:'1997-06-30', age:27, height:'162cm', weight:'55kg', team:'Iron Fist Academy', teamId:5, wins:9, losses:2, draws:0, rank:1, flag:'🇧🇷', bio:'Ana Lima é a principal lutadora feminina do kickboxing brasileiro, com atuações dominantes na categoria peso galo e três títulos nacionais.', tags:['#1 Rank','Feminino','Campeã Brasileira'] },
  { id:6, name:'Diego Ferreira', nick:'"The Dragon"', nat:'🇧🇷 Brasil', div:'Peso Meio-Médio (−71kg)', dob:'1993-02-18', age:31, height:'178cm', weight:'70kg', team:'Chute Boxe Academy', teamId:2, wins:15, losses:4, draws:1, rank:2, flag:'🇧🇷', bio:'Diego Ferreira é um técnico completo que mistura potência e inteligência dentro do ringue. Especialista em contra-ataques.', tags:['#2 Rank','Counter Specialist'] },
];

export const TEAMS = [
  { id:1, name:'Pitbull Brothers', location:'Brasília, DF', emoji:'🐾', fighters:12, wins:87, titles:5, coach:'Roberto Nunes', founded:'2010', meta:'Academia especializada em Kickboxing e Muay Thai' },
  { id:2, name:'Chute Boxe Academy', location:'Curitiba, PR', emoji:'🥊', fighters:24, wins:142, titles:11, coach:'Diego Lima', founded:'2005', meta:'Uma das mais tradicionais academias de artes marciais do Brasil' },
  { id:3, name:'Predadores Team', location:'São Paulo, SP', emoji:'🐆', fighters:18, wins:98, titles:7, coach:'Carlos Mendes', founded:'2012', meta:'Formando campeões nacionais e internacionais' },
  { id:4, name:'Dragão Team', location:'Rio de Janeiro, RJ', emoji:'🐉', fighters:15, wins:76, titles:4, coach:'Paulo Dragon', founded:'2008', meta:'Tradição e excelência no kickboxing carioca' },
  { id:5, name:'Iron Fist Academy', location:'Belo Horizonte, MG', emoji:'👊', fighters:9, wins:54, titles:3, coach:'Fábio Iron', founded:'2015', meta:'Especialistas no desenvolvimento de atletas femininas e masculinas' },
];

export const EVENTS = [
  { id:1, name:'FightHub Grand Prix 2025', org:'FightHub', date:'2025-03-15', city:'São Paulo, SP', status:'upcoming', fights:10 },
  { id:2, name:'Brazilian Kickboxing Championship', org:'CBKB', date:'2025-02-28', city:'Rio de Janeiro, RJ', status:'upcoming', fights:8 },
  { id:3, name:'Copa Sul de Kickboxing', org:'FKRS', date:'2025-04-20', city:'Porto Alegre, RS', status:'upcoming', fights:12 },
  { id:4, name:'SP Open Kickboxing', org:'FKESP', date:'2024-12-10', city:'São Paulo, SP', status:'past', fights:14 },
  { id:5, name:'Rio Fight Night', org:'RFN Promotions', date:'2024-11-22', city:'Rio de Janeiro, RJ', status:'past', fights:9 },
  { id:6, name:'Grand Slam Kickboxing', org:'CBKB', date:'2024-10-05', city:'Belo Horizonte, MG', status:'past', fights:11 },
];

export const FIGHT_HISTORY = {
  1: [
    { result:'W', opp:'Luis Torres', method:'KO (Chute Circular)', event:'GP Kickboxing 2024', date:'Nov 2024', round:'R2 1:23' },
    { result:'W', opp:'Carlos Smith', method:'Dec. Unânime', event:'Copa Brasil 2024', date:'Set 2024', round:'3R' },
    { result:'L', opp:'Ivan Volkov', method:'KO (Direto)', event:'World Clash 2023', date:'Jun 2023', round:'R1 2:45' },
    { result:'W', opp:'Bruno Costa', method:'TKO (Chutes)', event:'SP Open 2023', date:'Mar 2023', round:'R3' },
    { result:'W', opp:'Marcos Tavares', method:'Dec. Unânime', event:'Copa BR 2022', date:'Dez 2022', round:'3R' },
  ],
  2: [
    { result:'W', opp:'Felipe Neto', method:'TKO (Joelhada)', event:'FightHub GP 2024', date:'Dez 2024', round:'R2 2:10' },
    { result:'W', opp:'Paulo Araújo', method:'Dec. Dividida', event:'Copa BR 2024', date:'Out 2024', round:'3R' },
    { result:'W', opp:'Ricardo Melo', method:'KO (Combinação)', event:'SP Open 2024', date:'Jul 2024', round:'R1 0:58' },
    { result:'L', opp:'Rafael Fiziev', method:'Dec. Unânime', event:'Grand Slam 2023', date:'Out 2023', round:'3R' },
  ],
};

export const RANKINGS_DATA = {
  'Peso Pena (−60kg)': [
    { name:'João Victor', team:'Pitbull Brothers', country:'🇧🇷 Brasil', w:16, l:1, last:'W' },
    { name:'Carlos Moura', team:'SP Fight', country:'🇧🇷 Brasil', w:12, l:3, last:'W' },
    { name:'Pierre Dubois', team:'French KB', country:'🇫🇷 França', w:14, l:4, last:'L' },
    { name:'Tanapon Jitmuan', team:'Thailand Elite', country:'🇹🇭 Tailândia', w:18, l:5, last:'W' },
    { name:'Diego Santos', team:'Dragão Team', country:'🇧🇷 Brasil', w:10, l:2, last:'W' },
  ],
  'Peso Leve (−65kg)': [
    { name:'Rafael Fiziev', team:'Pitbull Brothers', country:'🇰🇿 Cazaquistão', w:11, l:2, last:'W' },
    { name:'Bruno Machado', team:'Chute Boxe Academy', country:'🇧🇷 Brasil', w:18, l:3, last:'W' },
    { name:'Jamal Hassan', team:'Dutch School', country:'🇳🇱 Holanda', w:15, l:4, last:'W' },
    { name:'Pedro Alves', team:'Predadores', country:'🇧🇷 Brasil', w:9, l:2, last:'L' },
    { name:'Michael Chen', team:'USA Kickboxing', country:'🇺🇸 EUA', w:11, l:3, last:'W' },
  ],
  'Peso Médio (−75kg)': [
    { name:'Caio Borralho', team:'Predadores Team', country:'🇧🇷 Brasil', w:14, l:1, last:'W' },
    { name:'Alexei Nikitin', team:'Russian Top Team', country:'🇷🇺 Rússia', w:17, l:3, last:'W' },
    { name:'Fernando Costa', team:'Chute Boxe', country:'🇧🇷 Brasil', w:12, l:5, last:'L' },
    { name:'Ahmed Al-Rashid', team:'Dubai KB', country:'🇦🇪 EAU', w:10, l:2, last:'W' },
  ],
  'Peso Meio-Médio (−71kg)': [
    { name:'Diego Ferreira', team:'Chute Boxe Academy', country:'🇧🇷 Brasil', w:15, l:4, last:'W' },
    { name:'Marcus Almeida', team:'Team SP', country:'🇧🇷 Brasil', w:13, l:2, last:'W' },
    { name:'Kiro Tanaka', team:'Japan Elite', country:'🇯🇵 Japão', w:12, l:3, last:'L' },
  ],
  'Peso Pesado (+81kg)': [
    { name:'Marcus Santos', team:'Dragão Team', country:'🇧🇷 Brasil', w:22, l:5, last:'W' },
    { name:'Artem Vovchanchyn', team:'UA Strong', country:'🇺🇦 Ucrânia', w:19, l:4, last:'W' },
    { name:'Roberto Biggão', team:'RJ Fight', country:'🇧🇷 Brasil', w:14, l:8, last:'W' },
  ],
  'Peso Galo (−56kg)': [
    { name:'Ana Lima', team:'Iron Fist Academy', country:'🇧🇷 Brasil', w:9, l:2, last:'W' },
    { name:'Keiko Tanaka', team:'Japan Kick', country:'🇯🇵 Japão', w:11, l:3, last:'W' },
    { name:'Sofia Mendez', team:'Arg KB', country:'🇦🇷 Argentina', w:8, l:2, last:'L' },
  ],
  'Peso Meio-Pesado (−81kg)': [
    { name:'Lucas Brito', team:'SP Power', country:'🇧🇷 Brasil', w:13, l:2, last:'W' },
    { name:'Dmitri Volkov', team:'Russia KB', country:'🇷🇺 Rússia', w:15, l:4, last:'W' },
    { name:'Felipe Guerra', team:'Predadores', country:'🇧🇷 Brasil', w:10, l:3, last:'W' },
  ],
  'Peso Mosca (−52kg)': [
    { name:'Rafinha Speed', team:'BH Kicks', country:'🇧🇷 Brasil', w:12, l:1, last:'W' },
    { name:'Leo Ágil', team:'Curitiba KB', country:'🇧🇷 Brasil', w:10, l:2, last:'W' },
    { name:'Chang Wei', team:'China Elite', country:'🇨🇳 China', w:14, l:3, last:'L' },
  ],
};

// Application State
export const state = {
  currentUser: null,
  activeFighterId: null,
  activeTeamId: null
};

// =============================================
// SUPABASE LOGIC
// =============================================
export function initSupabase() {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) return;
  import('https://esm.sh/@supabase/supabase-js@2').then(function (mod) {
    window.supabase = mod.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    document.dispatchEvent(new CustomEvent('supabaseReady'));
  }).catch(function (e) {
    console.error('Supabase load error:', e);
  });
}

export function mapRowToFighter(row) {
  return {
    id: row.id,
    name: row.name || '—',
    nick: row.nick || '"Fighter"',
    nat: row.nationality || '—',
    div: row.division || '—',
    dob: row.dob || '—',
    age: row.age || null,
    height: row.height_cm ? row.height_cm + 'cm' : '—',
    weight: row.weight_kg ? row.weight_kg + 'kg' : '—',
    team: row.team || 'Sem Equipe',
    teamId: row.team_id || null,
    wins: row.wins || 0,
    losses: row.losses || 0,
    draws: row.draws || 0,
    rank: row.rank || null,
    flag: row.flag || '🇧🇷',
    bio: row.bio || '',
    photo_url: row.photo_url || null,
    tags: Array.isArray(row.tags) ? row.tags : [],
  };
}

export async function loadFightersFromSupabase() {
  if (!window.supabase) return;
  const { data, error } = await window.supabase.from('fighters').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Supabase fighters load:', error);
    if(window.showToast) window.showToast('Erro ao carregar lutadores: ' + error.message, true);
    return;
  }
  if (data && data.length > 0) {
    FIGHTERS.length = 0;
    FIGHTERS.push(...data.map(mapRowToFighter));
  }
  if(window.renderHome) window.renderHome();
  if (document.getElementById('page-fighters')?.classList.contains('active')) {
    if(window.renderFighters) window.renderFighters();
  }
}

export async function loadTeamsFromSupabase() {
  if (!window.supabase) return;
  const { data, error } = await window.supabase.from('teams').select('*').order('id', { ascending: true });
  if (!error && data && data.length > 0) {
    TEAMS.length = 0;
    TEAMS.push(...data.map(t => ({
      ...t,
      fighters: t.fighters_count || 0,
      wins: t.wins_count || 0,
      titles: t.titles_count || 0
    })));
  }
}

export async function loadEventsFromSupabase() {
  if (!window.supabase) return;
  const { data, error } = await window.supabase.from('events').select('*').order('event_date', { ascending: true });
  if (!error && data && data.length > 0) {
    EVENTS.length = 0;
    EVENTS.push(...data.map(e => ({
      id: e.id,
      name: e.name,
      org: e.organization || '—',
      date: e.event_date,
      city: e.city || '—',
      status: e.status || 'past',
      fights: e.fights_count || 0
    })));
  }
}

export async function loadRankingsFromSupabase() {
  if (!window.supabase) return;
  
  // 1. Busca da tabela oficial de rankings
  const { data: rankTable, error: err1 } = await window.supabase.from('rankings').select('*').order('position', { ascending: true });
  
  // 2. Busca da tabela de lutadores (quem tem rank atribuído)
  const { data: fightersTable, error: err2 } = await window.supabase.from('fighters').select('*').not('rank', 'is', null).order('rank', { ascending: true });

  const grouped = {};

  // Helper para normalizar strings de categoria
  const normalizeWC = (s) => s.trim().replace(/\s+/g, ' ');

  // Processa tabela oficial (Rankings)
  if (!err1 && rankTable) {
    rankTable.forEach(r => {
      const wc = normalizeWC(r.weight_class);
      if (!grouped[wc]) grouped[wc] = [];
      grouped[wc].push({
        name: r.fighter_name,
        team: r.team || '—',
        country: r.country || '—',
        w: r.wins || 0,
        l: r.losses || 0,
        last: r.last_result || '—',
        pos: r.position
      });
    });
  }

  // Processa lutadores ranqueados (Híbrido)
  if (!err2 && fightersTable) {
    fightersTable.forEach(f => {
      const wc = f.division ? normalizeWC(f.division) : null;
      if (!wc) return;
      if (!grouped[wc]) grouped[wc] = [];
      
      // Evita duplicatas se já estiver na tabela de rankings pelo nome
      const exists = grouped[wc].some(x => x.name.toLowerCase() === f.name.toLowerCase());
      if (!exists) {
        grouped[wc].push({
          name: f.name,
          team: f.team || '—',
          country: f.nationality || '—',
          w: f.wins || 0,
          l: f.losses || 0,
          last: '—',
          pos: f.rank
        });
      }
    });
  }

  // Ordena cada categoria pela posição/rank
  Object.keys(grouped).forEach(cat => {
    grouped[cat].sort((a, b) => (a.pos || 99) - (b.pos || 99));
  });

  // Limpa e atualiza o objeto global
  Object.keys(RANKINGS_DATA).forEach(k => delete RANKINGS_DATA[k]);
  Object.assign(RANKINGS_DATA, grouped);
}

document.addEventListener('supabaseReady', async function () {
  await Promise.all([
    loadFightersFromSupabase(),
    loadTeamsFromSupabase(),
    loadEventsFromSupabase(),
    loadRankingsFromSupabase()
  ]);
  checkUserSession();
  
  // Re-renderiza a página atual para refletir os dados carregados
  if (window.renderHome) window.renderHome();
  if (document.getElementById('page-fighters') && window.renderFightersList) window.renderFightersList();
  if (document.getElementById('page-teams') && window.renderTeamsList) window.renderTeamsList();
  if (document.getElementById('page-events') && window.renderEventsList) window.renderEventsList();
  if (document.getElementById('page-rankings') && window.renderRankings) window.renderRankings();
});

// =============================================
// AUTHENTICATION
// =============================================
export async function doLogin() {
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;
  if (!email || !pass) { window.showToast('Preencha todos os campos', true); return; }
  
  if (!window.supabase) { window.showToast('Supabase não inicializado', true); return; }
  
  const { data, error } = await window.supabase.auth.signInWithPassword({ email, password: pass });
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      window.showToast('Email ou senha incorretos!', true);
    } else {
      window.showToast('Erro no login: ' + error.message, true);
    }
    return;
  }
  
  state.currentUser = data.user;
  updateAuthUI();
  window.showPage('home');
  window.showToast('Bem-vindo de volta!');
}

export async function doRegister() {
  const fname = document.getElementById('reg-fname').value;
  const lname = document.getElementById('reg-lname').value;
  const email = document.getElementById('reg-email').value;
  const pass = document.getElementById('reg-password').value;
  const pass2 = document.getElementById('reg-password2').value;
  const role = document.getElementById('reg-role').value;
  
  if (!fname || !lname || !email || !pass) { window.showToast('Preencha todos os campos', true); return; }
  if (pass !== pass2) { window.showToast('As senhas não coincidem', true); return; }
  if (pass.length < 6) { window.showToast('A senha precisa ter pelo menos 6 caracteres (Supabase default)', true); return; }
  
  if (!window.supabase) return;
  
  const { data, error } = await window.supabase.auth.signUp({
    email, 
    password: pass,
    options: { data: { first_name: fname, last_name: lname, role } }
  });
  
  if (error) {
    window.showToast('Erro no cadastro: ' + error.message, true);
    return;
  }
  
  // If email confirmation is enabled, data.user.identities might be empty for unconfirmed user or session is null
  if (data.user && data.session === null) {
    window.showPage('confirm-email');
    setTimeout(() => {
      const emailDisplay = document.getElementById('confirm-email-display');
      if (emailDisplay) emailDisplay.textContent = email;
    }, 50);
  } else {
    state.currentUser = data.user;
    updateAuthUI();
    window.showPage('home');
    window.showToast('Conta criada com sucesso!');
  }
}

export async function resendConfirmation() {
  const email = document.getElementById('reg-email')?.value;
  if (!email || !window.supabase) { window.showToast('Email não encontrado', true); return; }
  await window.supabase.auth.resend({ type: 'signup', email });
  window.showToast('E-mail re-enviado!');
}

export async function logout() {
  if (!window.supabase) return;
  await window.supabase.auth.signOut();
  state.currentUser = null;
  updateAuthUI();
  window.showPage('home');
  window.showToast('Você saiu da conta.');
}

export async function checkUserSession() {
  if (!window.supabase) return;
  const { data } = await window.supabase.auth.getSession();
  if (data.session) {
    state.currentUser = data.session.user;
    updateAuthUI();
  }
}

export function updateAuthUI() {
  const navAuth = document.getElementById('nav-auth');
  const navUser = document.getElementById('nav-user');
  const greeting = document.getElementById('user-greeting');
  
  if (navAuth) navAuth.style.display = state.currentUser ? 'none' : 'flex';
  if (navUser) navUser.style.display = state.currentUser ? 'flex' : 'none';
  if (greeting && state.currentUser) {
    const name = state.currentUser.user_metadata?.first_name || state.currentUser.email.split('@')[0];
    greeting.textContent = name;
  }
}

export function requireAuth(feature) {
  if (!state.currentUser) { 
    window.showToast('Faça login para usar: ' + feature, true); 
    window.showPage('login'); 
    return; 
  }
  window.showToast(feature + ' — funcionalidade em desenvolvimento!');
}

// =============================================
// SUBMISSION LOGIC (ADD FIGHTER / UPLOAD)
// =============================================
export async function uploadFighterPhoto(file) {
  if (!window.supabase) throw new Error("Supabase não configurado");
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const { data, error } = await window.supabase.storage.from('fighter-photos').upload(fileName, file);
  if (error) throw error;
  const { data: publicData } = window.supabase.storage.from('fighter-photos').getPublicUrl(fileName);
  return publicData.publicUrl;
}

export async function addFighter() {
  const nome = document.getElementById('af-nome').value.trim();
  const sobrenome = document.getElementById('af-sobrenome').value.trim();
  if (!nome || !sobrenome) { window.showToast('O nome e sobrenome do lutador são obrigatórios!', true); return; }
  
  const fullName = nome + ' ' + sobrenome;
  const apelido = document.getElementById('af-apelido').value.trim();
  const nick = apelido ? '"' + apelido + '"' : '""';
  const nat = document.getElementById('af-nat').value.trim();
  const nationality = nat ? (nat.includes('Brasil') && !nat.includes('🇧🇷') ? '🇧🇷 ' + nat : nat) : '🇧🇷 Brasil';
  const fileInput = document.getElementById('af-foto-file');
  let photoUrl = null;
  
  if (!window.supabase) { window.showToast('Supabase off', true); return; }
  
  try {
    if (fileInput && fileInput.files.length > 0) {
      window.showToast('Fazendo upload da foto...', false);
      const file = fileInput.files[0];
      photoUrl = await uploadFighterPhoto(file);
    }
  } catch (err) {
    window.showToast('Erro no upload da foto: ' + err.message, true);
    return;
  }

  const payload = {
    first_name: nome,
    last_name: sobrenome,
    name: fullName,
    nick: nick,
    nationality: nationality,
    division: document.getElementById('af-cat').value,
    dob: document.getElementById('af-dob').value || null,
    height_cm: parseInt(document.getElementById('af-altura').value, 10) || null,
    weight_kg: parseInt(document.getElementById('af-peso').value, 10) || null,
    team: document.getElementById('af-equipe').value || null,
    wins: parseInt(document.getElementById('af-wins').value, 10) || 0,
    losses: parseInt(document.getElementById('af-losses').value, 10) || 0,
    draws: parseInt(document.getElementById('af-draws').value, 10) || 0,
    bio: document.getElementById('af-bio').value.trim() || null,
    photo_url: photoUrl,
    flag: (nationality.includes('🇧🇷') ? '🇧🇷' : '🌍')
  };

  const { data, error } = await window.supabase.from('fighters').insert(payload).select('*').single();
  if (error) {
    window.showToast('Erro ao gravar lutador: ' + error.message, true);
    return;
  }
  
  if (window.closeModal) window.closeModal('modal-add-fighter');
  window.showToast(fullName + ' adicionado com sucesso!');
  if (window.resetFighterForm) window.resetFighterForm();
  await loadFightersFromSupabase();
  window.showPage('fighters');
}

