/**
 * Three.js 3D/4D Effects — Partikel, Geometric Morphing, Mouse Parallax
 * Butuh Three.js (sudah load via CDN di index.html)
 */

declare var THREE: any;

interface Particle {
  mesh: any;
  geometry: any;
  material: any;
  velocities: Float32Array;
  originalPositions: Float32Array;
}

interface MorphShape {
  mesh: any;
  targetGeometries: any[];
  currentIndex: number;
  progress: number;
  morphing: boolean;
}

let scene: any;
let camera: any;
let renderer: any;
let particles: Particle | null = null;
let morphShapes: MorphShape[] = [];
let mouse = { x: 0, y: 0 };
let targetMouse = { x: 0, y: 0 };
let animationId: number;
let time = 0;

export function initThreeEffects(containerId = 'three-bg') {
  const container = document.getElementById(containerId);
  if (!container || typeof THREE === 'undefined') return;

  // Scene
  scene = new THREE.Scene();

  // Camera
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.z = 50;

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Partikel 3D interaktif
  createParticles();

  // Geometric morphing shapes (4D: time-based morphing)
  createMorphShapes();

  // Lights
  const ambient = new THREE.AmbientLight(0x404060, 0.8);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0x38bdf8, 1);
  dirLight.position.set(10, 20, 15);
  scene.add(dirLight);
  const pointLight = new THREE.PointLight(0xf472b6, 0.6, 100);
  pointLight.position.set(-10, -10, 20);
  scene.add(pointLight);

  // Mouse parallax
  document.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);

  // Start loop
  animate();

  // Cleanup fn
  return () => {
    cancelAnimationFrame(animationId);
    document.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    if (particles) {
      particles.geometry.dispose();
      particles.material.dispose();
    }
    morphShapes.forEach(ms => {
      ms.mesh.geometry.dispose();
      ms.mesh.material.dispose();
      ms.targetGeometries.forEach(g => g.dispose());
    });
    container.removeChild(renderer.domElement);
  };
}

function createParticles() {
  const count = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const velocities = new Float32Array(count * 3);

  const color1 = new THREE.Color(0x38bdf8);
  const color2 = new THREE.Color(0xf472b6);
  const color3 = new THREE.Color(0x818cf8);

  for (let i = 0; i < count; i++) {
    const radius = 15 + Math.random() * 25;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    const c = new THREE.Color().copy(color1).lerp(color2, Math.random());
    c.lerp(color3, Math.random() * 0.3);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    sizes[i] = 0.5 + Math.random() * 1.5;

    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  particles = { mesh, geometry, material, velocities, originalPositions: positions.slice() };
}

function createMorphShapes() {
  const shapes = [
    { geometry: new THREE.TorusKnotGeometry(4, 1.5, 100, 16), color: 0x38bdf8 },
    { geometry: new THREE.IcosahedronGeometry(4, 1), color: 0xf472b6 },
    { geometry: new THREE.OctahedronGeometry(5, 1), color: 0x818cf8 },
    { geometry: new THREE.DodecahedronGeometry(4, 1), color: 0x22d3ee },
  ];

  shapes.forEach((shape, i) => {
    const material = new THREE.MeshPhysicalMaterial({
      color: shape.color,
      metalness: 0.3,
      roughness: 0.4,
      transmission: 0.15,
      thickness: 0.5,
      transparent: true,
      opacity: 0.35,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
    });

    const mesh = new THREE.Mesh(shape.geometry.clone(), material);
    mesh.position.set(
      (i % 2 === 0 ? -1 : 1) * 18,
      (i < 2 ? 1 : -1) * 12,
      -20 + i * 5
    );
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    scene.add(mesh);

    const targets = [
      new THREE.TorusKnotGeometry(4, 1.5, 100, 16),
      new THREE.IcosahedronGeometry(4, 1),
      new THREE.OctahedronGeometry(5, 1),
      new THREE.DodecahedronGeometry(4, 1),
      new THREE.SphereGeometry(4, 32, 32),
    ];

    morphShapes.push({
      mesh,
      targetGeometries: targets,
      currentIndex: 0,
      progress: 0,
      morphing: false,
    });
  });

  setInterval(() => {
    morphShapes.forEach((ms, i) => {
      if (!ms.morphing) {
        ms.morphing = true;
        ms.currentIndex = (ms.currentIndex + 1) % ms.targetGeometries.length;
      }
    });
  }, 4000 + Math.random() * 2000);
}

function onMouseMove(e: MouseEvent) {
  targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
}

function onResize() {
  const container = document.getElementById('three-bg');
  if (!container) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  time += 0.01;

  mouse.x += (targetMouse.x - mouse.x) * 0.05;
  mouse.y += (targetMouse.y - mouse.y) * 0.05;

  if (particles) {
    const pos = particles.geometry.attributes.position.array;
    const vel = particles.velocities;
    const orig = particles.originalPositions;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += vel[i];
      pos[i + 1] += vel[i + 1];
      pos[i + 2] += vel[i + 2];

      const dx = mouse.x * 30 - pos[i];
      const dy = mouse.y * 30 - pos[i + 1];
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 40) {
        const force = (40 - dist) / 40 * 0.03;
        pos[i] += dx * force;
        pos[i + 1] += dy * force;
      }

      const ox = orig[i] - pos[i];
      const oy = orig[i + 1] - pos[i + 1];
      const oz = orig[i + 2] - pos[i + 2];
      pos[i] += ox * 0.001;
      pos[i + 1] += oy * 0.001;
      pos[i + 2] += oz * 0.001;

      pos[i + 1] += Math.sin(time + i * 0.01) * 0.02;
    }
    particles.geometry.attributes.position.needsUpdate = true;

    particles.mesh.rotation.y += 0.0003;
    particles.mesh.rotation.x += 0.0001;
  }

  morphShapes.forEach((ms, i) => {
    ms.mesh.rotation.x += 0.003 + i * 0.001;
    ms.mesh.rotation.y += 0.005 + i * 0.0015;

    ms.mesh.position.y += Math.sin(time * 0.5 + i) * 0.02;

    ms.mesh.position.x += (mouse.x * 5 - ms.mesh.position.x * 0.1) * 0.02;
    ms.mesh.position.y += (mouse.y * 5 - ms.mesh.position.y * 0.1) * 0.02;

    if (ms.morphing) {
      ms.progress += 0.015;
      if (ms.progress >= 1) {
        ms.progress = 0;
        ms.morphing = false;
        ms.mesh.geometry = ms.targetGeometries[ms.currentIndex].clone();
      } else {
        const currentGeo = ms.mesh.geometry;
        const targetGeo = ms.targetGeometries[ms.currentIndex];
        const posAttr = currentGeo.attributes.position;
        const targetPos = targetGeo.attributes.position;
        if (posAttr.count === targetPos.count) {
          for (let j = 0; j < posAttr.count; j++) {
            const x = THREE.MathUtils.lerp(posAttr.getX(j), targetPos.getX(j), ms.progress);
            const y = THREE.MathUtils.lerp(posAttr.getY(j), targetPos.getY(j), ms.progress);
            const z = THREE.MathUtils.lerp(posAttr.getZ(j), targetPos.getZ(j), ms.progress);
            posAttr.setXYZ(j, x, y, z);
          }
          posAttr.needsUpdate = true;
          currentGeo.computeVertexNormals();
        }
      }
    }
  });

  camera.position.x += (mouse.x * 2 - camera.position.x) * 0.02;
  camera.position.y += (mouse.y * 2 - camera.position.y) * 0.02;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
}
