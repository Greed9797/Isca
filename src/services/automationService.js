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
  },
  
  // Save flow state (nodes + edges)
  updateAutomationFlow: async (id, flowState) => {
    const { data, error } = await supabase
      .from('automations')
      .update({ flow_state: flowState })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  
  // Test webhook via Proxy Edge Function
  testWebhook: async (url, payload) => {
      // Chamada real para Edge Function
      const { data, error } = await supabase.functions.invoke('webhook-proxy', { 
          body: { url, payload } 
      });
      if (error) throw error;
      return data;
  }
};
