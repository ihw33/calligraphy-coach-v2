# Figma API 테스트 스크립트 실행 가이드

## 1. 환경 변수 설정 (보안 유지)

터미널에서:
```bash
export FIGMA_TOKEN="여기에_토큰_입력"
export FIGMA_FILE_KEY="여기에_파일키_입력"
```

## 2. 테스트 실행

```bash
cd /Users/m4_macbook/Projects/calligraphy-coach-v2
node -e "
const token = process.env.FIGMA_TOKEN;
const fileKey = process.env.FIGMA_FILE_KEY;

if (!token || !fileKey) {
  console.log('환경 변수를 설정해주세요!');
  process.exit(1);
}

fetch(\`https://api.figma.com/v1/files/\${fileKey}\`, {
  headers: { 'X-Figma-Token': token }
})
.then(r => r.json())
.then(data => {
  console.log('Figma 파일 이름:', data.name);
  console.log('버튼 찾는 중...');
  
  const findComponents = (node, components = []) => {
    if (node.type === 'COMPONENT' || (node.name && node.name.includes('Button'))) {
      components.push({
        name: node.name,
        type: node.type,
        size: node.absoluteBoundingBox,
        fills: node.fills,
        effects: node.effects
      });
    }
    if (node.children) {
      node.children.forEach(child => findComponents(child, components));
    }
    return components;
  };
  
  const components = findComponents(data.document);
  console.log('찾은 컴포넌트:', components);
})
.catch(err => console.error('오류:', err));
"
```

이 방법으로 토큰을 직접 노출하지 않고 테스트할 수 있습니다!
