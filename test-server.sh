#!/bin/bash
# Simple test server script

echo "🚀 Starting Portfolio Test Server..."
echo "📁 Serving from: $(pwd)"
echo "🌐 Open your browser to: http://localhost:8000"
echo "⏹️  Press Ctrl+C to stop the server"
echo ""

# Start Python server (works on most systems)
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python not found. Please install Python or use another method."
    exit 1
fi