
/**
 * Función que añade efecto al cursor cuando se desplaza dentro del compoenente
 * @param event
 * @param colors
 * @returns
 */
export function mouseEffectMotion(event: MouseEvent, colors:any){

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
