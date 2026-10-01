#!/bin/bash

# smoke-test.sh - Verifies environment readiness for the bootcamp
echo "========================================="
echo "🔍 Running System Verification Checks..."
echo "========================================="

# 1. Verify Node.js Version
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install v20+ LTS."
    exit 1
else
    NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VER" -lt 20 ]; then
        echo "⚠️  Warning: Recommended Node.js version is v20 or higher (Current: $(node -v))"
    else
        echo "✅ Node.js Version: $(node -v) (Ready)"
    fi
fi

# 2. Verify Git
if ! command -v git &> /dev/null; then
    echo "❌ Error: Git is not installed."
    exit 1
else
    echo "✅ Git is installed."
fi

# 3. Verify GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "⚠️  Warning: GitHub CLI ('gh') is not installed. This is highly recommended for Module 3."
else
    echo "✅ GitHub CLI ('gh') is installed."
fi

# 4. Verify Network Connection and Corporate Proxy
echo "🌐 Checking network connection to LLM endpoints..."
curl -I -s --connect-timeout 5 https://api.github.com > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Network connection is successful."
else
    echo "❌ Error: Network unreachable. Please check your corporate proxy or VPN settings."
    exit 1
fi

echo ""
echo "========================================="
echo "🎉 [ALL GREEN] System verification passed! You are ready for the bootcamp."
echo "========================================="
