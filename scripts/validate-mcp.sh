#!/bin/bash

# MCP Configuration Validator
# This script validates the MCP configuration and environment setup

echo "🔍 MCP Configuration Validator"
echo "=============================="

# Check if mcp.json exists and is valid
if [ -f ".vscode/mcp.json" ]; then
    echo "✅ mcp.json file found"
    
    # Validate JSON syntax
    if python3 -m json.tool .vscode/mcp.json > /dev/null 2>&1; then
        echo "✅ mcp.json syntax is valid"
    else
        echo "❌ mcp.json has invalid JSON syntax"
        exit 1
    fi
else
    echo "❌ mcp.json file not found in .vscode/ directory"
    exit 1
fi

# Check environment file
if [ -f ".env" ]; then
    echo "✅ .env file found"
    
    # Check required environment variables
    source .env 2>/dev/null
    
    if [ -n "$MCP_AUTH_TOKEN" ] && [ "$MCP_AUTH_TOKEN" != "your_personal_access_token_here" ]; then
        echo "✅ MCP_AUTH_TOKEN is configured"
    else
        echo "⚠️  MCP_AUTH_TOKEN needs to be set in .env file"
    fi
    
    if [ -n "$MCP_AUTH_TYPE" ]; then
        echo "✅ MCP_AUTH_TYPE is set to: $MCP_AUTH_TYPE"
    else
        echo "⚠️  MCP_AUTH_TYPE not set, using default: PAT"
    fi
    
else
    echo "⚠️  .env file not found (optional, but recommended for security)"
    echo "   Copy .env.example to .env and configure your settings"
fi

# Check log directory
if [ -n "$MCP_LOG_FILE" ]; then
    LOG_DIR=$(dirname "$MCP_LOG_FILE")
    if [ ! -d "$LOG_DIR" ]; then
        echo "📁 Creating log directory: $LOG_DIR"
        mkdir -p "$LOG_DIR"
    fi
    echo "✅ Log directory is ready: $LOG_DIR"
fi

# Security recommendations
echo ""
echo "🔒 Security Recommendations:"
echo "   - Keep your .env file out of version control"
echo "   - Use strong, unique personal access tokens"
echo "   - Enable token encryption (MCP_TOKEN_ENCRYPTION=true)"
echo "   - Review allowed scopes and permissions regularly"
echo "   - Monitor MCP logs for unusual activity"

echo ""
echo "🎉 MCP configuration validation complete!"