# 🌤️ EC2 Deploy Test — Next.js on AWS EC2

> 기상청 API 공공 데이터를 통해 요청을 받는 시점에 따라 현재 ~ 4일 뒤의 기온과 풍속으로 체감온도를 알려주는 프로젝트입니다.

> Next.js 앱을 AWS EC2에 자동 배포하는 프로젝트입니다.  
> GitHub Actions + AWS CodeDeploy를 사용해 `main` 브랜치 push 시 자동으로 배포됩니다.

🔗 **라이브 데모:** [wchweather.duckdns.org](https://wchweather.duckdns.org/)

---

## 🛠️ 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| 언어 | TypeScript |
| 스타일 | CSS |
| 인프라 | AWS EC2, S3, CodeDeploy |
| CI/CD | GitHub Actions |
| 도메인 | DuckDNS |

---

## 📁 프로젝트 구조
```
EC2-Deploy-Test/
├── app/              # Next.js App Router 페이지 및 컴포넌트
├── appspec.yml       # AWS CodeDeploy 배포 설정 파일
├── deploy.sh         # EC2에서 실행되는 배포 스크립트
├── next.config.ts    # Next.js 설정
└── package.json      # 의존성 및 스크립트
```

---

## 🚀 배포 흐름
```
GitHub push (main 브랜치)
    ↓
GitHub Actions 실행
    ↓
빌드 파일을 AWS S3에 업로드
    ↓
AWS CodeDeploy가 EC2에 배포
    ↓
deploy.sh 실행 (서버 재시작)
    ↓
서비스 반영 완료
```

---

## 💻 로컬 개발 환경 실행

**1. 저장소 클론**
```bash
git clone https://github.com/BaeZzi813/EC2-Deploy-Test.git
cd EC2-Deploy-Test
```

**2. 의존성 설치**
```bash
npm install
```

**3. 개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---


## 📝 배포 관련 파일 설명

- **`appspec.yml`** — CodeDeploy가 배포 단계별로 어떤 스크립트를 실행할지 정의합니다.
- **`deploy.sh`** — EC2 서버에서 기존 프로세스를 종료하고 새 버전으로 앱을 실행합니다.

---
