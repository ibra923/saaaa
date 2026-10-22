const openSurprise = document.querySelector("#openSurprise");
const openGift = document.querySelector("#openGift");
const giftBox = document.querySelector("#giftBox");
const giftMessage = document.querySelector("#giftMessage");
const celebrate = document.querySelector("#celebrate");
const particles = document.querySelector("#particles");
const musicButton = document.querySelector("#musicButton");
const surpriseSection = document.querySelector("#surprise");
const finalSection = document.querySelector("#final");

let giftOpened = false;
let audioContext = null;
let musicPlaying = false;
let musicTimer = null;

function createParticles(amount = 30) {
  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");
    particle.classList.add("particle");
    particle.textContent = Math.random() > 0.35 ? "♥" : "✦";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.fontSize = 10 + Math.random() * 18 + "px";
    particle.style.animationDuration = 5 + Math.random() * 8 + "s";
    particle.style.animationDelay = Math.random() * 8 + "s";
    particles.appendChild(particle);
  }
}
createParticles(35);

openSurprise.addEventListener("click", () => {
  surpriseSection.scrollIntoView({ behavior: "smooth" });
  burstHearts(25);
});

openGift.addEventListener("click", () => {
  if (giftOpened) {
    finalSection.scrollIntoView({ behavior: "smooth" });
    return;
  }
  giftOpened = true;
  giftBox.classList.add("opened");
  giftMessage.textContent = "Катя, с днём рождения! Желаю тебе счастья, улыбок, исполнения мечтаний и много прекрасных моментов! Пусть каждый день приносит что-то хорошее. ❤️";
  giftMessage.classList.add("show");
  openGift.textContent = "Ещё один сюрприз ♥";
  burstHearts(45);
});

function burstHearts(amount = 20) {
  const symbols = ["♥", "❤", "✦", "✨"];
  for (let i = 0; i < amount; i++) {
    const heart = document.createElement("span");
    heart.classList.add("confetti");
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.color = Math.random() > 0.5 ? "#ff2448" : "#ffb4c1";
    heart.style.fontSize = 12 + Math.random() * 22 + "px";
    heart.style.animationDuration = 2 + Math.random() * 3 + "s";
    document.body.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

celebrate.addEventListener("click", () => {
  burstHearts(90);
  celebrate.textContent = "С днём рождения, Катя! ❤️";
  setTimeout(() => {
    celebrate.textContent = "Ты заслуживаешь счастья! ♥";
  }, 2500);
});

function playNote(frequency, duration = 0.35) {
  if (!audioContext || audioContext.state !== "running") return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}

function playMelody() {
  const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46];
  let index = 0;
  musicTimer = setInterval(() => {
    if (musicPlaying) playNote(notes[index++ % notes.length], 0.45);
  }, 550);
}

musicButton.addEventListener("click", async () => {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      musicButton.textContent = "×";
      return;
    }
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") await audioContext.resume();
  musicPlaying = !musicPlaying;
  if (musicPlaying) {
    musicButton.classList.add("playing");
    playMelody();
  } else {
    musicButton.classList.remove("playing");
    clearInterval(musicTimer);
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".wish-card").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.7s, transform 0.7s";
  observer.observe(card);
});
