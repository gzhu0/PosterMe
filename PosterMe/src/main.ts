const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
let angle = 0;
let direction = 1;

function drawClapperboard(angle: number) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Base
  ctx.fillStyle = '#444';
  ctx.fillRect(150, 200, 200, 100);

  // Top (clapper)
  ctx.save();
  ctx.translate(150, 200); // Pivot point
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = '#888';
  ctx.fillRect(0, -30, 200, 30);
  ctx.restore();

  // Stripes
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.translate(150, 200);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#000';
    ctx.fillRect(i * 40, -30, 40, 30);
    ctx.restore();
  }
}

function animate() {
  drawClapperboard(angle);

  // Animate angle
  angle += direction * 2;
  if (angle > 45 || angle < 0) direction *= -1;

  requestAnimationFrame(animate);
}

animate();