/**
 * Función que añade efecto al cursor cuando se desplaza dentro del compoenente
 * @param event
 * @param colors
 * @returns
 */
export function mouseEffectSnake({ gameMode = false }: { gameMode?: boolean } = {}) {
  // --- CANVAS Y CONTEXTO ---
  let canvas = document.getElementById('snake-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'snake-canvas';
    document.body.appendChild(canvas);
  }
  if (!canvas) {
    console.error('No se pudo crear ni encontrar el canvas.');
    return;
  }
  let ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
  if (!ctx) {
    console.error('No se pudo obtener el contexto 2D del canvas.');
    return;
  }

  // --- RESIZE & STYLE ---
  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = 'fixed';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    ctx = canvas.getContext('2d');
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // --- ESTADO GENERAL ---
  let running = true;
  let animationFrameId: number | null = null;

  // --- VARIABLES DEL JUEGO ---
  const START_LENGTH = 7;
  const SNAKE_SIZE = 24;
  const FOOD_RADIUS = SNAKE_SIZE / 2;
  let score = 0;
  let direction = { x: 1, y: 0 };
  let queuedDirection = { x: 1, y: 0 };
  let snake: { x: number, y: number }[] = [];
  let food = { x: 0, y: 0 };
  let lost = false;
  const MOVE_INTERVAL = 100;
  let lastMove = performance.now();

  // --- Cuenta regresiva ---
  let countdown = 0;
  let countdownStartTime = 0;
  let countdownFinished = false;

  // --- Mouse visual que sigue a la serpiente ---
  let followerX = 0;
  let followerY = 0;
  const followerSpeed = 0.22;

  // --- INICIALIZACIÓN ---
  function resetGame() {
    if (!canvas) return;
    lost = false;
    const cx = Math.round(canvas.width / 2 / SNAKE_SIZE) * SNAKE_SIZE;
    const cy = Math.round(canvas.height / 2 / SNAKE_SIZE) * SNAKE_SIZE;
    snake = [];
    for (let i = 0; i < START_LENGTH; i++) {
      snake.push({ x: cx - i * SNAKE_SIZE, y: cy });
    }
    direction = { x: 1, y: 0 };
    queuedDirection = { x: 1, y: 0 };
    score = 0;
    spawnFood();
    startCountdown();

    // Inicia el mouse visual en la posición de la cabeza de la serpiente
    followerX = snake[0].x;
    followerY = snake[0].y;
  }

  // Genera una posición aleatoria para la comida que no choque con la serpiente

  // y asegura que esté dentro de los límites del canvas
  function spawnFood() {
    if (!canvas) return;
    let valid = false;
    while (!valid) {
      food.x = Math.floor(Math.random() * (canvas.width / SNAKE_SIZE)) * SNAKE_SIZE + SNAKE_SIZE / 2;
      food.y = Math.floor(Math.random() * (canvas.height / SNAKE_SIZE)) * SNAKE_SIZE + SNAKE_SIZE / 2;
      valid = !snake.some(seg => seg.x === food.x && seg.y === food.y);

    }
  }

  // Control de teclado SOLO ASWD
  window.addEventListener('keydown', (e) => {
    if (!gameMode) return;
    if ((e.key === "w" || e.key === "W") && direction.y === 0) queuedDirection = { x: 0, y: -1 };
    if ((e.key === "s" || e.key === "S") && direction.y === 0) queuedDirection = { x: 0, y: 1 };
    if ((e.key === "a" || e.key === "A") && direction.x === 0) queuedDirection = { x: -1, y: 0 };
    if ((e.key === "d" || e.key === "D") && direction.x === 0) queuedDirection = { x: 1, y: 0 };
    if (e.key === "r" || e.key === "R") resetGame();
  });

  // --- MODO EFECTO MOUSE ---
  const effectPoints = 40;
  let pointer = { x: canvas.width / 2, y: canvas.height / 2 };
  let trail = Array.from({ length: effectPoints }, (_, i) => ({
    x: pointer.x - i * 12,
    y: pointer.y,
    dx: 0,
    dy: 0,
  }));
  let effectColorBase = 0;
  let exploded = false;
  let particles: { x: number, y: number, dx: number, dy: number, life: number }[] = [];

  function resetEffect() {
    if (!canvas) return;
    pointer = { x: canvas.width / 2, y: canvas.height / 2 };
    trail = Array.from({ length: effectPoints }, (_, i) => ({
      x: pointer.x - i * 12,
      y: pointer.y,
      dx: 0,
      dy: 0,
    }));
    effectColorBase = 0;
    exploded = false;
    particles = [];
  }

  window.addEventListener('mousemove', (e) => {
    if (gameMode || exploded) return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  window.addEventListener('mousedown', (e) => {
    if (gameMode || exploded) return;
    exploded = true;
    particles = [];
    for (let i = 0; i < trail.length; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      particles.push({
        x: trail[i].x,
        y: trail[i].y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        life: 60 + Math.random() * 40
      });
    }
    setTimeout(() => {
      resetEffect();
    }, 1200);
  });

  // --- Cuenta regresiva ---
  function startCountdown() {
    countdown = 3;
    countdownStartTime = performance.now();
    countdownFinished = false;
  }

  function drawCountdown() {
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "bold 120px monospace";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 8;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (countdown > 0) {
      ctx.strokeText(countdown.toString(), canvas.width / 2, canvas.height / 2);
      ctx.fillText(countdown.toString(), canvas.width / 2, canvas.height / 2);
    } else {
      ctx.strokeText("¡JUEGA!", canvas.width / 2, canvas.height / 2);
      ctx.fillText("¡JUEGA!", canvas.width / 2, canvas.height / 2);
    }
    ctx.restore();
  }

  // --- Mouse Persigue la Serpiente ---
  function updateMouseFollower() {
    if (!gameMode || snake.length === 0) return;
    const head = snake[0];
    // Movimiento suave hacia la cabeza de la serpiente
    followerX += (head.x - followerX) * followerSpeed;
    followerY += (head.y - followerY) * followerSpeed;
  }

  // Dibuja un cursor visual cerca de la cabeza de la serpiente
  function drawMouseFollower() {
    if (!ctx || !gameMode) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(followerX, followerY, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.8;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#000";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(followerX, followerY, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#26f";
    ctx.globalAlpha = 1;
    ctx.fill();
    ctx.restore();
  }

  // --- OJOS Y LENGUA ---
  function drawSnakeFace(head: { x: number, y: number }, direction: { x: number, y: number }) {
    if (!ctx) return;
    ctx.save();

    // Determina el ángulo de la cabeza según la dirección
    let angle = 0;
    if (direction.x === 1 && direction.y === 0) angle = 0;
    else if (direction.x === 0 && direction.y === 1) angle = Math.PI / 2;
    else if (direction.x === -1 && direction.y === 0) angle = Math.PI;
    else if (direction.x === 0 && direction.y === -1) angle = -Math.PI / 2;

    ctx.translate(head.x, head.y);
    ctx.rotate(angle);

    // --- OJOS ---
    // Posiciones relativas a la cabeza
    const eyeOffsetX = 5;
    const eyeOffsetY = -5;
    const eyeRadius = 3;
    // Ojo derecho
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeOffsetX, eyeOffsetY, 1, 0, Math.PI * 2);
    ctx.fillStyle = "#222";
    ctx.fill();
    // Ojo izquierdo
    ctx.beginPath();
    ctx.arc(eyeOffsetX, -eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(eyeOffsetX, -eyeOffsetY, 1, 0, Math.PI * 2);
    ctx.fillStyle = "#222";
    ctx.fill();

    // --- LENGUA ---
    // Animación de lengua: parpadea cada ~0.6s
    const now = performance.now();
    if (Math.floor(now / 300) % 2 === 0 && !lost) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(SNAKE_SIZE / 2 + 2, 0);
      ctx.lineTo(SNAKE_SIZE / 2 + 12, -3);
      ctx.lineTo(SNAKE_SIZE / 2 + 12, 3);
      ctx.closePath();
      ctx.fillStyle = "#ff327a";
      ctx.shadowColor = "#ff327a";
      ctx.shadowBlur = 4;
      ctx.fill();
      // Lengua bifurcada
      ctx.beginPath();
      ctx.moveTo(SNAKE_SIZE / 2 + 12, -3);
      ctx.lineTo(SNAKE_SIZE / 2 + 17, -8);
      ctx.strokeStyle = "#ff327a";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(SNAKE_SIZE / 2 + 12, 3);
      ctx.lineTo(SNAKE_SIZE / 2 + 17, 8);
      ctx.strokeStyle = "#ff327a";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  // --- ANIMACIONES ---
  function drawGame() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Comida
    ctx.save();
    ctx.beginPath();
    ctx.arc(food.x, food.y, FOOD_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.shadowColor = "orange";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();

    // Serpiente: cuerpo
    for (let i = snake.length - 1; i >= 1; i--) {
      ctx.beginPath();
      ctx.arc(snake[i].x, snake[i].y, SNAKE_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${i * 12}, 70%, 60%)`;
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.8 + 0.2 * (i / snake.length);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Serpiente: cabeza con ojos y lengua
    if (snake.length > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(snake[0].x, snake[0].y, SNAKE_SIZE / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#26f";
      ctx.shadowColor = "#26f";
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
      drawSnakeFace(snake[0], direction);
    }

    // Mouse visual sigue a la serpiente
    drawMouseFollower();

    // Score
    ctx.save();
    ctx.font = "bold 32px monospace";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 4;
    ctx.strokeText("SCORE: " + score, 24, 48);
    ctx.fillText("SCORE: " + score, 24, 48);
    ctx.restore();

    if (lost) {
      ctx.save();
      ctx.font = "bold 48px monospace";
      ctx.fillStyle = "#f44";
      ctx.textAlign = "center";
      ctx.fillText("¡PERDISTE! (presiona R)", canvas.width / 2, canvas.height / 2);
      ctx.textAlign = "start";
      ctx.restore();
    }
  }

  function updateGame(now?: number) {
    if (!canvas || !ctx) return;
    if (!running) return;
    if (!now) now = performance.now();

    // --- CUENTA REGRESIVA ---
    if (countdown > 0 || !countdownFinished) {
      const elapsed = Math.floor((now - countdownStartTime) / 1000);
      if (elapsed < 3) {
        countdown = 3 - elapsed;
        drawCountdown();
        animationFrameId = requestAnimationFrame(updateGame);
        return;
      } else if (!countdownFinished) {
        countdown = 0;
        drawCountdown();
        countdownFinished = true;
        setTimeout(() => {
          lastMove = performance.now();
          updateGame();
        }, 700);
        return;
      }
    }

    // Actualiza el mouse visual que sigue a la serpiente
    updateMouseFollower();

    if (lost) {
      drawGame();
      animationFrameId = requestAnimationFrame(updateGame);
      return;
    }

    // Movimiento lento: solo mueve la serpiente cada MOVE_INTERVAL ms
    if (now - lastMove >= MOVE_INTERVAL) {
      direction = { ...queuedDirection };
      // Nueva cabeza
      const newHead = {
        x: snake[0].x + direction.x * SNAKE_SIZE,
        y: snake[0].y + direction.y * SNAKE_SIZE,
      };

      // ¿Choca con borde?
      if (
        newHead.x < SNAKE_SIZE/2 ||
        newHead.y < SNAKE_SIZE/2 ||
        newHead.x > canvas.width - SNAKE_SIZE/2 ||
        newHead.y > canvas.height - SNAKE_SIZE/2
      ) {
        lost = true;
        drawGame();
        animationFrameId = requestAnimationFrame(updateGame);
        return;
      }

      // ¿Choca consigo?
      if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        lost = true;
        drawGame();
        animationFrameId = requestAnimationFrame(updateGame);
        return;
      }

      // Agrega la nueva cabeza
      snake.unshift(newHead);

      // ¿Comió comida?
      if (Math.abs(newHead.x - food.x) < SNAKE_SIZE && Math.abs(newHead.y - food.y) < SNAKE_SIZE) {
        score++;
        spawnFood();
      } else {
        snake.pop();
      }
      lastMove = now;
    }

    drawGame();
    animationFrameId = requestAnimationFrame(updateGame);
  }

  // --- EFECTO MOUSE ---
  function drawEffect() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (exploded) {
      for (let i = 0; i < particles.length; i++) {
        ctx.beginPath();
        ctx.arc(particles[i].x, particles[i].y, 10, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${effectColorBase + i * 10}, 80%, 60%)`;
        ctx.globalAlpha = Math.max(0, particles[i].life / 100);
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;
      return;
    }

    // Mueve el cuerpo
    for (let i = trail.length - 1; i > 0; i--) {
      trail[i].x = trail[i - 1].x;
      trail[i].y = trail[i - 1].y;
    }
    trail[0].x += (pointer.x - trail[0].x) * 0.35;
    trail[0].y += (pointer.y - trail[0].y) * 0.35;

    for (let i = trail.length - 1; i >= 0; i--) {
      ctx.beginPath();
      ctx.arc(trail[i].x, trail[i].y, 10, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${effectColorBase + i * 10}, 80%, 60%)`;
      ctx.globalAlpha = 0.7 + 0.3 * (i / trail.length);
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }

  function updateEffect() {
    if (!canvas || !ctx) return;
    if (!running) return;
    if (exploded) {
      for (let p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.2;
        p.life--;
      }
      particles = particles.filter(p => p.life > 0);
      if (particles.length === 0 && !exploded) resetEffect();
    }
    drawEffect();
    animationFrameId = requestAnimationFrame(updateEffect);
  }

  // --- INICIO ---
  function start() {
    running = true;
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (gameMode) {
      resetGame();
      lastMove = performance.now();
      updateGame();
    } else {
      resetEffect();
      updateEffect();
    }
  }

  start();

  // Permite alternar modos fácilmente, SIN fullscreen ni pointerlock
  (mouseEffectSnake as any).setMode = function(mode: "game" | "effect") {
    gameMode = mode === "game";
    start();
  };
}

/**
 * Función para quitar el canvas de la serpiente del DOM.
 * Esta función busca el canvas con el ID 'snake-canvas' y lo elimina del DOM si existe.
 * @returns {void}
 * @version 1.0.0
 * @author Arlez Camilo Ceron Herrera
 */
export function quitarCanvasSnake() {
  const canvas = document.getElementById('snake-canvas');
  if (canvas) {
    canvas.remove();
  }
}
