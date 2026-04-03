import { supabase } from '../src/utils/supabase.js';


async function testLeadSubmission() {
  console.log("Testando inserção de Lead...");
  const { data, error } = await supabase.from('leads').insert([{
    full_name: 'Teste E2E',
    email: 'teste@e2e.com',
    whatsapp: '11999999999',
    business_type: 'Fabricante',
    revenue: '30k a 100k'
  }]);

  if (error) {
    console.error("Erro na inserção:", error.message);
  } else {
    console.log("Lead inserido com sucesso!");
  }
}

testLeadSubmission();
