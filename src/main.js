import './style.css';
import QRCode from 'qrcode';
import { initFlowerEffect } from './flowers.js';

/* ============================================================
   CONFIGURATION
   ============================================================ */

// Wedding date/time — 29 November 2026, After Maghrib ~6pm IST
const WEDDING_DATE = new Date('2026-11-29T18:00:00+05:30');

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
   OPENING ANIMATION (Smooth & Elegant)
   ============================================================ */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const animItems = document.querySelectorAll('.anim-item');
let animationComplete = false;
let animationFast = false;

function runOpeningAnimation() {
  if (reducedMotion) {
    animItems.forEach(item => item.classList.add('visible'));
    animationComplete = true;
    return;
  }

  animItems.forEach(item => {
    const delay = parseFloat(item.dataset.delay) || 0;
    const effectiveDelay = animationFast ? Math.min(delay * 200, 600) : delay * 1000;

    setTimeout(() => {
      item.classList.add('visible');
    }, effectiveDelay);
  });

  const maxDelay = animationFast ? 900 : 3400;
  setTimeout(() => {
    animationComplete = true;
  }, maxDelay);
}

// Allow tapping anywhere on cover to accelerate reveal
document.addEventListener('click', () => {
  if (!animationComplete && !animationFast) {
    animationFast = true;
    animItems.forEach(item => {
      item.style.transitionDuration = '0.35s';
      item.classList.add('visible');
    });
    setTimeout(() => {
      animationComplete = true;
    }, 400);
  }
}, { once: false });

window.addEventListener('load', () => {
  requestAnimationFrame(() => {
    runOpeningAnimation();
  });
});

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

if (openBtn) {
  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    // Celebratory petal burst from button position
    const rect = openBtn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    if (flowerEffect && flowerEffect.burst) {
      flowerEffect.burst(originX, originY, 45);
    }

    // Ensure music is active on user opening interaction
    playBGM();

    // Start split animation
    coverScreen.classList.add('splitting');

    // Show main invitation
    setTimeout(() => {
      mainInvitation.classList.add('visible');
      mainInvitation.setAttribute('aria-hidden', 'false');
    }, 350);

    // Remove cover and gracefully clean up flower canvas
    setTimeout(() => {
      coverScreen.classList.add('hidden');
      coverScreen.style.display = 'none';
      if (flowerEffect && flowerEffect.stop) {
        flowerEffect.stop();
      }
      // Show nav FAB
      if (navFab) navFab.classList.remove('hidden');
      // Initialize scroll reveals
      initScrollReveal();
    }, 1400);
  });
}

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
    threshold: 0.12,
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
  if (!backdrop || !bottomSheet) return;
  backdrop.classList.remove('hidden');
  bottomSheet.classList.remove('hidden');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      backdrop.classList.add('visible');
      bottomSheet.classList.add('visible');
    });
  });
}

function closeSheet() {
  if (!backdrop || !bottomSheet) return;
  backdrop.classList.remove('visible');
  bottomSheet.classList.remove('visible');

  setTimeout(() => {
    backdrop.classList.add('hidden');
  }, 400);
}

if (navFab) {
  navFab.addEventListener('click', (e) => {
    e.stopPropagation();
    openSheet();
  });
}

if (backdrop) {
  backdrop.addEventListener('click', closeSheet);
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
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
    if (nikahCanvas) {
      await QRCode.toCanvas(nikahCanvas, nikahUrl, qrOptions);
      nikahCanvas.style.width = '';
      nikahCanvas.style.height = '';
    }

    const receptionCanvas = document.getElementById('qr-reception');
    if (receptionCanvas) {
      await QRCode.toCanvas(receptionCanvas, receptionUrl, qrOptions);
      receptionCanvas.style.width = '';
      receptionCanvas.style.height = '';
    }
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

if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'Abdhul Raheem & Shadab Fatima | Nikah Invitation',
      text: "You're cordially invited to celebrate the Nikah of Abdhul Raheem & Shadab Fatima.",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackCopy();
        }
      }
    } else {
      fallbackCopy();
    }
  });
}

