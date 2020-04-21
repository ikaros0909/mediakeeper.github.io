/* 
 * 버전v1.0.  
 */  
var objURLs = [];   // 리셋시 메모리해제 유도용.
var oneWorker;      // 워커는 하나씩만 작동하도록함.
var con = {
    devInfo: document.querySelector('.device-info'),
    bannerView: document.querySelector('.banner-view'),
    bayoAppTitle: document.querySelector('.bayo-symbol-title'),
    navStorage: document.querySelector('.nav-container .storage'),
    // navHelp: document.querySelector('.nav-container .help'),
    ui: document.querySelector('.ui-container'),
    mainFileField: document.querySelector('.main.file-field'),
            // ux: document.querySelector('.user-choice'),
            // mainHelp: document.querySelector('.main-help'),
                langBtn: document.querySelector('.lang-btn'),
                mainModeInfo: document.querySelector('.main-mode-info'),
                mainModeInfoKr: document.querySelector('.main-mode-info .kr'),
                mainModeInfoEn: document.querySelector('.main-mode-info .en'), 
                fileModeInfo: document.querySelector('.file-mode-info'), 
                fileModeInfoKr: document.querySelector('.file-mode-info .kr'), 
                fileModeInfoEn: document.querySelector('.file-mode-info .en'),
            storageView: document.querySelector('.storage-view'),
                storageLoader: document.querySelector('.storage-loader'),
                storageList: document.querySelector('.storage-filelist'),
                storageAddButton: document.querySelector('.storage-add-btn'),
                storageDeleteButton: document.querySelector('.storage-delete-btn'),
            filebox: document.querySelector('.static-filebox'),
            options: document.querySelector('.option-select'),
                option_jpgmask: document.querySelector('.option-jpgmask'),
                option_encryption: document.querySelector('.option-encryption'), 
                jpgmask : document.querySelector('.jpgmask-container'),
                jpg_selected : document.querySelector('.jpg-selected'),
                jpg_list : document.querySelector('.jpg-list'),
                jpg_local : document.querySelector('.jpg-local'),
                encryptionModeSelector: document.querySelector('.encrypt-mode-radio'),
                pwField: document.querySelector('.enc-pwinput'),
                pwInput: document.querySelector('#pwInput'),
                pwLabel: document.querySelector('.enc-pwinput label'),
                encButton: document.querySelector('.encrypt'),
                cltButton: document.querySelector('.collect'),
            dec: document.querySelector('.dec'),
                decButton: document.querySelector('.decrypt'),
                pwDecInput: document.querySelector('#pwDecInput'),
                pwDecLabel: document.querySelector('.dec label'),
            processor: document.querySelector('.processor'),
                progressBar: document.querySelector(".determinate"),
                processorMsg: document.querySelector('.processor-msg'),
                // processorInfo: document.querySelector('.processor .info'),
                processResult: document.querySelector('.process-result'),
                processSaveButton: document.querySelector('.save'),
                
                processSaveBrowserButton: document.querySelector('.processor .save-browser'),
                processSaveBrowserInfo: document.querySelector('.processor .save-browser-info'),

                processFilenameInput: document.getElementById('process-filename-input'),
            // help: document.querySelector('.help-container'),
            //     help1: document.querySelector('.help1-container'),
            //     help2: document.querySelector('.help2-container'),
            view: document.getElementById('view-container'),
            dropArea: document.querySelector('.drop-area'),
            viewerToggleSaveButton: document.getElementById('viewer-toggle-save-button'),
            topButton: document.getElementById("topButton") 
        };
    con.show = function(item){
            if( arguments.length >= 1 && typeof(item) == 'string'){
                var itemArr = [];
                for(var i=0; i< arguments.length ;i++) itemArr.push(arguments[i] );
                itemArr.forEach( function(itemStr){
                    if(con[itemStr] ) con[itemStr].classList.remove('hide');
                    else console.log( itemStr +'이 con에 없네');  });
            }else{
                console.log( 'hide 함수는 문자열 인수만 받음');                      
            }    
        }
    con.hide = function( item ){
            if( arguments.length >= 1 && typeof(item) == 'string'){
                var itemArr = [];
                for(var i=0; i< arguments.length ;i++) itemArr.push(arguments[i] );
                itemArr.forEach( function(itemStr){
                    if(con[itemStr] ) con[itemStr].classList.add('hide');
                    else console.log( itemStr +'이 con에 없네');  });
            }else{
                console.log( 'hide 함수는 문자열 인수만 받음');                      
            }
        }

var bayoCryptoUIMode = 'init';//, jpgBufferDefault;
var setup = { isEncrypt: false, encryptMode: 1 , jpgMask: false , jpgMaskLoaded: false, showSaveButton: true , showHelp: false , langSet: ''};
// encryptMode 기본값은 radio 버튼 value 1(AES-CTR 모드)로 checked 되어있음.  이후 change 이벤트로 변경됨.

 //facebot 표정 제어
 var heads = document.querySelectorAll('.head');
 function setFaceBot(status){
     heads[0].classList.remove('wrong','yes','idle','pass');
    //  heads[1].classList.remove('wrong','yes','idle','pass');
     if(status) heads[0].classList.add(status);
    //  if(status) heads[1].classList.add(status);
 }

 function loadMainBanner(){
    fetchBannerImage('banners/unicef_02_event_337X80.png', con.bannerView , 'https://www.unicef.or.kr/event/unicef-hope-2/?trackcode=18hope_hb2');
 }

