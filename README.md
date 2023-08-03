# Sizemine 소스 및 폴더 구조 directory

사이즈마인 코드는 node.js 를 사용해 서버를 구성하며 다음의 명령으로 시작된다.

**서버구동**
```
cd /opt/www
sudo node server
```

## 주요 파일목록

- /server.js : 최상위 라우터
- /route_[기능] : 서브 경로 라우터


## 주요 디렉토리 목록

**백엔드**
- admin : admin 전용 기능
- api : 사이즈 마인 Restful API 폴더
- apps : cafe24, hyundai 등 외부 연동 앱 관련  폴더
- lib : nodejs 용 자체제작 모듈들

**프론트엔드**

프론트 엔드는 view 를 제외하면 폴더 전체를 서비스하는 static 라우터를 사용한다.
- css : css 파일들
- images : 이미지 파일들
- js : js 파일들
- views : 확장ㅇ자는 htm이지만, ejs 형식으로 렌더링
