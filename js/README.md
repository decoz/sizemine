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

사이즈 마인 서비스의 핵심모듈, ai서버와의 통신 및 sizmein 처리를 위한 의류, 사용자, 템플릿등 각종 정보를 입출력하고 처리하는 핵심 루틴을 제공

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

- loadTaglist() : 태그의 전체 리스트를 읽어온다.

- loadTpl(tpl_name = tpl_name) : 탬플릿을 읽어온다.

- loadTags(id) : 태그정보를 읽어온다

- createMatchScores(dgsizes, dsize, dtpl, dtags) : 상품사이즈, 신체사이즈, 템플릿, 태그를 조합해 매칭 정보를 생성
  - dgsizes : 상품 사이즈 dot
  - dsize : 신체사이즈 dot
  - dtpl : 템플릿 정보 dot
  - dtags : 태그들 정보 dot

- getType(arr = sizearr) : 신체사이즈로부터 신체 유형정보를 얻어온다.
  - arr : 신체 사이즈 array   
  ```
  0 : 삼각형
  1 : 모래시계형
  2 : 역삼각형
  3 : 직사각형
  4 : 둥근형
  5 : 마른체형
  [-1] : unknown
  ```

### variables

dlabels: labels.txt 에 저장된 신체치수, 옷치수, 체형의 설명 한글명을 포함한 dot  
- dgsizes : 상품 사이즈 dot
- dsize : 신체사이즈 dot
- dtpl : 템플릿 정보 dot
- dtags : 태그들 정보 dot
- scorearr : createMatchScore 함수로 생성된 의류 사이즈별 적합도 테이블
- tpl_name : 현재 읽어들인 상품의 템플릿명

---

## mineif

ajax 대체용 라이브러리, 페이지 로딩 없이 url 에 정보를 보내고 받기 함수를 지원

### functions
- getData(url, func) : url 로부터 데이터를 가져옴, 수신핸들러 지정가능
- promiseGet(url) : 데이터 수신의 promise 버젼
- postJson(url, jsobj) : json 정보를 POST 메소드로 전송 결과값을 리턴
- postForm(url, form) : form 정보를 POST 메소드로 전송 결과값을 리턴
- postData(url, form, func) : form 정보를 보내되 수신 핸들러를 지정

---

## [dot](:doc:dot.md)
json 을 좀 더 간결하게 사용하기 위해서 개발된 라이브러리
