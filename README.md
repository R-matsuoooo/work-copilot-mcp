# calc.sh - A Simple Command Line Calculator

This project provides a simple command line calculator implemented in a shell script. The calculator supports basic arithmetic operations including addition, subtraction, multiplication, and division.

## Features

- Addition
- Subtraction
- Multiplication
- Division

## Usage

To use the calculator, run the following command in your terminal:

```bash
bash src/calc.sh
```

Follow the prompts to enter your calculations.

## MCP Configuration

This project includes Model Context Protocol (MCP) configuration for enhanced development workflows with VS Code and GitHub Copilot.

### Configuration File

The MCP settings are defined in `.vscode/mcp.json` with the following key features:

#### 1. Enhanced Authentication
- **Personal Access Token (PAT)**: Default authentication method
- **OAuth2.0 Flow**: Full OAuth configuration with client credentials
- **Token Encryption**: AES-256-GCM encryption for secure token storage

#### 2. Extended Server Settings
- **Timeout Configuration**: Customizable timeout values for different services
- **Retry Mechanism**: Automatic retry with configurable attempts and delays
- **Logging Levels**: Flexible logging configuration (debug, info, warn, error)

#### 3. Security Features
- **Token Encryption**: Encrypted storage of authentication tokens
- **Access Permissions**: Fine-grained permission controls
- **SSL Verification**: Certificate validation and optional pinning
- **Allowed Hosts**: Whitelist of permitted hosts for connections

### Environment Variables

Configure MCP using environment variables for better security and flexibility:

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` with your configuration values:

| Variable | Description | Default |
|----------|-------------|---------|
| `MCP_AUTH_TYPE` | Authentication type (PAT or oauth2) | `PAT` |
| `MCP_AUTH_TOKEN` | Personal access token or OAuth client ID | Required |
| `MCP_TOKEN_ENCRYPTION` | Enable token encryption | `true` |
| `MCP_SERVER_TIMEOUT` | Server timeout in milliseconds | `30000` |
| `MCP_RETRY_ATTEMPTS` | Number of retry attempts | `3` |
| `MCP_RETRY_DELAY` | Delay between retries in milliseconds | `1000` |
| `MCP_LOG_LEVEL` | Logging level (debug, info, warn, error) | `info` |
| `MCP_DEBUG_MODE` | Enable debug mode | `false` |

### OAuth2.0 Setup

For OAuth2.0 authentication:

1. Register a GitHub OAuth App at https://github.com/settings/applications/new
2. Set your OAuth credentials in environment variables:
```bash
MCP_AUTH_TYPE=oauth2
MCP_OAUTH_CLIENT_ID=your_client_id
MCP_OAUTH_CLIENT_SECRET=your_client_secret
MCP_OAUTH_REDIRECT_URI=http://localhost:3000/callback
```

### Security Best Practices

1. **Never commit actual tokens**: Use environment variables or encrypted storage
2. **Enable token encryption**: Set `MCP_TOKEN_ENCRYPTION=true`
3. **Review permissions**: Configure `allowedScopes` for minimal required access
4. **Monitor logs**: Check MCP logs regularly for security events
5. **Use HTTPS**: Always use secure connections in production

### Development Mode

Enable development features for testing:

```bash
MCP_DEBUG_MODE=true
MCP_VERBOSE_LOGGING=true
MCP_MOCK_ENABLED=true
```

This enables:
- Detailed debug logging
- Mock server for testing
- Verbose request/response logging

### Configuration Validation

Use the included validation script to verify your MCP setup:

```bash
./scripts/validate-mcp.sh
```

This script will:
- Validate JSON syntax in mcp.json
- Check environment variable configuration
- Create log directories if needed
- Provide security recommendations

## Prerequisites

- A Unix-like environment (Linux, macOS, or WSL on Windows)
- Bash shell
- VS Code with GitHub Copilot extension (for MCP features)

## License

This project is licensed under the MIT License. See the LICENSE file for more details.