# Sizemine JS Folder

대부분의 js 파일은 class 형태로 지원되는 커스텀 태그지만 다음은 예외


## 핵심 모듈

- sizmine : 사이즈마인 관련 클래스, 변수, 라이브러리
- mineif : 연결 전용 라이브러리
- dot : json 과 호환 자료저장을 위한 트리구조 라이브러리


## 커스텀 태그 모듈

- dragupload : 이미지 드래그 업로드 및 미리보기를 지원하는 태그
- dbselect : db 에서 읽어온 항목을 select 형태로 지원 태그
- dpopup : 팝업창 지원 태그
- dview : dot 기반 데이터를 html 객체와 연동시키는 클래스
- dtable :  dot 기반 데이터를 테이블 형태로 표시하는 클래스
- imgmarker : 이미지에 여러 항목 텍스트틀 삽입해 표시하는 클래스 ,의류나 신체의 치수표현에 사용
- selector : 엘리먼트들을 클릭하여 선택가능한 항목으로 변형
- popsel : 트리를 지원하는 팝업 메뉴

## dot 기반 라이브러리 리스트
dpopup, dview, dtable



# 주요 모듈 정보
---
## sizemine

### functions

-  upload(file, profile, onupload) : 신체 이미지를 업로드
  - file : 이미지 파일경로
  - profile : json 기반 유저 정보
    ```
    sex : 0 = 여성, 1 = 남성
    tall : 신장
    weight : 체중
    age : 연령
    ```
  - onupload 업로드 완료 이벤트함수   
- loadUser(uid, vid)
  - uid : 사용자 id
  - vid : 벤더 id
- loadGood(gid, vid, withtpl = false, withtag = false) : 상품정보를 읽어들인다
  - gid : 상품 id
  - vid : 벤더 id
  - withtpl : 상품 템플릿 정보를 함께 로드
  - withtag : 상품 태그정보를 함께 로드
- loadTaglist()
- loadTpl(tpl_name = tpl_name)
- estimate_e
- sortScores(scorearr)
