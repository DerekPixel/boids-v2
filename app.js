import Vector from './Vector.js';
import Boid from './Boid.js';
import makeNewSlider from './function.js';

var mainDiv = document.getElementById('main');

var canvas = document.createElement('canvas');
canvas.id = 'mycanvas';
canvas.width = 16 * 50;
canvas.height = 9 * 50;
var ctx = canvas.getContext('2d');

var sliderDiv = document.createElement('div');
sliderDiv.className = 'sliders';

var alignDiv = makeNewSlider('ALIGNMENT', 0, 10, 5);
var cohesionDiv = makeNewSlider('COHESION', 0, 10, 5);
var separationDiv = makeNewSlider('SEPARATION', 0, 10, 7);

mainDiv.append(canvas);
sliderDiv.append(alignDiv.div);
sliderDiv.append(cohesionDiv.div);
sliderDiv.append(separationDiv.div);
mainDiv.append(sliderDiv);


var flock = [];

for(var i = 0; i < 75; i++) {
  flock.push(new Boid(canvas, 'white'));
}

flock[0].color = 'red';

alignDiv.slider.oninput = () => {
  var alignment = alignDiv.slider.value/10;
  for(var i = 0; i < 75; i++) {
    flock[i].alignForce = alignment;
  }
  console.log(`alignment: ${alignment}`);
}

cohesionDiv.slider.oninput = () => {
  var cohesion = cohesionDiv.slider.value/10;
  for(var i = 0; i < 75; i++) {
    flock[i].coForce = cohesion;
  }
  console.log(`cohesion: ${cohesion}`);
}

separationDiv.slider.oninput = () => {
  var separation = separationDiv.slider.value/10;
  for(var i = 0; i < 75; i++) {
    flock[i].sepForce = separation;
  }
  console.log(`separation: ${separation}`);
}

loop();
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for(var boid in flock) {
    flock[boid].edges(canvas);
    flock[boid].flock(flock);
    flock[boid].update();
    flock[boid].show(ctx);
  }

}

function loop() {
  window.requestAnimationFrame(loop);
  draw();
}