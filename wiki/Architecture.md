# Architecture

## 🏗️ 시스템 아키텍처 개요

### 전체 구조
```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
├─────────────────────┬───────────────────────────────────┤
│   Mobile App (RN)   │      Web Dashboard (Next.js)      │
└─────────────────────┴───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                      API Gateway                         │
├─────────────────────┬───────────────────────────────────┤
│   REST API (FastAPI)│      WebSocket Server              │
└─────────────────────┴───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                    Service Layer                         │
├──────────┬──────────┬──────────┬───────────────────────┤
│  Auth    │ Analysis │ Learning │    Feedback           │
└──────────┴──────────┴──────────┴───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                      AI Layer                            │
├──────────┬──────────┬──────────┬───────────────────────┤
│  Ollama  │   CV     │  NLP     │    Custom Models      │
└──────────┴──────────┴──────────┴───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                     Data Layer                           │
├──────────┬──────────┬──────────┬───────────────────────┤
│PostgreSQL│  Redis   │   S3     │    Vector DB          │
└──────────┴──────────┴──────────┴───────────────────────┘
```

## 🔧 기술 스택 상세

### Frontend

#### Mobile App
- **Framework**: React Native + Expo
- **State Management**: Zustand
- **Navigation**: React Navigation
- **UI Components**: Custom Design System
- **Offline Support**: AsyncStorage + Queue

#### Web Dashboard
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State**: Zustand + React Query
- **Charts**: Recharts
- **Auth**: NextAuth.js

### Backend

#### API Server
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Validation**: Pydantic
- **Auth**: JWT + OAuth2
- **Queue**: Celery + Redis

#### WebSocket Server
- **Engine**: Socket.io
- **Protocol**: WebSocket + fallback
- **Auth**: Token-based
- **Scaling**: Redis Adapter

### AI/ML

#### Ollama Integration
```python
# 모델 구성
models = {
    "text": "mixtral:8x7b",
    "vision": "llava:13b",
    "embedding": "nomic-embed-text"
}

# API 엔드포인트
OLLAMA_API = "http://localhost:11434"
```

#### Computer Vision
- **Library**: OpenCV + MediaPipe
- **Tasks**: 
  - Stroke detection
  - Character recognition
  - Posture analysis
  - Real-time tracking

#### Custom Models
- **Framework**: PyTorch
- **Serving**: TorchServe
- **Models**:
  - CalligraphyNet (품질 평가)
  - StrokeOrderNet (획순 검증)
  - PostureNet (자세 분석)

### Infrastructure

#### Container Orchestration
```yaml
# docker-compose.yml
services:
  api:
    image: calligraphy-api:latest
    ports: ["8000:8000"]
    
  ai:
    image: calligraphy-ai:latest
    ports: ["8001:8001"]
    
  postgres:
    image: postgres:15
    volumes: ["./data/postgres:/var/lib/postgresql/data"]
    
  redis:
    image: redis:7-alpine
    
  ollama:
    image: ollama/ollama:latest
    volumes: ["./models:/root/.ollama"]
```

#### Monitoring
- **Metrics**: Prometheus + Grafana
- **Logging**: ELK Stack
- **Tracing**: Jaeger
- **Alerts**: AlertManager

## 📡 API 설계

### RESTful Endpoints

```
/api/v1/
├── auth/
│   ├── register     POST   회원가입
│   ├── login        POST   로그인
│   └── refresh      POST   토큰 갱신
├── users/
│   ├── profile      GET    프로필 조회
│   └── settings     PATCH  설정 변경
├── analysis/
│   ├── analyze      POST   이미지 분석
│   └── {id}         GET    결과 조회
├── learning/
│   ├── lessons      GET    레슨 목록
│   └── progress     GET    진도 조회
└── feedback/
    ├── generate     POST   피드백 생성
    └── history      GET    이력 조회
```

### WebSocket Events

```javascript
// Client → Server
socket.emit('stroke:start', { x, y, pressure })
socket.emit('stroke:move', { points: [...] })
socket.emit('stroke:end', { })

// Server → Client
socket.on('feedback:live', { type, message })
socket.on('analysis:result', { score, details })
socket.on('correction:suggest', { points: [...] })
```

## 🗄️ 데이터베이스 설계

### ERD (주요 테이블)

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    username VARCHAR(100),
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP
);

-- Analyses
CREATE TABLE analyses (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    image_url TEXT,
    score FLOAT,
    feedback JSONB,
    created_at TIMESTAMP
);

-- Learning Progress
CREATE TABLE progress (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    lesson_id UUID,
    completed_at TIMESTAMP,
    score FLOAT
);
```

### Redis 사용 용도
- Session storage
- Rate limiting
- Cache layer
- Real-time queue
- WebSocket state

## 🔐 보안 아키텍처

### Authentication Flow
```
1. Client → API: Login request
2. API → DB: Verify credentials
3. API → Client: JWT token
4. Client → API: Request + Bearer token
5. API: Validate token
6. API → Client: Protected resource
```

### Security Measures
- **Encryption**: TLS 1.3
- **Auth**: JWT + Refresh tokens
- **Rate Limiting**: 100 req/min
- **Input Validation**: Pydantic
- **SQL Injection**: Parameterized queries
- **XSS Prevention**: Content Security Policy
- **CORS**: Whitelist origins

## 🚀 배포 아키텍처

### Development
```bash
# Local setup
docker-compose up -d
npm run dev
python manage.py runserver
```

### Production
```
┌──────────────┐
│   CloudFlare │ CDN
└──────┬───────┘
       │
┌──────▼───────┐
│  Load Balancer│
└──────┬───────┘
       │
┌──────▼───────────────────┐
│   API Servers (3x)        │
└───────────────────────────┘
       │
┌──────▼───────────────────┐
│   PostgreSQL (Primary)    │
│   + Read Replicas (2x)    │
└───────────────────────────┘
```

## 📊 성능 최적화

### Frontend
- Code splitting
- Lazy loading
- Image optimization (WebP)
- Service Worker caching
- Bundle size < 200KB

### Backend
- Database indexing
- Query optimization
- Redis caching
- Connection pooling
- Async processing

### AI
- Model quantization
- Batch processing
- GPU acceleration
- Edge caching
- Response < 500ms

## 🔄 확장성 고려사항

### Horizontal Scaling
- Stateless API servers
- Database read replicas
- Redis cluster
- Load balancing

### Vertical Scaling
- GPU servers for AI
- Memory optimization
- CPU affinity
- Storage tiering

### Future Considerations
- Microservices migration
- Kubernetes deployment
- Multi-region support
- Edge computing

---
*아키텍처는 프로젝트 진행에 따라 진화합니다.*