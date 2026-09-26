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
    id: 1,
    name: "Mr. Shafi Aboobacker & Mrs. Shamshad Shafi",
    text: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fee khair! May Allah shower dearest Abdhul Raheem & Shadab Fatima with endless affection, peace, and divine barakah.",
    time: "Family Blessing",
    likes: 24
  },
  {
    id: 2,
    name: "Mr. Mohammad Shujathulla & Family",
    text: "May this sacred union be the beginning of a life filled with mutual trust, health, tranquility, and infinite bliss in this world and the Aakhirah. Ameen!",
    time: "Family Blessing",
    likes: 19
  },
  {
    id: 3,
    name: "Brothers & Cousins",
    text: "Heartiest congratulations to our dearest brother Abdhul Raheem and lovely bhabhi Shadab Fatima! May your journey together be radiant and filled with smiles!",
    time: "Yesterday",
    likes: 15
  }
];

function initDuas() {
  const duaForm = document.getElementById('dua-form');
  const duaSender = document.getElementById('dua-sender');
  const duaMessage = document.getElementById('dua-message');
  const duaFeedback = document.getElementById('dua-feedback');
  const duasWall = document.getElementById('duas-wall');
  const quickChips = document.querySelectorAll('.dua-chip');

  if (!duasWall) return;

  let storedBlessings = [];
  try {
    const raw = localStorage.getItem('abdhul_shadab_duas');
    if (raw) {
      storedBlessings = JSON.parse(raw);
    }
  } catch (e) {
    console.warn(e);
  }

  const allBlessings = [...storedBlessings, ...DEFAULT_BLESSINGS];

  function renderDuas() {
    duasWall.innerHTML = allBlessings.map((dua) => `
      <div class="dua-card scroll-reveal" data-id="${dua.id}">
        <div class="dua-card-header">
          <span class="dua-card-sender">${escapeHTML(dua.name)}</span>
          <span class="dua-card-time">${escapeHTML(dua.time)}</span>
        </div>
        <p class="dua-card-body">"${escapeHTML(dua.text)}"</p>
        <div class="dua-card-footer">
          <button type="button" class="dua-like-btn" data-id="${dua.id}" aria-label="Send love for this blessing">
            <span class="heart-icon">❤️</span> <span class="like-count">${dua.likes || 1}</span>
          </button>
        </div>
      </div>
    `).join('');

    // Attach like listeners
    duasWall.querySelectorAll('.dua-like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const countSpan = btn.querySelector('.like-count');
        const isLiked = btn.classList.contains('liked');
        let currentLikes = parseInt(countSpan.textContent, 10) || 0;
        if (!isLiked) {
          btn.classList.add('liked');
          countSpan.textContent = currentLikes + 1;
        } else {
          btn.classList.remove('liked');
          countSpan.textContent = Math.max(1, currentLikes - 1);
        }
      });
    });
  }

  renderDuas();

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

  // Submit new Dua
  if (duaForm) {
    duaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const sender = duaSender.value.trim();
      const message = duaMessage.value.trim();

      if (!sender || !message) return;

      const newDua = {
        id: Date.now(),
        name: sender,
        text: message,
        time: 'Just now',
        likes: 1
      };

      allBlessings.unshift(newDua);
      storedBlessings.unshift(newDua);

      try {
        localStorage.setItem('abdhul_shadab_duas', JSON.stringify(storedBlessings));
      } catch (err) {
        console.warn(err);
      }

      renderDuas();

      if (duaFeedback) {
        duaFeedback.classList.remove('hidden');
        setTimeout(() => {
          duaFeedback.classList.add('hidden');
        }, 3500);
      }

      // Celebratory burst from submit button
      const sendBtn = document.getElementById('btn-send-dua');
      if (sendBtn && flowerEffect && flowerEffect.burst) {
        const rect = sendBtn.getBoundingClientRect();
        flowerEffect.burst(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);
      }

      duaForm.reset();
    });
  }
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
