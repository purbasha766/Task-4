const albumArt = document.getElementById('album-art');
const songTitle = document.getElementById('song-title');
const artistName = document.getElementById('artist-name');
const progressBar = document.getElementById('progress-bar');
const currentTimeSpan = document.getElementById('current-time');
const totalDurationSpan = document.getElementById('total-duration');
const prevBtn = document.getElementById('prev-btn');
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = document.getElementById('play-pause-icon');
const nextBtn = document.getElementById('next-btn');
const volumeSlider = document.getElementById('volume-slider');
const playlistUl = document.getElementById('playlist');

const audio = new Audio();

const playlist = [
    {
        title: 'Dil Bechara',
        artist: 'A.R. Rahman',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
        img: 'https://placehold.co/224x224/E11D48/FFFFFF?text=Dil+Bechara' // Red-500
    },
    {
        title: 'Kabhi Khushi Kabhie Gham',
        artist: 'Lata Mangeshkar, Jatin-Lalit',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder audio
        img: 'https://placehold.co/224x224/F59E0B/FFFFFF?text=K3G' // Amber-500
    },
    {
        title: 'Kesariya',
        artist: 'Pritam, Arijit Singh',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder audio
        img: 'https://placehold.co/224x224/06B6D4/FFFFFF?text=Kesariya' // Cyan-500
    },
    {
        title: 'Jhoome Jo Pathaan',
        artist: 'Vishal-Sheykhar, Arijit Singh',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', // Placeholder audio
        img: 'https://placehold.co/224x224/4F46E5/FFFFFF?text=Pathaan' // Indigo-500
    },
    {
        title: 'Pasoori',
        artist: 'Ali Sethi, Shae Gill',
        src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', // Placeholder audio
        img: 'https://placehold.co/224x224/16A34A/FFFFFF?text=Pasoori' // Green-500
    }
];

let currentSongIndex = 0;
let isPlaying = false; // Track if the song is currently playing or should be playing

/**
 * Loads a song into the audio player based on its index in the playlist.
 * Updates UI elements like title, artist, and album art.
 * @param {number} index - The index of the song to load.
 * @param {boolean} shouldAutoPlay - Whether to automatically play the song after loading.
 */
function loadSong(index, shouldAutoPlay = false) {
    // Ensure the index is within the valid range of the playlist
    if (index < 0) {
        currentSongIndex = playlist.length - 1; // Loop back to the last song
    } else if (index >= playlist.length) {
        currentSongIndex = 0; // Loop back to the first song
    } else {
        currentSongIndex = index;
    }

    const song = playlist[currentSongIndex];
    audio.src = song.src;
    audio.load(); // Explicitly load the new audio

    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumArt.src = song.img;
    albumArt.alt = `${song.title} Album Art`;

    // Reset progress bar and time display
    progressBar.value = 0;
    currentTimeSpan.textContent = '0:00';
    totalDurationSpan.textContent = '0:00';

    // Mark the current song in the playlist UI
    updatePlaylistUI();

    // Set the `isPlaying` flag based on whether it *should* autoplay
    // or if it was already playing and we are just changing songs
    isPlaying = shouldAutoPlay; // This flag indicates the *desired* state

    // Update icon immediately based on the desired state
    if (isPlaying) {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
    } else {
        // If not autoplaying, ensure it's paused and icon is correct
        audio.pause(); // Ensure previous audio is paused if not intending to play
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    }
}

/**
 * Plays the current song.
 * Updates the play/pause icon to show 'pause'.
 */
function playSong() {
    audio.play().catch(error => {
        console.error("Error playing song:", error);
        // If play() fails (e.g., autoplay blocked), revert state and show play button
        isPlaying = false;
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
    });
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
}

/**
 * Pauses the current song.
 * Updates the play/pause icon to show 'play'.
 */
function pauseSong() {
    audio.pause();
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
}

/**
 * Toggles between play and pause states for the current song.
 */
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
        isPlaying = false;
    } else {
        playSong();
        isPlaying = true;
    }
}

/**
 * Loads and plays the next song in the playlist.
 * If at the end, it loops back to the first song.
 */
function playNextSong() {
    loadSong(currentSongIndex + 1, true); // Pass true to autoPlay
}

/**
 * Loads and plays the previous song in the playlist.
 * If at the beginning, it loops back to the last song.
 */
function playPrevSong() {
    loadSong(currentSongIndex - 1, true); // Pass true to autoPlay
}

/**
 * Formats time from seconds into a "minutes:seconds" string.
 * @param {number} seconds - The time in seconds.
 * @returns {string} Formatted time string.
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Renders the playlist in the UI and attaches click event listeners.
 */
function renderPlaylist() {
    playlistUl.innerHTML = ''; // Clear existing list items
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('flex', 'items-center', 'py-2', 'px-3', 'rounded-md', 'cursor-pointer', 'hover:bg-gray-600', 'transition-colors', 'duration-150');
        li.innerHTML = `
                    <img src="${song.img}" alt="${song.title} thumbnail" class="w-10 h-10 rounded-md mr-3 object-cover">
                    <div>
                        <p class="font-medium text-gray-100">${song.title}</p>
                        <p class="text-sm text-gray-400">${song.artist}</p>
                    </div>
                `;
        li.dataset.index = index; // Store the song index
        li.addEventListener('click', () => {
            loadSong(index, true); // Load and play the clicked song
        });
        playlistUl.appendChild(li);
    });
}

/**
 * Updates the visual state of the playlist items to highlight the currently playing song.
 */
function updatePlaylistUI() {
    Array.from(playlistUl.children).forEach((li, index) => {
        if (index === currentSongIndex) {
            li.classList.add('bg-blue-800', 'hover:bg-blue-800'); // Highlight current song
        } else {
            li.classList.remove('bg-blue-800', 'hover:bg-blue-800');
        }
    });
}

// --- Event Listeners ---

// Play/Pause button
playPauseBtn.addEventListener('click', togglePlayPause);

// Next song button
nextBtn.addEventListener('click', playNextSong);

// Previous song button
prevBtn.addEventListener('click', playPrevSong);

// Update progress bar and current time as song plays
audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration)) { // Ensure duration is a valid number
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    }
});

// Update total duration when song metadata is loaded
audio.addEventListener('loadedmetadata', () => {
    totalDurationSpan.textContent = formatTime(audio.duration);
});

// Listen for when enough data is buffered for playback to begin
audio.addEventListener('canplaythrough', () => {
    if (isPlaying) { // Check the flag set by loadSong
        playSong(); // Now it's safe to try playing
    }
});

// Seek song when progress bar is dragged
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

// Autoplay next song when current song ends
audio.addEventListener('ended', () => {
    isPlaying = true; // Ensure the flag is true to trigger next song to play
    playNextSong();
});

// Volume control
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100; // Volume is between 0 and 1
});

// Initial setup
window.onload = () => {
    // Load the first song when the page loads, but don't autoplay initially
    loadSong(currentSongIndex, false);
    // Set initial volume
    audio.volume = volumeSlider.value / 100;
    // Render the playlist
    renderPlaylist();
};
