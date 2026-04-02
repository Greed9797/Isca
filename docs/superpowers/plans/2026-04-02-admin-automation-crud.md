# W3 Automations Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a functional split-view admin panel for managing automation workflows (CRUD for automations, conditions, actions, and a visual node-based builder) integrating with Supabase.

**Architecture:** The application uses React Router for navigation. The `/admin` page will be a split-view interface: a left sidebar for listing and managing automations (CRUD) and a right main area containing a `ReactFlow` canvas for visual configuration. State management will handle the active automation and synchronize changes between the sidebar forms and the canvas nodes.

**Tech Stack:** React, React Router DOM, Tailwind CSS, Lucide React, `@xyflow/react`, Supabase Client.

---

### Task 1: Setup Supabase Database Schema & Client

**Files:**
- Create: `supabase/schema.sql`
- Create: `src/lib/supabase.js`
- Modify: `package.json`

- [ ] **Step 1: Define Supabase SQL Schema**
Create `supabase/schema.sql` with the structure needed for the automations system.
```sql
-- Create Leads Table
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    business_type TEXT,
    revenue TEXT,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Automations Table
CREATE TABLE public.automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT false,
    logic_type TEXT DEFAULT 'AND' CHECK (logic_type IN ('AND', 'OR')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Conditions Table
CREATE TABLE public.conditions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
    field TEXT NOT NULL,
    operator TEXT NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Actions Table
CREATE TABLE public.actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'webhook',
    endpoint TEXT NOT NULL,
    payload_template JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Execution Logs Table
CREATE TABLE public.execution_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID REFERENCES public.automations(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    status_code INTEGER,
    response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

- [ ] **Step 2: Install Supabase JS Client**
Run: `npm install @supabase/supabase-js`

- [ ] **Step 3: Initialize Supabase Client**
Create `src/lib/supabase.js` to initialize the client.
```javascript
import { createClient } from '@supabase/supabase-js';

// Fallbacks for local development testing without real env vars yet
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 4: Commit**
```bash
git add supabase/schema.sql src/lib/supabase.js package.json package-lock.json
git commit -m "feat: setup supabase schema and client"
```

---

### Task 2: Create Automation Data Fetching Service

**Files:**
- Create: `src/services/automationService.js`

