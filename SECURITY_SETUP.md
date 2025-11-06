# Security Setup Guide

## Critical Security Rules

### 🔴 NEVER Commit These to Git
- `.env` file with actual API keys
- API keys or tokens in code
- Database credentials
- Authentication secrets

### ✅ Always Follow These
- Use environment variables for all secrets
- Keep `.env` local only (in `.gitignore`)
- Use different keys for dev/staging/production
- Rotate keys regularly

## Environment Variable Security

### Correct Setup ✅
```bash
# .env file (git ignored)
AZURE_API_KEY=your_actual_key_here
AZURE_OPENAI_API_KEY=your_actual_key_here
```

```typescript
// Code - uses environment variables
const apiKey = process.env.AZURE_API_KEY;
if (!apiKey) {
  throw new Error('Missing API key');
}
```

### Incorrect Setup ❌
```typescript
// NEVER do this - hardcoded key
const apiKey = "AbC123dEfGhI...";
```

## API Key Management

### 1. Storage
- ✅ Store in `.env` file
- ✅ Use secure environment variable services (Azure Key Vault, AWS Secrets Manager)
- ❌ Never hardcode in source code
- ❌ Never commit to Git

### 2. Access Control
- Limit who can access production keys
- Use role-based access control
- Log API key usage
- Monitor for unauthorized access

### 3. Rotation Policy
- Rotate keys every 90 days
- Rotate immediately if compromised
- Use different keys per environment
- Keep old keys for 24 hours during rotation

## Azure AI Services Security

### Bearer Token Format
Azure API keys are Bearer tokens:
```bash
Authorization: Bearer YOUR_TOKEN_HERE
```

In `.env`, store without "Bearer " prefix:
```bash
AZURE_API_KEY=YOUR_TOKEN_HERE
```

### Key Protection
- Never log API keys
- Don't include in error messages
- Use HTTPS only
- Enable Azure monitoring

## Database Security

### Connection String
```bash
# Use environment variable
POSTGRES_URL=postgres://user:pass@host:5432/dbname
```

### Best Practices
- Use SSL/TLS connections
- Rotate database passwords
- Use connection pooling
- Limit database user permissions

## Authentication Security

### BETTER_AUTH_SECRET
```bash
# Generate new secret
npx @better-auth/cli@latest secret

# Add to .env
BETTER_AUTH_SECRET=your_generated_secret_here
```

### Requirements
- Minimum 32 characters
- Cryptographically random
- Unique per environment
- Never reuse across projects

## Production Checklist

### Before Deployment
- [ ] All secrets in environment variables
- [ ] `.env` file in `.gitignore`
- [ ] No hardcoded API keys in code
- [ ] Different keys for production
- [ ] SSL/TLS enabled
- [ ] Authentication configured
- [ ] Database secured

### After Deployment
- [ ] Monitor API usage
- [ ] Check for unauthorized access
- [ ] Review security logs
- [ ] Test error handling
- [ ] Verify HTTPS only

## Incident Response

### If API Key Compromised
1. **Immediately** rotate the key in Azure Portal
2. Update `.env` file with new key
3. Restart application
4. Review access logs
5. Investigate how key was exposed
6. Document incident

### If Database Compromised
1. **Immediately** change database password
2. Review database logs
3. Check for unauthorized access
4. Restore from backup if needed
5. Audit user permissions

## Compliance

### Data Protection
- GDPR compliance for EU users
- Encrypt data at rest
- Encrypt data in transit
- Regular security audits

### Access Logging
- Log all API requests
- Monitor unusual patterns
- Set up alerts for suspicious activity
- Retain logs per compliance requirements

## Security Monitoring

### Azure Portal
- Monitor API usage
- Set up usage alerts
- Review access logs
- Check for failed requests

### Application Logs
- Log authentication attempts
- Monitor error rates
- Track API response times
- Alert on security events

## Code Security

### Input Validation
```typescript
// Validate all user inputs
if (!isValidInput(userInput)) {
  throw new Error('Invalid input');
}
```

### Error Handling
```typescript
// Don't expose sensitive info in errors
try {
  // API call
} catch (error) {
  // Log detailed error internally
  console.error('API Error:', error);
  
  // Return generic message to user
  return { error: 'Service temporarily unavailable' };
}
```

### Rate Limiting
- Implement rate limiting
- Prevent abuse
- Protect against DDoS
- Monitor request patterns

## Dependencies

### Keep Updated
```powershell
# Check for security vulnerabilities
pnpm audit

# Update dependencies
pnpm update
```

### Review Regularly
- Check for CVEs
- Update vulnerable packages
- Review security advisories
- Test after updates

## Additional Resources

- [Azure Security Best Practices](https://docs.microsoft.com/azure/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Guide](https://nodejs.org/en/docs/guides/security/)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)

## Questions?

Review:
- `API_KEYS_SETUP.md` for key configuration
- `PRODUCTION_CHECKLIST.md` for deployment steps
- Azure documentation for security features
