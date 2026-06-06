// Harmonify Music Player Controller

// --- Track Database ---
const playlist = [
    {
        id: 0,
        title: "Synthwave Breeze",
        artist: "Retro Wave",
        album: "Cyber Drive",
        src: "songs/synthwave_breeze.wav",
        cover: "images/cover_synthwave.png",
        duration: "0:15",
        glow: "rgba(147, 51, 234, 0.25)" // Neon Purple
    },
    {
        id: 1,
        title: "Lofi Chill",
        artist: "Sleepy Cat",
        album: "Lazy Rain",
        src: "songs/lofi_chill.wav",
        cover: "images/cover_lofi.png",
        duration: "0:15",
        glow: "rgba(249, 115, 22, 0.25)" // Neon Orange
    },
    {
        id: 2,
        title: "Ambient Orbit",
        artist: "Nebula Drone",
        album: "Cosmic Swell",
        src: "songs/ambient_orbit.wav",
        cover: "images/cover_ambient.png",
        duration: "0:15",
        glow: "rgba(59, 130, 246, 0.25)" // Space Blue
    },
    {
        id: 3,
        title: "Chiptune Hero",
        artist: "Pixel Kid",
        album: "Arcade Run",
        src: "songs/chiptune_hero.wav",
        cover: "images/cover_chiptune.png",
        duration: "0:15",
        glow: "rgba(16, 185, 129, 0.25)" // Retro Green
    },
    {
        id: 4,
        title: "Techno Pulse",
        artist: "Lazer Grid",
        album: "Laser Rave",
        src: "songs/techno_pulse.wav",
        cover: "images/cover_techno.png",
        duration: "0:15",
        glow: "rgba(236, 72, 153, 0.25)" // Rave Pink
    },
    {
        id: 5,
        title: "Pavala Malli",
        artist: "Kural",
        album: "Poomalai",
        src: "songs/pavala_malli.wav",
        cover: "images/cover_pavala_malli.png",
        duration: "0:15",
        glow: "rgba(234, 179, 8, 0.25)" // Jasmine Yellow-Gold
    },
    {
        id: 6,
        title: "Chaudhary",
        artist: "Desert Folk",
        album: "Virasat",
        src: "songs/chaudhary.wav",
        cover: "images/cover_chaudhary.png",
        duration: "0:15",
        glow: "rgba(220, 38, 38, 0.25)" // Desert Red
    },
    {
        id: 7,
        title: "Aalaporaan Tamilan",
        artist: "Isai",
        album: "Mersal",
        src: "songs/aalaporaan_tamilan.wav",
        cover: "images/cover_aalaporaan_tamilan.png",
        duration: "0:15",
        glow: "rgba(244, 63, 94, 0.25)" // Royal Crimson
    },
    {
        id: 8,
        title: "Enjoy Enjaami",
        artist: "Therukural",
        album: "Rooted Roots",
        src: "songs/enjoy_enjaami.wav",
        cover: "images/cover_enjoy_enjaami.png",
        duration: "0:15",
        glow: "rgba(16, 185, 129, 0.25)" // Tribal Green
    },
    {
        id: 9,
        title: "Blinding Lights",
        artist: "Star Wave",
        album: "After Hours",
        src: "songs/blinding_lights.wav",
        cover: "images/cover_blinding_lights.png",
        duration: "0:15",
        glow: "rgba(6, 182, 212, 0.25)" // Neon Cyan
    },
    {
        id: 10,
        title: "Shape of You",
        artist: "Sheeran Star",
        album: "Divide",
        src: "songs/shape_of_you.wav",
        cover: "images/cover_shape_of_you.png",
        duration: "0:15",
        glow: "rgba(59, 130, 246, 0.25)" // Soft Blue
    },
    {
        id: 11,
        title: "Kabira",
        artist: "Sufi Chord",
        album: "Yeh Jawaani Hai Deewani",
        src: "songs/kabira.wav",
        cover: "images/cover_kabira.png",
        duration: "0:15",
        glow: "rgba(245, 158, 11, 0.25)" // Warm Amber
    },
    {
        id: 12,
        title: "Rowdy Baby",
        artist: "Rowdy Beat",
        album: "Maari 2",
        src: "songs/rowdy_baby.wav",
        cover: "images/cover_rowdy_baby.png",
        duration: "0:15",
        glow: "rgba(236, 72, 153, 0.25)" // Vibrant Pink
    },
    {
        id: 13,
        title: "Stay",
        artist: "Kid Star",
        album: "F*CK LOVE 3",
        src: "songs/stay.wav",
        cover: "images/cover_stay.png",
        duration: "0:15",
        glow: "rgba(139, 92, 246, 0.25)" // Violet
    },
    {
        id: 14,
        title: "Arabic Kuthu",
        artist: "Ani Lazer",
        album: "Beast",
        src: "songs/arabic_kuthu.wav",
        cover: "images/cover_arabic_kuthu.png",
        duration: "0:15",
        glow: "rgba(20, 184, 166, 0.25)" // Teal
    }
];