function fallbackCopy() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    if (!shareCopied) return;
    shareCopied.classList.remove('hidden');
    shareCopied.classList.add('show');
    setTimeout(() => {
      shareCopied.classList.remove('show');
    }, 2500);
  }).catch(() => {
    const textArea = document.createElement('textarea');
    textArea.value = window.location.href;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);

    if (shareCopied) {
      shareCopied.classList.remove('hidden');
      shareCopied.classList.add('show');
      setTimeout(() => {
        shareCopied.classList.remove('show');
      }, 2500);
    }
  });
}

/* ============================================================
   MUSIC TOGGLE & INSTANT AUTOPLAY SYSTEM
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
  }, 3200);
}

function updateMusicUI(playing) {
  if (!musicFab) return;
  if (playing) {
    musicFab.classList.add('playing');
    musicFab.classList.remove('paused');
    musicFab.setAttribute('aria-label', 'Pause background music');
    musicFab.setAttribute('title', 'Pause background music');
  } else {
    musicFab.classList.remove('playing');
    musicFab.classList.add('paused');
    musicFab.setAttribute('aria-label', 'Play background music');
    musicFab.setAttribute('title', 'Play background music');
  }
}

function fadeAudio(audio, targetVolume, duration = 1200, onComplete) {
  const steps = 24;
  const stepTime = duration / steps;
  const startVolume = audio.volume;
  const volumeStep = (targetVolume - startVolume) / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    audio.volume = Math.min(1, Math.max(0, audio.volume + volumeStep));
    if (currentStep >= steps) {
      audio.volume = targetVolume;
      clearInterval(interval);
      if (onComplete) onComplete();
    }
  }, stepTime);
}

function playBGM() {
  if (!bgMusic || isPlaying) return;
  bgMusic.loop = true;
  bgMusic.volume = 0.05;

  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      isPlaying = true;
      updateMusicUI(true);
      fadeAudio(bgMusic, 0.55, 1400);
      showMusicToast('♫ Soothing music playing • Tap icon to pause');
    }).catch((err) => {
      console.log('Autoplay deferred by browser policy, awaiting first interaction:', err);
      isPlaying = false;
      updateMusicUI(false);
      setupFirstInteractionListener();
    });
  }
}

function setupFirstInteractionListener() {
  const events = ['pointerdown', 'touchstart', 'click', 'keydown', 'wheel', 'scroll'];
  const handler = () => {
    if (!isPlaying && bgMusic) {
      bgMusic.volume = 0.05;
      bgMusic.play().then(() => {
        isPlaying = true;
        updateMusicUI(true);
        fadeAudio(bgMusic, 0.55, 1200);
        showMusicToast('♫ Soothing music playing • Tap icon to pause');
      }).catch(() => {});
    }
    events.forEach(evt => window.removeEventListener(evt, handler, { capture: true }));
  };

  events.forEach(evt => {
    window.addEventListener(evt, handler, { capture: true, once: true });
  });
}

// Start music immediately from the very beginning
playBGM();

// Also trigger on DOMContentLoaded & window load
document.addEventListener('DOMContentLoaded', () => {
  if (!isPlaying) playBGM();
});
window.addEventListener('load', () => {
  if (!isPlaying) playBGM();
});

// Music Toggle Click Handler
if (musicFab) {
  musicFab.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      fadeAudio(bgMusic, 0, 400, () => {
        bgMusic.pause();
        isPlaying = false;
        updateMusicUI(false);
        showMusicToast('Music paused');
      });
    } else {
      bgMusic.volume = 0.05;
      bgMusic.play().then(() => {
        isPlaying = true;
        updateMusicUI(true);
        fadeAudio(bgMusic, 0.55, 600);
        showMusicToast('♫ Music playing • Tap icon to pause');
      }).catch((err) => {
        console.log('Play failed:', err);
      });
    }
  });
}

/* ============================================================
   DUAS & BLESSINGS (Interactive Guestbook)
   ============================================================ */

