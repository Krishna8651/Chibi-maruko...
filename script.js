import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------- CERITA BAHASA INDONESIA ----------
const cerita = [
    { 
        pembicara: "Maruko-chan", 
        teks: "Hari ini cuacanya bagus banget ya! Aku mau jalan-jalan deh~",
        kebahagiaan: 5
    },
    { 
        pembicara: "Maruko-chan", 
        teks: "Wah! Bunga sakura mekar semuanya! Cantik-cantik banget!",
        kebahagiaan: 10,
        bunga: 3
    },
    { 
        pembicara: "Teman Maruko", 
        teks: "Maruko-chan! Lagi ngapain sendirian di sini?",
        kebahagiaan: 5
    },
    { 
        pembicara: "Maruko-chan", 
        teks: "Aku lagi nikmatin bunga sakura~ Enak banget liat pemandangan kayak gini!",
        kebahagiaan: 10,
        bunga: 2
    },
    { 
        pembicara: "Teman Maruko", 
        teks: "Boleh aku temenin?",
        kebahagiaan: 5
    },
    { 
        pembicara: "Maruko-chan", 
        teks: "Boleh banget! Makin seru kalau bareng teman!",
        kebahagiaan: 15,
        bunga: 2
    },
    { 
        pembicara: "Maruko-chan", 
        teks: "Eh lihat! Ada kelinci lucu di balik pohon!",
        kebahagiaan: 10
    },
    { 
        pembicara: "Teman Maruko", 
        teks: "Iya! Gemes banget!",
        kebahagiaan: 10
    },
    { 
        pembicara: "Maruko-chan", 
        teks: "Hari ini bener-bener hari yang sempurna! Cuaca cerah, bunga mekar, ada kelinci imut, dan ditemenin kamu!",
        kebahagiaan: 20,
        bunga: 5
    },
    { 
        pembicara: "Maruko-chan", 
        teks: "Makasih ya udah jadi teman terbaik!",
        kebahagiaan: 15,
        bunga: 3
    },
    { 
        pembicara: "Semua", 
        teks: "Persahabatan selamanya! 🌸",
        kebahagiaan: 25,
        bunga: 10,
        akhir: true
    }
];

let indexCerita = 0;
let totalKebahagiaan = 50;
let totalBunga = 0;
let autoPlay = false;
let autoTimer;

// ---------- SETUP THREE.JS ----------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff0f5); // Pink lembut

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 3, 8);
camera.lookAt(0, 1, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.target.set(0, 1.2, 0);
controls.maxPolarAngle = Math.PI / 2;

// ---------- LAMPU ----------
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xfff5e6, 1);
mainLight.position.set(3, 5, 4);
mainLight.castShadow = true;
mainLight.receiveShadow = true;
mainLight.shadow.mapSize.width = 1024;
mainLight.shadow.mapSize.height = 1024;
scene.add(mainLight);

const pinkLight = new THREE.PointLight(0xffaacc, 0.8);
pinkLight.position.set(1, 2, 2);
scene.add(pinkLight);

// ---------- GROUND ----------
const groundGeo = new THREE.CircleGeometry(15, 32);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x90ee90 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
ground.receiveShadow = true;
scene.add(ground);

// Bunga-bunga kecil di ground
for (let i = 0; i < 100; i++) {
    const flowerGeo = new THREE.CircleGeometry(0.1, 5);
    const flowerMat = new THREE.MeshStandardMaterial({ color: Math.random() > 0.5 ? 0xff69b4 : 0xffa500 });
    const flower = new THREE.Mesh(flowerGeo, flowerMat);
    
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 12;
    flower.position.set(
        Math.cos(angle) * radius,
        0.02,
        Math.sin(angle) * radius
    );
    flower.rotation.x = -Math.PI / 2;
    scene.add(flower);
}