// --- Audio Engine & State ---
const audio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 = no repeat, 1 = repeat all, 2 = repeat one
let shuffledIndices = [];
let currentShufflePointer = 0;
let savedVolume = 0.8;
let likedTracks = JSON.parse(localStorage.getItem('harmonify_liked_tracks')) || [];

// --- DOM Elements ---
const tracklistRows = document.getElementById('tracklist-rows');
const searchInput = document.getElementById('search-tracks');
const playerAlbumArt = document.getElementById('player-album-art');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const bannerTitle = document.getElementById('banner-title');
const bannerArtist = document.getElementById('banner-artist');
const bannerAlbum = document.getElementById('banner-album');
const bannerPlayBtn = document.getElementById('banner-play-btn');
const ambientGlow = document.getElementById('ambient-glow');
const dynamicBanner = document.getElementById('dynamic-banner');

// Control Buttons
const playPauseBtn = document.getElementById('btn-play-pause');
const playPauseIcon = document.getElementById('play-pause-icon');
const prevBtn = document.getElementById('btn-prev');
const nextBtn = document.getElementById('btn-next');
const stopBtn = document.getElementById('btn-stop');
const shuffleBtn = document.getElementById('btn-shuffle');
const repeatBtn = document.getElementById('btn-repeat');
const repeatModeBadge = document.getElementById('repeat-mode-badge');
const likeBtn = document.getElementById('player-like-btn');

// Seek and Volume Sliders
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-fill');
const progressWrapper = document.getElementById('progress-slider-wrapper');
const timeCurrent = document.getElementById('time-current');
const timeTotal = document.getElementById('time-total');

const muteBtn = document.getElementById('btn-mute');
const volumeIcon = document.getElementById('volume-icon');
const volumeSlider = document.getElementById('volume-slider');
const volumeFill = document.getElementById('volume-fill');
const volumeWrapper = document.querySelector('.volume-slider-wrapper');

// Modal Elements
const shortcutsToggle = document.getElementById('btn-shortcuts-toggle');
const shortcutsModal = document.getElementById('shortcuts-modal');
const modalClose = document.getElementById('modal-close');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Playlist Table
    renderTracklist(playlist);

    // 2. Load the first track without playing it
    loadTrack(currentTrackIndex, false);

    // 3. Setup volume slider defaults
    audio.volume = savedVolume;
    volumeSlider.value = savedVolume * 100;
    updateVolumeSliderUI(savedVolume);

    // 4. Initialize event listeners
    setupEventListeners();
});

// --- Track Loading & Playback ---

function loadTrack(index, shouldPlay = true) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrackIndex = index;
    const track = playlist[currentTrackIndex];

    // Load audio source
    audio.src = track.src;
    audio.load();

    // Update DOM Details
    playerAlbumArt.src = track.cover;
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist;
    
    bannerTitle.textContent = track.title;
    bannerArtist.textContent = track.artist;
    bannerAlbum.textContent = track.album;

    // Reset Progress
    progressBar.value = 0;
    progressFill.style.width = '0%';
    progressWrapper.style.setProperty('--seek-percent', '0%');
    timeCurrent.textContent = "0:00";
    timeTotal.textContent = track.duration;

    // Handle Active Row Highlights
    updateRowSelection();

    // Update Dynamic Theme Colors (Ambient Glow & Jumbotron Radial Overlay)
    document.documentElement.style.setProperty('--ambient-glow', track.glow);
    
    // Update Favorite Like State
    updateLikeButtonUI();

    // Handle Autoplay state
    if (shouldPlay) {
        playAudio();
    } else {
        pauseAudio();
    }
}

