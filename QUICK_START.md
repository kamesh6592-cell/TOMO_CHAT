# Quick Start Guide

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- PostgreSQL database
- Azure AI Services account

## Setup Steps

### 1. Clone the Repository

```powershell
git clone https://github.com/kamesh6592-cell/hello-its.git
cd hello-its
```

### 2. Install Dependencies

```powershell
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
# Azure AI Services
AZURE_API_KEY=your_azure_key_here
AZURE_BASE_URL=https://flook.services.ai.azure.com/models
AZURE_OPENAI_API_KEY=your_azure_openai_key_here
AZURE_OPENAI_ENDPOINT=https://flook.cognitiveservices.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01

# Database
POSTGRES_URL=postgres://user:pass@host:5432/dbname

# Authentication
BETTER_AUTH_SECRET=generate_with_npx_better_auth_cli_secret
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Generate Authentication Secret

```powershell
npx @better-auth/cli@latest secret
```

Copy the generated secret to `BETTER_AUTH_SECRET` in `.env`

### 5. Start Development Server

```powershell
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing Features

### Test Image Generation
1. Type: "Generate an image of a sunset"
2. Select provider: "OpenAI (Azure DALL-E-3)" or "Gemini"
3. Click generate

### Test Chat Models
1. Select model from dropdown
2. Try: "Explain quantum physics" (test reasoning with DeepSeek-R1)
3. Try: "What's the weather?" (test Grok models)

## Production Deployment

### 1. Build for Production

```powershell
pnpm build
```

### 2. Update Environment Variables

Update `.env` with production values:
- Use production Azure keys
- Set production `POSTGRES_URL`
- Set production `BETTER_AUTH_URL`

### 3. Start Production Server

```powershell
pnpm start
```

## Troubleshooting

### "Missing AZURE_API_KEY" Error
- Check `.env` file exists in project root
- Verify no quotes around values
- Ensure no spaces around `=` sign

### Image Generation Fails
- Verify `AZURE_OPENAI_API_KEY` is set
- Check Azure endpoint URL is correct
- Ensure API key has DALL-E-3 access

### Chat Models Not Working
- Verify `AZURE_API_KEY` is set
- Check model names match Azure deployment

## Available Models

### Chat Models (via Azure)
- DeepSeek-R1 (with reasoning)
- Grok-4-fast-non-reasoning
- Grok-3

### Image Generation
- DALL-E-3 (Azure)
- Gemini (Google)

## Documentation

- `API_KEYS_SETUP.md` - How to configure API keys
- `SECURITY_SETUP.md` - Security best practices
- `AZURE_INTEGRATION.md` - Azure integration details
- `CHANGES_SUMMARY.md` - Technical changes
- `PRODUCTION_CHECKLIST.md` - Production deployment checklist

## Need Help?

1. Check documentation files
2. Verify `.env` configuration
3. Check Azure Portal for API key status
4. Review application logs
