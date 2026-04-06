-- Atualização do Schema para persistência do ReactFlow
ALTER TABLE public.automations 
ADD COLUMN IF NOT EXISTS flow_state JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- Garantir que temos uma tabela de logs clara
CREATE TABLE IF NOT EXISTS public.execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    status_code INTEGER,
    response TEXT,
    payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
