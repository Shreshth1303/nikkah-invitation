import './style.css';
import QRCode from 'qrcode';
import { initFlowerEffect } from './flowers.js';

/* ============================================================
   CONFIGURATION
   ============================================================ */

// Wedding date/time — change this single variable to update everywhere
const WEDDING_DATE = new Date('2026-11-29T18:00:00+05:30'); // After Maghrib ~6pm IST

/* ============================================================
   COUNTDOWN
   ============================================================ */

function getCountdownValues() {
  const now = new Date();
  const diff = WEDDING_DATE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, mins: 0, secs: 0, complete: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return { days, hours, mins, secs, complete: false };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function updateCountdowns() {
  const { days, hours, mins, secs, complete } = getCountdownValues();

  // Cover countdown
  const coverDays = document.getElementById('cover-days');
  const coverHours = document.getElementById('cover-hours');
  const coverMins = document.getElementById('cover-mins');
  const coverSecs = document.getElementById('cover-secs');

  if (coverDays) {
    coverDays.textContent = pad(days);
    coverHours.textContent = pad(hours);
    coverMins.textContent = pad(mins);
    coverSecs.textContent = pad(secs);
  }

  // Main countdown
  const mainDays = document.getElementById('main-days');
  const mainHours = document.getElementById('main-hours');
  const mainMins = document.getElementById('main-mins');
  const mainSecs = document.getElementById('main-secs');
  const mainCountdown = document.getElementById('main-countdown');
  const countdownComplete = document.getElementById('countdown-complete');

  if (mainDays) {
    if (complete) {
      mainCountdown.style.display = 'none';
      countdownComplete.classList.remove('hidden');
    } else {
      mainDays.textContent = pad(days);
      mainHours.textContent = pad(hours);
      mainMins.textContent = pad(mins);
      mainSecs.textContent = pad(secs);
    }
  }
}

// Start countdown
updateCountdowns();
setInterval(updateCountdowns, 1000);

/* ============================================================
   OPENING ANIMATION
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animItems = document.querySelectorAll('.anim-item');
let animationComplete = false;
let animationFast = false;

function runOpeningAnimation() {
  if (reducedMotion) {
    // Show everything immediately
    animItems.forEach(item => item.classList.add('visible'));
    animationComplete = true;
    return;
  }

  animItems.forEach(item => {
    const delay = parseFloat(item.dataset.delay) || 0;
    const effectiveDelay = animationFast ? Math.min(delay * 200, 800) : delay * 1000;

    setTimeout(() => {
      item.classList.add('visible');
    }, effectiveDelay);
  });

  // Mark animation complete
  const maxDelay = animationFast ? 1600 : 7500;
  setTimeout(() => {
    animationComplete = true;
  }, maxDelay);
}

// Allow tapping to speed up animation
document.addEventListener('click', () => {
  if (!animationComplete && !animationFast) {
    animationFast = true;
    animItems.forEach(item => {
      item.style.transitionDuration = '0.3s';
      item.classList.add('visible');
    });
    setTimeout(() => {
      animationComplete = true;
    }, 400);
  }
}, { once: false });

// Start animation on load
window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    runOpeningAnimation();
  });
});

// Fallback: start after a short delay if load event has already fired
if (document.readyState === 'complete') {
  requestAnimationFrame(() => {
    runOpeningAnimation();
  });
}

/* ============================================================
   OPEN INVITATION TRANSITION
   ============================================================ */

const coverScreen = document.getElementById('cover-screen');
const mainInvitation = document.getElementById('main-invitation');
const openBtn = document.getElementById('open-invitation-btn');
const navFab = document.getElementById('nav-fab');

// Start dynamic flower petals effect on the entry page
const flowerEffect = initFlowerEffect();

openBtn.addEventListener('click', (e) => {
  e.stopPropagation();

  // Celebratory petal burst from button position
  const rect = openBtn.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  if (flowerEffect && flowerEffect.burst) {
    flowerEffect.burst(originX, originY, 45);
  }

  // Start soothing background music on user opening interaction
  startMusic();

  // Start split animation
  coverScreen.classList.add('splitting');

  // Show main invitation
  setTimeout(() => {
    mainInvitation.classList.add('visible');
    mainInvitation.setAttribute('aria-hidden', 'false');
  }, 400);

  // Remove cover and gracefully clean up flower canvas
  setTimeout(() => {
    coverScreen.classList.add('hidden');
    coverScreen.style.display = 'none';
    if (flowerEffect && flowerEffect.stop) {
      flowerEffect.stop();
    }
    // Show nav FAB
    navFab.classList.remove('hidden');
    // Initialize scroll reveals
    initScrollReveal();
  }, 1500);
});

/* ============================================================
   SCROLL REVEAL
   ============================================================ */

function initScrollReveal() {
  if (reducedMotion) {
    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.classList.add('revealed');
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================================
   BOTTOM SHEET NAVIGATION
   ============================================================ */

const bottomSheet = document.getElementById('bottom-sheet');
const backdrop = document.getElementById('bottom-sheet-backdrop');
const navLinks = document.querySelectorAll('[data-nav]');

function openSheet() {
  backdrop.classList.remove('hidden');
  bottomSheet.classList.remove('hidden');

  // Force reflow before adding visible class
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      backdrop.classList.add('visible');
      bottomSheet.classList.add('visible');
    });
  });
}