function changeUIMode(mode){
    removeChildren(con.view);
    if( mode == UIselectedFileType.normal || mode == UIselectedFileType.collection){ 
        //파일 재선택시 옵션 초기화
        if (con.option_jpgmask.checked) con.option_jpgmask.click();
        if (con.option_encryption.checked) con.option_encryption.click();    
    }
    if(bayoCryptoUIMode == mode){
        // console.log('changeUIMode: same mode: ' + mode);
        scrollTo(0);
        return;
    } 
    // console.log('changeUIMode: from: ' + bayoCryptoUIMode + '-> to: ' + mode);
    bayoCryptoUIMode = mode;
    var mainModeInfoKr, mainModeInfoEn,
        fileModeInfoKr, fileModeInfoEn;

    switch(mode){
        case 'main': 
            con.show('ui','mainFileField','mainModeInfo' );
            con.hide('storageView','filebox','options','dec','processor','view');
            scrollTo(0);    
            // loadMainBanner();
            mainModeInfoKr = 
            "<li>MP4 동영상, 이미지 모음 파일보안 웹앱</li>\
            <li>암호화, 합체, 변신, 브라우저 저장 감상!</li>\
            <li>[생성] 일반 파일 한개나 여러개를 다중 선택</li> \
            <li>[복원] 복원 및 감상은 bayo 파일 1개만 선택</li>";
            mainModeInfoEn = "<li>encrypt, combine, transform, store at once.</li> \
            <li>[create] Select one or multiple files to make new bayo file.</li> \
            <li>[recover] Select one bayo file.</li>";
            // setFaceBot('idle');
            break;
        case 'storageView': 
            con.show('ui','storageView','mainModeInfo');
            con.hide('mainFileField','filebox','options','dec','processor','view');
            con.storageView.querySelector('.storage-close-btn').onclick = function(){
                changeUIMode('main');
            }
            // con.storageView.querySelector('.storage-add-btn')
            con.storageAddButton.onclick = function(){
                con.storageView.querySelector('input').click();
            }
            // con.storageView.querySelector('.storage-delete-btn')
            con.storageDeleteButton.onclick = function(){
                removeStorageItems( storageItemCheckStatus );
            }
            mainModeInfoKr = "브라우저 저장소에 파일을 저장해두고 로딩 할수 있습니다.";
            mainModeInfoEn = "save or load file from browser storage.";
            loadStorageList();  //scrollTo 0 포함
            break;
        case UIselectedFileType.collection:
        case UIselectedFileType.normal:
            fileModeInfoKr = "새로운 bayo 파일을 만듭니다. 암호화, JPG 변신 여부를 선택하세요! ";
            fileModeInfoEn = "Select the option(s) you want. enryption, transform.";
            con.hide('dec','view','mainModeInfo');
            con.show('options');
            break;
        case UIselectedFileType.normal_bayo:
            fileModeInfoKr = "암호 없는 bayo 파일입니다. 자동 복원됩니다.";
            fileModeInfoEn = "non-encrypted bayo file. it will be extracted automatically.";
            con.hide('options','dec','view','mainModeInfo');
            break;
        case UIselectedFileType.encrypted_bayo:
            fileModeInfoKr = "암호화된 bayo 파일입니다. 패스워드를 입력하여 복호화를 시도하세요!";
            fileModeInfoEn = "encrypted bayo file. You have to input the correct file password to decrypt original files.";
            con.hide('options','view','mainModeInfo');
            con.show('dec');
            break;

      default: 
    }

    //내용문장은 여기서 세팅해주고
    con.mainModeInfoKr.innerHTML = mainModeInfoKr;
    con.mainModeInfoEn.innerHTML = mainModeInfoEn;
    con.fileModeInfoKr.innerHTML = fileModeInfoKr;
    con.fileModeInfoEn.innerHTML = fileModeInfoEn;
    
    con.hide('viewerToggleSaveButton');
}


function removeChildren( parent){ //모든 children 제거
    if( typeof( parent) == 'string' ){
      var parentContainer = document.querySelector(parent);
      if(parentContainer) while( parentContainer.children.length > 0) parentContainer.removeChild( parentContainer.children[0] );
    }else if( typeof( parent) == 'object' ){
        while( parent.children.length > 0) parent.removeChild( parent.children[0] );    
    }else{
        console.log('Unknown type')
    }
}


con.option_jpgmask.addEventListener('change', function(e){ 
    setup.jpgMask = this.checked;
    if( setup.jpgMask ){
        con.show('jpgmask');
        if(!setup.jpgMaskLoaded ){
            fetchServerImageList();  //옵션 사용시에만 로딩. good.
            setup.jpgMaskLoaded = true; //한번만 로딩.
        }
    }else{
        con.jpgmask.classList.add('hide');
    }
});
con.option_encryption.addEventListener('change', function(e){ 
    setup.isEncrypt = this.checked;
    if( setup.isEncrypt ){
        con.show('encryptionModeSelector', 'pwField');
        con.hide('cltButton');
        con.pwInput.focus();
        con.pwLabel.textContent = "Input password! ";
        con.pwInput.value = "";
    }else{ //숨기기
        con.hide(  'encryptionModeSelector', 'pwField');
        con.show('cltButton');

    }
});

con.encryptionModeSelector.addEventListener('change', function(e){
    setup.encryptMode = parseInt(e.target.value) ;
    console.log('encryptionMode changed: '+ setup.encryptMode );
});

// function toggleHelpButton(req){
//     if(req == undefined)setup.showHelp = !setup.showHelp; 
//         else setup.showHelp = req;
//     if( setup.showHelp){
//         con.mainHelp.classList.remove('hide');
//         scrollTo( con.mainHelp );
//     }else{
//         con.mainHelp.classList.add('hide');
//     }
// }
function toggleViewerSaveButtons(req){
    if(req == undefined) setup.showSaveButton = !setup.showSaveButton; 
        else setup.showSaveButton = req;
    if(setup.showSaveButton){
        con.view.classList.remove('hide-button-area');  // style class 방식 버튼 감추기.  height을 0으로
    }else{
        con.view.classList.add('hide-button-area');
    }
}

