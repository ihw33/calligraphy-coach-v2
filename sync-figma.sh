#!/bin/bash

# Figma-GitHub 동기화 실행 스크립트
# 이 스크립트를 실행하면 자동으로 Figma 디자인을 동기화합니다

echo "🎨 Figma-GitHub 동기화 시작..."

# 환경 변수 확인
if [ -z "$FIGMA_ACCESS_TOKEN" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ 환경 변수가 설정되지 않았습니다!"
    echo "💡 .env 파일을 확인하거나 다음 명령어를 실행하세요:"
    echo "   export FIGMA_ACCESS_TOKEN=your_token"
    echo "   export GITHUB_TOKEN=your_token"
    exit 1
fi

# 프로젝트 루트로 이동
cd /Users/m4_macbook/Projects/calligraphy-coach-v2

# Figma Sync 패키지로 이동
cd packages/figma-sync

# 의존성 확인
if [ ! -d "node_modules" ]; then
    echo "📦 의존성 설치 중..."
    npm install
fi

# 빌드 확인
if [ ! -d "dist" ]; then
    echo "🔨 빌드 중..."
    npm run build
fi

# 동기화 실행
echo "🚀 동기화 실행 중..."
npm run sync

echo "✅ 동기화 완료!"
