# TourTrigger
2019 2학기 웹프로그래밍 수업 기말 프로젝트

## 개발환경

OS: windows 10

서버: nodejs v10.16.3

데이터베이스: mongodb

## 환경변수

### Server

- MONGODB_USERNAME
- MONGODB_PASSWORD
- MONGODB_PROTOCOL
- MONGODB_CLUSTER_URL

- GOOGLE_MAPS_API_KEY

- PORT

- FACEBOOK_APP_ID
- FACEBOOK_API_KEY

- Google_APP_ID
- Google_API_KEY

- S3_BUCKET

### Database

- MONGO_INITDB_ROOT_USERNAME
- MONGO_INITDB_ROOT_PASSWORD

---
## Docker

```bash
# DEV

## UP
$ docker compose -f docker-compose.dev.yml up --build -d

## DOWN
$ docker compose -f docker-compose.dev.yml down
```

---
