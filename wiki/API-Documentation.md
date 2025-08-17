# API Documentation

## 🌐 API 개요

### Base URL
```
Development: http://localhost:8000/api/v1
Production: https://api.calligraphy-coach.com/v1
```

### Authentication
모든 보호된 엔드포인트는 Bearer Token이 필요합니다.

```http
Authorization: Bearer <token>
```

## 📚 API Endpoints

### 🔐 Authentication

#### POST /auth/register
**회원가입**

Request:
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "username": "john_doe",
  "language": "ko"
}
```

Response (201):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "access_token": "jwt_token",
  "refresh_token": "refresh_token"
}
```

#### POST /auth/login
**로그인**

Request:
```json
{
  "email": "user@example.com",
  "password": "securePassword123!"
}
```

Response (200):
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### POST /auth/refresh
**토큰 갱신**

Request:
```json
{
  "refresh_token": "refresh_token"
}
```

Response (200):
```json
{
  "access_token": "new_jwt_token",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### 👤 Users

#### GET /users/profile
**프로필 조회** 🔒

Response (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "level": 3,
  "total_score": 1250,
  "created_at": "2025-01-17T10:00:00Z",
  "stats": {
    "total_analyses": 45,
    "average_score": 78.5,
    "streak_days": 7
  }
}
```

#### PATCH /users/settings
**설정 변경** 🔒

Request:
```json
{
  "username": "new_username",
  "language": "en",
  "notifications": {
    "email": true,
    "push": false
  }
}
```

Response (200):
```json
{
  "message": "Settings updated successfully",
  "updated_fields": ["username", "language", "notifications"]
}
```

### 📝 Analysis

#### POST /analysis/analyze
**이미지 분석 요청** 🔒

Request:
```json
{
  "image": "base64_encoded_image",
  "type": "korean",  // korean | chinese
  "character": "한",
  "mode": "practice", // practice | test
  "metadata": {
    "device": "mobile",
    "app_version": "1.0.0"
  }
}
```

Response (202):
```json
{
  "analysis_id": "uuid",
  "status": "processing",
  "estimated_time": 3,
  "message": "Analysis started"
}
```

#### GET /analysis/{analysis_id}
**분석 결과 조회** 🔒

Response (200):
```json
{
  "id": "uuid",
  "status": "completed",
  "score": 85.5,
  "character": "한",
  "feedback": {
    "overall": "좋은 필력입니다!",
    "strengths": [
      "획의 균형이 좋습니다",
      "전체적인 구조가 안정적입니다"
    ],
    "improvements": [
      "ㅎ의 세로획을 더 곧게 써보세요",
      "ㅏ의 간격을 조금 더 넓혀보세요"
    ],
    "stroke_analysis": [
      {
        "stroke_number": 1,
        "score": 90,
        "feedback": "시작점이 정확합니다"
      }
    ]
  },
  "created_at": "2025-01-17T10:00:00Z"
}
```

#### GET /analysis/history
**분석 이력 조회** 🔒

Query Parameters:
- `page`: 페이지 번호 (기본: 1)
- `limit`: 페이지당 항목 수 (기본: 20)
- `from_date`: 시작 날짜
- `to_date`: 종료 날짜

Response (200):
```json
{
  "total": 145,
  "page": 1,
  "limit": 20,
  "data": [
    {
      "id": "uuid",
      "character": "한",
      "score": 85.5,
      "created_at": "2025-01-17T10:00:00Z"
    }
  ]
}
```

### 📖 Learning

#### GET /learning/lessons
**레슨 목록 조회** 🔒

Query Parameters:
- `level`: 난이도 (1-5)
- `type`: korean | chinese
- `category`: basic | intermediate | advanced

Response (200):
```json
{
  "lessons": [
    {
      "id": "uuid",
      "title": "기초 한글 자음",
      "description": "ㄱ, ㄴ, ㄷ 쓰기 연습",
      "level": 1,
      "duration": 15,
      "completed": false,
      "locked": false
    }
  ]
}
```

#### GET /learning/lesson/{lesson_id}
**레슨 상세 조회** 🔒

Response (200):
```json
{
  "id": "uuid",
  "title": "기초 한글 자음",
  "description": "ㄱ, ㄴ, ㄷ 쓰기 연습",
  "level": 1,
  "content": {
    "introduction": "...",
    "characters": ["ㄱ", "ㄴ", "ㄷ"],
    "exercises": [
      {
        "type": "trace",
        "character": "ㄱ",
        "guide_image": "url",
        "stroke_order": [...]
      }
    ]
  }
}
```

