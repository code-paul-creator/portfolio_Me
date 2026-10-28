/**
 * AMONG US THEME PORTFOLIO - SCRIPT
 * Interactive audio synthesizer, starfield, voting mechanics, and task tracker.
 */

// --- 1. Web Audio API Sound Synthesizer (Zero External Audio Dependencies) ---
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
}

const SoundFX = {
  // Classic Among Us UI button blip
  blip() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.08); // A5

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch (e) {
      console.log('Audio playback prevented', e);
    }
  },

  // Task complete satisfying chime
  taskComplete() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.07);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.07);
        osc.stop(audioCtx.currentTime + idx * 0.07 + 0.26);
      });
    } catch (e) {}
  },

  // EMERGENCY MEETING SREN HORN
  emergencySiren() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';

      // Harsh Among Us emergency horn frequencies
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(420, audioCtx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(320, audioCtx.currentTime + 0.35);
      osc.frequency.linearRampToValueAtTime(420, audioCtx.currentTime + 0.55);

      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.7);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.75);
    } catch (e) {}
  },

  // Ejection space sweep
  ejectionSweep() {
    if (!soundEnabled) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, audioCtx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.25);
    } catch (e) {}
  }
};

// --- 2. Interactive Outer Space Canvas (Twinkling Stars & Shooting Stars) ---
function initStarfield() {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const starCount = 130;
  const stars = [];

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random(),
      speed: Math.random() * 0.02 + 0.005,
      driftX: (Math.random() - 0.5) * 0.2,
      driftY: (Math.random() - 0.5) * 0.2
    });
  }

  // Shooting star
  let shootingStar = null;
  function triggerShootingStar() {
    if (!shootingStar && Math.random() < 0.01) {
      shootingStar = {
        x: Math.random() * width,
        y: Math.random() * (height * 0.5),
        len: Math.random() * 80 + 40,
        speed: Math.random() * 10 + 8,
        life: 0,
        maxLife: 30
      };
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw twinkling stars
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.1) {
        star.speed = -star.speed;
      }
      star.x += star.driftX;
      star.y += star.driftY;
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
      ctx.shadowBlur = star.radius > 1.2 ? 6 : 0;
      ctx.shadowColor = '#8bf4ff';
      ctx.fill();
    });

    // Draw shooting star
    triggerShootingStar();
    if (shootingStar) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(shootingStar.x, shootingStar.y);
      ctx.lineTo(shootingStar.x + shootingStar.len, shootingStar.y + shootingStar.len * 0.5);
      ctx.stroke();
      ctx.restore();

      shootingStar.x += shootingStar.speed;
      shootingStar.y += shootingStar.speed * 0.5;
      shootingStar.life++;
      if (shootingStar.life > shootingStar.maxLife) {
        shootingStar = null;
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// --- 3. Suit Color Customizer ---
function initSuitCustomizer() {
  const colorDots = document.querySelectorAll('.color-dot');
  colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
      SoundFX.blip();
      colorDots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      const color = dot.getAttribute('data-color');
      document.body.className = `theme-${color}`;
    });
  });
}

// --- 4. Emergency Meeting Modal Mechanics ---
function initEmergencyModal() {
  const emergencyBtn = document.getElementById('emergencyBtn');
  const modal = document.getElementById('emergencyModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (emergencyBtn && modal) {
    emergencyBtn.addEventListener('click', () => {
      SoundFX.emergencySiren();
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      SoundFX.blip();
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  // Click outside to close
  window.addEventListener('click', e => {
    if (e.target === modal) {
      SoundFX.blip();
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  });
}

// --- 5. Interactive Voting Screen & Ejection Animation ---
function initVotingSystem() {
  const voteButtons = document.querySelectorAll('.btn-vote');
  const resultBanner = document.getElementById('voteResultBanner');
  const ejectionScreen = document.getElementById('ejectionScreen');
  const ejectionText = document.getElementById('ejectionText');
  const impostorCountText = document.getElementById('impostorCountText');
  const skipEjectionBtn = document.getElementById('skipEjectionBtn');

  voteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const candidate = btn.getAttribute('data-candidate');
      SoundFX.blip();

      if (candidate === 'Paulami') {
        // Voted for Paulami!
        triggerEjection(
          'Paulami was not an Impostor.',
          '0 Impostors remain. (Verdict: HIRE FOR SWE/AI INTERNSHIP! 🎉)',
          true
        );
        if (resultBanner) {
          resultBanner.innerHTML = '✅ <strong style="color: #38fedc;">100% UNANIMOUS VOTE:</strong> Paulami hired for the internship! 🚀';
        }
      } else if (candidate === 'Bug #404') {
        triggerEjection(
          'Bug #404 was An Impostor.',
          '0 Impostors remain. (Production is clean & verified!)',
          false
        );
        if (resultBanner) {
          resultBanner.innerHTML = '🚨 <strong style="color: #4ade80;">Bug #404 ejected into deep space!</strong> 🌌';
        }
      } else if (candidate === 'Hallucinating LLM') {
        triggerEjection(
          'Hallucinating LLM was An Impostor.',
          '0 Impostors remain. (Only grounded, verifiable agents remain!)',
          false
        );
        if (resultBanner) {
          resultBanner.innerHTML = '🧠 <strong style="color: #f5f557;">Hallucinating LLM ejected! Grounded AI restored.</strong>';
        }
      } else {
        triggerEjection(
          'Generic Todo App was skipped.',
          'Paulami is still shipping real-world AI systems.',
          false
        );
        if (resultBanner) {
          resultBanner.innerHTML = '⏭️ <strong>Skipped generic apps. Focused on real impact!</strong>';
        }
      }
    });
  });

  function triggerEjection(mainMsg, subMsg, isSuccess) {
    if (!ejectionScreen) return;
    SoundFX.ejectionSweep();

    ejectionText.textContent = mainMsg;
    impostorCountText.textContent = subMsg;
    ejectionScreen.classList.add('active');
    ejectionScreen.setAttribute('aria-hidden', 'false');

    if (isSuccess) {
      setTimeout(() => SoundFX.taskComplete(), 1000);
    }
  }

  if (skipEjectionBtn && ejectionScreen) {
    skipEjectionBtn.addEventListener('click', () => {
      SoundFX.blip();
      ejectionScreen.classList.remove('active');
      ejectionScreen.setAttribute('aria-hidden', 'true');
    });
  }
}