function onLocalJPGFileSelected( files ){ // JPG Mask local 선택
    if( files.length == 0) return;
    for(var i=0; i< files.length ;i++){
        jpgProcessor( files[i] );
    }
}
function imageLoadChecker( file ){
    return new Promise( function(resolve, reject ){
        var img = document.createElement('img');
        img.onload = function(e){  resolve( img ); }
        img.onerror = function(e){ reject(); }
        img.src = URL.createObjectURL(file );
    });
}
function jpgHeaderChecker(file){ //reader 읽어서 soi eoi 검토
    return new Promise( function(resolve, reject ){
        var reader = new FileReader();
        reader.onload = function(){
            var dv =  new DataView( reader.result );
            // if( dv.getUint16(0) == 0xffd8 && dv.getUint16( dv.byteLength -2 ) == 0xffd9 ) resolve( reader.result );
            // eoi 확인은 위치가 고정되지 않아서 전체파일을 해석해야하고  imageloader에서 일단 검증되므로 생략. 
            if( dv.getUint16(0) == 0xffd8 ) resolve( reader.result );
            else reject(); 
        }
        reader.onerror = function(){ reject();  }
        reader.readAsArrayBuffer(file);
    });
}
function jpgProcessor(file){
    imageLoadChecker(file).then(function(img){
        jpgHeaderChecker(file).then(function(buf){
            var index = jpgBuffers.push(buf);
            img.alt = index - 1;
            img.classList.add('responsive-img');
            while(con.jpg_selected.children.length ) con.jpg_list.appendChild( con.jpg_selected.children[0] );
            con.jpg_selected.appendChild(img);
            img.onclick = function(e){
                while(con.jpg_selected.children.length ) con.jpg_list.appendChild( con.jpg_selected.children[0] );
                con.jpg_selected.appendChild( img);
           }
        }).catch(function(err){
            console.log('not a compatible jpeg image');
            con.jpg_local.querySelector('input[type=file]').value = "";  //선택 파일 정보 리셋.
            con.jpg_local.querySelector('.file-path').value ='Select jpg, jfif, jpe, jpeg image only';
        });
    }).catch(function(err){
        console.log('not a image');
        con.jpg_local.querySelector('input[type=file]').value = "";  //선택 파일 정보 리셋.
        con.jpg_local.querySelector('.file-path').value ='please choose JPG image!';
    });

}

// JPG Mask 서버 제공 이미지 선택
var jpgBuffers = [];
function fetchServerImageList(){
  var jpgList = [ 'bernard-hermant-665508-unsplash.jpg', 'justin-lim-500765-unsplash.jpg', 'michael-prewett-126900-unsplash.jpg', 'palesa-717372-unsplash.jpg' ];
  jpgList.forEach( function(url ){
      fetchImage( 'jpgMaskSample/'+url , con.jpg_list );    
  })    
}

async function fetchImage( url , container ){
  container.appendChild( await fetch( url  ).then(function(response) {
                  response.onprogress = function(e){
                    //   console.log( e );
                  };
                  if(response.status == 200){
                      return response.arrayBuffer();  
                  }else{
                      return false;
                  }
              })
              .then(function(buf ){
                  if(buf){
                      var img = document.createElement('img');
                      var index =  jpgBuffers.push( buf );
                      var myBlob = new Blob( [buf]);
                      img.src = URL.createObjectURL(myBlob);
                      img.alt = index - 1;
                      img.classList.add('responsive-img');
                      img.onclick = function(e){
                        while(con.jpg_selected.children.length ) con.jpg_list.appendChild( con.jpg_selected.children[0] );
                        con.jpg_selected.appendChild( img);
                      }
                      return img;
                  } else{
                      var fail = document.createElement('div');
                      fail.innerHTML = "NO IMAGE<br>filename: " + url;   
                      return fail;
                  }
              })
          ); //append image Child.
          if( con.jpg_selected.children.length == 0) con.jpg_selected.appendChild( con.jpg_list.children[0] );
    }

function fetchBannerImage( imgURL , container , linkURL ){
   fetch( imgURL  ).then(function(response) {
                  response.onprogress = function(e){
                    //   console.log( e );
                  };
                  if(response.status == 200){
                      return response.blob();  

                  }else{
                      return false;
                  }
              }).then(function(blob ){
                    var img = container.querySelector('img');
                    const objectURL = URL.createObjectURL(blob);
                    img.src = objectURL;
                    container.querySelector('a').href = linkURL;
              }).catch( function (err){
                console.log('error : banner loading.');
              })
        
    }



/* 
 * 인수: 항상 fileList 전달됨
 * file 기본정보 해석후 filebox로 보여주고 파일 타입별 후작업은 fileProcessor에게 넘긴다.
 */  
var UIselectedFileType = { collection:'collection', normal:'normal', normal_bayo:'normal_bayo', encrypted_bayo:'encrypted_bayo'};