function closeSheet() {
  backdrop.classList.remove('visible');
  bottomSheet.classList.remove('visible');

  setTimeout(() => {
    backdrop.classList.add('hidden');
  }, 400);
}

navFab.addEventListener('click', (e) => {
  e.stopPropagation();
  openSheet();
});

backdrop.addEventListener('click', closeSheet);

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    closeSheet();
  });
});

/* ============================================================
   QR CODE GENERATION
   ============================================================ */

async function generateQRCodes() {
  const nikahUrl = "https://www.google.com/maps/search/Beary's+Amity+Bengaluru";
  const receptionUrl = "https://www.google.com/maps/search/Silvercloud+Private+Resort+Wedding+Banquet+Hall+Chalalakkal+Parappur+Kerala";

  const qrOptions = {
    width: 150,
    margin: 1,
    color: {
      dark: '#172033',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  };

  try {
    const nikahCanvas = document.getElementById('qr-nikah');
    await QRCode.toCanvas(nikahCanvas, nikahUrl, qrOptions);
    // Reset CSS dimensions so clamp() in stylesheet applies
    nikahCanvas.style.width = '';
    nikahCanvas.style.height = '';

    const receptionCanvas = document.getElementById('qr-reception');
    await QRCode.toCanvas(receptionCanvas, receptionUrl, qrOptions);
    receptionCanvas.style.width = '';
    receptionCanvas.style.height = '';
  } catch (err) {
    console.error('QR Code generation error:', err);
  }
}

generateQRCodes();

/* ============================================================
   SHARE BUTTON
   ============================================================ */

const shareBtn = document.getElementById('share-btn');
const shareCopied = document.getElementById('share-copied');

shareBtn.addEventListener('click', async () => {
  const shareData = {
    title: 'Nikah Invitation',
    text: "You're invited to the Nikah of Abdul Raheem & Shadab Fatima.",
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // User cancelled or error
      if (err.name !== 'AbortError') {
        fallbackCopy();
      }
    }
  } else {
    fallbackCopy();
  }
});

function fallbackCopy() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    shareCopied.classList.remove('hidden');
    shareCopied.classList.add('show');
    setTimeout(() => {
      shareCopied.classList.remove('show');
    }, 2500);
  }).catch(() => {
    // Final fallback
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    shareCopied.classList.remove('hidden');
    shareCopied.classList.add('show');
    setTimeout(() => {
      shareCopied.classList.remove('show');
    }, 2500);
  });
}

/* ============================================================
   MUSIC TOGGLE & AUDIO SYSTEM
   ============================================================ */

const musicFab = document.getElementById('music-fab');
const bgMusic = document.getElementById('bg-music');
const musicToast = document.getElementById('music-toast');
let isPlaying = false;
let toastTimeout = null;

function showMusicToast(msg) {
  if (!musicToast) return;
  musicToast.textContent = msg;
  musicToast.classList.remove('hidden');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    musicToast.classList.add('hidden');
  }, 3600);
}

function updateMusicUI(playing) {
  if (!musicFab) return;
  const statusText = document.getElementById('music-status-text');
  if (playing) {
    musicFab.classList.add('playing');
    musicFab.classList.remove('paused');
    musicFab.setAttribute('aria-label', 'Click to turn off music');
    musicFab.setAttribute('title', 'Click to turn off music');
    if (statusText) statusText.textContent = 'MUSIC ON';
  } else {
    musicFab.classList.remove('playing');
    musicFab.classList.add('paused');
    musicFab.setAttribute('aria-label', 'Click to turn on music');
    musicFab.setAttribute('title', 'Click to turn on music');
    if (statusText) statusText.textContent = 'MUSIC OFF';
  }
}

function fadeAudioIn(audio, targetVolume = 0.6, duration = 1200) {
  const steps = 24;
  const stepTime = duration / steps;
  const volumeStep = (targetVolume - audio.volume) / steps;
  let currentStep = 0;
  const interval = setInterval(() => {
    currentStep++;
    audio.volume = Math.min(targetVolume, Math.max(0, audio.volume + volumeStep));
    if (currentStep >= steps || audio.volume >= targetVolume) {
      audio.volume = targetVolume;
      clearInterval(interval);
    }
  }, stepTime);
}

function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.05;
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      updateMusicUI(true);
      fadeAudioIn(bgMusic, 0.6, 1200);
      showMusicToast('♫ Soothing music playing • Click button to turn off');
    }).catch((err) => {
      console.log('Autoplay interaction deferred:', err);
      updateMusicUI(false);
    });
  }
}

// Initial state: prepared but paused until user opens or clicks
updateMusicUI(false);

if (musicFab) {
  musicFab.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      updateMusicUI(false);
      showMusicToast('Music turned off');
    } else {
      bgMusic.play().then(() => {
        isPlaying = true;
        updateMusicUI(true);
        fadeAudioIn(bgMusic, 0.6, 600);
        showMusicToast('♫ Music playing • Click button to turn off');
      }).catch((err) => {
        console.log('Play failed:', err);
      });
    }
  });
}

/* ============================================================
   PREVENT HORIZONTAL SCROLL
   ============================================================ */

// Safety net: prevent any accidental horizontal overflow
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
});
