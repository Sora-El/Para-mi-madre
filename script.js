// Configuración inicial
const startDate = new Date('2005-08-08T00:00:00');
const svg = document.getElementById('tree-svg');
const colors = ['#ff4081', '#f06292', '#ba68c8', '#ffd54f', '#ffb74d'];

// --- 1. Lógica del Contador ---
function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
    // Cálculo aproximado de años, meses y días
    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();

    if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
    }
    if (months < 0) {
        years--;
        months += 12;
    }

    document.getElementById('years').innerText = years;
    document.getElementById('months').innerText = months;
    document.getElementById('days').innerText = days;
    document.getElementById('hours').innerText = hours;
    document.getElementById('minutes').innerText = minutes;
    document.getElementById('seconds').innerText = seconds;
}

setInterval(updateCounter, 1000);
updateCounter();

// --- 2. Lógica del Árbol Interactivo ---
function createFlower(x, y) {
    const flower = document.createElementNS("http://www.w3.org/2000/svg", "g");
    flower.setAttribute("class", "flower");
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 5 + Math.random() * 8;
    
    // Pétalos
    for (let i = 0; i < 5; i++) {
        const petal = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        const angle = (i * 72) * (Math.PI / 180);
        const px = Math.cos(angle) * (size / 1.5);
        const py = Math.sin(angle) * (size / 1.5);
        
        petal.setAttribute("cx", x + px);
        petal.setAttribute("cy", y + py);
        petal.setAttribute("rx", size / 2);
        petal.setAttribute("ry", size / 4);
        petal.setAttribute("fill", color);
        petal.setAttribute("transform", `rotate(${i * 72}, ${x + px}, ${y + py})`);
        flower.appendChild(petal);
    }
    
    // Centro de la flor
    const center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    center.setAttribute("cx", x);
    center.setAttribute("cy", y);
    center.setAttribute("r", size / 4);
    center.setAttribute("fill", "#fff176");
    flower.appendChild(center);
    
    svg.appendChild(flower);

    // Eliminar flores después de un tiempo para mantener el rendimiento (opcional)
    // O dejarlas para que el árbol se llene de flores.
    if (svg.children.length > 150) {
        svg.removeChild(svg.querySelector('.flower'));
    }
}

// Interacción
svg.addEventListener('click', (e) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    
    // Crear ráfaga de flores
    for(let i = 0; i < 3; i++) {
        setTimeout(() => {
            createFlower(
                svgP.x + (Math.random() - 0.5) * 40, 
                svgP.y + (Math.random() - 0.5) * 40
            );
        }, i * 100);
    }
});

// Flores iniciales aleatorias en las "ramas"
function initialBlooms() {
    const branchPoints = [
        {x: 150, y: 200}, {x: 250, y: 250}, {x: 120, y: 280},
        {x: 300, y: 350}, {x: 100, y: 120}, {x: 220, y: 100}
    ];
    
    branchPoints.forEach(pt => {
        for(let i = 0; i < 2; i++) {
            createFlower(pt.x + (Math.random()-0.5)*20, pt.y + (Math.random()-0.5)*20);
        }
    });
}

initialBlooms();

// --- 3. Lógica de Música y Mensaje Secreto ---
const music = document.getElementById('bg-music');
const secretBtn = document.getElementById('secret-btn');
const secretMsg = document.getElementById('secret-message');
let musicStarted = false;

function startMusic() {
    if (!musicStarted) {
        music.play().catch(e => console.log("Autoplay blocked, waiting for interaction"));
        music.volume = 0.5;
        musicStarted = true;
    }
}

// Iniciar música al primer clic en cualquier parte
document.addEventListener('click', startMusic, { once: true });

// Revelar mensaje secreto
secretBtn.addEventListener('click', () => {
    secretMsg.classList.toggle('hidden');
    if (!secretMsg.classList.contains('hidden')) {
        secretBtn.innerText = "Cerrar mensaje 💖";
        startMusic(); // Asegurar que la música suene al abrir el mensaje
    } else {
        secretBtn.innerText = "Revelar mensaje secreto 💌";
    }
});
