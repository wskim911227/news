#!/bin/sh
# Git hooks 설치 (최초 1회 실행)
cd "$(dirname "$0")/.." || exit 1
git config core.hooksPath .githooks
chmod +x .githooks/post-commit
echo "✅ 자동 푸시 hook 설치 완료 (커밋 시 origin으로 자동 push)"