// --- 6. Task Progress Bar & Scroll Tracking ---
function initTaskProgress() {
  const progressBar = document.getElementById('taskProgressBar');
  const counterText = document.getElementById('taskCounterText');
  const taskItems = document.querySelectorAll('.task-item');
  const rooms = [
    'hero-sec',
    'admin-sec',
    'electrical-sec',
    'medbay-sec',
    'reactor-sec',
    'discussion-sec',
    'comms-sec'
  ];

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(100, Math.max(15, (scrollPos / (docHeight || 1)) * 100));

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    // Determine current active section
    let currentRoom = rooms[0];
    rooms.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop - 180;
        if (scrollPos >= top) {
          currentRoom = id;
        }
      }
    });

    taskItems.forEach(item => {
      const target = item.getAttribute('data-target');
      if (target === currentRoom) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Counter
    if (counterText) {
      const activeIdx = rooms.indexOf(currentRoom) + 1;
      counterText.textContent = `${activeIdx} / 7 TASKS ACTIVE`;
    }
  });

  // Clicking on tasklist item scrolls to section
  taskItems.forEach(item => {
    item.addEventListener('click', () => {
      SoundFX.blip();
      const targetId = item.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Minimize tasks HUD toggle
  const toggleBtn = document.getElementById('toggleTaskListBtn');
  const taskList = document.getElementById('skeldTaskList');
  if (toggleBtn && taskList) {
    toggleBtn.addEventListener('click', () => {
      SoundFX.blip();
      taskList.classList.toggle('collapsed');
      toggleBtn.textContent = taskList.classList.contains('collapsed') ? '+' : '−';
    });
  }
}

// --- 7. Vent Easter Egg ---
function initVentEasterEgg() {
  const ventBtn = document.getElementById('ventEasterEggBtn');
  const secretBox = document.getElementById('ventSecretBox');

  if (ventBtn && secretBox) {
    ventBtn.addEventListener('click', () => {
      SoundFX.blip();
      secretBox.classList.toggle('revealed');
      if (secretBox.classList.contains('revealed')) {
        SoundFX.taskComplete();
      }
    });
  }
}

// --- 8. Crewmate Interactive Quotes On Click ---
function initCrewmateQuotes() {
  const crewmate = document.getElementById('mainCrewmate');
  const voice = document.getElementById('crewmateVoice');

  const quotes = [
    '"I\'d rather debug a 2 AM production issue than rewrite the same TODO app for the 5th time!"',
    '"GSA 2026: Building AI that empowers students & developers."',
    '"In Bhaskara Vision, we fuse optical and radar satellite data in real time!"',
    '"Peeking into transformer LLM layers with CausalTrace!"',
    '"Every agent decision needs a verifiable, hash-chained audit trail!"',
    '"CityPulse: Turning raw urban feeds into explainable forecasts!"',
    '"No impostors in this codebase. Verified commits only! 🛡️"'
  ];

  let quoteIdx = 0;

  if (crewmate && voice) {
    const dialogue = crewmate.querySelector('.crewmate-dialogue');
    crewmate.addEventListener('click', () => {
      SoundFX.blip();
      quoteIdx = (quoteIdx + 1) % quotes.length;
      voice.textContent = quotes[quoteIdx];
      if (dialogue) {
        dialogue.style.animation = 'none';
        void dialogue.offsetWidth;
        dialogue.style.animation = 'popDialogue 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
    });
  }
}

// --- 9. Sound FX Toggle Button ---
function initSoundToggle() {
  const btn = document.getElementById('soundToggleBtn');
  const label = document.getElementById('soundLabel');

  if (btn && label) {
    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      label.textContent = soundEnabled ? 'SFX: ON' : 'SFX: OFF';
      btn.querySelector('.hud-icon').textContent = soundEnabled ? '🔊' : '🔇';
      if (soundEnabled) {
        SoundFX.blip();
      }
    });
  }
}

// --- DOM Content Loaded Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initSuitCustomizer();
  initEmergencyModal();
  initVotingSystem();
  initTaskProgress();
  initVentEasterEgg();
  initCrewmateQuotes();
  initSoundToggle();

  // Play a welcoming task complete sound on first user interaction
  const triggerAudioOnFirstTouch = () => {
    SoundFX.blip();
    window.removeEventListener('click', triggerAudioOnFirstTouch);
  };
  window.addEventListener('click', triggerAudioOnFirstTouch, { once: true });
});

