## Cafe24 module

### 주요파일
- ../route_cafe24.js : cafe24 관련 요청을 처리하는 라우팅
- cafe24.js : cafe24에 관련된 통신 및 기본 인증을 담당하는 모듈
- remote/ : cafe24에 삽입하는 코드들
  - product_detail.js : 상품 세부보기에 삽입되는 코드


---
### ../route_cafe24

https://sizemine.co.kr/app/cafe24 경로를 처리하는 라우팅 모듈

**cafe24 필수 경로**
- /request : 설치시 접속되는 url ,  토큰발급(/rediret)을 받아 스크립트 설치
- /redicret : reqeust 에서 받은 cid, ckey를 이용해 억세스 토큰을 발급받는 페이지
- /refresh : 토큰을 갱신하는 페이지
- /remote : cafe24 설치용 js 파일을 전송하는 라우터

**기타경로**
- /scriptList : 해당 쇼핑몰에 설치된 스크립트를 확인하기 위한 디버깅 url


---
### cafe24.js

cafe24 모듈은 서버스크립트에서 작동하며 인증, 스크립트 인증 해쉬등등의 주요정보를 모두 관리, 대부분 라우터(route_cafe24)에서 호출됨

**property**
- mallid : 앱 설치 해당 쇼핑몰
- cid : 앱의 고유아이디
- ckey : 앱의 인증키
- auth_id : cafe24 api전송을 보낼때 사용하는 cid, ckey의 조합
- api_version : 사용하는 cafe24 버젼( 요청시 필요 )
- token : 억세스 토큰
- refresh_token : 새토큰을 발급받을때 사용되는 토큰
- scripts : remote 폴더에 존재하는 스크립와 해쉬값 정보



**method**
- constructor : 생성시 load_scripts
- initHtml :  앱이 등록될때 작동하는 페이지를 생성하는 메소드
  등록된 앱의 코드를 받아서 저장하고 억세스 토큰을 요청하는 기능을 함
- getScriptList : 대상 쇼핑몰에 현재 설치된 스크립트 리스트를 가져옴
- install() : 해당 쇼핑몰에 스크립트를 설치  
- refreshToken() : 토큰이 만료된 경우 토큰을 새로 받아옴
- getToken() : 토큰을 신청하고 결과를 저장

---
### remote/product_detail.js

세부 상품보기에 삽입되는 스크립트로서 다음 기능을 지원

- 등록된 상품의 경우 sizemine 으로 이동버튼 삽입
- 현재 사용자가 쇼핑몰의 관리자일 경우 상품 등록 및 수정 버튼 삽입
- 위의 버튼들을 클릭시 상품 사이즈 매칭(sizemine) 및 상품등록 및 수정(goodmine) 이 팝업됨
