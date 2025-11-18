# Google OAuth and OpenRouter Image Generation Setup

This guide explains how to enable Google OAuth authentication and OpenRouter image generation in your TOMO application.

## Google OAuth Authentication Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Select **Web application** as the application type
6. Add authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
7. Click **Create** and copy your **Client ID** and **Client Secret**

### 2. Configure Environment Variables

Add the following to your `.env` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# Optional: Force account selection every time
GOOGLE_FORCE_ACCOUNT_SELECTION=1
```

### 3. Enable Google OAuth in the App

The Google OAuth button will automatically appear on the sign-in page once you've configured the credentials. No additional code changes are needed!

## OpenRouter Image Generation Setup

### 1. Get OpenRouter API Key

1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Navigate to your [API Keys](https://openrouter.ai/keys) page
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

Add your OpenRouter API key to your `.env` file:

```bash
# OpenRouter
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 3. How It Works

The OpenRouter integration uses Google's Gemini 2.5 Flash Image model through OpenRouter's API. This provides:

- **Image Generation**: Create new images from text descriptions
- **Image Editing**: Modify existing images based on conversation context
- **Image Composition**: Combine multiple images
- **Conversation Awareness**: The AI considers the last 6 messages for context

### 4. Example Usage

Once configured, users can simply ask:

```
"Generate an image of a sunset over mountains"
"Create a logo for my company"
"Edit the previous image to add more colors"
```

The AI will automatically:
1. Analyze the conversation context
2. Call the OpenRouter API with the Gemini 2.5 Flash Image model
3. Generate the image
4. Upload it to your storage
5. Display it in the chat

## Model Information

**OpenRouter Model**: `google/gemini-2.5-flash-image`

This model supports:
- Text-to-image generation
- Image understanding and editing
- Multi-turn conversations with images
- Various image styles and formats

## Testing

### Test Google OAuth
1. Navigate to `/sign-in`
2. Click the "Google" button
3. Sign in with your Google account
4. You should be redirected back to the app

### Test OpenRouter Image Generation
1. Start a new chat
2. Type: "Generate an image of a futuristic city"
3. The AI will use OpenRouter to create the image
4. The image will be displayed in the chat

## Troubleshooting

### Google OAuth Issues

**Error: redirect_uri_mismatch**
- Ensure your redirect URI in Google Console exactly matches your application URL
- For local dev: `http://localhost:3000/api/auth/callback/google`
- For production: `https://yourdomain.com/api/auth/callback/google`

**OAuth Not Showing**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in `.env`
- Restart your development server after adding environment variables
- Check browser console for errors

### OpenRouter Image Generation Issues

**Error: OPENROUTER_API_KEY is not set**
- Verify the API key is correctly set in `.env`
- Ensure there are no extra spaces or quotes
- Restart your server after adding the key

**Image Generation Fails**
- Check your OpenRouter account credits
- Verify the model `google/gemini-2.5-flash-image` is available
- Check server logs for detailed error messages

**Image Upload Fails**
- Ensure your file storage is properly configured
- Check that `FILE_STORAGE_TYPE` is set in `.env`
- Verify file storage permissions

## Advanced Configuration

### Custom Referer Headers

OpenRouter tracks API usage by referer. Configure these in your `.env`:

```bash
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

These will be used as the HTTP-Referer header for OpenRouter requests, allowing you to track usage on OpenRouter's dashboard.

### Multiple Image Generation Providers

The app supports multiple image generation providers:
- **Gemini Nano Banana** (default): Google's native image generation
- **OpenAI Image Generation**: GPT-4 based image generation
- **OpenRouter**: Access to multiple models including Gemini 2.5

You can switch between providers by modifying the tool configuration in your AI settings.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit** your `.env` file to version control
2. **Keep secrets secure**: OAuth secrets and API keys should never be exposed
3. **Use environment variables**: Always use `.env` files for sensitive data
4. **Rotate keys regularly**: Change API keys periodically for security
5. **Monitor usage**: Check your Google and OpenRouter dashboards for unexpected activity

## Cost Considerations

### Google OAuth
- **Free** for most use cases
- Check [Google Cloud pricing](https://cloud.google.com/pricing) for high-volume usage

### OpenRouter
- **Pay-per-use** model
- Check [OpenRouter pricing](https://openrouter.ai/models) for current rates
- Gemini 2.5 Flash Image pricing varies by request
- Monitor your usage on the OpenRouter dashboard

## Support

For issues or questions:
- Create an issue on [GitHub](https://github.com/kamesh6592-cell/hello-its/issues)
- Check the main README for general setup
- Review the [Better Auth documentation](https://www.better-auth.com/docs) for OAuth issues

---

**Built with ❤️ by TOMO**