- [ ] **Step 1: Write Automation Service Methods**
Create `src/services/automationService.js` to handle CRUD operations via Supabase.
```javascript
import { supabase } from '../lib/supabase';

export const automationService = {
  // Fetch all automations (lightweight for sidebar)
  getAutomations: async () => {
    const { data, error } = await supabase
      .from('automations')
      .select('id, name, is_active, logic_type')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // Fetch single automation with its conditions and actions (for canvas)
  getAutomationDetails: async (id) => {
    const { data, error } = await supabase
      .from('automations')
      .select(`
        *,
        conditions (*),
        actions (*)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  // Create a new empty automation
  createAutomation: async (name) => {
    const { data, error } = await supabase
      .from('automations')
      .insert([{ name, is_active: false, logic_type: 'AND' }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update automation status or logic
  updateAutomation: async (id, updates) => {
    const { data, error } = await supabase
      .from('automations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Delete automation
  deleteAutomation: async (id) => {
    const { error } = await supabase
      .from('automations')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
```

- [ ] **Step 2: Commit**
```bash
git add src/services/automationService.js
git commit -m "feat: add automation crud service"
```

---

### Task 3: Refactor Admin Page Layout (Split-View)

**Files:**
- Modify: `src/pages/Admin.jsx`

- [ ] **Step 1: Restructure Admin.jsx to include a real Sidebar**
Modify `src/pages/Admin.jsx` to replace the static configurator with a dynamic Automation List Sidebar.
```javascript
import React, { useState, useEffect } from 'react';
import { 
  Settings, LogIn, ArrowRight, XCircle, Webhook, Play, Plus, List, Trash2, Power
} from 'lucide-react';
// ... keep existing ReactFlow imports and Custom Node definitions ...
// (We will keep the static mock ReactFlow for now, just changing the layout)

export default function AdminPage() {
  const [automations, setAutomations] = useState([
    { id: '1', name: 'Regra Qualificado High Ticket', is_active: true },
    { id: '2', name: 'Regra Rejeição Revenda', is_active: false },
  ]);
  const [activeAutomationId, setActiveAutomationId] = useState('1');

  // ... keep existing useNodesState and useEdgesState ...

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col font-['Inter']">
      
      {/* Topbar */}
      <div className="h-16 border-b border-zinc-800 bg-[#111] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-xl font-black text-white tracking-tighter">
            W3 <span className="text-[#F55900]">Automations</span>
          </div>
        </div>
      </div>

      {/* Main Content Area: Split View */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Automation List */}
        <div className="w-72 bg-[#111] border-r border-zinc-800 flex flex-col z-10 shrink-0">
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
             <h2 className="text-white font-bold uppercase tracking-wider text-xs flex items-center gap-2">
               <List className="w-4 h-4 text-zinc-400" /> 
               Automações
             </h2>
             <button className="bg-zinc-800 hover:bg-zinc-700 text-white rounded p-1 transition-colors">
               <Plus className="w-4 h-4" />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {automations.map(auto => (
              <button 
                key={auto.id}
                onClick={() => setActiveAutomationId(auto.id)}
                className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${activeAutomationId === auto.id ? 'bg-zinc-800 border border-zinc-700' : 'hover:bg-zinc-900 border border-transparent'}`}
              >
                <span className="text-sm font-medium text-white truncate pr-2">{auto.name}</span>
                <div className={`w-2 h-2 rounded-full shrink-0 ${auto.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-600'}`}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Area: Canvas & Config */}
        <div className="flex-1 flex flex-col bg-[#050505] relative">
          {/* Active Automation Header */}
          <div className="h-14 border-b border-zinc-800 bg-[#0a0a0a] flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <span className="text-white font-bold">Regra Qualificado High Ticket</span>
              <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Ativo</span>
            </div>
            <div className="flex items-center gap-2">
               <button className="text-zinc-400 hover:text-red-500 transition-colors p-2">
                 <Trash2 className="w-4 h-4" />
               </button>
               <button className="bg-[#F55900] hover:bg-[#d44d00] text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors">
                 Salvar Fluxo
               </button>
            </div>
          </div>
          
          {/* ReactFlow Canvas (Keep existing setup here) */}
          <div className="flex-1 relative">
             {/* Replace this comment with the existing ReactFlow component code from Admin.jsx */}
             <div className="absolute inset-0 flex items-center justify-center text-zinc-600">Canvas Placeholder</div>
          </div>
        </div>

      </div>
    </div>
  );
}
```
*(Note: Full ReactFlow implementation will be re-integrated in the next steps, this sets up the shell).*

- [ ] **Step 2: Restore ReactFlow into the new layout**
Ensure the `ReactFlow` component, `initialNodes`, `initialEdges`, and node types are correctly placed inside the Right Area of `Admin.jsx`.

- [ ] **Step 3: Commit**
```bash
git add src/pages/Admin.jsx
git commit -m "feat: restructure admin page to split-view sidebar layout"
```

---

### Task 4: Hook up State to Supabase Service (Frontend CRUD)

**Files:**
- Modify: `src/pages/Admin.jsx`

- [ ] **Step 1: Add useEffect for fetching automations**
Import `automationService` and `useEffect` to fetch real data on mount.
```javascript
import { automationService } from '../services/automationService';

// Inside AdminPage component:
const [automations, setAutomations] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadAutomations();
}, []);

const loadAutomations = async () => {
  try {
    // Mock for now if Supabase isn't fully configured with env vars, 
    // but structure it for the real call
    const data = await automationService.getAutomations();
    setAutomations(data);
  } catch (error) {
    console.error('Error loading automations:', error);
    // Fallback to mock data if no DB connection
    setAutomations([{ id: '1', name: 'Mock Auto', is_active: true }]);
  } finally {
    setLoading(false);
  }
};
```

- [ ] **Step 2: Implement Create Automation handler**
```javascript
const handleCreateAutomation = async () => {
  const name = prompt("Nome da nova automação:");
  if (!name) return;
  
  try {
    const newAuto = await automationService.createAutomation(name);
    setAutomations([newAuto, ...automations]);
    setActiveAutomationId(newAuto.id);
  } catch (error) {
    console.error('Failed to create:', error);
    alert('Erro ao criar. Verifique conexão Supabase.');
  }
};
```
Bind `handleCreateAutomation` to the `Plus` button in the sidebar.

- [ ] **Step 3: Commit**
```bash
git add src/pages/Admin.jsx
git commit -m "feat: connect admin sidebar to automation service"
```

---

### Task 5: Automation Configuration Sidebar (QA Testing UI)

**Files:**
- Modify: `src/pages/Admin.jsx`

- [ ] **Step 1: Add a configuration drawer/panel overlay on the right side of the canvas**
When a node (like a Webhook Action) is clicked in ReactFlow, we need to show configuration options.
For MVP, we'll place a fixed absolute panel over the right side of the canvas.
```javascript
// Inside AdminPage
const [selectedNode, setSelectedNode] = useState(null);

const onNodeClick = (event, node) => {
  setSelectedNode(node);
};

// Inside the return, as a sibling to ReactFlow:
{selectedNode && selectedNode.type === 'action' && (
  <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#111] border-l border-zinc-800 p-6 z-10 shadow-2xl flex flex-col">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-white font-bold uppercase text-sm">Configurar Webhook</h3>
      <button onClick={() => setSelectedNode(null)} className="text-zinc-500 hover:text-white"><XCircle className="w-5 h-5"/></button>
    </div>
    
    <div className="space-y-4 flex-1">
      <div>
        <label className="block text-zinc-400 text-xs mb-1">URL do Webhook</label>
        <input type="text" className="w-full bg-[#0a0a0a] border border-zinc-800 text-white rounded p-2 text-sm focus:border-[#F55900] outline-none" defaultValue={selectedNode.data.endpoint} />
      </div>
      <div>
        <label className="block text-zinc-400 text-xs mb-1">Payload JSON</label>
        <textarea rows={6} className="w-full bg-[#0a0a0a] border border-zinc-800 text-green-400 rounded p-2 text-xs font-mono outline-none focus:border-[#F55900]" defaultValue={JSON.stringify({ status: "test" }, null, 2)} />
      </div>
    </div>

    {/* QA Test Button */}
    <div className="mt-auto pt-4 border-t border-zinc-800">
       <button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-bold py-3 rounded flex justify-center items-center gap-2 transition-colors">
         <Play className="w-4 h-4" /> Disparar Teste
       </button>
    </div>
  </div>
)}
```

- [ ] **Step 2: Add `onNodeClick={onNodeClick}` to ReactFlow component**

- [ ] **Step 3: Commit**
```bash
git add src/pages/Admin.jsx
git commit -m "feat: add webhook configuration and QA test panel"
```