function playAudio() {
    audio.play().then(() => {
        isPlaying = true;
        playPauseIcon.innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`; // Pause SVG Path
        playPauseBtn.title = "Pause (Space)";
        bannerPlayBtn.querySelector('span').textContent = "PAUSE";
        bannerPlayBtn.querySelector('svg').innerHTML = `<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>`;
        playerAlbumArt.classList.add('playing');
        
        // Update track rows
        const currentActiveRow = document.querySelector(`.track-row[data-index="${currentTrackIndex}"]`);
        if (currentActiveRow) {
            currentActiveRow.classList.add('playing');
        }
    }).catch(err => {
        console.error("Audio playback error:", err);
    });
}

function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playPauseIcon.innerHTML = `<path d="M8 5v14l11-7z"/>`; // Play SVG Path
    playPauseBtn.title = "Play (Space)";
    bannerPlayBtn.querySelector('span').textContent = "PLAY";
    bannerPlayBtn.querySelector('svg').innerHTML = `<path d="M8 5v14l11-7z"/>`;
    playerAlbumArt.classList.remove('playing');

    // Update track rows
    const allRows = document.querySelectorAll('.track-row');
    allRows.forEach(row => row.classList.remove('playing'));
}

function togglePlay() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function stopAudio() {
    pauseAudio();
    audio.currentTime = 0;
    progressBar.value = 0;
    progressFill.style.width = '0%';
    progressWrapper.style.setProperty('--seek-percent', '0%');
    timeCurrent.textContent = "0:00";
}

// --- Playlist Control Logic (Next, Prev, Shuffle, Repeat) ---

function playNext() {
    if (repeatMode === 2) {
        // Repeat One
        loadTrack(currentTrackIndex, true);
        return;
    }

    if (isShuffle) {
        currentShufflePointer++;
        if (currentShufflePointer >= shuffledIndices.length) {
            if (repeatMode === 1) {
                // Repeat All is active - reshuffle and loop
                generateShuffleQueue();
                currentShufflePointer = 0;
            } else {
                // End of playlist, stop
                currentShufflePointer = shuffledIndices.length - 1;
                stopAudio();
                return;
            }
        }
        loadTrack(shuffledIndices[currentShufflePointer], true);
    } else {
        let nextIndex = currentTrackIndex + 1;
        if (nextIndex >= playlist.length) {
            if (repeatMode === 1) {
                nextIndex = 0; // Loop to start
            } else {
                stopAudio();
                return;
            }
        }
        loadTrack(nextIndex, true);
    }
}

function playPrev() {
    // If track is more than 3 seconds in, restart the track
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    if (isShuffle) {
        currentShufflePointer--;
        if (currentShufflePointer < 0) {
            if (repeatMode === 1) {
                currentShufflePointer = shuffledIndices.length - 1; // loop to back
            } else {
                currentShufflePointer = 0;
            }
        }
        loadTrack(shuffledIndices[currentShufflePointer], true);
    } else {
        let prevIndex = currentTrackIndex - 1;
        if (prevIndex < 0) {
            if (repeatMode === 1) {
                prevIndex = playlist.length - 1; // Loop to end
            } else {
                prevIndex = 0;
            }
        }
        loadTrack(prevIndex, true);
    }
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    if (isShuffle) {
        shuffleBtn.classList.add('active');
        generateShuffleQueue();
    } else {
        shuffleBtn.classList.remove('active');
    }
}

function generateShuffleQueue() {
    // Fisher-Yates Shuffle algorithm
    shuffledIndices = playlist.map(track => track.id);
    for (let i = shuffledIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
    }
    // Set pointer to the current track's position in shuffle queue to prevent repeating it
    currentShufflePointer = shuffledIndices.indexOf(currentTrackIndex);
    if (currentShufflePointer === -1) {
        currentShufflePointer = 0;
    }
}

function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    
    // UI states: 0 = Off (white/grey), 1 = Repeat All (green), 2 = Repeat One (green + badge)
    if (repeatMode === 0) {
        repeatBtn.classList.remove('active');
        repeatBtn.classList.remove('repeat-one');
        repeatBtn.title = "Toggle Repeat (r) - Off";
    } else if (repeatMode === 1) {
        repeatBtn.classList.add('active');
        repeatBtn.classList.remove('repeat-one');
        repeatBtn.title = "Toggle Repeat (r) - Repeat All";
    } else if (repeatMode === 2) {
        repeatBtn.classList.add('active');
        repeatBtn.classList.add('repeat-one');
        repeatBtn.title = "Toggle Repeat (r) - Repeat One";
    }
}

// --- Volume Engine ---

function adjustVolume(amount) {
    let newVolume = audio.volume + amount;
    newVolume = Math.max(0, Math.min(1, newVolume)); // Clamp 0 to 1
    audio.volume = newVolume;
    volumeSlider.value = newVolume * 100;
    updateVolumeSliderUI(newVolume);
    if (newVolume > 0) {
        audio.muted = false;
        savedVolume = newVolume;
    }
}

function toggleMute() {
    audio.muted = !audio.muted;
    if (audio.muted) {
        volumeSlider.value = 0;
        updateVolumeSliderUI(0);
        volumeIcon.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`; // Muted/Slash Icon
    } else {
        volumeSlider.value = savedVolume * 100;
        updateVolumeSliderUI(savedVolume);
    }
}

function updateVolumeSliderUI(val) {
    const percent = val * 100;
    volumeFill.style.width = `${percent}%`;
    volumeWrapper.style.setProperty('--volume-percent', `${percent}%`);

    // Dynamic speaker icon representation
    if (val === 0 || audio.muted) {
        volumeIcon.innerHTML = `<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>`;
    } else if (val < 0.3) {
        volumeIcon.innerHTML = `<path d="M7 9v6h4l5 5V4L7 9H3zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>`; // Speaker Low
    } else {
        volumeIcon.innerHTML = `<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>`; // Speaker High
    }
}

// --- Like Favoriting Logic ---

function toggleLike() {
    const track = playlist[currentTrackIndex];
    const index = likedTracks.indexOf(track.id);
    
    if (index === -1) {
        likedTracks.push(track.id);
    } else {
        likedTracks.splice(index, 1);
    }
    
    localStorage.setItem('harmonify_liked_tracks', JSON.stringify(likedTracks));
    updateLikeButtonUI();
}

function updateLikeButtonUI() {
    const track = playlist[currentTrackIndex];
    if (likedTracks.includes(track.id)) {
        likeBtn.classList.add('liked');
        likeBtn.querySelector('svg').style.fill = '#e91429';
    } else {
        likeBtn.classList.remove('liked');
        likeBtn.querySelector('svg').style.fill = 'currentColor';
    }
}

// --- Time Formatting Helper ---

function formatTime(secs) {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// --- DOM Rendering & Updating UI ---

function renderTracklist(tracks) {
    tracklistRows.innerHTML = '';
    
    if (tracks.length === 0) {
        tracklistRows.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 32px; color: var(--text-muted);">No songs found.</td></tr>`;
        return;
    }

    tracks.forEach((track, i) => {
        const row = document.createElement('tr');
        row.className = 'track-row';
        row.setAttribute('data-id', track.id);
        row.setAttribute('data-index', track.id);
        
        row.innerHTML = `
            <td class="col-index">
                <div class="row-index-container">
                    <span class="row-num">${i + 1}</span>
                    <svg class="row-play-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    <svg class="row-speaker-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                    <div class="visualizer-bars">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </td>
            <td class="col-title">
                <div class="title-cell">
                    <img src="${track.cover}" alt="${track.title} Album Art">
                    <div class="title-info">
                        <span class="song-title-text">${track.title}</span>
                        <span class="song-artist-text">${track.artist}</span>
                    </div>
                </div>
            </td>
            <td class="col-album">
                <span class="song-album-text">${track.album}</span>
            </td>
            <td class="col-duration">
                <span class="song-duration-text">${track.duration}</span>
            </td>
        `;

        // Row clicks load track
        row.addEventListener('click', (e) => {
            // Prevent triggering double actions if clicking small utility inside row
            if (currentTrackIndex === track.id) {
                togglePlay();
            } else {
                loadTrack(track.id, true);
            }
        });

        tracklistRows.appendChild(row);
    });

    updateRowSelection();
}

function updateRowSelection() {
    const allRows = document.querySelectorAll('.track-row');
    allRows.forEach(row => {
        const rowId = parseInt(row.getAttribute('data-id'), 10);
        if (rowId === currentTrackIndex) {
            row.classList.add('active-track');
            if (isPlaying) {
                row.classList.add('playing');
            } else {
                row.classList.remove('playing');
            }
        } else {
            row.classList.remove('active-track');
            row.classList.remove('playing');
        }
    });
}

// --- Event Listeners Setup ---

function setupEventListeners() {
    // Playback Buttons
    playPauseBtn.addEventListener('click', togglePlay);
    bannerPlayBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrev);
    nextBtn.addEventListener('click', playNext);
    stopBtn.addEventListener('click', stopAudio);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    likeBtn.addEventListener('click', toggleLike);

    // Audio Engine Handlers
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progress;
            progressFill.style.width = `${progress}%`;
            progressWrapper.style.setProperty('--seek-percent', `${progress}%`);
            timeCurrent.textContent = formatTime(audio.currentTime);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        timeTotal.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        playNext();
    });

    // Seek Slider Event Input
    progressBar.addEventListener('input', (e) => {
        const seekPercent = e.target.value;
        progressFill.style.width = `${seekPercent}%`;
        progressWrapper.style.setProperty('--seek-percent', `${seekPercent}%`);
        
        if (audio.duration) {
            const newTime = (seekPercent / 100) * audio.duration;
            timeCurrent.textContent = formatTime(newTime);
        }
    });

    // Actual seek change apply
    progressBar.addEventListener('change', (e) => {
        if (audio.duration) {
            audio.currentTime = (e.target.value / 100) * audio.duration;
        }
    });

    // Volume Slider Event Input
    volumeSlider.addEventListener('input', (e) => {
        const val = e.target.value / 100;
        audio.volume = val;
        updateVolumeSliderUI(val);
        if (val > 0) {
            audio.muted = false;
            savedVolume = val;
        }
    });

    // Search bar logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const filtered = playlist.filter(track => {
            return track.title.toLowerCase().includes(query) || 
                   track.artist.toLowerCase().includes(query) ||
                   track.album.toLowerCase().includes(query);
        });
        renderTracklist(filtered);
    });

    // Keyboard Shortcuts Modal toggling
    shortcutsToggle.addEventListener('click', () => {
        shortcutsModal.classList.add('active');
        shortcutsModal.setAttribute('aria-hidden', 'false');
    });

    modalClose.addEventListener('click', closeShortcutsModal);
    shortcutsModal.addEventListener('click', (e) => {
        if (e.target === shortcutsModal) {
            closeShortcutsModal();
        }
    });

    // Keyboard Hotkey Global Listener
    window.addEventListener('keydown', handleGlobalKeydowns);
}

function closeShortcutsModal() {
    shortcutsModal.classList.remove('active');
    shortcutsModal.setAttribute('aria-hidden', 'true');
}

// --- Keyboard Shortcuts Manager ---

function handleGlobalKeydowns(e) {
    // Skip hotkeys if user is focusing the search bar
    if (document.activeElement === searchInput) {
        return;
    }

    const key = e.key.toLowerCase();

    // Hotkeys mapper
    switch (e.key) {
        case ' ':
            e.preventDefault(); // Prevent scrolling page with spacebar
            togglePlay();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            audio.currentTime = Math.max(0, audio.currentTime - 5);
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (audio.duration) {
                audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            adjustVolume(0.05);
            break;
        case 'ArrowDown':
            e.preventDefault();
            adjustVolume(-0.05);
            break;
        case 'Escape':
            e.preventDefault();
            // Close modal if open
            if (shortcutsModal.classList.contains('active')) {
                closeShortcutsModal();
            } else {
                stopAudio();
            }
            break;
        default:
            break;
    }

    // Single-character hotkeys
    if (key === 'm') {
        toggleMute();
    } else if (key === 's') {
        toggleShuffle();
    } else if (key === 'r') {
        toggleRepeat();
    }
}