// ---------- KARAKTER 3D MARUKO-CHAN ----------
function createMaruko() {
    const group = new THREE.Group();
    
    // GAUN MERAH
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.8, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff3333 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.4;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // KEPALA
    const headGeo = new THREE.SphereGeometry(0.3, 24);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffddbb });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.0;
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);
    
    // RAMBUT
    const hairGeo = new THREE.SphereGeometry(0.28, 8);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x332211 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.18, 0.05);
    hair.scale.set(1.1, 0.3, 0.9);
    hair.castShadow = true;
    group.add(hair);
    
    // PONI
    for (let i = 0; i < 3; i++) {
        const poniGeo = new THREE.BoxGeometry(0.08, 0.05, 0.1);
        const poniMat = new THREE.MeshStandardMaterial({ color: 0x332211 });
        const poni = new THREE.Mesh(poniGeo, poniMat);
        poni.position.set(-0.07 + (i * 0.07), 1.13, 0.18);
        poni.castShadow = true;
        group.add(poni);
    }
    
    // MATA KIRI
    const eyeLGeo = new THREE.SphereGeometry(0.08, 8);
    const eyeLMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const eyeL = new THREE.Mesh(eyeLGeo, eyeLMat);
    eyeL.position.set(-0.1, 1.05, 0.25);
    eyeL.castShadow = true;
    group.add(eyeL);
    
    // MATA KANAN
    const eyeRGeo = new THREE.SphereGeometry(0.08, 8);
    const eyeRMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const eyeR = new THREE.Mesh(eyeRGeo, eyeRMat);
    eyeR.position.set(0.1, 1.05, 0.25);
    eyeR.castShadow = true;
    group.add(eyeR);
    
    // PIPI
    const cheekL = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 4),
        new THREE.MeshStandardMaterial({ color: 0xffa0a0 })
    );
    cheekL.position.set(-0.18, 0.98, 0.2);
    group.add(cheekL);
    
    const cheekR = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 4),
        new THREE.MeshStandardMaterial({ color: 0xffa0a0 })
    );
    cheekR.position.set(0.18, 0.98, 0.2);
    group.add(cheekR);
    
    // MULUT
    const mouthGeo = new THREE.TorusGeometry(0.04, 0.01, 4, 8, Math.PI);
    const mouthMat = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 0.95, 0.25);
    mouth.rotation.x = 0.1;
    mouth.rotation.z = 0;
    mouth.scale.set(0.8, 0.5, 0.3);
    mouth.castShadow = true;
    group.add(mouth);
    
    // TANGAN
    const armL = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.3, 6),
        new THREE.MeshStandardMaterial({ color: 0xffddbb })
    );
    armL.position.set(-0.3, 0.7, 0);
    armL.rotation.z = 0.3;
    armL.rotation.x = 0.2;
    armL.castShadow = true;
    group.add(armL);
    
    const armR = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.3, 6),
        new THREE.MeshStandardMaterial({ color: 0xffddbb })
    );
    armR.position.set(0.3, 0.7, 0);
    armR.rotation.z = -0.3;
    armR.rotation.x = -0.2;
    armR.castShadow = true;
    group.add(armR);
    
    return group;
}

// ---------- KARAKTER 3D TEMAN ----------
function createTeman() {
    const group = new THREE.Group();
    
    // BAJU KUNING
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.7, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.35;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // KEPALA
    const headGeo = new THREE.SphereGeometry(0.28, 24);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffddbb });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.95;
    head.castShadow = true;
    head.receiveShadow = true;
    group.add(head);
    
    // RAMBUT
    const hairGeo = new THREE.SphereGeometry(0.26, 8);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x884422 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.1, 0.05);
    hair.scale.set(1.1, 0.3, 0.9);
    hair.castShadow = true;
    group.add(hair);
    
    // MATA
    const eyeL = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 6),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    eyeL.position.set(-0.09, 1.0, 0.2);
    eyeL.castShadow = true;
    group.add(eyeL);
    
    const eyeR = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 6),
        new THREE.MeshStandardMaterial({ color: 0x000000 })
    );
    eyeR.position.set(0.09, 1.0, 0.2);
    eyeR.castShadow = true;
    group.add(eyeR);
    
    return group;
}

// Posisi karakter
const maruko = createMaruko();
maruko.position.set(-1.5, 0, 0);
maruko.rotation.y = 0.2;
scene.add(maruko);

const teman = createTeman();
teman.position.set(1.5, 0, 0);
teman.rotation.y = -0.2;
scene.add(teman);

// ---------- POHON SAKURA ----------
function createTree(x, z) {
    const group = new THREE.Group();
    
    // Batang
    const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 2);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);
    
    // Daun pink
    for (let i = 0; i < 10; i++) {
        const leafGeo = new THREE.SphereGeometry(0.25, 5);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0xffaacc });
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        
        const angle = (i / 10) * Math.PI * 2;
        leaf.position.set(
            Math.cos(angle) * 0.6,
            2.0 + Math.sin(i) * 0.3,
            Math.sin(angle) * 0.6
        );
        leaf.castShadow = true;
        group.add(leaf);
    }
    
    group.position.set(x, 0, z);
    return group;
}

// Tambah pohon
scene.add(createTree(-3, -2));
scene.add(createTree(3, 2));
scene.add(createTree(-2, 3));
scene.add(createTree(2, -3));

