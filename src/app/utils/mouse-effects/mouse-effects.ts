/**
 * Función que añade efecto al cursor cuando se desplaza dentro del compoenente
 * @param event
 * @param colors
 * @returns
 */
export function mouseEffectMotion(event: MouseEvent, colors: any) {
  // Acciones a realizar cuando el mouse se mueve
  var circle = document.createElement('div');
  circle.setAttribute('class', 'circle');
  document.body.appendChild(circle);

  // adds motion
  circle.style.position = 'absolute';
  circle.style.left = event.clientX + 'px';
  circle.style.top = event.clientY + 'px';

  // randomize color
  var color = colors[Math.floor(Math.random() * colors.length)];

  circle.style.border = `solid ${color}`;
  circle.style.borderRadius = '15px';

  // adds animation
  circle.style.transition = 'all 0.5s linear 0s';
  circle.style.left = circle.offsetLeft - 20 + 'px';
  circle.style.top = circle.offsetTop - 20 + 'px';

  /**Size */
  circle.style.width = '20px';
  circle.style.height = '20px';
  circle.style.borderWidth = '5px';

  /* circle.style.opacity = 0; */
  setTimeout(() => {
    document.body.removeChild(circle);
  }, 100); // Delay of 2000 milliseconds (2 seconds)

  return circle;
}

/**
 * Función que añade efecto al cursor como serpiente cuando se desplaza dentro del componente
 * @param event
 * @param colors
 * @returns
 * @description
 */
export function mouseEffectSnake() {

  var canvas: any;
    var ctx: any;
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');

    // for intro motion
    let mouseMoved = false;

    const pointer = {
      x: 0.5 * window.innerWidth,
      y: 0.5 * window.innerHeight,
    };
    const params = {
      pointsNumber: 40,
      widthFactor: 0.3,
      mouseThreshold: 0.6,
      spring: 0.4,
      friction: 0.5,
    };

    const trail = new Array(params.pointsNumber);
    for (let i = 0; i < params.pointsNumber; i++) {
      trail[i] = {
        x: pointer.x,
        y: pointer.y,
        dx: 0,
        dy: 0,
      };
    }

    window.addEventListener('click', (e) => {
      updateMousePosition(e.pageX, e.pageY);
    });
    window.addEventListener('mousemove', (e) => {
      mouseMoved = true;
      updateMousePosition(e.pageX, e.pageY);
    });
    window.addEventListener('touchmove', (e) => {
      mouseMoved = true;
      updateMousePosition(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
    });

    function updateMousePosition(eX: any, eY: any) {
      pointer.x = eX;
      pointer.y = eY;
    }

    setupCanvas();
    update(0);
    window.addEventListener('resize', setupCanvas);

    function update(t: any) {
      // for intro motion
      if (!mouseMoved) {
        pointer.x =
          (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
          window.innerWidth;
        pointer.y =
          (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) *
          window.innerHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      trail.forEach((p, pIdx) => {
        const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
        const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
        p.dx += (prev.x - p.x) * spring;
        p.dy += (prev.y - p.y) * spring;
        p.dx *= params.friction;
        p.dy *= params.friction;
        p.x += p.dx;
        p.y += p.dy;
      });

      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);

      for (let i = 1; i < trail.length - 1; i++) {
        const xc = 0.5 * (trail[i].x + trail[i + 1].x);
        const yc = 0.5 * (trail[i].y + trail[i + 1].y);
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
        ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
        ctx.stroke();
      }
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();

      window.requestAnimationFrame(update);
    }

    function setupCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // add position fixed to canvas
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';

    // change color degrade to mouse
    canvas.addEventListener('mousemove', (e: any) => {
      const x = e.clientX;
      const y = e.clientY;
      const color = `hsl(${x % 360}, 100%, ${y % 100}%)`;
      ctx.strokeStyle = color;
      canvas.style.pointerEvents = 'resize';
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineWidth = 2;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      canvas.style.pointerEvents = 'none'; // to avoid blocking other events
      canvas.style.zIndex = '1'; // to avoid blocking other events
      canvas.style.position = 'fixed'; // to avoid blocking other events
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    });
    return canvas;

}
