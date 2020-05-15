# MediaKeeper Bayo (바요)

## Personal media file cryptography tool - web app
* file encryption/decryption ( 암호화, 복호화)
  * AES-CTR
  * AES-GCM
  * BAYO
* Merge files ( 파일 합체 )
* Transform any file into a jpeg file ( 파일 변신 )
* World Wide Passphrase(Use any UTF-8 Chracter)( 패스워드에 한국 문자 및 전세계 다국문자 지원)
* No server data transit. (서버 무전송)
* 100% local device processing. (로컬 장치만으로 암호화 연산)
* PWA (Progressive Web App) 
* Browser file pocket. (브라우저 파일 저장소)
* Play secret mp4 video & image with browser.
* up to 2GB file size.

## website: https://mediakeeper.github.io


## mp4 video
1. encode: select mp4 video > [encrypt] > [transform] > jpeg image(mp4 video embeded).
2. keep:  On browser storage, file system, or website. 
3. decode: select mp4 embeded jpeg image file > [decrypt] > play mp4 video(on browser)

## image collection
1. encode: select multiple image files > [Merge] > [transform] > one jpeg image.
2. keep:  On browser storage, filesystem, blog or website CDN. 
3. decode: jpg image > [extract] > watch the image collection (on browser)


## application
* comic book collection
* keeping secret images
* keeping secret mp4 videos


## 기본 소개글 ( 한글 Korean )
민감한 파일 우아하게 지켜주는 
Media Keeper  Bayo ( 미디어키퍼 바요)

프로그램 설치없이 PC나 모바일 웹브라우저(크롬 권장)로 접속하여 바로 사용. 특별히 mp4 동영상, 사진/이미지 컬랙션을 티안나게  암호화/변신/보관/감상 하는용도로 개발됨. 사적인 정보파일,  민감한 사진, 동영상을 암호화하고,  원할경우 직접 선택한 JPG 이미지로 변신해서  저장가능.
1~2GB 고용량 사진 모음이나  mp4 파일도 브라우저에 저장해놓고 안전하게 보관 및 감상 가능


기능.

- 암호화 /복호화  AES 및 BAYO 자체 알고리즘
- 한글 및 전세계 유니코드 문자 암호문 지원 ( ㅁㄷㅇㅋㅍ 같은 자음 모음 단문자도 패스워드도 가능)   

- 변신기능:  파일 종류와 무관하게  JPG 이미지파일로 변신시켜줌

- 자주 사용되는 파일을 브라우저 저장소에 보관해놓고 쉽게 꺼내보기 지원


기타.

- 설치없이 모던웹브라우저로 접속해서 사용가능한 프로그레시브 웹앱 (PWA)

  바탕화면에 저장하기 선택하면 오프라인으로도 작동됨.

- 브라우저 보안정책상  원본 파일은 수정되거나 삭제되지 않고 새로운 파일이 생성됨


사용법

1. 원본 파일의 선택
   파일을 선택(1개 또는 다수 선택)해주고,  원하는 옵션 선택 후

    옵션 선택  

    -  암호화:  암호화 여부를 선택.  암호화 없이 이미지컬랙션이나  변신 기능만 사용가능
    - 합체( i파일을 여러개 선택시 자동선택됨)   사진 모음 선택시 유용함.
   - 변신:  원하는 JPG 이미지를 선택하면 JPG 이미지로 변신됨.


2. 생성된 파일의 저장

    파일시스템에 새로운 파일로 저장하거나  브라우저 스토리지에 저장할 수 있다.  또는 둘다 선택 가능.
  브라우저 스토리지에 저장된 파일을 앱 우측 상단에 storage(저장소) 버튼을 클릭하면 확인가능


3. 복호화 또는 감상

   암호화로 생성된 파일을 브라우저 저장소나 파일시스템에서 선택 후
브라우저에서 바로 감상(mp4, image, txt 파일만 바로보기 지원) 하거나, 복원하여 저장후 사용


# 샘플 예제

  mp4 동영상이나  사진 모음을   jpg 이미지로 변신시켜서 보관 및 웹을통해 배포 가능함. 실제로 아래에 링크된  bayo_cat_video.jpg  파일속에는  mp4 동영상이 암호화되어 삽입되어 있음. 

샘플 파일:  https://mediakeeper.github.io/example/bayo_cat_video.jpg 

예제 파일 테스트 방법  

  1. 첨부된 예제 jpg 이미지 파일을 다운로드
  2. 웹앱 접속 ( https://mediakeeper.github.io/  )후 

     파일 선택하기에서 해당 jpg 파일을 선택( PC에서는 끌어붙이기 지원)  
  3. 암호 입력창에  암호문 입력:   mediakeeperbayo   

     암호가 맞으면 삽입된 mp4 동영상이 해독되고  브라우저에서 바로 감상 가능


 직접, 이미지모음, mp4동영상을 선택하여 새로 만들어보시길!!!