// ---------- BUNGA SAKURA BETERBANGAN ----------
const sakuraGroup = new THREE.Group();
for (let i = 0; i < 20; i++) {
    const petalGeo = new THREE.CircleGeometry(0.1, 5);
    const petalMat = new THREE.MeshStandardMaterial({ color: 0xffaacc });
    const petal = new THREE.Mesh(petalGeo, petalMat);
    
    petal.position.set(
        (Math.random() - 0.5) * 8,
        Math.random() * 4,
        (Math.random() - 0.5) * 8
    );
    petal.rotation.x = Math.random() * Math.PI;
    petal.rotation.y = Math.random() * Math.PI;
    sakuraGroup.add(petal);
}
scene.add(sakuraGroup);

// ---------- UPDATE UI ----------
function updateUI() {
    document.getElementById('happiness').textContent = totalKebahagiaan + '%';
    document.getElementById('flower-count').textContent = totalBunga;
    
    const dialog = document.getElementById('dialog');
    const speaker = document.getElementById('speaker');
    const sub = document.getElementById('dialog-sub');
    
    const current = cerita[indexCerita];
    dialog.textContent = current.teks;
    speaker.textContent = current.pembicara;
    
    if (current.pembicara === "Maruko-chan") {
        sub.textContent = "(Maruko-chan sedang bicara)";
    } else if (current.pembicara === "Teman Maruko") {
        sub.textContent = "(Teman Maruko sedang bicara)";
    } else {
        sub.textContent = "✨ Momen spesial ✨";
    }
    
    // Efek saat cerita berakhir
    if (current.akhir) {
        dialog.style.color = '#ff1493';
        dialog.style.fontSize = '32px';
        dialog.style.textAlign = 'center';
    }
}

// ---------- NEXT DIALOGUE ----------
function nextCerita() {
    if (indexCerita < cerita.length - 1) {
        indexCerita++;
        
        const current = cerita[indexCerita];
        totalKebahagiaan += current.kebahagiaan;
        if (totalKebahagiaan > 100) totalKebahagiaan = 100;
        
        if (current.bunga) {
            totalBunga += current.bunga;
        }
        
        // Animasi karakter
        if (current.pembicara === "Maruko-chan") {
            maruko.position.y = 0.1;
            setTimeout(() => { maruko.position.y = 0; }, 200);
        } else {
            teman.position.y = 0.1;
            setTimeout(() => { teman.position.y = 0; }, 200);
        }
        
        updateUI();
    }
}

// ---------- EVENT LISTENERS ----------
document.getElementById('next-btn').addEventListener('click', () => {
    nextCerita();
});

document.getElementById('auto-btn').addEventListener('click', function() {
    autoPlay = !autoPlay;
    this.textContent = autoPlay ? '⏸ Pause' : '⏵ Auto Play';
    
    if (autoPlay) {
        autoTimer = setInterval(() => {
            nextCerita();
            if (indexCerita === cerita.length - 1) {
                clearInterval(autoTimer);
                autoPlay = false;
                document.getElementById('auto-btn').textContent = '⏵ Auto Play';
            }
        }, 6000);
    } else {
        clearInterval(autoTimer);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        nextCerita();
    }
});

// ---------- ANIMATION LOOP ----------
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    
    time += 0.01;
    
    // Animasi karakter
    maruko.position.y = Math.sin(time * 2) * 0.03;
    teman.position.y = Math.cos(time * 2) * 0.03;
    
    // Animasi tangan
    maruko.children.forEach(child => {
        if (child.position.x === -0.3) {
            child.rotation.z = 0.3 + Math.sin(time * 3) * 0.1;
        }
        if (child.position.x === 0.3) {
            child.rotation.z = -0.3 + Math.cos(time * 3) * 0.1;
        }
    });
    
    // Animasi bunga sakura
    sakuraGroup.children.forEach((petal, i) => {
        petal.position.y += Math.sin(time + i) * 0.002;
        petal.rotation.y += 0.01;
    });
    
    controls.update();
    renderer.render(scene, camera);
}

animate();

// ---------- RESIZE ----------
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- LOADING ----------
window.addEventListener('load', () => {
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.innerHTML = `
        <div class="loader">
            <h1>🌸</h1>
            <h2>Maruko-chan 3D</h2>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loading);
    
    setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 500);
    }, 2000);
    
    updateUI();
});

console.log('🌸 Maruko-chan 3D siap! Tekan SPASI untuk lanjut cerita');
