# Azure API Keys Setup Guide

## ⚠️ SECURITY WARNING
**NEVER commit actual API keys to Git!** This guide uses placeholder values only.

## Required Environment Variables

### For Chat Models (DeepSeek & Grok)
```bash
AZURE_API_KEY=your_azure_bearer_token_here
AZURE_BASE_URL=https://flook.services.ai.azure.com/models
```

### For Image Generation (DALL-E-3)
```bash
AZURE_OPENAI_API_KEY=your_azure_openai_bearer_token_here
AZURE_OPENAI_ENDPOINT=https://flook.cognitiveservices.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01
```

## Complete .env Configuration

Create a `.env` file in your project root:

```bash
# === Azure AI Services (REQUIRED) ===
AZURE_API_KEY=your_azure_bearer_token_here
AZURE_BASE_URL=https://flook.services.ai.azure.com/models

# Azure OpenAI for DALL-E-3
AZURE_OPENAI_API_KEY=your_azure_openai_bearer_token_here
AZURE_OPENAI_ENDPOINT=https://flook.cognitiveservices.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01

# === Database (REQUIRED) ===
POSTGRES_URL=postgres://username:password@localhost:5432/dbname

# === Authentication (REQUIRED) ===
# Generate with: npx @better-auth/cli@latest secret
BETTER_AUTH_SECRET=your_generated_secret_here
BETTER_AUTH_URL=http://localhost:3000

# === Optional Providers ===
GOOGLE_GENERATIVE_AI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GROQ_API_KEY=
```

## How to Get Your Azure API Keys

### From Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Azure AI Services resource
3. Go to "Keys and Endpoint"
4. Copy your API key

### From curl Commands
If you have working curl commands with Authorization headers:
```bash
curl -X POST https://... \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Extract the token after "Bearer " and use it as your API key.

## Token Format

Azure Bearer tokens typically:
- Length: ~70-90 characters
- Mix of uppercase/lowercase letters and numbers
- No spaces or special characters

Example format (NOT a real key):
```bash
AZURE_API_KEY=AbC123dEfGhIjKlMnOpQrStUvWxYz0123456789
```

## Where These Keys Are Used

### AZURE_API_KEY
- DeepSeek-R1 chat model
- Grok-4-fast-non-reasoning
- Grok-3

### AZURE_OPENAI_API_KEY
- DALL-E-3 image generation

## Security Best Practices

✅ **DO:**
- Store keys in `.env` file
- Use different keys for dev/production
- Rotate keys regularly

❌ **DON'T:**
- Commit `.env` to Git
- Share keys publicly
- Hardcode keys in source code

## Common Mistakes

```bash
# Correct ✅
AZURE_API_KEY=YourTokenHere

# Wrong ❌ - has quotes
AZURE_API_KEY="YourTokenHere"

# Wrong ❌ - has Bearer prefix
AZURE_API_KEY=Bearer YourTokenHere

# Wrong ❌ - has spaces
AZURE_API_KEY = YourTokenHere
```