function onFileSelected(oFiles ) {
    // toggleHelpButton(false);
    if( objURLs.length >= 1){    //기존 objectURL 제거
        while( objURLs.length >= 1) URL.revokeObjectURL(objURLs.shift() );
    }
    if(oneWorker) oneWorker.terminate();
    while( con.view.children.length > 0){    //기존 view children 지우기.  view는 한개로 가정.
        con.view.removeChild( con.view.children[0] );
    }
    con.hide('options','dec','processor','processResult','processSaveButton','processSaveBrowserButton','processSaveBrowserInfo','view');
    con.show('filebox','fileModeInfo');


    //기본 파일박스 정보 설정.
    var theFile,                    
        nBytes = 0,
        nFiles = 0;
        nFiles = oFiles.length;
        for (var n = 0; n < nFiles; n++) {
            nBytes += oFiles[n].size;
        }   
        var fileSizeToShow;// = nBytes + " bytes";
        for (var aMultiples = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            fileSizeToShow = nApprox.toFixed(1) + " " + aMultiples[nMultiple] + " (" + numberWithCommas(nBytes) + " bytes)";
        }
        if(fileSizeToShow == undefined ) fileSizeToShow = nBytes + ' Bytes';  //1KB 미만크기
        theFile = oFiles[0];  
        // var fileIcon = afileBox.querySelector('.icon');
        var fileNameField = con.filebox.querySelector('.fileName');
        // var fileNumberField = con.filebox.querySelector('.fileNumber');
        // var fileSizeField = con.filebox.querySelector('.fileSize');
        var fileNumSizeField = con.filebox.querySelector('.fileNumSize');
        var fileTypeField = con.filebox.querySelector('.fileType');
            // fileNumberField.textContent = nFiles.toString()+"개의 파일 선택됨";
            if(nFiles > 1){
                fileNameField.textContent = 'name: ' + theFile.name + '... ( total '+ nFiles.toString()+ 'files )';
                fileNumSizeField.innerHTML = 'total size: ' +fileSizeToShow ;
            }else{  
                fileNameField.textContent = 'name: ' + theFile.name ;
                fileNumSizeField.innerHTML = 'size: ' + fileSizeToShow;
            }
        var icon = document.querySelector('.static-filebox .material-icons'); 
        var sampleFileType = theFile.type.split('/')[0] ;
        if(  sampleFileType == 'image'){
            icon.textContent = 'image';
        }else if(sampleFileType == 'text'){
            icon.textContent = 'description';
        }else if(sampleFileType == 'video'){
            icon.textContent = 'play_arrow';
        }else{
            icon.textContent = 'insert_drive_file';
        }
        // 파일 개수 무관하게  총 파일크기 제한.
        if(nBytes >= MAX_FILE_SIZE  ){
            alert('총 파일 크기 초과. 다시 선택해주세요!\nTotal file size over. \nMax file size is: ' + MAX_FILE_SIZE +'\nPlease retry!');
            return; 
        }     
        // Multiple 선택시는  파일구조 검사없이 신규 파일생성으로 본다.
        if( oFiles.length > 1 ){ 
            fileProcessor(oFiles, UIselectedFileType.collection);
            fileTypeField.textContent = 'Multiple files';
            return; 
        } 


    

        // 파일 구조 검사 후,  bayo파일여부 파악 후 ui 생성.
        var reader = new FileReader();
        reader.onload = function( e) {
            // var fileBuffer = reader.result; 
            var tail = new Uint8Array(reader.result);
            // var isBayoFile = false;          
            // var isEncrypted ;
            var tailInfo = {};
            if( tail[tailPos.PID] == 0xba && tail[tailPos.PID + 1] == 0x40 ){
                //bayo file 이면
                tailInfo.encryptMode = tail[tailPos.encryptMode];
                tailInfo.nPower = tail[ tailPos.nPower ] ;
                tailInfo.pwChkSum1 = tail[tailPos.pwCheckSum ];
                tailInfo.pwChkSum2 = tail[tailPos.pwCheckSum + 1];
                tailInfo.ivBin = tail.slice( tailPos.ivBin, tailPos.ivBin + 32)  ;   
                tailInfo.ivStr = buf2hex(tailInfo.ivBin.buffer);

                if( tailInfo.encryptMode == CRYPTO_MODE['PLAINTEXT'] ){
                    fileTypeField.textContent = 'bayo file';
                    fileProcessor( theFile , UIselectedFileType.normal_bayo , tailInfo );                   
                }else{
                    icon.classList.add('red','lighten-1');
                    icon.textContent = 'lock';
                    fileTypeField.textContent = CRYPTO_MODE[ tailInfo.encryptMode ] + ' encrypted file';
                    fileProcessor( theFile , UIselectedFileType.encrypted_bayo , tailInfo );                                       
                }

            }else{ //bayo 아닌 파일.
                if( oFiles.loadedFromBrowserDB == true){
                    fileTypeField.textContent = 'Normal File From Storage.';
                    // console.log('loadeFromBrowserDB');
                    var fileData = {urls: [] , type: [], name: [], arrbuf: [] };
                    fileData.urls[0] = URL.createObjectURL( new Blob( [theFile ], {type: theFile.type } ) );  //blob 타입변경.
                    fileData.type[0] = theFile.type;
                    fileData.name[0] = theFile.name;
                    fileData.arrbuf[0] = new ArrayBuffer();
                    scrollTo( con.filebox );
                    drawView( fileData );
                    return;
                }else{
                    fileTypeField.textContent = 'Normal File';
                    fileProcessor(oFiles, UIselectedFileType.normal);    
                }
                
            } 


        };

        if( theFile.size > TAIL_LEN ){ 
            reader.readAsArrayBuffer(theFile.slice( theFile.size - TAIL_LEN  ));  
        }else{
            fileTypeField.textContent = 'Normal File';
            fileProcessor(oFiles, UIselectedFileType.normal);
        }
    }