const DEFAULT_BLESSINGS = [
  {
    id: 'blessing-brother-raheem-sabaa',
    name: "Raheem & Sabaa",
    relation: "Brother & Sister-in-law",
    badgeClass: "brother-badge",
    avatarClass: "brother-avatar",
    initials: "RS",
    text: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fee khair! Heartiest congratulations and infinite love to my dearest brother Abdhul Raheem and our dearest bhabhi Shadab Fatima. May Allah bless your new journey together with boundless affection, peace, happiness, and eternal barakah. Ameen! 🤍✨",
    time: "Brother's Blessing",
    likes: 38
  },
  {
    id: 'blessing-groom-parents',
    name: "Mr. Shafi Aboobacker & Mrs. Shamshad Shafi",
    relation: "Parents' Blessing",
    badgeClass: "family-badge",
    avatarClass: "family-avatar",
    initials: "SS",
    text: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fee khair! May Allah shower dearest Abdhul Raheem & Shadab Fatima with endless affection, peace, good health, and divine barakah.",
    time: "Parents' Duas",
    likes: 29
  },
  {
    id: 'blessing-bride-family',
    name: "Mr. Mohammad Shujathulla & Family",
    relation: "Bride's Family",
    badgeClass: "family-badge",
    avatarClass: "family-avatar",
    initials: "MS",
    text: "May this sacred union be the beginning of a life filled with mutual trust, health, tranquility, and infinite bliss in this world and the Aakhirah. Ameen!",
    time: "Family Blessing",
    likes: 24
  },
  {
    id: 'blessing-cousins',
    name: "Brothers & Cousins",
    relation: "Cousins & Family",
    badgeClass: "family-badge",
    avatarClass: "family-avatar",
    initials: "BC",
    text: "Heartiest congratulations to our dearest brother Abdhul Raheem and lovely bhabhi Shadab Fatima! May your journey together be radiant, joyful, and filled with smiles!",
    time: "Family",
    likes: 18
  }
];

function getInitials(name) {
  if (!name) return '✦';
  const clean = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.)\s*/i, '').trim();
  const parts = clean.split(/[\s&+,/]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase() || '✦';
}

