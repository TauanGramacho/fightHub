import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { LogOut, User as UserIcon } from 'lucide-react'

// Tipo para a tabela public.users
type UserProfile = {
  id: string
  full_name: string | null
  email: string
  role: string | null
  avatar_url: string | null
  phone: string | null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    let isMounted = true

    const getProfile = async () => {
      // Verifica se está no modo demo primeiro
      if (localStorage.getItem('demo_mode') === 'true') {
        if (isMounted) {
          setProfile({
            id: 'demo-123',
            full_name: 'Atleta Visitante (Demo)',
            email: 'visitante@demo.com',
            role: 'Lutador Profissional',
            avatar_url: null,
            phone: null
          })
          setLoading(false)
        }
        return
      }

      try {
        setLoading(true)
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !sessionData.session) {
          throw new Error('No session found')
        }

        const user = sessionData.session.user

        // Busca os dados da tabela public.users (sincronizada via trigger)
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', user.id)
          .single()

        if (error) {
          console.error("Erro ao buscar perfil público:", error)
          // Fallback para dados básicos do Auth se ainda não sincronizou
          if (isMounted) {
            setProfile({
              id: user.id,
              full_name: user.user_metadata.full_name || 'Usuário FightHub',
              email: user.email || '',
              role: user.user_metadata.role || 'Fã / Espectador',
              avatar_url: user.user_metadata.avatar_url || null,
              phone: user.phone || null
            })
          }
        } else if (data && isMounted) {
          setProfile(data as UserProfile)
        }
      } catch (error) {
        console.error('Error loading user data!', error)
        navigate('/login')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void getProfile()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const handleSignOut = async () => {
    if (localStorage.getItem('demo_mode') === 'true') {
      localStorage.removeItem('demo_mode')
      navigate('/login')
      return
    }

    await supabase.auth.signOut()
    navigate('/login')
  }

  if (loading) {
    return <div className="loading-screen">Carregando painel...</div>
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Painel do Lutador</h1>
        <button onClick={handleSignOut} className="btn-logout">
          <LogOut size={18} />
          Sair
        </button>
      </header>

      <main className="dashboard-content">
        <div className="card profile-card">
          <div className="profile-header">
            {profile?.avatar_url ? (
               <img src={profile.avatar_url} alt="Avatar" className="avatar" />
            ) : (
               <div className="avatar fallback"><UserIcon size={32}/></div>
            )}
            
            <div>
              <h2>{profile?.full_name || 'Bem-vindo!'}</h2>
              <p className="role-badge">{profile?.role || 'Lutador'}</p>
            </div>
          </div>

          <div className="profile-details">
             <p><strong>Email:</strong> {profile?.email}</p>
             <p><strong>Status:</strong> Conta Ativa</p>
             <p><strong>Próximo Passo:</strong> Complete seu perfil de lutador ou registre sua academia.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
