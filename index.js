const heading = document.querySelector("header h2")
const author = document.querySelector("header h3")
const cd = document.querySelector(".cd");
const cdThumb = document.querySelector(".cd-thumb")
const audio = document.querySelector("#audio")
const player = document.querySelector(".music-player");
const playBtn = document.querySelector(".btn-toggle-play");
const progress = document.querySelector("#progress");
const volume = document.querySelector("#value-volume");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const randomBtn = document.querySelector(".btn-random");
const repeatBtn = document.querySelector(".btn-repeat");
const playlist = document.querySelector(".playlist");
const ctime = document.querySelector(".current-time")
const dtime = document.querySelector(".duration-time")
const playListShow = document.querySelector(".btn-playlist")
const volumeBtn = document.querySelector(".btn-volume")
const videoBg = document.querySelector(".video-bg")
const canvas = document.querySelector("#canvas")


// const PlAYER_STORAGE_KEY = "MUSIC_PLAYER";
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    isVolume: false,
    // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    songs: [{
            name: "Walk on da street",
            singer: "16 Typh x 16 BrT",
            path: "./songs/song/walk_on_da_street.mp3",
            image: "./songs/images/walkondastreet.jpg"
        },
        {
            name: "Buông Hàng",
            singer: "Young Milo「Cukak Remix」",
            path: "./songs/song/buong_hang.mp3",
            image: "./songs/images/buonghang.jpg"
        },
        {
            name: "comethru",
            singer: "Jeremy Zucker",
            path: "./songs/song/comethru.mp3",
            image: "./songs/images/comethru.jpg"
        },
        {
            name: "Lily",
            singer: "Alan Walker, K-391 & Emelie Hollow",
            path: "./songs/song/lily.mp3",
            image: "./songs/images/lily.jpg"
        },
        {
            name: "Mùa Hè Ấy Em Khóc",
            singer: " Ngô Lan Hương「Cukak Remix」",
            path: "./songs/song/mua_he_ay_em_khoc.mp3",
            image: "./songs/images/mua-he-ay-em-khoc.jpg"
        },
        {
            name: "On My Way",
            singer: "Alan Walker, Sabrina Carpenter & Farruko",
            path: "./songs/song/on_my_way.mp3",
            image: "./songs/images/onmyway.jpg"
        },
        {
            name: "Sang Xịn Mịn",
            singer: "Gill ft. Kewtiie「Cukak Remix」",
            path: "./songs/song/sang_xin_min.mp3",
            image: "./songs/images/sxm.jpg"
        },
        {
            name: "Trò Đùa",
            singer: "Quang Đăng Trần",
            path: "./songs/song/tro_dua.mp3",
            image: "./songs/images/trodua.jpg"
        },
        {
            name: "Xích Thêm Chút",
            singer: "RPT Groovie ft. Tlinh & RPT MCK「Cukak Remix」",
            path: "./songs/song/xich_them_chut.mp3",
            image: "./songs/images/xtc.jpg"
        }
        
    ],
    // setConfig(key, value) {
    //     this.config[key] = value
    //     localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
    // },
    render() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-music"></i>
                </div>
            </div>
            `;
        })
        playlist.innerHTML = htmls.join("");
    },
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    renderEqualizer() {
        var audioContext = new (window.AudioContext || window.webkitAudioContext)()
        let audioContextSrc = audioContext.createMediaElementSource(audio)      
        let audioAnalyser = audioContext.createAnalyser()
        canvasContext = canvas.getContext("2d")
        audioContextSrc.connect(audioAnalyser)
        audioAnalyser.connect(audioContext.destination)
        
        // Gán FFT size là 2048 cho Analyser        
        audioAnalyser.fftSize = 1024;
        let analyserFrequencyLength = audioAnalyser.frequencyBinCount
        let frequencyDataArray = new Uint8Array(analyserFrequencyLength)
        // Lấy width và height của canvas
        let canvasWith = canvas.width
        let canvasHeight = canvas.height
        // Tính toán barWidth và barHeight
        let barWidth = (canvasWith / analyserFrequencyLength) * 1.5
        let barHeight;
        let barIndex = 0
        const renderFrame = () => {
        window.requestAnimationFrame(renderFrame);
          barIndex = 0;
          audioAnalyser.getByteFrequencyData(frequencyDataArray)
          canvasContext.fillStyle = "#090214";
          canvasContext.fillRect(0, 0, canvasWith, canvasHeight)
          for (let i = 0; i < analyserFrequencyLength; i++) {
            barHeight = frequencyDataArray[i]+ 1
            // Tạo màu cho thanh bar
            let rgbRed = barHeight + (15 * (i / analyserFrequencyLength))
            let rgbGreen = 255 * (i / analyserFrequencyLength)
            let rgbBlue = 10;

            // Điền màu và vẽ bar
            canvasContext.fillStyle = "rgb("+ rgbRed +", "+ rgbGreen +", "+ rgbBlue +")"
            canvasContext.fillRect(barIndex, (canvasHeight - barHeight), barWidth, barHeight)
            barIndex += (barWidth + 1)
          }
        }
        renderFrame();
    },
    handleEvents() {
        const _this = this
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        playBtn.onclick = () => {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        audio.onplay = () => {
            _this.isPlaying = true
            player.classList.add("playing")
            setTimeout(() =>{
                videoBg.classList.add("visible")
                heading.classList.add("playing")
            },300)
            _this.renderEqualizer()
            cdThumbAnimate.play()

        }
        audio.onpause = () => {
            _this.isPlaying = false
            player.classList.remove("playing")
            setTimeout(() =>{
                videoBg.classList.remove("visible")
                heading.classList.remove("playing")
            },300)
            cdThumbAnimate.pause()
        }
        let checkOnmouseAndTouch = true;
        progress.onmousedown = () => {
            checkOnmouseAndTouch = false;
        }

        progress.ontouchstart = () => {
            checkOnmouseAndTouch = false;
        }
        volume.onmousedown = () => {
            checkOnmouseAndTouch = false;
        }

        volume.ontouchstart = () => {
            checkOnmouseAndTouch = false;
        }
        audio.ontimeupdate = () => {
            if (audio.duration && checkOnmouseAndTouch) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
                // _this.setConfig('currentTime', audio.currentTime)
            }
            
        }
        volume.onchange = e => {
            audio.volume = e.target.value
            checkOnmouseAndTouch = true
        }
        volumeBtn.onclick = () => {
            if(volumeBtn.classList.contains("active")){
                volumeBtn.classList.remove("active")
                volume.classList.add("show")
                audio.muted = false
            }else {
                volumeBtn.classList.add("active")
                volume.classList.remove("show")
                audio.muted = true
            }
        }
        progress.onchange = e => {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
            ctime.textContent = this.formatTimes(audio.currentTime)
            checkOnmouseAndTouch = true

        }
        
        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            
        }
        prevBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom
            // _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom);
            
        }
        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            // _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat);
            
        }
        audio.onended = () => {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        playlist.onclick = (e) => {
            const songNode = e.target.closest(".song:not(.active)")
            if(songNode){
                _this.currentIndex = Number(songNode.dataset.index)
                _this.loadCurrentSong()
                _this.render()
                audio.play()
                if(playlist.classList.contains("active")){
                    playlist.classList.remove("active")
                    playListShow.classList.remove("active")
                }
            }
        }
        playListShow.onclick = () => {
            playListShow.classList.toggle("active")
            playlist.classList.toggle("active")
        }
        
    },
    scrollToActiveSong() {
        setTimeout(() => {
            document.querySelector(".song.active").scrollIntoView(
                {
                    behavior: 'smooth',
                    block: "end",
                    inline: "nearest"
                }
            )
        },500)
    },
    formatTimes(seconds) {
        return [
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
        ]
            .join(":")
            .replace(/\b(\d)\b/g, "0$1")
    },
    loadCurrentSong() {
        heading.textContent = this.currentSong.name
        author.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        volume.value = audio.volume = 1
        setInterval(() => {
            ctime.textContent = this.formatTimes(audio.currentTime)
        },10)
        audio.oncanplay = () => {
            dtime.textContent = this.formatTimes(audio.duration)
        }
        canvas.width= window.innerWidth
        canvas.height= window.innerHeight
        // if(this.currentIndex == this.config.currentIndex){
        //     audio.currentTime = this.config.currentTime
        // }else{
        //     audio.currentTime = 0
        // }
        // this.setConfig('currentIndex', this.currentIndex)
    },
    // loadConfig: function (){
    //     this.isRandom = this.config.isRandom || this.isRandom;
    //     this.isRepeat = this.config.isRepeat || this.isRepeat;
    //     this.currentIndex = this.config.currentIndex || this.currentIndex;
    //     this.currentTime = this.config.currentTime || this.currentTime;
    //     randomBtn.classList.toggle('active',this.isRandom);
    //     repeatBtn.classList.toggle('active',this.isRepeat);
 
    // },
    nextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start() {
        // this.loadConfig()
        this.defineProperties()

        this.handleEvents()

        this.loadCurrentSong()

        this.render()

    }
}
app.start();