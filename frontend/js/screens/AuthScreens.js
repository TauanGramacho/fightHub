export function renderLoginScreen() {
  return `
  <div class="auth-page">
    <div class="auth-box">
      <div class="auth-logo">FIGHT<span>HUB</span></div>
      <div class="auth-sub">Entre na sua conta</div>
      <div class="form-group"><label class="form-label">E-mail</label><input class="form-input" type="email" placeholder="seu@email.com" id="login-email" onkeydown="if(event.key==='Enter')doLogin()"></div>
      <div class="form-group"><label class="form-label">Senha</label>
        <div style="position:relative;">
          <input class="form-input" type="password" placeholder="••••••••" id="login-password" style="padding-right:40px;width:100%;" onkeydown="if(event.key==='Enter')doLogin()">
          <button type="button" onclick="togglePassword('login-password', this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--gray);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
      </div>
      <button class="btn btn-red" style="width:100%;padding:14px;font-size:14px;margin-top:8px;" onclick="doLogin()">Entrar</button>
      <hr class="auth-divider">
      <div class="auth-footer">Não tem conta? <a onclick="showPage('register')">Cadastre-se gratuitamente</a></div>
      <div class="auth-footer" style="margin-top:8px;"><a onclick="showPage('home')">← Continuar sem entrar</a></div>
    </div>
  </div>
  `;
}

export function renderRegisterScreen() {
  return `
  <div class="auth-page">
    <div class="auth-box" style="max-width:500px;">
      <div class="auth-logo">FIGHT<span>HUB</span></div>
      <div class="auth-sub">Crie sua conta gratuita</div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Nome</label><input class="form-input" placeholder="João" id="reg-fname"></div>
        <div class="form-group"><label class="form-label">Sobrenome</label><input class="form-input" placeholder="Silva" id="reg-lname"></div>
      </div>
      <div class="form-group"><label class="form-label">E-mail</label><input class="form-input" type="email" placeholder="seu@email.com" id="reg-email"></div>
      <div class="form-group"><label class="form-label">Senha</label>
        <div style="position:relative;">
          <input class="form-input" type="password" placeholder="Mínimo 8 caracteres" id="reg-password" style="padding-right:40px;width:100%;" onkeydown="if(event.key==='Enter')document.getElementById('reg-password2').focus()">
          <button type="button" onclick="togglePassword('reg-password', this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--gray);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Confirmar Senha</label>
        <div style="position:relative;">
          <input class="form-input" type="password" placeholder="Repita a senha" id="reg-password2" style="padding-right:40px;width:100%;" onkeydown="if(event.key==='Enter')doRegister()">
          <button type="button" onclick="togglePassword('reg-password2', this)" style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;color:var(--gray);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Perfil</label>
        <select class="form-input" id="reg-role">
          <option>Fã / Espectador</option><option>Atleta</option><option>Treinador</option>
          <option>Promotor de Evento</option><option>Jornalista Esportivo</option>
        </select>
      </div>
      <button class="btn btn-red" style="width:100%;padding:14px;font-size:14px;margin-top:8px;" onclick="doRegister()">Criar Conta</button>
      <hr class="auth-divider">
      <div class="auth-footer">Já tem conta? <a onclick="showPage('login')">Entrar</a></div>
      <div class="auth-footer" style="margin-top:8px;"><a onclick="showPage('home')">← Continuar sem entrar</a></div>
    </div>
  </div>
  `;
}

export function renderEmailConfirmScreen() {
  return `
  <div class="auth-page">
    <div class="auth-box" style="text-align:center;max-width:500px;">
      <div style="font-size:64px;margin-bottom:16px;">📧</div>
      <div class="auth-logo">FIGHT<span>HUB</span></div>
      <div style="font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:2px;margin:16px 0 8px;color:var(--gold);">CONFIRME SEU E-MAIL</div>
      <p style="color:var(--white-dim);font-size:15px;line-height:1.7;margin-bottom:24px;">
        Enviamos um link de confirmação para:<br>
        <strong style="color:var(--white);font-size:17px;" id="confirm-email-display">—</strong>
      </p>
      <div style="background:var(--dark3);border:1px solid var(--dark4);padding:20px;margin-bottom:24px;text-align:left;">
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--red);margin-bottom:12px;">📋 Próximos passos:</div>
        <div style="color:var(--white-dim);font-size:14px;line-height:1.8;">
          <div>1️⃣ Abra seu e-mail (<span id="confirm-email-provider" style="color:var(--gold);">Gmail</span>)</div>
          <div>2️⃣ Procure o e-mail do <strong style="color:var(--white);">FightHub</strong></div>
          <div>3️⃣ Clique no link <strong style="color:var(--white);">"Confirm your mail"</strong></div>
          <div>4️⃣ Volte aqui e faça login!</div>
        </div>
      </div>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-red" onclick="showPage('login')" style="padding:12px 24px;">Ir para Login</button>
        <button class="btn btn-outline" onclick="resendConfirmation()" id="btn-resend" style="padding:12px 24px;">Reenviar E-mail</button>
      </div>
      <div style="margin-top:20px;font-size:12px;color:var(--gray);">
        ⚠️ Não recebeu? Verifique a pasta de <strong>spam</strong> ou <strong>lixo eletrônico</strong>.
      </div>
    </div>
  </div>
  `;
}