function initDuas() {
  const duaForm = document.getElementById('dua-form');
  const duaSender = document.getElementById('dua-sender');
  const duaMessage = document.getElementById('dua-message');
  const duaFeedback = document.getElementById('dua-feedback');
  const quickChips = document.querySelectorAll('.dua-chip');
  const track = document.getElementById('duas-carousel-track');
  const dotsContainer = document.getElementById('duas-dots-container');
  const prevBtn = document.getElementById('dua-prev-btn');
  const nextBtn = document.getElementById('dua-next-btn');
  const pageIndicator = document.getElementById('carousel-page-indicator');
  const countText = document.getElementById('duas-count-text');

  if (!track) return;

  // Load stored blessings
  let storedBlessings = [];
  try {
    const raw = localStorage.getItem('abdhul_shadab_duas_v2');
    if (raw) {
      storedBlessings = JSON.parse(raw);
    } else {
      const oldRaw = localStorage.getItem('abdhul_shadab_duas');
      if (oldRaw) {
        const oldList = JSON.parse(oldRaw);
        storedBlessings = oldList.filter(item => typeof item.id === 'number' && item.id > 100);
      }
    }
  } catch (e) {
    console.warn(e);
  }

  // Load liked blessings map
  let likedMap = {};
  try {
    const rawLikes = localStorage.getItem('abdhul_shadab_likes');
    if (rawLikes) likedMap = JSON.parse(rawLikes);
  } catch (e) {
    console.warn(e);
  }

  const allBlessings = [...storedBlessings, ...DEFAULT_BLESSINGS];
  let currentIndex = 0;

  function renderCarousel(highlightFirst = false) {
    const totalCount = allBlessings.length;

    if (countText) {
      countText.textContent = `${totalCount} Heartfelt ${totalCount === 1 ? 'Wish' : 'Wishes'}`;
    }

    track.innerHTML = allBlessings.map((dua, index) => {
      const isLiked = !!likedMap[dua.id];
      const displayLikes = (dua.likes || 0) + (isLiked ? 1 : 0);
      const isJustAdded = highlightFirst && index === 0;

      return `
        <article class="dua-carousel-card ${isJustAdded ? 'just-added' : ''}" data-id="${dua.id}" data-index="${index}" aria-label="Blessing from ${escapeHTML(dua.name)}">
          <div class="dua-card-header">
            <div class="dua-sender-profile">
              <div class="dua-avatar ${dua.avatarClass || ''}">${escapeHTML(dua.initials || getInitials(dua.name))}</div>
              <div class="dua-sender-meta">
                <h4 class="dua-card-sender">${escapeHTML(dua.name)}</h4>
                <span class="dua-relation-badge ${dua.badgeClass || ''}">✦ ${escapeHTML(dua.relation || 'Guest Wish')}</span>
              </div>
            </div>
            <span class="dua-card-time">${escapeHTML(dua.time || 'Warm Wish')}</span>
          </div>

          <div class="dua-card-quote-icon">“</div>
          <p class="dua-card-body">${escapeHTML(dua.text)}</p>

          <div class="dua-card-footer">
            <button type="button" class="dua-like-btn ${isLiked ? 'liked' : ''}" data-id="${dua.id}" aria-label="Send Mubarak for this blessing">
              <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
              <span class="like-label">Mubarak</span>
              <span class="like-count">${displayLikes}</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    renderDots();
    attachLikeListeners();
    updateNavUI();
  }

  function renderDots() {
    if (!dotsContainer) return;
    const total = allBlessings.length;
    dotsContainer.innerHTML = Array.from({ length: total }, (_, i) => `
      <button type="button" class="dua-dot ${i === currentIndex ? 'active' : ''}" data-index="${i}" aria-label="Go to wish ${i + 1}"></button>
    `).join('');

    dotsContainer.querySelectorAll('.dua-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
        scrollToIndex(targetIdx);
        restartAutoPlay();
      });
    });
  }

  function updateNavUI() {
    const total = allBlessings.length;
    if (pageIndicator) {
      pageIndicator.textContent = `${currentIndex + 1} / ${total}`;
    }
    if (prevBtn) {
      prevBtn.disabled = total <= 1;
    }
    if (nextBtn) {
      nextBtn.disabled = total <= 1;
    }
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.dua-dot').forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }
  }

  function scrollToIndex(index) {
    const total = allBlessings.length;
    if (total === 0) return;

    // Loop continuously around
    if (index < 0) {
      index = total - 1;
    } else if (index >= total) {
      index = 0;
    }
    currentIndex = index;

    const cards = track.querySelectorAll('.dua-carousel-card');
    if (cards[index]) {
      const card = cards[index];
      const trackPadding = parseInt(window.getComputedStyle(track).paddingLeft, 10) || 0;
      track.scrollTo({
        left: card.offsetLeft - trackPadding,
        behavior: 'smooth'
      });
    }
    updateNavUI();
  }

  // Auto-play loop for blessings cards
  let autoPlayTimer = null;
  const AUTO_PLAY_INTERVAL = 4000; // Change every 4 seconds

  function startAutoPlay() {
    stopAutoPlay();
    if (allBlessings.length <= 1) return;
    autoPlayTimer = setInterval(() => {
      scrollToIndex(currentIndex + 1);
    }, AUTO_PLAY_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Pause on hover
  track.addEventListener('mouseenter', stopAutoPlay);
  track.addEventListener('mouseleave', startAutoPlay);

  // Pause on touch interaction, resume after pause
  track.addEventListener('touchstart', stopAutoPlay, { passive: true });
  track.addEventListener('touchend', () => {
    setTimeout(startAutoPlay, 3000);
  }, { passive: true });

  // Pause when browser tab/window is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoPlay();
    else startAutoPlay();
  });

  // Scroll listener to sync indicator on mobile swipe
  let scrollTimeout = null;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const cards = track.querySelectorAll('.dua-carousel-card');
      if (!cards.length) return;
      const scrollPos = track.scrollLeft + track.offsetWidth / 2;
      let closestIdx = 0;
      let minDiff = Infinity;

      cards.forEach((c, idx) => {
        const cardCenter = c.offsetLeft + c.offsetWidth / 2;
        const diff = Math.abs(scrollPos - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      if (closestIdx !== currentIndex) {
        currentIndex = closestIdx;
        updateNavUI();
      }
    }, 60);
  }, { passive: true });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(currentIndex - 1);
      restartAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      scrollToIndex(currentIndex + 1);
      restartAutoPlay();
    });
  }

  function attachLikeListeners() {
    track.querySelectorAll('.dua-like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const countSpan = btn.querySelector('.like-count');
        const heartSpan = btn.querySelector('.heart-icon');
        const wasLiked = btn.classList.contains('liked');
        let currentLikes = parseInt(countSpan.textContent, 10) || 0;

        if (!wasLiked) {
          btn.classList.add('liked');
          likedMap[id] = true;
          countSpan.textContent = currentLikes + 1;
          if (heartSpan) heartSpan.textContent = '❤️';
        } else {
          btn.classList.remove('liked');
          delete likedMap[id];
          countSpan.textContent = Math.max(1, currentLikes - 1);
          if (heartSpan) heartSpan.textContent = '🤍';
        }

        try {
          localStorage.setItem('abdhul_shadab_likes', JSON.stringify(likedMap));
        } catch (err) {}
      });
    });
  }

  // Quick chips autofill
  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      if (duaMessage) {
        duaMessage.value = text;
        duaMessage.focus();
      }
    });
  });

  // Submit new wish
  if (duaForm) {
    duaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = duaSender.value.trim();
      const message = duaMessage.value.trim();

      if (!sender || !message) return;

      const newDua = {
        id: 'dua-' + Date.now(),
        name: sender,
        relation: "Guest Wish",
        badgeClass: "guest-badge",
        avatarClass: "",
        initials: getInitials(sender),
        text: message,
        time: 'Just now',
        likes: 1
      };

      allBlessings.unshift(newDua);
      storedBlessings.unshift(newDua);

      try {
        localStorage.setItem('abdhul_shadab_duas_v2', JSON.stringify(storedBlessings));
      } catch (err) {
        console.warn(err);
      }

      currentIndex = 0;
      renderCarousel(true);
      scrollToIndex(0);
      restartAutoPlay();

      if (duaFeedback) {
        duaFeedback.textContent = "✨ Alhamdulillah! Your heartfelt blessing has been added!";
        duaFeedback.classList.remove('hidden');
        setTimeout(() => {
          duaFeedback.classList.add('hidden');
        }, 4500);
      }

      // Celebratory flower petal burst from send button
      const sendBtn = document.getElementById('btn-send-dua');
      if (sendBtn && flowerEffect && flowerEffect.burst) {
        const rect = sendBtn.getBoundingClientRect();
        flowerEffect.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);
      }

      duaForm.reset();
    });
  }

  renderCarousel();
  startAutoPlay();
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

initDuas();

/* ============================================================
   CALENDAR & COPY ADDRESS
   ============================================================ */

function initCalendarAndCopy() {
  const calModal = document.getElementById('calendar-modal');
  const calBackdrop = document.getElementById('calendar-modal-backdrop');
  const calClose = document.getElementById('cal-modal-close');
  const calTitle = document.getElementById('cal-modal-title');
  const calSub = document.getElementById('cal-modal-subtitle');
  const calGoogleLink = document.getElementById('cal-google-link');
  const calIcalBtn = document.getElementById('cal-ical-btn');

  let currentCalEvent = null;

  const EVENTS = {
    nikah: {
      title: "Nikah Ceremony of Abdhul Raheem & Shadab Fatima",
      description: "Join us in celebrating the Nikah of Abdhul Raheem and Shadab Fatima after Namaz-e-Maghrib at Beary's Amity, Bengaluru.",
      location: "Beary's Amity, Bengaluru",
      start: "20261129T123000Z", // 6:00 PM IST = 12:30 UTC
      end: "20261129T163000Z",
      displayTitle: "Nikah Ceremony",
      displaySub: "Sunday, 29 November 2026 • Beary's Amity, Bengaluru"
    },
    reception: {
      title: "Grand Reception: Abdhul Raheem & Shadab Fatima",
      description: "Wedding Banquet Hall Reception of Abdhul Raheem and Shadab Fatima at Silvercloud Private Resort, Chalalakkal, Parappur, Kerala.",
      location: "Silvercloud Private Resort, Chalalakkal, Parappur, Kerala 680552",
      start: "20261208T113000Z", // 5:00 PM IST = 11:30 UTC
      end: "20261208T163000Z",
      displayTitle: "Grand Reception",
      displaySub: "Tuesday, 8 December 2026 • Silvercloud Resort, Kerala"
    }
  };

  function openCalModal(eventKey) {
    currentCalEvent = EVENTS[eventKey] || EVENTS.nikah;
    if (calTitle) calTitle.textContent = currentCalEvent.displayTitle;
    if (calSub) calSub.textContent = currentCalEvent.displaySub;

    const gUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(currentCalEvent.title)}&dates=${currentCalEvent.start}/${currentCalEvent.end}&details=${encodeURIComponent(currentCalEvent.description)}&location=${encodeURIComponent(currentCalEvent.location)}`;
    if (calGoogleLink) calGoogleLink.href = gUrl;

    if (calBackdrop) calBackdrop.classList.remove('hidden');
    if (calModal) calModal.classList.remove('hidden');
  }

  function closeCalModal() {
    if (calBackdrop) calBackdrop.classList.add('hidden');
    if (calModal) calModal.classList.add('hidden');
  }

  document.querySelectorAll('.btn-add-cal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const eventKey = btn.getAttribute('data-event');
      openCalModal(eventKey);
    });
  });

  if (calClose) calClose.addEventListener('click', closeCalModal);
  if (calBackdrop) calBackdrop.addEventListener('click', closeCalModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCalModal();
  });

  if (calIcalBtn) {
    calIcalBtn.addEventListener('click', () => {
      if (!currentCalEvent) return;
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Abdhul Raheem and Shadab Fatima Nikah//Wedding Invitation//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `SUMMARY:${currentCalEvent.title}`,
        `DESCRIPTION:${currentCalEvent.description}`,
        `LOCATION:${currentCalEvent.location}`,
        `DTSTART:${currentCalEvent.start}`,
        `DTEND:${currentCalEvent.end}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `${currentCalEvent.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      closeCalModal();
    });
  }

  // Copy Address Buttons
  document.querySelectorAll('.btn-copy-address').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      const originalHtml = btn.innerHTML;
      navigator.clipboard.writeText(textToCopy).then(() => {
        btn.innerHTML = '✓ COPIED!';
        btn.style.borderColor = 'var(--gold)';
        btn.style.color = 'var(--gold-light)';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2200);
      }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = textToCopy;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.innerHTML = '✓ COPIED!';
        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 2200);
      });
    });
  });
}

initCalendarAndCopy();

/* ============================================================
   PREVENT HORIZONTAL SCROLL
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';
});
