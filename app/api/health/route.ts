export async function GET() {
  const keys = {
    openai: !!process.env.OPENAI_API_KEY,
    anthropic: !!process.env.ANTHROPIC_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    xai: !!process.env.XAI_API_KEY,
    google: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  };
  
  return Response.json({ 
    status: 'ok', 
    apiKeys: keys,
    timestamp: new Date().toISOString()
  });
}
