const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'KAN'

const playList = $('.playlist')
const footer =$('.footer')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn =$('.btn-toggle-play')
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const timeCurrent = $(".progress-time--current");
const timeDuration = $(".progress-time--duration");
const progressBar = $('.progress-bar')
const btnPlayList = $('btn_icon-playlist')
const playlistSong = $('.song.active')
const tabs = $$(".list_item-tab");
const panes = $$(".tab-content");
const tabActive = $(".list_item-tab.showingup");
const line = $(".menu .line");
const volume = $('.volume');
const volumeIcon = $('.volume-icon');
const muteVolume = $('.mute-volume');


const app  = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function (key,value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
     }
    ,
    songs: [
         {
         "name":"Nhất Thân",
         "singer":"Masew,Khoi Vu",
         "path" : "./sing/NhatThan-MasewKhoiVu-7060342.mp3",
         "imgage": "./img/nhatthan.jpg"
        },
        {
         "name":"Ái Nộ",
         "singer":"Masew,Khoi Vu",
         "path":"./sing/AiNo1-MasewKhoiVu-7078913.mp3",
         "imgage":"./img/aino.jpg"
        },
        {
         "name":"Mời Trầu",
         "singer":"Masew,Tuấn Cry",
         "path":"./sing/MoiTrau-MasewTuanCry-7293424.mp3",
         "imgage":"./img/moitrau.jpg"
        },
        {
        "name":"Hối Duyên",
         "singer":"Masew,Khoi Vu",
         "path":"./sing/HoiDuyen-MasewKhoiVuGreat-8073042.mp3",
         "imgage":"./img/hoiduyen.jpg"

        },
        {
            "name":"Cưới Thôi",
            "singer":"Masew,B Ray,TAP",
            "path" : "./sing/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3",
            "imgage": "./img/cuoithoi.jpg"
        },
        {
            "name":"Thị Mầu",
            "singer":"Hòa Minzy,Masew",
            "path":"./sing/ThiMau1-HoaMinzyMasew-8820974.mp3",
            "imgage":"./img/tm.jpg"
        },
        {
           
            "name":"Luôn Yêu ĐỜi",
            "singer":"Đen Vâu,Cheng",
            "path" : "./sing/LuonYeuDoi-Den-8692742.mp3",
            "imgage": "./img/lyd.jpg"
        },
        {
            "name":"Bên Trên Tầng Lầu",
            "singer":"Tăng Duy Tân",
            "path":"./sing/BenTrenTangLau-TangDuyTan-7412012.mp3",
            "imgage":"./img/bttl.jpg"
        },
        {
            "name":"3107",
            "singer":"W/N, DuongG, Nâu",
            "path":"./sing/3107-WnDuonggNau-6099150.mp3",
            "imgage":"./img/3107.jpg"
        },
        
    ],
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.imgage}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
            `
        })
        playList.innerHTML = htmls.join("\n")
    },
    defineProperties: function (){
        Object.defineProperty(this,'currentSong',
        {
            get: function(){
                return this.songs[this.currentIndex]
            }
            })
    },
    handlEvent: function(){
        const _this = this
        const widthCd = cd.offsetWidth

        //xu ly cd xoay va dung 
      const cdThumbAnimate =  cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations :Infinity
        })
        cdThumbAnimate.pause()
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = widthCd - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / widthCd
        }


        //khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }

        }


        audio.onplay = function(){
            _this.isPlaying = true
            footer.classList.add('playing')
            cdThumbAnimate.play()
        }

        audio.onpause = function(){ 
            _this.isPlaying = false
            footer.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
           

            progress.oninput = function(e){
                const seekTime =  audio.duration /100 * e.target.value
                audio.currentTime = seekTime
            }
        }
        

        //next bai hat
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        //tro lai bai hat
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }
            else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }


        //random bai hat
        randomBtn.onclick = function(){
            _this.isRandom =!_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // phat lai bai hat
        repeatBtn.onclick = function(){
            _this.isRepeat =!_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }
        // chuyen bai hat khi ket thuc
        audio.onended = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else if (_this.isRepeat) {
                audio.play();
            } else {
                _this.nextSong();
            }
            _this.render();
            _this.scrollToActiveSong();
            audio.play();
        }

        // click vao playlist
        playList.onclick = function(e){
            const songElm = e.target.closest('.song:not(.active)')
            if(songElm || !e.target.closest('option'))
            {
                if(songElm){
                    _this.currentIndex = Number(songElm.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

            }
        }
        audio.addEventListener("timeupdate", function () {
            // method duration trả về độ dài của audio/video
            const audioDuration = audio.duration;
            
            if (!isNaN(audioDuration)) {
              // audio.currentTime trả về thời gian đang chạy của audio/video
              const progressPercent = (audio.currentTime / audio.duration) * 100; // Tính phần trăm chạy của bài hát
      
              // gán phần trăm bài hát vào thanh progress
              progressBar.value = progressPercent;
            }
            /* ========== Hiển thị thời gian hiện tại của bài hát ========== */
            // Trả về số phút hiện tại của audio/video
            let currentMinutes = Math.floor(audio.currentTime / 60);
            // Trả về số giây hiện tại của audio/video
            let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
      
            if (currentMinutes < 10) {
              currentMinutes = `0${currentMinutes}`;
            }
      
            if (currentSeconds < 10) {
              currentSeconds = `0${currentSeconds}`;
            }
      
            timeCurrent.innerText = `${currentMinutes}:${currentSeconds}`;
          });
      
          /* ========== Hiển thị thời gian bài hát ========== */
          audio.addEventListener("loadedmetadata", function () {
            // Trả về số phút của audio/video
            let durationMinutes = Math.floor(audio.duration / 60);
            // Trả về số giây của audio/video
            let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);
      
            if (durationMinutes < 10) {
              durationMinutes = `0${durationMinutes}`;
            }
      
            if (durationSeconds < 10) {
              durationSeconds = `0${durationSeconds}`;
            }
      
            timeDuration.innerText = `${durationMinutes}:${durationSeconds}`;
          });   

          volumeIcon.onclick = function () {
            if (audio.muted === false) {
                audio.muted = true;
                volumeIcon.classList.remove('fa-volume-high');
                volumeIcon.classList.add('fa-volume-xmark');
                volume.value = 0;
            } else {
                audio.muted = false;
                volumeIcon.classList.remove('fa-volume-xmark');
                volumeIcon.classList.add('fa-volume-high');
                volume.value = Math.floor(audio.volume * 100);
            }
          }
          volume.oninput = function (e) {
            audio.volume = e.currentTarget.value / 100;
            if (audio.volume == 0) {
                audio.muted = true;
                volumeIcon.classList.remove('fa-volume-high');
                volumeIcon.classList.add('fa-volume-xmark');
            } else {
                audio.muted = false;
                volumeIcon.classList.remove('fa-volume-xmark');
                volumeIcon.classList.add('fa-volume-high');
            }

        }
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url("${this.currentSong.imgage}")`
        audio.src = this.currentSong.path
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1   
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex 
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    scrollToActiveSong: function () {
        setTimeout(function () {
          if (this.currentIndex === 0) {
           playlistSong.scrollIntoView({
              behavior: "smooth",
              block: "end",
              inline:"nearest"
            })
          }
           else {
           playlistSong.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline:"nearest"
            })
          }
        },500);
      },
    start: function(){
        this.render()
        this.defineProperties()
        this.handlEvent()
        this.loadCurrentSong()
        this.loadConfig()
        randomBtn.classList.toggle('active', app.isRandom);
        repeatBtn.classList.toggle('active', app.isRepeat);
    }
}

app.start()
// SonDN fixed - Active size wrong size on first load.
// Original post: https://www.facebook.com/groups/649972919142215/?multi_permalinks=1175881616551340
requestIdleCallback(function () {
  line.style.left = tabActive.offsetLeft + "px";
  line.style.width = tabActive.offsetWidth + "px";
});

tabs.forEach((tab, index) => {
  const pane = panes[index];

  tab.onclick = function () {
    $(".list_item-tab.showingup").classList.remove("showingup");
    $(".tab-content.showingup").classList.remove("showingup");

    line.style.left = this.offsetLeft + "px";
    line.style.width = this.offsetWidth + "px";

    this.classList.add("showingup");
    pane.classList.add("showingup");
  };
});