/*
 * 사용자가 선택한 파일의 종류
 * (C) Collection 2개 이상의 파일 선택. 
 *  N  일반(Bayo가 아닌)파일 1개. 
 * (B) 비암호화 Bayo파일 1개.   
 * [B] 암호화된 Bayo파일 1개.
 * 각각  collection, normal, normal_bayo, encrypted_bayo 
*/
function fileProcessor( fileData, selectedFileType, tailInfo){
    // con.mainFileField.querySelector('.file-path').value =  setup.langSet == 'kr' ? '재선택 가능합니다.': 'You can select again!';    
    con.mainFileField.querySelector('.file-path').value =  "";    
    con.progressBar.style.width = "0%"                   
    changeUIMode(selectedFileType);

    var isCollection = false;
    switch( selectedFileType){
         //(C)와 N 인경우 bayo 생성 절차 진행
        case UIselectedFileType.collection:
            isCollection = true;
        case UIselectedFileType.normal:
            if(isCollection){
                document.querySelector('.option-combine').classList.remove('hide');                
            }else{
                document.querySelector('.option-combine').classList.add('hide');
            }
            con.processorMsg.textContent = '옵션을 선택해주세요!';
            con.show('options');
            scrollTo(con.filebox );
                if( setup.isEncrypt){
                    con.pwInput.focus(); 
                    con.pwInput.value = '';
                }else{
                    con.show('cltButton');
                } 
                // if( !jpgBufferDefault) getTextJpgBuffer();  //이것도 파일 생성시 필요하므로 여기에 추가함.
            con.cltButton.onclick = function(){ 
                creatingBayo( fileData , con.processor  );
                con.hide('options','cltButton');
                };           
            con.encButton.onclick = function(){ 
                creatingBayo( fileData , con.processor  );
                con.hide('options','cltButton');
                };       
            var pwReadyChecker = function(e){
                if( this.value ){ 
                    con.show('encButton');
                }else{
                    con.hide('encButton');
                    con.pwLabel.textContent = 'Input password!';
                    con.pwInput.focus();
                }};
            con.pwInput.addEventListener( 'input', pwReadyChecker );
            con.pwInput.addEventListener( 'keyup', function(e){
                if( e.key == 'Enter'){
                    con.encButton.click();        
                } });
            break;  // 2개이상 파일 묶기 작업시 여기서 종료

        // (B)는 암호가 없으므로 바로 복원
        case UIselectedFileType.normal_bayo:
            con.processorMsg.textContent = 'Unpacking bayo file';
            extractingBayo( fileData , con.processor, false );
            break;

        case UIselectedFileType.encrypted_bayo:  //decryption UI;  pwInputchecker, dec버튼. 
            con.show('dec');
            con.pwDecLabel.textContent = 'Input password! 암호를 입력해주세요!';
            con.pwDecInput.value = '';
            con.pwDecInput.focus();
            scrollTo(con.filebox);
            setFaceBot('idle');
            con.processorMsg.textContent = 'encrypted bayo file';
                con.decButton.onclick = function(){ 
                    con.pwDecLabel.textContent = '';
                    con.hide('decButton','dec');
                    extractingBayo( fileData , con.processor, true  );
                };        

            var pwInputHashSumChecker = function(e){
                var inputChksum1 =  new Uint8Array( sha256.arrayBuffer( tailInfo.ivStr + this.value.substr(0,1) ) )[0];
                var inputChksum2 =  new Uint8Array( sha256.arrayBuffer( tailInfo.ivStr + this.value ) )[0];
                                    
                if( tailInfo.pwChkSum1 == inputChksum1 && tailInfo.pwChkSum2 == inputChksum2){ 
                    //try decrypt 버튼 표시
                    setFaceBot('pass'); //멈춤
                    con.pwDecLabel.textContent = setup.langSet == 'kr' ?  '맞는거 같아요! 버튼을 눌러보세요!' : 'Okay! try push button.';
                    con.show('decButton');
                }else if( tailInfo.pwChkSum1 == inputChksum1){ 
                    // console.log('첫자만 일치'); 
                    con.pwDecLabel.textContent = setup.langSet == 'kr' ?   '오호 첫자는 맞는것 같아요!' : 'good! the first chracter looks correct.';    
                    setFaceBot('yes');
                    con.hide('decButton');
                }else{
                    con.pwDecLabel.textContent = setup.langSet == 'kr' ?  '이런! 첫글자가 그게 아닌것 같네요' : 'well, the first character looks incorrect.';
                    setFaceBot('wrong');
                    con.hide('decButton');
                }
            };

            var pwInputEnter = function(e){
                if(!e.repeat && e.key == 'Enter'){
                    if( !con.decButton.classList.contains('hide') ){
                        con.decButton.click();
                    }
                }};

            con.pwDecInput.addEventListener( 'input', pwInputHashSumChecker );
            con.pwDecInput.addEventListener( 'keyup', pwInputEnter );
        break;

    }
   


    // [B]는 사용자에게 암호를 입력받아서 암호화하는 절차 진행
}
/*  creatingBayo :  
    요청한 파일(들)로 bayo파일 생성(필요시 encrypt까지)하도록 서비스 워커에 위임하고 관련 UI DOM에 상태를 표시해준다.
    > oFiles:  FileList 형 그대로 전달.  판단은 worker에서.
    > fileInfoConatainer: 진행 상태 실시간 안내용 UI DOM
*/
function creatingBayo(oFiles , fileInfoContainer ){   
    var passPhrase = con.pwInput.value;
    if( setup.isEncrypt && passPhrase == ''){
        alert('Input password!');
        con.pwInput.focus();
        return;
    }
    con.show('processor');   //연산할때 보여주는 방식인 경우
    con.processor.classList.remove('short-margin-bottom');
    fileInfoContainer.querySelector(".progress").classList.remove('hide');
    scrollTo( con.filebox );

    // var circleLoader = fileInfoContainer.querySelector('.loader');
    var tempBlobFileName = "";
    oneWorker = new Worker("./js/bayoCryptoWorker_v1.0.js");
    oneWorker.onmessage = function(e) {
        switch(e.data[0]){
            case 'progressBegin':
                con.processorMsg.textContent = e.data[1];   
                break;
            case 'inprogress':
                con.progressBar.style.width = e.data[1];                    
                break;
            case 'FILE_CREATED':  //  생성 완료시 전달 메시지.
                setFaceBot('idle');
                con.processorMsg.innerHTML = setup.langSet == 'kr' ? '생성된 파일을 저장하세요!<br>파일명 변경가능': 'Save new bayo file!<br>you can change filename.';    
                fileInfoContainer.querySelector(".progress").classList.add('hide');
                con.show('processResult','processSaveButton');
                con.hide('options');
                scrollTo( con.processor);
                con.processSaveButton.href = e.data[1];   // objURL
                objURLs.push( e.data[1] );
                con.processFilenameInput.value = e.data[2]; //enc fileName
                con.processFilenameInput.focus();
                con.processSaveButton.download = e.data[2]; //enc fileName
                
                tempBlobFileName = e.data[2]; 
                con.show('processSaveBrowserButton','processSaveBrowserInfo');
                con.processSaveBrowserButton.onclick = function(){
                    // addBlobToStorage( tempBlobFileName , e.data[3] ); //3: blob
                    var fileObj = e.data[3];
                    fileObj.name = tempBlobFileName; //사용자가 변경가능
                    addFilesToStorage( [fileObj] );                    

                }
                con.processFilenameInput.onblur = function(){
                    if(con.processFilenameInput.value ==''){
                        tempBlobFileName = e.data[2];
                        con.processFilenameInput.value = e.data[2]; //enc fileName
                        con.processSaveButton.download = e.data[2]; //파일명 공백인경우 기본값으로 재설정                    
                    }else{
                        con.processSaveButton.download = con.processFilenameInput.value; //사용자 변경한 파일명반영
                        tempBlobFileName = con.processFilenameInput.value; //브라우저 저장 활성화시만 필요함.
                    }
                }
                break;

            case 'FAIL':
                console.log( e.data[1]);
                alert('파일 생성오류: ' + e.data[1] );
                location.reload();
                break;
            case 'loggerMessage':
                console.log( e.data[1]);
                break;
            default:
                console.log('알수없는 postMessage: ' + e.data[0]);
        }
    }
    var metaData = {};
    metaData.pwStr = passPhrase;
    metaData.setup = setup;  //setup에 isEncrypt 정보도 포함됨.
    if(setup.jpgMask){
        metaData.jpgMaskBuffer = jpgBuffers[ con.jpg_selected.firstChild.alt ];
    }else{
        // metaData.jpgMaskBuffer = jpgBufferDefault;  //JPG Mask 미선택시, 바요 배너jpg 로 대체함.
    }

    var work = [ 'createBayoFile', oFiles, metaData ]; 
    oneWorker.postMessage( work);
}

