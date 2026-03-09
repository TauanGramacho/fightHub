import { useEffect, useState } from 'react'
import './App.css'
import { supabase } from './supabaseClient'

type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'ok'; hasSession: boolean }
  | { type: 'error'; message: string }

type Row = Record<string, unknown>

const TABLE_NAME = 'todos' // troque aqui pelo nome da sua tabela, ex: 'fights'

function App() {
  const [status, setStatus] = useState<Status>({ type: 'idle' })
  const [rows, setRows] = useState<Row[] | null>(null)
  const [tableError, setTableError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setStatus({ type: 'loading' })

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession()

      if (sessionError) {
        setStatus({ type: 'error', message: sessionError.message })
        return
      }

      setStatus({ type: 'ok', hasSession: !!sessionData.session })

      const { data, error } = await supabase.from(TABLE_NAME).select('*').limit(20)

      if (error) {
        setTableError(error.message)
        setRows(null)
        return
      }

      setTableError(null)
      setRows(data ?? [])
    }

    void run()
  }, [])

  return (
    <div className="app">
      <h1>FightHub + Supabase</h1>

      {status.type === 'idle' && <p>Preparando teste de conexão...</p>}

      {status.type === 'loading' && <p>Testando conexão com o Supabase...</p>}

      {status.type === 'ok' && (
        <div className="card">
          <p>✅ Conexão com Supabase funcionando!</p>
          {status.hasSession ? (
            <p>Existe uma sessão ativa de usuário.</p>
          ) : (
            <p>Nenhuma sessão ativa no momento (sem usuário logado).</p>
          )}
        </div>
      )}

      {status.type === 'error' && (
        <div className="card error">
          <p>❌ Erro ao conectar no Supabase.</p>
          <p>Detalhes: {status.message}</p>
          <p>
            Verifique se as variáveis{' '}
            <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{' '}
            estão corretas.
          </p>
        </div>
      )}

      <div className="card">
        <h2>Leitura da tabela "{TABLE_NAME}"</h2>
        {!rows && !tableError && <p>Carregando linhas...</p>}
        {tableError && (
          <p>
            Erro ao buscar dados: {tableError}. Verifique se a tabela existe no
            Supabase e se as permissões (RLS) permitem <code>select</code> com a
            anon key.
          </p>
        )}
        {rows && rows.length === 0 && <p>Nenhuma linha encontrada.</p>}
        {rows && rows.length > 0 && (
          <pre className="table-json">{JSON.stringify(rows, null, 2)}</pre>
        )}
      </div>

      <p className="hint">
        Troque o valor de <code>TABLE_NAME</code> em <code>App.tsx</code> para a
        tabela real do FightHub (por exemplo, <code>fights</code>).
      </p>
    </div>
  )
}

export default App
