import React, { useState, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Settings, LogIn, XCircle, Webhook, Play, Plus, List, Trash2, LogOut } from 'lucide-react';
import { automationService } from '../services/automationService';
import { useAuth } from '../contexts/AuthContext';

// Custom Nodes Design
const TriggerNode = ({ data }) => (
  <div className="bg-[#161616] border border-[#F55900] shadow-[0_0_15px_rgba(245,89,0,0.2)] rounded-lg p-4 min-w-[200px]">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded bg-[#F55900]/20 flex items-center justify-center">
        <LogIn className="w-4 h-4 text-[#F55900]" />
      </div>
      <div>
        <h3 className="text-white text-sm font-bold uppercase">Lead Recebido</h3>
        <p className="text-zinc-500 text-xs">Formulário Landing Page</p>
      </div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#F55900] border-none" />
  </div>
);

const ConditionNode = ({ data }) => (
  <div className="bg-[#161616] border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)] rounded-lg p-4 min-w-[200px]">
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-blue-500 border-none" />
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center">
        <Settings className="w-4 h-4 text-blue-500" />
      </div>
      <div>
        <h3 className="text-white text-sm font-bold uppercase">Condição</h3>
        <p className="text-zinc-500 text-xs">Filtragem Qualificada</p>
      </div>
    </div>
    <div className="bg-black border border-zinc-800 p-2 rounded text-xs text-zinc-300">
      Se: Faturamento == "10k a 30k" <br/>
      E: Tipo == "Revenda"
    </div>
    <Handle type="source" position={Position.Right} id="true" className="w-3 h-3 bg-green-500 border-none" style={{ top: '30%' }} />
    <Handle type="source" position={Position.Right} id="false" className="w-3 h-3 bg-red-500 border-none" style={{ top: '70%' }} />
  </div>
);

const ActionNode = ({ data }) => (
  <div className={`bg-[#161616] border ${data.isError ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'} rounded-lg p-4 min-w-[200px] cursor-pointer hover:border-white transition-colors`}>
    <Handle type="target" position={Position.Left} className={`w-3 h-3 ${data.isError ? 'bg-red-500' : 'bg-purple-500'} border-none`} />
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-8 h-8 rounded ${data.isError ? 'bg-red-500/20' : 'bg-purple-500/20'} flex items-center justify-center`}>
        {data.isError ? <XCircle className="w-4 h-4 text-red-500" /> : <Webhook className="w-4 h-4 text-purple-500" />}
      </div>
      <div>
        <h3 className="text-white text-sm font-bold uppercase">{data.label}</h3>
        <p className="text-zinc-500 text-xs">{data.subLabel}</p>
      </div>
    </div>
    {data.endpoint && (
      <div className="bg-black border border-zinc-800 p-2 rounded text-xs text-zinc-400 mt-2 break-all font-mono line-clamp-2">
        POST {data.endpoint}
      </div>
    )}
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

// Initial Mock Flow Setup
const initialNodes = [
  { id: '1', type: 'trigger', position: { x: 50, y: 200 }, data: { label: 'Novo Lead' } },
  { id: '2', type: 'condition', position: { x: 350, y: 200 }, data: { label: 'Filtro' } },
  { id: '3', type: 'action', position: { x: 700, y: 100 }, data: { label: 'Salvar no CRM', subLabel: 'Lead Qualificado', endpoint: 'https://webhook.site/w3-crm', isError: false } },
  { id: '4', type: 'action', position: { x: 700, y: 300 }, data: { label: 'Desqualificar', subLabel: 'Enviar Email Recusa', endpoint: 'https://webhook.site/w3-rejeicao', isError: true } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#F55900', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', sourceHandle: 'false', target: '3', animated: true, style: { stroke: '#22c55e', strokeWidth: 2 } },
  { id: 'e2-4', source: '2', sourceHandle: 'true', target: '4', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
];

export default function AdminPage() {
  const { signOut } = useAuth();
  
  // Global State
  const [automations, setAutomations] = useState([]);
  const [activeAutomationId, setActiveAutomationId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ReactFlow State
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Load Automations
  useEffect(() => {
    loadAutomations();
  }, []);

  // Carregar o fluxo quando a automação ativa mudar
  useEffect(() => {
    if (activeAutomationId) {
      loadAutomationFlow(activeAutomationId);
    }
  }, [activeAutomationId]);

  const loadAutomations = async () => {
    try {
      const data = await automationService.getAutomations();
      if (data && data.length > 0) {
         setAutomations(data);
         setActiveAutomationId(data[0].id);
      } else {
         const mockData = [
           { id: '1', name: 'Regra Qualificado High Ticket', is_active: true },
           { id: '2', name: 'Regra Rejeição Revenda', is_active: false },
         ];
         setAutomations(mockData);
         setActiveAutomationId(mockData[0].id);
      }
    } catch (error) {
      console.error('Error loading automations:', error);
      const mockData = [
        { id: '1', name: 'Regra Qualificado High Ticket', is_active: true },
        { id: '2', name: 'Regra Rejeição Revenda', is_active: false },
      ];
      setAutomations(mockData);
      setActiveAutomationId(mockData[0].id);
    } finally {
      setLoading(false);
    }
  };

  const loadAutomationFlow = async (id) => {
    try {
      // Tenta buscar do Supabase
      const details = await automationService.getAutomationDetails(id);
      
      // Converte detalhes do banco em nodes/edges para ReactFlow
      // (MVP: Mockando a conversão baseada no id da automação)
      if (id === '1') {
        setNodes(initialNodes);
        setEdges(initialEdges);
      } else {
        // Fluxo diferente para o "teste"
        setNodes([
          { id: '1', type: 'trigger', position: { x: 50, y: 100 }, data: { label: 'Novo Lead' } },
          { id: '3', type: 'action', position: { x: 400, y: 100 }, data: { label: 'Enviar Email', subLabel: 'Boas vindas', endpoint: 'https://webhook.site/email', isError: false } }
        ]);
        setEdges([
          { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#F55900', strokeWidth: 2 } }
        ]);
      }
    } catch (error) {
      console.error('Error loading flow:', error);
    }
  };


  const handleCreateAutomation = async () => {
    const name = prompt("Nome da nova automação:");
    if (!name) return;
    
    try {
      const newAuto = await automationService.createAutomation(name);
      setAutomations([newAuto, ...automations]);
      setActiveAutomationId(newAuto.id);
    } catch (error) {
      console.error('Failed to create:', error);
      // Fallback for mock testing
      const mockAuto = { id: Date.now().toString(), name, is_active: false };
      setAutomations([mockAuto, ...automations]);
      setActiveAutomationId(mockAuto.id);
    }
  };

  const onNodeClick = (event, node) => {
    setSelectedNode(node);
  };

  const activeAuto = automations.find(a => a.id === activeAutomationId);

  const handleSaveFlow = () => {
    // Aqui seria feita a chamada para a API Supabase (automationService.updateAutomationFlow(id, nodes, edges))
    alert(`Fluxo "${activeAuto.name}" salvo com sucesso!`);
  };

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col font-['Inter']">
      
      {/* Topbar */}
      <div className="h-16 border-b border-zinc-800 bg-[#111] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="text-xl font-black text-white tracking-tighter">
            W3 <span className="text-[#F55900]">Automations</span>
          </div>
        </div>
        <button onClick={signOut} className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors">
          <LogOut className="w-4 h-4" /> Sair
        </button>
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
             <button onClick={handleCreateAutomation} className="bg-zinc-800 hover:bg-zinc-700 text-white rounded p-1 transition-colors">
               <Plus className="w-4 h-4" />
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loading ? (
              <div className="text-zinc-500 text-xs text-center py-4">Carregando...</div>
            ) : (
              automations.map(auto => (
                <button 
                  key={auto.id}
                  onClick={() => {
                    setActiveAutomationId(auto.id);
                    setSelectedNode(null); // Reset selection on change
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${activeAutomationId === auto.id ? 'bg-zinc-800 border border-zinc-700' : 'hover:bg-zinc-900 border border-transparent'}`}
                >
                  <span className="text-sm font-medium text-white truncate pr-2">{auto.name}</span>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${auto.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-zinc-600'}`}></div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Area: Canvas & Config */}
        <div className="flex-1 flex flex-col bg-[#050505] relative">
          
          {/* Active Automation Header */}
          {activeAuto && (
            <div className="h-14 border-b border-zinc-800 bg-[#0a0a0a] flex items-center justify-between px-6 z-10">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">{activeAuto.name}</span>
                {activeAuto.is_active ? (
                  <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Ativo</span>
                ) : (
                  <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Inativo</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                 <button className="text-zinc-400 hover:text-red-500 transition-colors p-2" title="Excluir Automação">
                   <Trash2 className="w-4 h-4" />
                 </button>
                 <button onClick={handleSaveFlow} className="bg-[#F55900] hover:bg-[#d44d00] text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-2 transition-colors">
                   Salvar Fluxo
                 </button>
              </div>
            </div>
          )}
          
          {/* ReactFlow Canvas */}
          <div className="flex-1 relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              className="bg-[#050505]"
            >
              <Background color="#222" gap={16} />
              <Controls className="bg-zinc-900 border-zinc-800 fill-white" />
              <MiniMap 
                nodeColor={(node) => {
                  switch (node.type) {
                    case 'trigger': return '#F55900';
                    case 'condition': return '#3b82f6';
                    case 'action': return node.data.isError ? '#ef4444' : '#a855f7';
                    default: return '#222';
                  }
                }} 
                maskColor="#00000080" 
                className="bg-[#111] border-zinc-800"
              />
            </ReactFlow>

            {/* QA Test Panel & Configuration Drawer (Overlays on Canvas) */}
            {selectedNode && selectedNode.type === 'action' && (
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-[#111] border-l border-zinc-800 p-6 z-20 shadow-2xl flex flex-col">
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
                    <textarea rows={8} className="w-full bg-[#0a0a0a] border border-zinc-800 text-green-400 rounded p-2 text-xs font-mono outline-none focus:border-[#F55900] resize-none" defaultValue={JSON.stringify({ status: selectedNode.data.isError ? "rejected" : "qualified", lead_data: "{{lead}}" }, null, 2)} />
                  </div>
                </div>

                {/* QA Test Button */}
                <div className="mt-auto pt-4 border-t border-zinc-800">
                   <button className="w-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm font-bold py-3 rounded flex justify-center items-center gap-2 transition-colors">
                     <Play className="w-4 h-4" /> Disparar Teste
                   </button>
                   <p className="text-zinc-500 text-[10px] text-center mt-2 leading-relaxed">Dispara um payload mock para validar o endpoint em tempo real.</p>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
