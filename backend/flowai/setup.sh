#!/bin/bash
# FlowAI Setup Script
# Installs Ollama and pulls recommended models

set -e

echo "🧠 FlowAI Setup Script"
echo "====================="

# Detect VRAM
detect_vram() {
    if command -v nvidia-smi &> /dev/null; then
        VRAM_MB=$(nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits | head -1)
        VRAM_GB=$((VRAM_MB / 1024))
        echo "✅ Detected NVIDIA GPU with ${VRAM_GB}GB VRAM"
    else
        VRAM_GB=0
        echo "ℹ️  No NVIDIA GPU detected. Will use CPU-only mode."
    fi
}

# Install Ollama
install_ollama() {
    if command -v ollama &> /dev/null; then
        echo "✅ Ollama already installed"
        return
    fi
    
    echo "📦 Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo "✅ Ollama installed"
}

# Pull models based on VRAM
pull_models() {
    echo ""
    echo "📥 Pulling AI models..."
    
    if [ "$VRAM_GB" -ge 12 ]; then
        echo "   Using 12GB+ VRAM configuration..."
        ollama pull deepseek-r1:8b
        ollama pull qwen3:8b
    elif [ "$VRAM_GB" -ge 8 ]; then
        echo "   Using 8GB VRAM configuration..."
        ollama pull deepseek-r1:8b
        ollama pull mistral:7b
    elif [ "$VRAM_GB" -ge 6 ]; then
        echo "   Using 6GB VRAM configuration..."
        ollama pull mistral:7b
    else
        echo "   Using CPU-only configuration..."
        ollama pull qwen3:0.6b
    fi
    
    echo "✅ Models installed"
}

# Update .env file
update_env() {
    ENV_FILE="../.env"
    
    if [ ! -f "$ENV_FILE" ]; then
        echo "FLOWAI_VRAM_GB=$VRAM_GB" > "$ENV_FILE"
    else
        if ! grep -q "FLOWAI_VRAM_GB" "$ENV_FILE"; then
            echo "FLOWAI_VRAM_GB=$VRAM_GB" >> "$ENV_FILE"
        fi
    fi
    
    echo "✅ Environment configured"
}

# Main
main() {
    detect_vram
    install_ollama
    pull_models
    update_env
    
    echo ""
    echo "🎉 FlowAI Setup Complete!"
    echo ""
    echo "To start FlowAI:"
    echo "  cd backend"
    echo "  python -m uvicorn main:app --host 0.0.0.0 --port 8000"
    echo ""
    echo "Available endpoints:"
    echo "  - GET  /flowai/status"
    echo "  - GET  /flowai/models"
    echo "  - POST /analyze"
}

main "$@"
