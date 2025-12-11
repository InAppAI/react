# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

As the project matures and reaches 1.0.0, we will maintain security updates for the latest major version.

## Reporting a Vulnerability

We take the security of InAppAI React seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please send an email to **security@inappai.com** with the following information:

1. **Description**: A clear description of the vulnerability
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Impact**: Your assessment of the potential impact
4. **Affected Versions**: Which versions are affected
5. **Suggested Fix**: If you have a suggested fix, please include it

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
- **Initial Assessment**: We will provide an initial assessment within 7 days
- **Resolution Timeline**: We aim to resolve critical vulnerabilities within 30 days
- **Credit**: If you wish, we will credit you in our security advisory

### Disclosure Policy

- We follow a coordinated disclosure process
- We request that you do not publicly disclose the vulnerability until we have had a chance to address it
- We will work with you to understand and resolve the issue quickly

## Security Best Practices for Users

When using the InAppAI React component, please follow these security guidelines:

### API Keys and Credentials

- **Never expose API keys in client-side code**
- Store sensitive credentials on your backend server
- Use environment variables for configuration
- The `agentId` is safe to include in client-side code as it's not a secret

### Content Security

- The component uses React's built-in XSS protection
- Custom styles are applied via inline styles (safe from XSS)
- We do not use `dangerouslySetInnerHTML`
- User inputs are sanitized before rendering

### Data Handling

- Messages are stored in component state by default
- For persistent storage, implement your own backend solution
- Do not store sensitive user data in localStorage
- Use HTTPS for all API communications

### CORS Configuration

- Configure allowed origins on your backend
- Only allow trusted domains to access your API
- Use specific origin lists rather than wildcards in production

### Content Security Policy (CSP)

If your application uses CSP headers, ensure they allow:

```
style-src 'self' 'unsafe-inline';
connect-src 'self' your-api-domain.com;
```

## Known Security Considerations

### Client-Side Component

As a client-side React component:

- All code runs in the user's browser
- Do not include secrets or sensitive logic
- Validate all user input on your backend
- The component makes HTTP requests that can be inspected

### Third-Party Dependencies

We regularly update dependencies to address security vulnerabilities. Run `npm audit` to check for known issues in your project.

### Demo Application

The demo application (`examples/demo/`) is for development and testing purposes only:

- It uses localStorage for message persistence (not recommended for production)
- Configuration values may be visible in browser dev tools
- Do not deploy the demo with production credentials

## Security Updates

Security updates are released as patch versions. To stay updated:

```bash
# Check for updates
npm outdated @inappai/react

# Update to latest version
npm update @inappai/react
```

## Security Changelog

### 0.1.0 (Initial Release)

- Initial security review completed
- XSS protection via React's built-in sanitization
- Secure style application using inline styles
- No use of dangerous DOM methods

---

Thank you for helping keep InAppAI React and its users safe!
