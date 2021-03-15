import Vector from './Vector.js';

class Boid {
  constructor(canvas,  color) {
    this.position = new Vector(
      Math.random() * canvas.width + 0.1,
      Math.random() * canvas.height + 0.1
    );
    this.velocity = new Vector(
      ((Math.random() < 0.5 ? -1 : 1) * Math.random()) * 2, 
      ((Math.random() < 0.5 ? -1 : 1) * Math.random()) * 2
    );
    this.acceleration = new Vector(0, 0);
    this.angle = this.velocity.getAngle();
    this.h = 9;
    this.w = 6;
    this.maxSpeed = 4;
    this.maxForce = 0.1;
    this.alignForce = 0.5;
    this.coForce = 0.5;
    this.sepForce = 0.7;
    this.perception = 50;
    this.canvas = canvas;
    this.color = color;
  }

  dist(v1, v2) {
    var a = v1.x - v2.x;
    var b = v1.y - v2.y;

    return Math.sqrt( a*a + b*b );
  }

  align(flock) {
    var steering = new Vector(0, 0);
    var total = 0;

    for(var other of flock) {
      // var d = this.dist(this.position, other.position);
      var d = Math.sqrt(
        Math.pow(Math.min(
          Math.abs(this.position.x - other.position.x), 
          this.canvas.width - Math.abs(this.position.x - other.position.x)
        ), 2) + 
        Math.pow(Math.min(
          Math.abs(this.position.y - other.position.y), 
          this.canvas.height - Math.abs(this.position.y - other.position.y)
        ), 2)
      );

      if(other !== this && d < this.perception) {
        steering.addTo(other.velocity);
        total++;
      }
    }

    if(total > 0) {
      steering.divideBy(total);
      steering.setMagnitude(this.maxSpeed);
      steering.subtractFrom(this.velocity);
      steering = steering.normalize(this.alignForce);
    }

    return steering;
  }

  cohesion(flock) {
    var steering = new Vector(0, 0);
    var total = 0;

    for(var other of flock) {
      // var d = this.dist(this.position, other.position);
      var d = Math.sqrt(
        Math.pow(Math.min(
          Math.abs(this.position.x - other.position.x), 
          this.canvas.width - Math.abs(this.position.x - other.position.x)
        ), 2) + 
        Math.pow(Math.min(
          Math.abs(this.position.y - other.position.y), 
          this.canvas.height - Math.abs(this.position.y - other.position.y)
        ), 2)
      );

      if(other !== this && d < this.perception) {
        steering.addTo(other.position);
        total++;
      }
    }

    if(total > 0) {
      steering.divideBy(total);
      steering.subtractFrom(this.position);
      steering.setMagnitude(this.maxSpeed);
      steering.subtractFrom(this.velocity);
      steering = steering.normalize(this.coForce);
    }
    
    return steering;
  }

  separation(flock) {
    var steering = new Vector(0, 0);
    var total = 0;

    for(var other of flock) {
      // var d = this.dist(this.position, other.position);
      var d = Math.sqrt(
        Math.pow(Math.min(
          Math.abs(this.position.x - other.position.x), 
          this.canvas.width - Math.abs(this.position.x - other.position.x)
        ), 2) + 
        Math.pow(Math.min(
          Math.abs(this.position.y - other.position.y), 
          this.canvas.height - Math.abs(this.position.y - other.position.y)
        ), 2)
      );

      if(other !== this && d < this.perception) {
        var diff = this.position.subtract(other.position);

        diff.divideBy(d * d);

        steering.addTo(diff);
        total++;
      }
    }

    if(total > 0) {
      steering.divideBy(total);
      steering.setMagnitude(this.maxSpeed);
      steering.subtractFrom(this.velocity);
      steering = steering.normalize(this.sepForce);
    }

    return steering;
  }

  update() {
    this.velocity.setMagnitude(this.maxSpeed);
    this.velocity.addTo(this.acceleration);
    this.position.addTo(this.velocity);
    this.acceleration = new Vector(0, 0);
  }

  flock(boids) {
    var alignment = this.align(boids);
    var cohesion = this.cohesion(boids);
    var separation = this.separation(boids);

    this.acceleration.addTo(alignment);
    this.acceleration.addTo(cohesion);
    this.acceleration.addTo(separation);
  }

  edges() {
    if (this.position.x > this.canvas.width) {
      this.position.x = 0;
    } else if (this.position.x < 0) {
      this.position.x = this.canvas.width;
    }
    if (this.position.y > this.canvas.height) {
      this.position.y = 0;
    } else if (this.position.y < 0) {
      this.position.y = this.canvas.height;
    }
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.velocity.getAngle());
    ctx.beginPath();
    ctx.moveTo(this.h, 0);
    ctx.lineTo(-this.h, -this.w);
    ctx.lineTo(-this.h, this.w);
    ctx.fillStyle = `${this.color}`;
    ctx.fill();
    ctx.restore();
  }

}

export default Boid;