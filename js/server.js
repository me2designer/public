'use strict'



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/



  /*

    URL에서 파라미터 명 찾아 값 반환 받기 ▼

    [입력된 URL]
      https://www.me2designer.com/?page=1&category=3

    [script 작성 예]
      console.log(urlSearchName('page'));
      console.log(urlSearchName('category'));

    [console 출력결과]
      1
      3
  */

  const urlSearchName = function(name) {
    let curr_url = location.search.substr(location.search.indexOf("?") + 1);
    let svalue = "";
    curr_url = curr_url.split("&");

    for (let i = 0; i < curr_url.length; i++) {
      let temp = curr_url[i].split("=");

      if ([temp[0]] == name) {
        svalue = temp[1];
      }
    }
    return svalue = svalue == '' ? false : svalue;
  }



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/


  
  const localhost = /\d+\.\d+\.\d+\.\d/.test(location.hostname) ? location.hostname : 'localhost';
  const LOCAL = {
    name: 'local',
    public: '//' + localhost + ':65001',
    fonts: '//' + localhost + ':65002',
    images: '//' + localhost + ':65003',
    blog: '//' + localhost + ':65101',
    portfolio: '//' + localhost + ':65100',
  }
  const REAL = {
    name: 'real',
    public: '//public.me2designer.com',
    fonts: '//fonts.me2designer.com',
    images: '//images.me2designer.com',
    blog: '//blog.me2designer.com',
    portfolio: '//me2designer.com',
  }
  let SERVER, isReal, isLocal;
  const urlServer = new URLSearchParams(location.search).get('server');

  if (urlServer === 'real') {
    SERVER = REAL
  } else if (/server\=/.test(location.search)) {
    if (/server\=local/.test(location.search)) SERVER = LOCAL;
    else if (/server\=real/.test(location.search)) SERVER = REAL;
    else SERVER = REAL;
  } else {
    if (!isNaN(location.host.replace(/\.|\:/g,'')) || /localhost/i.test(location.host)) SERVER = LOCAL;
    else SERVER = REAL;
  }

  switch(SERVER.name) {
    case 'real':
      if (urlServer === 'real') isReal = false;
      else isReal = true;
    break;
    case 'local':
      isLocal = true;
    break;
  }



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/



  /*  cache */
  let cache, FILES_CSS, FILES_JS;
  cache = '?v='+(new Date).getTime();



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/



  /* FILES */
  const FILES = function(fileList, callback){
    let result;

    function isOverlap (list, filePath){
      let value;

      for (let i=0; i<list.length; i++){
        if (list[i]==filePath) {
          value = true;
          break;
        }
      }
      return Boolean(value);
    }

    function afterJqLoad(){
      let _result;
      let CSS = [];
      let JS = [];

      if (Array.isArray(fileList)) {
        fileList.forEach(function(v,i,a){
          let isJS = /\.js/.test(v);

          isJS?JS.push(v):CSS.push(v);
        });
      } else {
        let isJS = /\.js/.test(fileList);

        isJS?JS.push(fileList):CSS.push(fileList);
      }

      CSS.forEach(function(v,i,a){
        if(!FILES_CSS) FILES_CSS = [];

        let filePath = CSS[i];

        if (!isOverlap(FILES_CSS, filePath)){
          let head  = document.getElementsByTagName('head')[0];
          let tag  = document.createElement('link');

          tag.rel = 'stylesheet';
          tag.type = 'text/css';
          tag.href = filePath+cache;
          head.appendChild(tag);
          FILES_CSS.push(filePath);
        }
        if (callback && (CSS.length-1==i) && !JS.length) _result = callback();
      });

      if (JS.length){
        (function getJS(i){
          if(!FILES_JS) FILES_JS = [];

          let filePath = JS[i];

          if (!isOverlap(FILES_JS, filePath)){
            let _cache = /\?/.test(filePath) ? '' : cache;

            $.getScript(filePath+_cache).done(function(){
              FILES_JS.push(filePath);

              if (i!=JS.length-1) {
                getJS(++i);
              } else {
                if (callback) _result = callback();
              }
            }).fail(function(){
              console.log('error : '+filePath);

              if (i!=JS.length-1) {
                getJS(++i);
              } else {
                if (callback) _result = callback();
              }
            });
          } else {
            console.log('overlab : '+filePath);

            if (i!=JS.length-1) {
              getJS(++i);
            } else {
              if(callback) _result = callback();
            }
          }
        })(0);
      }
      return _result;
    }

    if (/undefined/i.test(typeof jQuery)){
      let xml = new XMLHttpRequest();

      xml.onreadystatechange = function(){
        if (this.readyState==4&&this.status==200) {
          eval(xml.responseText);
          $.ajaxSetup({cache: true});
          result = afterJqLoad();
        }
      }
      xml.open("GET", SERVER.public+"/lib/jquery/jquery.js"+cache, false);
      xml.send();
    } else {
      result = afterJqLoad();
    }
    return result;
  }



/*
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
*/