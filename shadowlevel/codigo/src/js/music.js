document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const seekBar = document.getElementById('seekBar');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const trackTitle = document.getElementById('trackTitle');
  const trackArtist = document.getElementById('trackArtist');
  const albumArt = document.getElementById('albumArt');
  const playlistUI = document.getElementById('playlistUI');
  const playerCard = document.querySelector('.player-card');
  const canvas = document.getElementById('visualizer');
  const ctx = canvas.getContext('2d');
  let audioContext;
  let analyser;
  let source;
  let bufferLength;
  let dataArray;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const playlist = [
    {
      title: "Dark Aria",
      artist: "Hiroyuki SAWANO",
      src: "../audio/musica1.mp3",
      art: "../img/music/art3.jpg"
    },
    {
      title: "REVIVƎЯ",
      artist: "Hiroyuki SAWANO",
      src: "../audio/musica2.mp3",
      art: "../img/music/art2.jpg"
    },
    {
      title: "SHADOWBORN",
      artist: "Hiroyuki SAWANO",
      src: "../audio/musica3.mp3",
      art: "../img/music/art1.jpg"
    }
  ];
  let currentTrackIndex = 0;
  let isPlaying = false;
  let isAudioAPIInitialized = false;
  function loadTrack(trackIndex) {
    const track = playlist[trackIndex];
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;
    albumArt.src = track.art;
    audioPlayer.src = track.src;
    
    updatePlaylistActive(trackIndex);
    seekBar.value = 0;
    
    if (isPlaying) {
      audioPlayer.play();
    }
  }

  function playAudio() {
    if (!isAudioAPIInitialized) {
      initAudioAPI();
    }
    audioPlayer.play();
    playPauseBtn.textContent = '❚❚';
    playerCard.classList.add('is-playing');
    isPlaying = true;
  }

  function pauseAudio() {
    audioPlayer.pause();
    playPauseBtn.textContent = '▶';
    playerCard.classList.remove('is-playing');
    isPlaying = false;
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  }

  function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
  }

  function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
  }

  function initAudioAPI() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    
    if (source) {
      source.disconnect();
    }
    source = audioContext.createMediaElementSource(audioPlayer);
    
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyser.fftSize = 512;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    isAudioAPIInitialized = true;
    drawVisualizer();
  }

  function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    if (!isPlaying || !analyser) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    analyser.getByteFrequencyData(dataArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 120;
    const bars = bufferLength * 0.7;
    const barWidth = 3;

    ctx.lineWidth = barWidth;
    ctx.shadowBlur = 10;

    for (let i = 0; i < bars; i++) {
      const barHeight = Math.pow(dataArray[i] / 255, 2) * (canvas.height * 0.25) + dataArray[i] * 0.4;
      if (barHeight < 60) {
           ctx.strokeStyle = 'rgba(169, 140, 255, 0.6)';
           ctx.shadowColor = 'rgba(169, 140, 255, 0.6)';
      } else {
           ctx.strokeStyle = 'rgba(134, 232, 255, 0.9)';
           ctx.shadowColor = 'rgba(134, 232, 255, 0.9)';
      }
      const angle = (i / bars) * Math.PI * 2 - (Math.PI / 2);
      const x1 = cx + Math.cos(angle) * radius;
      const y1 = cy + Math.sin(angle) * radius;
      const x2 = cx + Math.cos(angle) * (radius + barHeight);
      const y2 = cy + Math.sin(angle) * (radius + barHeight);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  }
  function buildPlaylistUI() {
    playlist.forEach((track, index) => {
      const li = document.createElement('li');
      li.innerHTML = `${track.title} <span class="artist">${track.artist}</span>`;
      li.dataset.index = index;
      li.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playAudio();
      });
      playlistUI.appendChild(li);
    });
  }
  
  function updatePlaylistActive(trackIndex) {
     playlistUI.querySelectorAll('li').forEach((li, index) => {
      if (index === trackIndex) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });
  }
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateTime() {
    if (!isNaN(audioPlayer.duration)) {
      seekBar.value = audioPlayer.currentTime;
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
  }

  function setDuration() {
     if (!isNaN(audioPlayer.duration)) {
      seekBar.max = audioPlayer.duration;
      totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
  }
  playPauseBtn.addEventListener('click', togglePlayPause);
  nextBtn.addEventListener('click', nextTrack);
  prevBtn.addEventListener('click', prevTrack);
  
  audioPlayer.addEventListener('timeupdate', updateTime);
  audioPlayer.addEventListener('loadedmetadata', setDuration);
  audioPlayer.addEventListener('ended', nextTrack);
  
  seekBar.addEventListener('input', () => {
    audioPlayer.currentTime = seekBar.value;
  });
  
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  buildPlaylistUI();
  loadTrack(currentTrackIndex);
});