/*
    worker에게 파일추출 시킨다. 
    metaData로 암호화 여부만 전달.

*/
function extractingBayo(theFile, fileInfoContainer, isEncrypted ){ 
    var passPhrase = con.pwDecInput.value;
    if( isEncrypted && passPhrase == ''){
        alert('Input password!');
        con.pwDecInput.focus();
        scrollTo( con.dec );
        return;
    }
 
    con.show('processor');   //연산할때 보여주는 방식인 경우
    con.processor.classList.remove('short-margin-bottom');
    scrollTo( con.filebox );

    fileInfoContainer.querySelector(".progress").classList.remove('hide');
    oneWorker = new Worker("./js/bayoCryptoWorker_v1.0.js");
        oneWorker.onmessage = function(e) {
            switch(e.data[0]){
                case 'progressBegin':
                    // con.progressBar.style.width = '0%';   // 시작하자마자 inprogress 값으로 대체됨.  세팅 여부 비주얼은 마찬가지다.                 
                    con.processorMsg.textContent = e.data[1];   
                    break;
                case 'inprogress':
                    con.progressBar.style.width = e.data[1];                    
                    break;
                case 'wrongPass':
                    con.pwDecLabel.textContent = '패스워드가 틀립니다. 다시 입력해주세요!';
                    con.processorMsg.textContent = e.data[1];    
                    con.show('dec');
                    con.pwDecInput.focus();
                    con.pwDecInput.value = '';
                    break;
                case 'wrongHash':
                    alert('손상된 파일입니다. incorrect Hash');
                    location.reload();
                    break;
                case 'wrongFileInfo':
                    alert('손상된 파일입니다. invalid file info.');
                    location.reload();
                    break;
                case 'FAIL':
                    console.log( e.data[1]);
                    alert('손상된 파일입니다. decryption err.');
                    location.reload();
                    break;    
                case 'FILE_EXTRACTED':
                    fileInfoContainer.querySelector(".progress").classList.add('hide');
                    drawView(e.data[1] );
                    break;
                case 'loggerMessage':
                    console.log( e.data[1]);
                    break;
                default:
                    console.log('알수없는 postMessage: ' + e.data[0]);
            }
        }
        var metaData = {};
        metaData.pwStr = passPhrase;
        metaData.isEncrypted = isEncrypted;
        var work = [ 'extractBayoFile', theFile, metaData ];
        oneWorker.postMessage( work);
    }

function drawView( decData ){
    con.hide('dec','processor');
    con.hide('mainModeInfo' ,'fileModeInfo' );
    setFaceBot('idle');

    if(decData.urls.length >= 1){
        // toggleHelpButton(false); //help는 숨긴다.
        var hasVideo = false;
        var hasCaption = false;
        for( i = 0 ; i < decData.urls.length ; i++ ){
            var fileType = decData.type[i].split('/')[0] ;
            if( fileType == 'image' ){
                var rImage = document.createElement('img');
                con.view.appendChild( rImage);    
                    rImage.src = decData.urls[i];
                    rImage.alt = decData.name[i];
                    rImage.classList.add('responsive-img');
            }else if( fileType == 'video' && decData.type[i] == 'video/mp4'){
                // console.log( decData.type[i]);
                hasVideo = document.createElement('video');
                hasVideo.classList.add('responsive-video');
                hasVideo.setAttribute('controls','controls');
                hasVideo.setAttribute('autoplay','autoplay');
                hasVideo.setAttribute('type', decData.type[i] );
                hasVideo.innerHTML = '<track default kind="subtitles" srclang="ko" /> uncompatible video';
                hasVideo.src = decData.urls[i];
            }else if( decData.name[i].substr( decData.name[i].lastIndexOf('.') + 1) == 'vtt' ){
                hasCaption = decData.urls[i];
                console.log('video collection description > VTT:'  + decData.type[i]);
            }else if( fileType == 'text' ){  
                //일단 종류 구분없이 text/plain, text/html, text/css, text/javascript
                // utf8 인코딩 문자열로 가정.  인코딩 검증 추가요함
                var textData =  decoder.decode( new Uint8Array( decData.arrbuf[i] ) );
                // console.log('textdata:' + textData);
                var textView = document.createElement('textarea');
                textView.textContent = textData;
                con.view.appendChild( textView);  
            }else{ // 웹뷰 지원 안되는 일발 파일. 직접 저장해서 사용
                var normalFileInfoDiv = document.createElement('div');
                normalFileInfoDiv.style = "height: 20px;";
                con.view.appendChild(normalFileInfoDiv );    
            }   
            //기본 저장 버튼.
            var btn = document.createElement('a');
            if(fileType == 'image'){
                btn.classList.add('waves-effect', 'waves-light', 'btn-small','grey');
            }else{
                btn.classList.add('waves-effect', 'waves-light', 'btn-small','red','darken-4');
            }
            btn.innerHTML = '<i class="material-icons left">save_alt</i>'+ decData.name[i] ;
            btn.href = decData.urls[i];
            btn.download = decData.name[i] ;
            var btnWrap = document.createElement('div');
            btnWrap.appendChild(btn);
            con.view.appendChild( btnWrap);
            objURLs.push( decData.urls[i]);
        }//end of for
        // 호환 비디오 파일 있는 경우.  화면 추가. 
        if(hasVideo ){
            con.view.innerHTML += "<br>";
            con.view.appendChild( hasVideo);
            if(hasCaption){  // 호환 자막까지 함께 제공된 경우
                hasVideo.querySelector('track').src = hasCaption;
            }
        }
    } // end of collection 처리.
    con.processor.classList.add('short-margin-bottom');
    con.show('view','viewerToggleSaveButton');
    toggleViewerSaveButtons(true);  //뷰어 초기화면은  저장버튼 보여주기
}

