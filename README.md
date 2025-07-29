# work-copilot-mcp - MCP Configuration Project

This project provides a comprehensive MCP (Model Context Protocol) configuration setup with advanced security, authentication, and monitoring features. It also includes a simple command line calculator as a demonstration application.

## Features

### MCP Configuration
- **Advanced Authentication**: Support for OAuth2.0 and Personal Access Tokens
- **Environment Variable Integration**: Secure token management
- **Enhanced Security**: Token encryption and fine-grained permissions
- **Reliability Features**: Timeout configuration, retry mechanisms, and health checks
- **Comprehensive Logging**: Structured logging with multiple outputs and categories
- **Monitoring & Alerts**: Built-in metrics collection and alerting

### Calculator Application
- Addition
- Subtraction
- Multiplication
- Division

## MCP Configuration Setup

### 1. Environment Variables

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```bash
# OAuth2 Authentication (Recommended)
MCP_OAUTH_CLIENT_ID=your_github_oauth_client_id_here
MCP_OAUTH_CLIENT_SECRET=your_github_oauth_client_secret_here

# Or use Personal Access Token
MCP_PERSONAL_ACCESS_TOKEN=your_github_personal_access_token_here

# Logging level
MCP_LOG_LEVEL=info
```

### 2. OAuth2 Setup

To use OAuth2 authentication (recommended for production):

1. **Create a GitHub OAuth App**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Fill in the application details:
     - Application name: `Your MCP Client`
     - Homepage URL: `http://localhost:8080`
     - Authorization callback URL: `http://localhost:8080/callback`
   - Note down the Client ID and Client Secret

2. **Configure Environment Variables**:
   ```bash
   MCP_OAUTH_CLIENT_ID=your_client_id
   MCP_OAUTH_CLIENT_SECRET=your_client_secret
   ```

### 3. Personal Access Token Setup

Alternative to OAuth2 for simpler setups:

1. **Generate a GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `read:user`, `repo`
   - Copy the generated token

2. **Configure Environment Variable**:
   ```bash
   MCP_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
   ```

## Configuration Features

### Authentication & Security
- **Token Encryption**: AES-256-GCM encryption for stored tokens
- **Environment Variable Support**: Secure credential management
- **OAuth2 Flow**: Complete OAuth2 implementation with refresh tokens
- **Domain Restrictions**: Configurable allowed/blocked domains
- **HTTPS Enforcement**: Mandatory secure connections
- **Certificate Validation**: SSL/TLS certificate verification

### Server Configuration
- **Timeout Management**: Configurable connection, request, and idle timeouts
- **Retry Logic**: Exponential and linear backoff strategies
- **Health Checks**: Automatic server health monitoring
- **Rate Limiting**: Request throttling and burst control
- **Multiple Server Types**: HTTP and stdio server support

### Logging & Monitoring
- **Structured Logging**: JSON format with multiple output targets
- **Log Categories**: Separate logging for auth, network, security, and performance
- **File Rotation**: Automatic log file rotation and compression
- **Metrics Collection**: Request, performance, and error metrics
- **Alerting**: Configurable thresholds for error rates and response times

## Usage Examples

### Basic Calculator Usage

```bash
bash src/calc.sh
```

### MCP Client Configuration

The MCP configuration is automatically loaded from `.vscode/mcp.json`. Environment variables are resolved at runtime:

```json
{
  "auth": {
    "oauth2": {
      "clientId": "${MCP_OAUTH_CLIENT_ID}",
      "clientSecret": "${MCP_OAUTH_CLIENT_SECRET}"
    }
  }
}
```

### Development Mode

Enable debug logging and verbose output:

```bash
export MCP_DEBUG=true
export MCP_VERBOSE=true
export MCP_LOG_LEVEL=debug
```

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem**: `Authentication failed` or `Invalid token`

**Solutions**:
- Verify your environment variables are set correctly
- Check token permissions and expiration
- For OAuth2, ensure redirect URI matches exactly
- Review logs for detailed error messages

#### 2. Connection Timeouts

**Problem**: `Connection timeout` or `Request timeout`

**Solutions**:
- Check network connectivity
- Verify server URLs are accessible
- Adjust timeout values in `mcp.json`:
  ```json
  "timeout": {
    "connect": 30000,
    "request": 60000
  }
  ```

#### 3. Rate Limiting

**Problem**: `Rate limit exceeded` errors

**Solutions**:
- Reduce request frequency
- Implement request queuing
- Adjust rate limit settings:
  ```json
  "rateLimit": {
    "requestsPerSecond": 5,
    "burstSize": 10
  }
  ```

#### 4. SSL/TLS Issues

**Problem**: `Certificate verification failed`

**Solutions**:
- Ensure system certificates are up to date
- For development only, you can disable validation:
  ```json
  "security": {
    "validation": {
      "validateCertificates": false
    }
  }
  ```

### Debug Mode

Enable comprehensive debugging:

```bash
export MCP_DEBUG=true
export MCP_LOG_LEVEL=debug
```

Check logs in `./logs/mcp-client.log` for detailed information.

### Health Checks

Monitor server health:
- Health check endpoint: `/health`
- Default interval: 30 seconds
- Configure in `mcpServer.healthCheck` section

## Configuration Reference

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MCP_OAUTH_CLIENT_ID` | GitHub OAuth2 Client ID | - | Yes (OAuth2) |
| `MCP_OAUTH_CLIENT_SECRET` | GitHub OAuth2 Client Secret | - | Yes (OAuth2) |
| `MCP_PERSONAL_ACCESS_TOKEN` | GitHub PAT | - | Yes (PAT) |
| `MCP_LOG_LEVEL` | Logging level | `info` | No |
| `MCP_DEBUG` | Enable debug mode | `false` | No |
| `MCP_VERBOSE` | Enable verbose output | `false` | No |

### Security Best Practices

1. **Never commit credentials** to version control
2. **Use OAuth2** for production environments
3. **Enable token encryption** in production
4. **Regularly rotate** access tokens
5. **Monitor logs** for security events
6. **Use HTTPS only** for all connections
7. **Validate certificates** in production

## Prerequisites

- A Unix-like environment (Linux, macOS, or WSL on Windows)
- Bash shell
- Node.js (for local MCP server)
- Internet connection for GitHub API access

## License

This project is licensed under the MIT License. See the LICENSE file for more details.