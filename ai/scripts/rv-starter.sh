#!/bin/bash

# 色の定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# アイコン定義
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
FOLDER="📁"
FILE="📄"

# ヘッダー表示
echo -e "${PURPLE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║           RV Project Setup Script           ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# 引数チェック
if [ $# -eq 0 ]; then
    echo -e "${ERROR} ${RED}Error: No ID provided${NC}"
    echo ""
    echo -e "${INFO} ${CYAN}Usage:${NC}"
    echo -e "  ${WHITE}$0 <PROJECT_ID>${NC}"
    echo ""
    echo -e "${INFO} ${CYAN}Example:${NC}"
    echo -e "  ${WHITE}$0 RV-FI-0057${NC}"
    echo ""
    echo -e "${INFO} ${CYAN}Description:${NC}"
    echo -e "  This script creates a new RV project directory structure"
    echo -e "  and copies the template instruction file with the specified ID."
    echo ""
    exit 1
fi

# 第1引数をIDとして使用
ID="$1"
echo -e "${INFO} ${BLUE}Processing project ID: ${WHITE}$ID${NC}"
echo ""

# 現在のディレクトリ表示
CURRENT_DIR=$(pwd)
echo -e "${INFO} ${CYAN}Working directory: ${WHITE}$CURRENT_DIR${NC}"

# ディレクトリが既に存在するかチェック
if [ -d "$ID" ]; then
    echo -e "${ERROR} ${RED}Error: Directory '${WHITE}$ID${RED}' already exists${NC}"
    echo -e "${WARNING} ${YELLOW}Please choose a different project ID or remove the existing directory${NC}"
    echo ""
    echo -e "${INFO} ${CYAN}Existing directory contents:${NC}"
    ls -la "$ID" 2>/dev/null | head -5
    echo ""
    exit 1
fi

# テンプレートファイルの存在確認
TEMPLATE_FILE="template-rv/instructions-{id}.md"
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo -e "${ERROR} ${RED}Error: Template file '${WHITE}$TEMPLATE_FILE${RED}' not found${NC}"
    echo -e "${WARNING} ${YELLOW}Please ensure the template directory structure exists${NC}"
    echo ""
    exit 1
fi

echo -e "${INFO} ${CYAN}Template file found: ${WHITE}$TEMPLATE_FILE${NC}"
echo ""

# ディレクトリ作成
echo -e "${INFO} ${BLUE}Creating project directory...${NC}"
if mkdir "$ID"; then
    echo -e "${SUCCESS} ${GREEN}Directory '${WHITE}$ID${GREEN}' created successfully${NC}"
else
    echo -e "${ERROR} ${RED}Failed to create directory '${WHITE}$ID${RED}'${NC}"
    exit 1
fi

# ファイルコピー
TARGET_FILE="$ID/instructions-$ID.md"
echo -e "${INFO} ${BLUE}Copying template file...${NC}"
if cp "$TEMPLATE_FILE" "$TARGET_FILE"; then
    echo -e "${SUCCESS} ${GREEN}Template copied successfully${NC}"
else
    echo -e "${ERROR} ${RED}Failed to copy template file${NC}"
    exit 1
fi

# 完了メッセージ
echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║              Setup Complete!                ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${SUCCESS} ${GREEN}Project setup completed successfully!${NC}"
echo ""
echo -e "${FOLDER} ${CYAN}Created:${NC}"
echo -e "  ${WHITE}Directory: $ID/${NC}"
echo -e "${FILE} ${CYAN}Created:${NC}"
echo -e "  ${WHITE}File: $TARGET_FILE${NC}"
echo ""


# スクリプトがある場所を基準にしたい場合は以下をコメントアウト
# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# cd "$SCRIPT_DIR"
# mkdir "$ID"
# cp "template-rv/instructions-{id}.md" "$ID/instructions-$ID.md"