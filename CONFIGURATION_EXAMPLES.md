# MCP Configuration Examples

This document provides practical examples for configuring the MCP client with different scenarios.

## Authentication Examples

### OAuth2 Configuration (Production)

```bash
# .env file
MCP_OAUTH_CLIENT_ID=Iv1.abc123def456
MCP_OAUTH_CLIENT_SECRET=abcdef1234567890abcdef1234567890abcdef12
MCP_LOG_LEVEL=info
```

### Personal Access Token (Development)

```bash
# .env file
MCP_PERSONAL_ACCESS_TOKEN=ghp_abcdef1234567890abcdef1234567890123456
MCP_LOG_LEVEL=debug
MCP_DEBUG=true
```

## Server Configuration Examples

### High-Availability Setup

```json
{
  "mcpServer": {
    "timeout": {
      "connect": 10000,
      "request": 30000,
      "idle": 120000
    },
    "retry": {
      "enabled": true,
      "maxAttempts": 5,
      "backoffStrategy": "exponential",
      "baseDelay": 500,
      "maxDelay": 30000
    },
    "healthCheck": {
      "enabled": true,
      "interval": 15000
    }
  }
}
```

### Development Setup

```json
{
  "mcpServer": {
    "timeout": {
      "connect": 30000,
      "request": 60000
    },
    "retry": {
      "enabled": false
    },
    "healthCheck": {
      "enabled": false
    }
  },
  "development": {
    "debug": true,
    "verbose": true,
    "mockResponses": true
  }
}
```

## Security Configuration Examples

### Maximum Security

```json
{
  "security": {
    "permissions": {
      "allowedDomains": ["api.github.com"],
      "requireHttps": true,
      "maxConnections": 5
    },
    "validation": {
      "validateCertificates": true,
      "allowSelfSigned": false,
      "pinCertificates": true
    }
  },
  "auth": {
    "encryption": {
      "enabled": true,
      "algorithm": "AES-256-GCM"
    }
  }
}
```

### Development Security (Relaxed)

```json
{
  "security": {
    "permissions": {
      "allowedDomains": ["*"],
      "requireHttps": false,
      "maxConnections": 50
    },
    "validation": {
      "validateCertificates": false,
      "allowSelfSigned": true
    }
  }
}
```

## Logging Examples

### Production Logging

```json
{
  "logging": {
    "level": "warn",
    "format": "json",
    "outputs": [
      {
        "type": "file",
        "level": "info",
        "filename": "./logs/mcp-production.log",
        "maxSize": "50MB",
        "maxFiles": 10
      }
    ]
  }
}
```

### Debug Logging

```json
{
  "logging": {
    "level": "debug",
    "format": "json",
    "outputs": [
      {
        "type": "console",
        "level": "debug"
      },
      {
        "type": "file",
        "level": "trace",
        "filename": "./logs/mcp-debug.log",
        "maxSize": "10MB",
        "maxFiles": 3
      }
    ],
    "categories": {
      "auth": "trace",
      "network": "debug",
      "security": "debug"
    }
  }
}
```

## Monitoring Examples

### Basic Monitoring

```json
{
  "monitoring": {
    "enabled": true,
    "metrics": {
      "collectRequestMetrics": true,
      "collectPerformanceMetrics": true
    },
    "alerts": {
      "enabled": true,
      "thresholds": {
        "errorRate": 0.1,
        "responseTime": 10000
      }
    }
  }
}
```

### Advanced Monitoring

```json
{
  "monitoring": {
    "enabled": true,
    "metrics": {
      "collectRequestMetrics": true,
      "collectPerformanceMetrics": true,
      "collectErrorMetrics": true
    },
    "alerts": {
      "enabled": true,
      "thresholds": {
        "errorRate": 0.02,
        "responseTime": 2000,
        "connectionFailures": 1
      }
    }
  }
}
```

## Environment-Specific Configurations

### Development

```bash
# .env.development
MCP_PERSONAL_ACCESS_TOKEN=ghp_dev_token_here
MCP_LOG_LEVEL=debug
MCP_DEBUG=true
MCP_VERBOSE=true
```

### Staging

```bash
# .env.staging
MCP_OAUTH_CLIENT_ID=staging_client_id
MCP_OAUTH_CLIENT_SECRET=staging_client_secret
MCP_LOG_LEVEL=info
MCP_DEBUG=false
```

### Production

```bash
# .env.production
MCP_OAUTH_CLIENT_ID=prod_client_id
MCP_OAUTH_CLIENT_SECRET=prod_client_secret
MCP_LOG_LEVEL=warn
MCP_DEBUG=false
MCP_VERBOSE=false
```

## Common Configuration Patterns

### Multi-Server Setup

```json
{
  "servers": {
    "github-primary": {
      "type": "http",
      "url": "https://api.github.com/mcp/",
      "timeout": { "request": 30000 }
    },
    "github-backup": {
      "type": "http",
      "url": "https://backup-api.github.com/mcp/",
      "timeout": { "request": 45000 }
    },
    "local-dev": {
      "type": "stdio",
      "command": "node",
      "args": ["./dev-server.js"]
    }
  }
}
```

### Rate Limiting Configuration

```json
{
  "servers": {
    "github": {
      "rateLimit": {
        "enabled": true,
        "requestsPerSecond": 5,
        "burstSize": 15
      }
    }
  }
}
```

## Troubleshooting Configuration

### Enable All Debug Information

```bash
export MCP_LOG_LEVEL=trace
export MCP_DEBUG=true
export MCP_VERBOSE=true
```

```json
{
  "logging": {
    "level": "trace",
    "categories": {
      "auth": "trace",
      "network": "trace",
      "security": "trace",
      "performance": "trace"
    }
  }
}
```

### Test Configuration Validation

```bash
# Test environment variable substitution
python3 -c "
import json, os, re

def expand_env_vars(content):
    pattern = r'\\\${([^}:]+)(?::-([^}]+))?}'
    def replacer(m):
        var, default = m.groups()
        return os.environ.get(var, default or '')
    return re.sub(pattern, replacer, content)

with open('.vscode/mcp.json') as f:
    content = f.read()

expanded = expand_env_vars(content)
config = json.loads(expanded)
print('Configuration is valid!')
"
```