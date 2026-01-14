// ============================================
// Sample Tracks
// ============================================
const sampleTracks = [
  {
    id: 'track-1',
    title: 'Chill Vibes',
    artist: 'SoundHelix',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    albumArt: 'https://picsum.photos/seed/album1/300/300'
  },
  {
    id: 'track-2',
    title: 'Summer Breeze',
    artist: 'SoundHelix',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    albumArt: 'https://picsum.photos/seed/album2/300/300'
  },
  {
    id: 'track-3',
    title: 'Night Drive',
    artist: 'SoundHelix',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    albumArt: 'https://picsum.photos/seed/album3/300/300'
  },
  {
    id: 'track-4',
    title: 'Morning Coffee',
    artist: 'SoundHelix',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    albumArt: 'https://picsum.photos/seed/album4/300/300'
  }
];

// ============================================
// DOM Elements
// ============================================
const audio = document.getElementById('audioPlayer');
const vinylDisc = document.getElementById('vinylDisc');
const tonearmAssembly = document.getElementById('tonearmAssembly');
const tonearm = document.getElementById('tonearm');
const albumArt = document.getElementById('albumArt');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');

// Controls
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const seekBar = document.getElementById('seekBar');
const seekProgress = document.getElementById('seekProgress');
const seekThumb = document.getElementById('seekThumb');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');

// Playlist
const playlistTracks = document.getElementById('playlistTracks');
const trackCount = document.getElementById('trackCount');
const fileInput = document.getElementById('fileInput');

// ============================================
// State
// ============================================
let tracks = [];
let currentIndex = -1;
let isPlaying = false;
let isMuted = false;
let prevVolume = 1;

// ============================================
// Utility Functions
// ============================================
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function generateId() {
  return `track-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Playlist Management
// ============================================
function addTracks(newTracks) {
  tracks = [...tracks, ...newTracks];
  renderPlaylist();
  updateTrackCount();

  if (currentIndex === -1 && tracks.length > 0) {
    selectTrack(0);
  }
}

function selectTrack(index) {
  if (index < 0 || index >= tracks.length) return;

  const wasPlaying = isPlaying;
  currentIndex = index;
  const track = tracks[index];

  audio.src = track.src;
  audio.load();

  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  albumArt.src = track.albumArt || '';

  renderPlaylist();
  updateSkipButtons();

  if (wasPlaying) {
    audio.play().catch(console.error);
  }
}

function playNext() {
  if (currentIndex < tracks.length - 1) {
    selectTrack(currentIndex + 1);
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }
}

function playPrevious() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else if (currentIndex > 0) {
    selectTrack(currentIndex - 1);
    if (isPlaying) {
      audio.play().catch(console.error);
    }
  }
}

function updateSkipButtons() {
  prevBtn.disabled = currentIndex <= 0 && audio.currentTime <= 3;
  nextBtn.disabled = currentIndex >= tracks.length - 1;
}

function updateTrackCount() {
  trackCount.textContent = `${tracks.length} track${tracks.length !== 1 ? 's' : ''}`;
}

function renderPlaylist() {
  playlistTracks.innerHTML = tracks.map((track, index) => `
    <div class="playlist-item ${index === currentIndex ? 'active' : ''}" data-index="${index}">
      <img src="${track.albumArt || ''}" alt="" class="playlist-item-art">
      <div class="playlist-item-info">
        <div class="playlist-item-title">${track.title}</div>
        <div class="playlist-item-artist">${track.artist}</div>
      </div>
    </div>
  `).join('');

  playlistTracks.querySelectorAll('.playlist-item').forEach(item => {
    item.addEventListener('click', () => {
      const index = parseInt(item.dataset.index, 10);
      selectTrack(index);
      togglePlay(true);
    });
  });
}

// ============================================
// Playback Controls
// ============================================
function togglePlay(forcePlay = false) {
  if (tracks.length === 0) return;

  if (forcePlay || audio.paused) {
    audio.play().catch(console.error);
  } else {
    audio.pause();
  }
}

function updatePlayState(playing) {
  isPlaying = playing;

  playBtn.classList.toggle('playing', playing);
  vinylDisc.classList.toggle('spinning', playing);
  tonearmAssembly.classList.toggle('engaged', playing);
}

function seek(percent) {
  if (!audio.duration) return;
  audio.currentTime = percent * audio.duration;
}

function updateProgress() {
  const progress = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  seekProgress.style.width = `${progress}%`;
  seekThumb.style.left = `${progress}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);

  // Update tonearm tracking angle
  const trackingAngle = (progress / 100) * 15;
  tonearm.style.setProperty('--tracking-angle', `${trackingAngle}deg`);
}

function updateDuration() {
  durationEl.textContent = formatTime(audio.duration);
}

// ============================================
// Volume Controls
// ============================================
function setVolume(value) {
  audio.volume = value;
  volumeSlider.value = value;
  updateVolumeIcon();
}

function toggleMute() {
  if (isMuted) {
    setVolume(prevVolume);
    isMuted = false;
  } else {
    prevVolume = audio.volume;
    setVolume(0);
    isMuted = true;
  }
}

function updateVolumeIcon() {
  volumeBtn.classList.remove('low', 'muted');
  if (audio.volume === 0) {
    volumeBtn.classList.add('muted');
  } else if (audio.volume < 0.5) {
    volumeBtn.classList.add('low');
  }
}

// ============================================
// File Upload
// ============================================
function handleFileUpload(files) {
  const newTracks = Array.from(files).map(file => ({
    id: generateId(),
    title: file.name.replace(/\.[^/.]+$/, ''),
    artist: 'Local File',
    src: URL.createObjectURL(file),
    albumArt: '',
    isLocal: true
  }));

  addTracks(newTracks);
}

// ============================================
// Event Listeners
// ============================================

// Audio events
audio.addEventListener('play', () => updatePlayState(true));
audio.addEventListener('pause', () => updatePlayState(false));
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('durationchange', updateDuration);
audio.addEventListener('ended', () => {
  if (currentIndex < tracks.length - 1) {
    playNext();
    audio.play().catch(console.error);
  } else {
    updatePlayState(false);
  }
});
audio.addEventListener('error', (e) => {
  console.error('Audio error:', e);
  trackTitle.textContent = 'Error loading track';
});

// Control buttons
playBtn.addEventListener('click', () => togglePlay());
prevBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);

// Seek bar
seekBar.addEventListener('click', (e) => {
  const rect = seekBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  seek(Math.max(0, Math.min(1, percent)));
});

// Volume
volumeBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', (e) => {
  setVolume(parseFloat(e.target.value));
  isMuted = e.target.value === '0';
});

// File upload
fileInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFileUpload(e.target.files);
    e.target.value = '';
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT') return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      audio.currentTime = Math.max(0, audio.currentTime - 5);
      break;
    case 'ArrowRight':
      e.preventDefault();
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
      break;
    case 'ArrowUp':
      e.preventDefault();
      setVolume(Math.min(1, audio.volume + 0.1));
      break;
    case 'ArrowDown':
      e.preventDefault();
      setVolume(Math.max(0, audio.volume - 0.1));
      break;
  }
});

// ============================================
// Initialize
// ============================================
function init() {
  setVolume(1);
  addTracks(sampleTracks);
  updateSkipButtons();
}

init();