#### POST /learning/progress
**진도 업데이트** 🔒

Request:
```json
{
  "lesson_id": "uuid",
  "completed": true,
  "score": 92,
  "time_spent": 720
}
```

Response (200):
```json
{
  "message": "Progress updated",
  "new_level": 2,
  "unlocked_lessons": ["uuid1", "uuid2"],
  "achievement": {
    "name": "첫 레슨 완료!",
    "description": "첫 번째 레슨을 성공적으로 완료했습니다"
  }
}
```

### 💬 Feedback

#### POST /feedback/generate
**AI 피드백 생성** 🔒

Request:
```json
{
  "analysis_id": "uuid",
  "type": "detailed", // quick | detailed
  "language": "ko"
}
```

Response (200):
```json
{
  "feedback_id": "uuid",
  "analysis_id": "uuid",
  "content": {
    "summary": "전체적으로 좋은 진전을 보이고 있습니다",
    "detailed": {
      "structure": "...",
      "balance": "...",
      "strokes": "..."
    },
    "suggestions": [
      "매일 10분씩 연습하세요",
      "획순에 더 주의를 기울이세요"
    ],
    "next_steps": [
      {
        "lesson_id": "uuid",
        "title": "획순 집중 연습"
      }
    ]
  }
}
```

### 🏆 Achievements

#### GET /achievements
**업적 목록 조회** 🔒

Response (200):
```json
{
  "total_points": 2500,
  "level": 5,
  "achievements": [
    {
      "id": "uuid",
      "name": "서예 입문자",
      "description": "첫 번째 문자 완성",
      "icon": "🎯",
      "earned_at": "2025-01-15T10:00:00Z",
      "points": 100
    }
  ],
  "in_progress": [
    {
      "id": "uuid",
      "name": "연속 7일",
      "description": "7일 연속 연습하기",
      "progress": 5,
      "total": 7
    }
  ]
}
```

## 🔄 WebSocket API

### Connection
```javascript
const socket = io('ws://localhost:8000', {
  auth: {
    token: 'jwt_token'
  }
});
```

### Events

#### Client → Server

**stroke:start**
```javascript
socket.emit('stroke:start', {
  x: 100,
  y: 150,
  pressure: 0.8,
  timestamp: Date.now()
});
```

**stroke:move**
```javascript
socket.emit('stroke:move', {
  points: [
    { x: 101, y: 151, pressure: 0.82 },
    { x: 102, y: 152, pressure: 0.85 }
  ],
  timestamp: Date.now()
});
```

**stroke:end**
```javascript
socket.emit('stroke:end', {
  timestamp: Date.now()
});
```

#### Server → Client

**feedback:live**
```javascript
socket.on('feedback:live', (data) => {
  // data: {
  //   type: 'warning' | 'success' | 'error',
  //   message: '획순이 잘못되었습니다',
  //   correction: { ... }
  // }
});
```

**analysis:progress**
```javascript
socket.on('analysis:progress', (data) => {
  // data: {
  //   stage: 'preprocessing' | 'analyzing' | 'generating',
  //   progress: 0.75
  // }
});
```

## 🔴 Error Responses

### Error Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {
      "field": "Additional information"
    }
  }
}
```

### Common Error Codes
| Code | Status | Description |
|------|--------|-------------|
| AUTH_REQUIRED | 401 | 인증 필요 |
| INVALID_TOKEN | 401 | 유효하지 않은 토큰 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스를 찾을 수 없음 |
| VALIDATION_ERROR | 422 | 입력값 검증 실패 |
| RATE_LIMIT | 429 | 요청 제한 초과 |
| SERVER_ERROR | 500 | 서버 오류 |

## 📊 Rate Limiting

### Limits
- **Anonymous**: 10 requests/minute
- **Authenticated**: 100 requests/minute
- **Premium**: 1000 requests/minute

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642350000
```

## 🧪 Testing

### Postman Collection
[Download Postman Collection](https://api.calligraphy-coach.com/postman)

### cURL Examples

**Login**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Get Profile**:
```bash
curl -X GET http://localhost:8000/api/v1/users/profile \
  -H "Authorization: Bearer <token>"
```

---
*API 문서는 지속적으로 업데이트됩니다. 최신 버전은 항상 이 페이지를 참조하세요.*