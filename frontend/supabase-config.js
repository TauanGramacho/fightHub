// Configuracao do Supabase para a aplicacao estatica.
// Mantem compatibilidade com o app legado e permite sobrescrita por runtime.
(function initFightHubSupabaseConfig(globalScope) {
  const defaultConfig = {
    supabaseUrl: 'https://jwojnxopkuqmmwpomfss.supabase.co',
    supabaseAnonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3b2pueG9wa3VxbW13cG9tZnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE2Mjc0MzAsImV4cCI6MjA4NzIwMzQzMH0.but9kEhaezBRcnh5NFnRBqluClB30zjIctxw_0Ly2LQ',
  };

  const runtimeConfig = globalScope.FIGHTHUB_RUNTIME_CONFIG || {};
  const mergedConfig = {
    supabaseUrl:
      runtimeConfig.supabaseUrl ||
      runtimeConfig.url ||
      defaultConfig.supabaseUrl,
    supabaseAnonKey:
      runtimeConfig.supabaseAnonKey ||
      runtimeConfig.supabasePublishableKey ||
      runtimeConfig.anonKey ||
      runtimeConfig.publishableKey ||
      defaultConfig.supabaseAnonKey,
  };

  if (!mergedConfig.supabaseUrl || !mergedConfig.supabaseAnonKey) {
    console.error(
      '[FightHub] Configuracao do Supabase incompleta. Verifique url e chave publica.'
    );
    return;
  }

  globalScope.FIGHTHUB_CONFIG = Object.freeze({
    supabaseUrl: mergedConfig.supabaseUrl,
    supabaseAnonKey: mergedConfig.supabaseAnonKey,
  });

  // Compatibilidade com o app legado.
  globalScope.SUPABASE_URL = mergedConfig.supabaseUrl;
  globalScope.SUPABASE_ANON_KEY = mergedConfig.supabaseAnonKey;
})(window);
