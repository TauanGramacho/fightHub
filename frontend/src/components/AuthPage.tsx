import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../supabaseClient'

export default function AuthPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Escuta mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          navigate('/dashboard')
        }
      }
    )

    // Checa se já está logado ao montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const enterDemoMode = () => {
    // Definimos uma flag no localStorage para o bypass
    localStorage.setItem('demo_mode', 'true')
    navigate('/dashboard')
  }

  return (
    <div className="auth-container">
      <h2>Entrar no FightHub</h2>
      <p>Gerencie sua carreira, eventos e ranking.</p>
      <div className="auth-card">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['github', 'google']}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua Senha',
                button_label: 'Entrar',
                loading_button_label: 'Entrando...',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre aqui',
              },
              sign_up: {
                email_label: 'Endereço de e-mail',
                password_label: 'Sua Senha',
                button_label: 'Cadastrar',
                loading_button_label: 'Cadastrando...',
                social_provider_text: 'Cadastrar com {{provider}}',
                link_text: 'Não tem conta? Cadastre-se',
              },
              forgotten_password: {
                button_label: 'Recuperar senha',
                link_text: 'Esqueceu a senha?',
              }
            },
          }}
          theme="dark"
        />
        
        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '1.5rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Não consegue logar agora?
          </p>
          <button 
            onClick={enterDemoMode}
            style={{
              background: 'transparent',
              border: '1px solid #ef4444',
              color: '#ef4444',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              width: '100%'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
          >
            Acessar no Modo Demo
          </button>
        </div>
      </div>
    </div>
  )
}
