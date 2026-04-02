# Especificação de Design: Sistema de Automações B2B (W3 Automations)

## Propósito
Criar um painel administrativo estilo n8n acoplado ao Supabase para gerenciar regras de roteamento de Leads (via webhooks) com base em lógica condicional. O objetivo é garantir que um Lead proveniente do formulário seja automaticamente qualificado, desqualificado ou enviado para diferentes sistemas de CRM.

## Restrições & Premissas
* **Backend Base:** Supabase (PostgreSQL para dados, Edge Functions para execução das regras de negócio).
* **Frontend:** React + Tailwind CSS + `@xyflow/react` para o canvas visual de automações.
* **Segurança:** O painel `/admin` exigirá no futuro autenticação via Supabase Auth (simulada ou integrada no escopo estendido).

## Arquitetura de Dados (Supabase Schema)

* **`leads`:** Tabela que recebe o input direto do formulário da Landing Page.
  * *Campos:* `id`, `full_name`, `email`, `whatsapp`, `business_type`, `revenue`, `created_at`.
* **`automations`:** Tabela raiz dos fluxos.
  * *Campos:* `id`, `name`, `is_active` (boolean), `logic_type` ('AND' | 'OR').
* **`conditions`:** Condições atreladas a uma automação.
  * *Campos:* `id`, `automation_id` (FK), `field` (ex: revenue), `operator` (ex: '==', '>'), `value` (ex: '10k a 30k').
* **`actions`:** Ações executadas se as condições da automação forem verdadeiras.
  * *Campos:* `id`, `automation_id` (FK), `type` (webhook), `endpoint` (URL), `payload_template` (JSON).
* **`execution_logs`:** Registro de QA para cada disparo de webhook.
  * *Campos:* `id`, `automation_id` (FK), `lead_id` (FK), `status_code`, `response`, `created_at`.

## Interface do Painel Admin (UX/UI)

A tela de Administração (`/admin`) terá uma arquitetura "Split-View":

1. **Painel Esquerdo (Lista de Automações & Logs):** 
   * Lista lateral contendo as automações (ex: "Regra Revendedor", "Regra High Ticket").
   * Indicador visual de Status (Ativo [Verde] / Inativo [Vermelho]).
   * Botão "+" para Criar Nova Automação.
   * Aba secundária para consultar os "Logs de Execução".
2. **Painel Direito (Canvas Flow Builder & Configuração):**
   * Interface visual `@xyflow/react` ilustrando o fluxo: `Trigger -> Conditions -> Action`.
   * Menu lateral de contexto (Side-drawer) que abre ao clicar em um Nó:
     * **Nó de Condição:** Permite adicionar/remover condições atreladas ao Banco (CRUD na tabela `conditions`) e alterar entre lógica `AND/OR`.
     * **Nó de Ação:** Permite colar a URL do Webhook, editar o Payload (JSON) e contém um botão de "Testar Webhook" disparando um payload fictício para validação imediata (QA).

## Fluxo de Execução (Edge Function)

1. Um Lead se cadastra no Formulário.
2. O React faz o `INSERT` na tabela `leads`.
3. O Supabase dispara um Database Webhook interno atrelado a um Edge Function.
4. A Função busca todas as `automations` onde `is_active = true`.
5. Avalia as `conditions` de cada automação usando a lógica definida (`AND` ou `OR`).
6. Se `true`, a Função executa um `fetch()` HTTP POST para o `endpoint` da tabela `actions`.
7. O resultado (200 OK ou Erros) é gravado via `INSERT` na tabela `execution_logs`.

## Estratégia de Qualidade (QA)

A combinação do **Botão de Teste** no painel de configuração do Webhook garante validação em tempo de design (evita erros de digitação de URL). A aba de **Logs Reais** provê o rastreamento em produção para debugging de payloads recusados por sistemas externos (CRMs).

## Próximos Passos
* Inicializar projeto Supabase e definir schema SQL.
* Refatorar a tela `/admin` para seguir o modelo de Painel Esquerdo (Lista de Automações) e Painel Direito (Canvas Visual).
* Implementar mock do CRUD Frontend antes de ligar a API Real (Edge Functions).