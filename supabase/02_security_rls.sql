-- Ativar Row Level Security (RLS) para todas as tabelas
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;

-- =========================================================================
-- Políticas de Segurança para a tabela LEADS
-- =========================================================================

-- 1. Qualquer pessoa (anon) ou usuário logado (authenticated) pode inserir um novo Lead (Formulário Landing Page)
CREATE POLICY "Permitir inserção de leads para todos" 
ON public.leads FOR INSERT 
TO public 
WITH CHECK (true);

-- 2. Apenas usuários logados (Admin) podem ver, atualizar ou deletar Leads
CREATE POLICY "Permitir visualização de leads apenas para Admin" 
ON public.leads FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Permitir atualização de leads apenas para Admin" 
ON public.leads FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Permitir deleção de leads apenas para Admin" 
ON public.leads FOR DELETE 
TO authenticated 
USING (true);

-- =========================================================================
-- Políticas de Segurança para tabelas administrativas (AUTOMATIONS, CONDITIONS, ACTIONS, LOGS)
-- =========================================================================

-- Criar política genérica para permitir acesso total apenas a usuários autenticados

-- AUTOMATIONS
CREATE POLICY "Acesso total a automations para Admin" ON public.automations FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- CONDITIONS
CREATE POLICY "Acesso total a conditions para Admin" ON public.conditions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ACTIONS
CREATE POLICY "Acesso total a actions para Admin" ON public.actions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EXECUTION LOGS
CREATE POLICY "Acesso total a execution_logs para Admin" ON public.execution_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- OBSERVAÇÃO DE SEGURANÇA (CYBERSECURITY):
-- Para ambientes de produção rigorosos, a policy `USING (true)` para `authenticated` pode ser restrita ainda mais.
-- Exemplo: `USING (auth.uid() = 'id-do-usuario-admin')` ou criar uma tabela de "roles" para checar se o usuário é realmente administrador.
-- Por enquanto, qualquer usuário com login válido no Supabase Auth terá acesso ao painel.