function loadLangSet(){
    if( localStorage.langSet == 'en'){
        setup.langSet = 'en'; 
    }else if( localStorage.langSet == 'kr'){
        setup.langSet = 'kr'; 
    }else{
        setup.langSet = 'en'; //default lang
    }
    setLang();
}

function toggleLang(){
    if(setup.langSet == 'kr'){
        setup.langSet = 'en';
    }else if(setup.langSet == 'en'){
        setup.langSet = 'kr';
    }
    setLang();
}



// 토글 하는것 다름.
function setLang(){ // 초기 kr 이후 en 과 kr 반복.  

    if( setup.langSet == 'kr'){
        con.hide( 'fileModeInfoEn','mainModeInfoEn');
        con.show( 'fileModeInfoKr','mainModeInfoKr');
        con.langBtn.textContent = 'kr ▸ en';
    }else if( setup.langSet == 'en'){
        con.hide( 'fileModeInfoKr','mainModeInfoKr');
        con.show( 'fileModeInfoEn','mainModeInfoEn');
        con.langBtn.textContent = 'en ▸ kr';        
    }else{
        console.log('알수없는 langSet: '+ setup.langSet );
    }
    localStorage.langSet = setup.langSet;

   //파일정보 라벨 언어변경
//    con.ui.querySelector('.static-filebox .label').textContent =   setup.langSet == 'kr' ? '파일 정보' : 'File info';
   //기본 파일 선택기
    con.ui.querySelector('.file-path').placeholder =  setup.langSet == 'kr' ? '파일을 선택해주세요!' : 'Select one or more files';
    //option local jpg 파일 선택기
    con.jpg_local.querySelector('.file-path').placeholder = setup.langSet == 'kr' ? '갖고있는 JPG 파일을 선택해주세요!' : 'Select one or more local JPG images';
    con.pwDecLabel.textContent =  setup.langSet == 'kr' ? '패스워드를 입력해주세요!':'Input password!';
    // con.processorMsg.innerHTML = setup.langSet == 'kr' ? '저는 파일 트랜스포머입니다.<br>파일을 선택해주세요!': 'I am a file transformer.<br>Select one or more files.';


    if(setup.langSet == 'kr'){
        con.bayoAppTitle.textContent = '바요';
        con.navStorage.textContent = '저장소';
        // con.navHelp.textContent = '도움말';        
        con.processSaveButton.textContent = '파일로 저장';
        con.processSaveBrowserButton.textContent = '브라우저에 저장';
        con.processSaveBrowserInfo.textContent =  '생성된 bayo 파일을 브라우저 저장소에 저장해두면 편리합니다.\
        메뉴 browser storage 기능을 이용하세요. 주의. 브라우저에 저장된 파일은 지워질수 있으니 반드시 별도 파일로 저장해주세요!';
    }else{
        con.bayoAppTitle.textContent = 'Bayo';
        con.navStorage.textContent = 'Storage';
        // con.navHelp.textContent = 'Help';
        con.processSaveButton.textContent = 'save as file';
        con.processSaveBrowserButton.textContent = 'save to browser storage';
        con.processSaveBrowserInfo.textContent =  '- You can save bayo file into web browser storage.\
        Use menu > browser storage button to reload.  * Warning. It can be deleted. you must backup the file.';
    }


}


    // 스크롤 제어 부. //{ scrollFunction() }; function scrollFunction() 
    window.onscroll = function(){
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            con.topButton.classList.remove('hide');// = "block";
        } else {
            con.topButton.classList.add('hide'); 
        }
    }
    function topFunction() { scrollTo( 0); }
    function scrollToNow( topVal ){
        document.body.scrollTop = topVal; // For Safari
        document.documentElement.scrollTop = topVal; // For Chrome, Firefox, IE and Opera
    }
    var timerID;
    function scrollTo( target ){
        var topPos;
        var delta = 70;
        if( typeof target  == 'object') topPos = target.offsetTop - delta;
        else if(typeof target == 'number') topPos = target;
        
        if(timerID) clearInterval( timerID);
        var ds;
        timerID = setInterval( function(){
            ds = document.documentElement.scrollTop - topPos;
            if( Math.abs( ds ) < 5){
                clearInterval(timerID);
                timerID = null;
                document.documentElement.scrollTop = topPos;
            }else{
                var mv = ds * 0.3;
                document.documentElement.scrollTop -= mv;
            }
        }, 30); 
        setTimeout( function(){   
            clearInterval( timerID);
            document.documentElement.scrollTop = topPos;
        },500);
    }

    // drag & drop handler
    function dragOverHandler(ev) {    ev.preventDefault(); }
    function removeDragData(ev) {
        // console.log('Removing drag data');
        if (ev.dataTransfer.items) { // Use DataTransferItemList interface to remove the drag data
        ev.dataTransfer.items.clear();
        } else { // Use DataTransfer interface to remove the drag data
        ev.dataTransfer.clearData();
        }
    }
    function dropHandler(ev) {
        ev.preventDefault();
        if(ev.dataTransfer.files.length >= 1 ){
            // 드롭된 정보가 파일 클릭 선택 정보를 지워줘야함
            con.ui.querySelector('input[type=file]').value = "";  //이값이 실제 파일 정보 연계. 공백넣으면 리셋됨.
            var len = ev.dataTransfer.files.length;
            var firstName = ev.dataTransfer.files[0].name;
            if(len == 1){
                con.ui.querySelector('.file-path').value = firstName + ' 1개의 파일이 선택됨';
            }else{
                con.ui.querySelector('.file-path').value = firstName +' 포함 총'+ len + '개 파일이 선택됨';
            }
            onFileSelected(ev.dataTransfer.files);
        }
        removeDragData(ev)
    }

    function addFilesToStorage( oFiles){
        //keys 목록 받은뒤, oFiles name과 일치하는 파일없어야 통과.
        var fileNameList= [];
        for(var i=0;i < oFiles.length; i++){
            fileNameList.push( oFiles[i].name );        
        }

        localforage.keys().then( function(keyList){
            var samefileNameList = [];
            fileNameList.forEach(function(filename){
               if( keyList.includes( filename)){
                    samefileNameList.push(filename);
               }
            });
            var filenameconflitConfirmMsg = setup.langSet == 'kr' ? "동일한 제목의 파일이 이미 있습니다.\
            \n중복 파일명:" + samefileNameList.toString() +"\n덮어쓰시겠습니까?" :
            'storage already contains\n'+
            'existing filenames: ' + samefileNameList.toString() + '\nChoose Okay if you want to overwite the file. or Cancel to keep existing files.';
            var saveOrNot = true;

            if( samefileNameList.length >= 1 ){
                console.log('동일 filename 목록 ; ' + samefileNameList );
                saveOrNot = window.confirm(filenameconflitConfirmMsg);
            }

            if( saveOrNot  ){
                console.log('저장 시도');
                var promiseStack = [];
                try{
                    con.show('storageLoader');
                    con.hide('storageList','storageAddButton');
                    for(var i=0;i < oFiles.length; i++){
                        var blobTitle = oFiles[i].name;
                        var blobData = oFiles[i];
                        promiseStack.push(localforage.setItem( blobTitle , blobData )) ;
                    }
                    Promise.all( promiseStack ).then( function(){
                        con.hide('storageLoader');
                        M.toast({html: '스토리지에 저장완료 :  total ' + oFiles.length +' files.' })
                        if( !con.storageView.classList.contains('hide')){
                            loadStorageList( );    
                        }
                    })
    
                }catch(err){
                    con.hide('storageLoader');
                    M.toast({html: 'Fail. 스토리지 저장 오류발생'});
                }
            }else{
                console.log('파일명 중복으로 저장 취소');
            }

        })

    }



    // function addBlobToStorage( blobTitle, blobData){
        // localforage.setItem( blobTitle , blobData ).then( function(){
        //     M.toast({html: 'Done. 스토리지에 저장완료<br>please use menu to reload.'})
        // }).catch( function( err ){
        //     M.toast({html: 'Fail. 저장실패'})
        //     console.log('저장실패');
        // });
    // }

    function loadFileFromStorage(fileName ){
        localforage.getItem( fileName).then(function(data){
            if(data){
                var lsBlob = data;
                lsBlob.name = fileName;
                lsBlob.type = 'blobtype';            
                var blobFileObj = { length: 1 , 0: lsBlob , loadedFromBrowserDB: true };
                // con.ui.querySelector('.file-path').value =  lsBlob.name;
                onFileSelected( blobFileObj );    
            }else{
                alert('No file in browser storage');
            }
        });
    }

    var storageItemCheckStatus = [];
    function loadStorageList(  ){
        console.log('loadStorageList()');
        scrollTo(0 ) ;

        if( !con.storageLoader.classList.contains('hide') ){
            console.log('loadStorageList() -> loading -> return');
            return;
        }
        con.hide('storageDeleteButton');
        con.show('storageList','storageAddButton');
        container = con.storageList;

        localforage.keys().then(function(listData){
            removeChildren(container);
            storageItemCheckStatus = [];
    
            if( listData != null && listData.length >= 1){
                // console.log('storage keys.len: ' + listData.length );
                //검증
                listData.forEach( function(val,index, arr){
                    // console.log(` val: ${val} i: ${index} arr: ${arr}`);                        
                    var item = document.createElement('li');
                    // item.classList.add('btn', 'wide','grey');
                    item.classList.add('collection-item','storage-item');
                    var itemCheckBtn = document.createElement('i');
                    itemCheckBtn.classList.add('material-icons','right');
                    itemCheckBtn.textContent = 'radio_button_unchecked';
                    itemCheckBtn.onclick = function(ev){
                        ev.stopPropagation();
                        // console.log('index; ' + index );
                        if(itemCheckBtn.textContent == 'radio_button_unchecked'){
                            itemCheckBtn.textContent = 'radio_button_checked';  
                            storageItemCheckStatus[index] = val;
                        }else{
                            itemCheckBtn.textContent = 'radio_button_unchecked'; 
                            storageItemCheckStatus[index] = null;
                        }                
                        //check checked items
                        if(storageItemCheckStatus.some( item => item ) ){
                            // con.storageView.querySelector('.storage-delete-btn').classList.remove('hide');
                            con.show('storageDeleteButton');
                        }else{
                            con.hide('storageDeleteButton');
                            // con.storageView.querySelector('.storage-delete-btn').classList.add('hide');
                        }                        

                    }
                    item.innerHTML =  val  ;
                    item.append(itemCheckBtn);
                    
                    item.onclick =function(ev){
                        loadFileFromStorage( val );
                    }
                    container.appendChild( item);
                });
                // console.log('data '+ data[1]);
            }else{
                // alert('No file in browser storage');
                var item = document.createElement('li');
                item.classList.add('collection-item','storage-item');
                item.textContent = ' NO FILE. 아직 저장해둔 파일이 없습니다.';
                container.appendChild( item);
            }
        });
    }


    function removeStorageItems(itemList){
        var promiseStack = [];
        itemList.forEach( function(item){
            if(item){  
                promiseStack.push( localforage.removeItem( item ) );
            }
        });

        Promise.all( promiseStack ).then( function(){
            console.log('cleared');
            if( !con.storageView.classList.contains('hide') ) loadStorageList( );
        }).catch( function (err){
            console.log('removeStorageItem Err:'+ err);
        });

    }


    // document.querySelector('input[type=file]').value = "";  //이값이 실제 파일 선택정보. * 공백넣으면 리셋됨.
    // document.querySelector('.file-path').value ='';         //선택된 파일명 화면표시용
    // document.querySelector('.file-path').placeholder ='';   //파일 미선택시 기본 안내문.


// 개발중 서비스워커 미사용
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
        navigator.serviceWorker
            .register('/sw.js')
            .then(function() { console.log('Service Worker Registered'); });
        });
    }

 //지원 상황 확인
 
 //encoder 지원
if( typeof(TextEncoder) != "undefined" ) {  // 지원하지 않는 브라우저. 임시 확인방식
    var encoder = new TextEncoder();
    var decoder = new TextDecoder();          
    con.hide('devInfo');
    console.log('url: '+ document.URL );
    changeUIMode( 'main');   //default UImode
    // changeUIMode( 'storageView');   //default UImode
    loadLangSet();
}





