const canvas = document.getElementById('game') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const DPR = Math.max(1, window.devicePixelRatio || 1);
const keysPressed: Record<string, boolean> = {};

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
let x = 50, y = 50;
const size = 64;
let vx = 1; // px/s
const g = 10;

function update(dt: number) {
    vx += dt*g*g;
    
    let isAtBottom;
    if (y >= CANVAS_HEIGHT - size)
        isAtBottom = true;
    
    const dx = 10;
    if (keysPressed.ArrowLeft)
        x -= dx;
    if (keysPressed.ArrowRight)
        x += dx;
    if (isAtBottom && (keysPressed.Space || keysPressed.ArrowUp)) {
        vx = -20*dt*g*g;
        isAtBottom = false;
    }
    
    y += vx;
    if (isAtBottom)
        y = CANVAS_HEIGHT - size;
}

function resize() {
    const w = Math.floor(window.innerWidth);
    const h = Math.floor(window.innerHeight);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    canvas.width = Math.floor(CANVAS_WIDTH * DPR);
    canvas.height = Math.floor(CANVAS_HEIGHT * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); // draw in CSS pixels
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('keydown', (ev: KeyboardEvent) => {
    keysPressed[ev.code] = true;
    console.log(ev.code)
});

window.addEventListener('keyup', (ev: KeyboardEvent) => {
    keysPressed[ev.code] = false;
});

function render() {
    ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);
    ctx.fillStyle = '#7ad1ff';
    ctx.fillRect(Math.round(x), Math.round(y), size, size);
}

let last = performance.now();

function frame(now = performance.now()) {
    const dt = (now - last) / 1000;
    last = now;

    update(dt);
    render();
    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);