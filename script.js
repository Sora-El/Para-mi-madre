// Configuración inicial
const startDate = new Date('2005-08-08T00:00:00');
const svg = document.getElementById('tree-svg');
const colors = [
    '#ff4081', '#f06292', '#ba68c8', '#ffd54f', '#ffb74d', 
    '#ff5252', '#ff4081', '#e040fb', '#7c4dff', '#536dfe', 
    '#448aff', '#40c4ff', '#18ffff', '#64ffda', '#69f0ae', 
    '#b2ff59', '#eeff41', '#ffff00', '#ffd740', '#ffab40'
];

// --- 1. Lógica del Contador ---
function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    
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

// --- 2. Lógica del Árbol ---
function createFlower(x, y) {
    const flower = document.createElementNS("http://www.w3.org/2000/svg", "g");
    flower.setAttribute("class", "flower");
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 8 + Math.random() * 10; // TAMAÑO EQUILIBRADO
    
    for (let i = 0; i < 5; i++) {
        const petal = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        const angle = (i * 72) * (Math.PI / 180);
        const px = Math.cos(angle) * (size / 1.5);
        const py = Math.sin(angle) * (size / 1.5);
        
        petal.setAttribute("cx", x + px);
        petal.setAttribute("cy", y + py);
        petal.setAttribute("rx", size / 1.8);
        petal.setAttribute("ry", size / 3.5);
        petal.setAttribute("fill", color);
        petal.setAttribute("transform", `rotate(${i * 72}, ${x + px}, ${y + py})`);
        flower.appendChild(petal);
    }
    
    const center = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    center.setAttribute("cx", x);
    center.setAttribute("cy", y);
    center.setAttribute("r", size / 4);
    center.setAttribute("fill", "#fff176");
    flower.appendChild(center);
    
    svg.appendChild(flower);

    if (svg.querySelectorAll('.flower').length > 400) {
        svg.removeChild(svg.querySelector('.flower'));
    }
}

svg.addEventListener('click', (e) => {
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());
    for(let i = 0; i < 3; i++) {
        setTimeout(() => {
            createFlower(
                svgP.x + (Math.random() - 0.5) * 40, 
                svgP.y + (Math.random() - 0.5) * 40
            );
        }, i * 100);
    }
});

function initialBlooms() {
    // Puntos de las ramas para un crecimiento más natural
    const branchPoints = [
        {x: 340, y: 320}, {x: 60, y: 320}, {x: 80, y: 180},
        {x: 320, y: 180}, {x: 200, y: 40}, {x: 370, y: 330},
        {x: 30, y: 330}, {x: 40, y: 150}, {x: 360, y: 150},
        {x: 200, y: 150}, {x: 220, y: 250}, {x: 180, y: 250}
    ];
    
    let bloomCount = 0;
    const maxFlowers = 180; // Cantidad justa para que no tape todo

    function autoBloom() {
        if (bloomCount < maxFlowers) {
            const randomBranch = branchPoints[Math.floor(Math.random() * branchPoints.length)];
            createFlower(
                randomBranch.x + (Math.random() - 0.5) * 100, 
                randomBranch.y + (Math.random() - 0.5) * 100
            );
            bloomCount++;
            setTimeout(autoBloom, 40 + Math.random() * 100);
        }
    }
    autoBloom();
}

initialBlooms();

// --- 3. Música y Mensaje ---
const music = document.getElementById('bg-music');
const secretBtn = document.getElementById('secret-btn');
const secretMsg = document.getElementById('secret-message');
let musicStarted = false;

function startMusic() {
    if (!musicStarted) {
        music.play().catch(e => console.log("Autoplay blocked"));
        music.volume = 0.5;
        musicStarted = true;
    }
}

document.addEventListener('click', startMusic, { once: true });

secretBtn.addEventListener('click', () => {
    secretMsg.classList.toggle('hidden');
    if (!secretMsg.classList.contains('hidden')) {
        secretBtn.innerText = "Cerrar mensaje 💖";
        startMusic();
    } else {
        secretBtn.innerText = "Revelar mensaje secreto 💌";
    }
});
