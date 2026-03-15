// poemGenerator.js

// 全局变量
let scene, camera, renderer, controls;
let poemData = [];
let currentPoem = null;
let poemObject = null;
let particleSystem = null;
let rotationSpeed = 0.01;
let frameColor = "#d4b36a";

// DOM元素
const canvasContainer = document.getElementById('poem-canvas');
const poemSelect = document.getElementById('poem-select');
const styleSelect = document.getElementById('style-select');
const frameColorInput = document.getElementById('frame-color');
const animationSpeedInput = document.getElementById('animation-speed');
const particleEffectCheckbox = document.getElementById('particle-effect');
const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const resetBtn = document.getElementById('reset-btn');
const poemInfoContent = document.getElementById('poem-info-content');
const canvasLoading = document.getElementById('canvas-loading');
const canvasPlaceholder = document.querySelector('.canvas-placeholder');

// 初始化函数
function init() {
    // 1. 加载诗歌元数据
    loadPoemData();
    
    // 2. 初始化Three.js场景
    initThreeJS();
    
    // 3. 设置事件监听器
    setupEventListeners();
}

// 加载诗歌元数据
function loadPoemData() {
    fetch('../assets/data/metadata.json')
        .then(response => response.json())
        .then(data => {
            poemData = data;
            populatePoemSelect(data);
        })
        .catch(error => {
            console.error('加载诗歌元数据失败:', error);
        });
}

// 填充诗歌选择下拉框
function populatePoemSelect(data) {
    poemSelect.innerHTML = '<option value="" disabled selected>--请选择--</option>';
    
    data.forEach(poem => {
        const option = document.createElement('option');
        option.value = poem.id;
        option.textContent = poem.title;
        poemSelect.appendChild(option);
    });
}

// 初始化Three.js
function initThreeJS() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0e6d3);
    scene.fog = new THREE.Fog(0xf0e6d3, 10, 20);
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(
        75,
        canvasContainer.clientWidth / canvasContainer.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 5;
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);
    
    // 添加轨道控制
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // 添加基础平面
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xf0e6d3,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -2;
    scene.add(plane);
    
    // 隐藏加载动画
    setTimeout(() => {
        canvasLoading.style.display = 'none';
    }, 1500);
    
    // 开始动画循环
    animate();
}

// 设置事件监听器
function setupEventListeners() {
    // 诗歌选择事件
    poemSelect.addEventListener('change', function() {
        const poemId = this.value;
        currentPoem = poemData.find(p => p.id === poemId);
        
        if (currentPoem) {
            updatePoemInfo(currentPoem);
        }
    });
    
    // 边框颜色事件
    frameColorInput.addEventListener('input', function() {
        frameColor = this.value;
        if (poemObject) {
            updateFrameColor();
        }
    });
    
    // 动画速度事件
    animationSpeedInput.addEventListener('input', function() {
        rotationSpeed = this.value * 0.005;
    });
    
    // 生成按钮事件
    generateBtn.addEventListener('click', generatePoem);
    
    // 下载按钮事件
    downloadBtn.addEventListener('click', downloadPoem);
    
    // 重置按钮事件
    resetBtn.addEventListener('click', resetScene);
    
    // 窗口大小调整事件
    window.addEventListener('resize', onWindowResize);
}

// 更新诗歌信息
function updatePoemInfo(poem) {
    poemInfoContent.innerHTML = `
        <h4>${poem.title}</h4>
        <p><strong>作者：</strong>${poem.author}</p>
        <p><strong>创作日期：</strong>${poem.date}</p>
        <p><strong>背景：</strong>${poem.background}</p>
        <div class="poem-text">${poem.poemText.replace(/\n/g, '<br>')}</div>
        <p class="poem-description">${poem.description}</p>
    `;
}

// 生成诗笺
function generatePoem() {
    if (!currentPoem) {
        alert('请先选择一首诗歌');
        return;
    }
    
    // 隐藏占位符
    canvasPlaceholder.style.display = 'none';
    
    // 清除现有诗笺
    if (poemObject) {
        scene.remove(poemObject);
        poemObject = null;
    }
    
    // 清除现有粒子
    if (particleSystem) {
        scene.remove(particleSystem);
        particleSystem = null;
    }
    
    // 创建诗笺
    createPoemObject();
    
    // 添加粒子效果
    if (particleEffectCheckbox.checked) {
        createParticleSystem();
    }
}

// 创建诗笺对象
function createPoemObject() {
    const style = styleSelect.value;
    const frameGroup = new THREE.Group();
    
    // 创建边框
    const frameGeometry = new THREE.BoxGeometry(3.5, 4.5, 0.1);
    const frameMaterial = new THREE.MeshPhongMaterial({ 
        color: frameColor,
        shininess: 80
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frameGroup.add(frame);
    
    // 创建画布
    const canvasGeometry = new THREE.PlaneGeometry(3.2, 4.2);
    
    // 创建书法纹理
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(`../assets/calligraphy/${currentPoem.id}.jpg`);
    
    const canvasMaterial = new THREE.MeshPhongMaterial({ 
        map: texture,
        side: THREE.DoubleSide
    });
    
    const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvas.position.z = 0.06;
    frameGroup.add(canvas);
    
    // 根据风格添加效果
    if (style === 'scroll') {
        // 卷轴效果
        const scrollTop = createScrollEnd(0.2, 0.3, 1.8, 0.1);
        scrollTop.position.y = 2.25;
        frameGroup.add(scrollTop);
        
        const scrollBottom = createScrollEnd(0.2, 0.3, 1.8, 0.1);
        scrollBottom.position.y = -2.25;
        frameGroup.add(scrollBottom);
    } 
    else if (style === 'silk') {
        // 绢本效果 - 添加纹理
        const silkTexture = textureLoader.load('../assets/textures/silk-texture.jpg');
        silkTexture.wrapS = THREE.RepeatWrapping;
        silkTexture.wrapT = THREE.RepeatWrapping;
        silkTexture.repeat.set(2, 2);
        
        frameMaterial.map = silkTexture;
        frameMaterial.needsUpdate = true;
    } 
    else if (style === 'stele') {
        // 碑刻效果
        frameMaterial.color.set(0x7a6e5d);
        frameMaterial.bumpScale = 0.05;
        
        const stoneTexture = textureLoader.load('../assets/textures/stone.jpg');
        stoneTexture.wrapS = THREE.RepeatWrapping;
        stoneTexture.wrapT = THREE.RepeatWrapping;
        stoneTexture.repeat.set(1, 1);
        
        frameMaterial.map = stoneTexture;
        frameMaterial.bumpMap = stoneTexture;
        frameMaterial.needsUpdate = true;
        
        // 添加磨损效果
        const wearGeometry = new THREE.BoxGeometry(3.51, 4.51, 0.11);
        const wearMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.1,
            wireframe: true
        });
        const wear = new THREE.Mesh(wearGeometry, wearMaterial);
        frameGroup.add(wear);
    }
    
    // 添加动画效果
    frameGroup.rotation.x = -0.2;
    frameGroup.rotation.y = 0.3;
    
    // 添加到场景
    scene.add(frameGroup);
    poemObject = frameGroup;
}

// 创建卷轴末端
function createScrollEnd(radiusTop, radiusBottom, height, radialSegments) {
    const geometry = new THREE.CylinderGeometry(
        radiusTop, 
        radiusBottom, 
        height, 
        radialSegments
    );
    
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x8a3324,
        shininess: 60
    });
    
    const cylinder = new THREE.Mesh(geometry, material);
    cylinder.rotation.z = Math.PI / 2;
    return cylinder;
}

// 创建粒子系统
function createParticleSystem() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // 粒子颜色 - 根据诗歌风格
    let colorPalette;
    switch(currentPoem.background) {
        case '边塞':
            colorPalette = [0x8a3324, 0xd4b36a, 0x7a6e5d, 0x4e342e]; // 沙漠色调
            break;
        case '乐舞':
            colorPalette = [0xe8c87d, 0xd4b36a, 0x8a3324, 0x4e342e]; // 暖色调
            break;
        case '神话':
            colorPalette = [0x7d8a33, 0x5d7a6e, 0x4e348a, 0x8a334e]; // 神秘色调
            break;
        case '离别':
            colorPalette = [0x334e8a, 0x6a5dd4, 0x8a7d33, 0x4e8a34]; // 忧郁色调
            break;
        default:
            colorPalette = [0xd4b36a, 0x8a3324, 0x7a6e5d, 0x4e342e];
    }
    
    // 初始化粒子位置和颜色
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // 位置
        positions[i3] = (Math.random() - 0.5) * 10;
        positions[i3 + 1] = Math.random() * 5;
        positions[i3 + 2] = (Math.random() - 0.5) * 10;
        
        // 颜色
        const color = new THREE.Color(
            colorPalette[Math.floor(Math.random() * colorPalette.length)]
        );
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 粒子材质
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    // 创建粒子系统
    particleSystem = new THREE.Points(particles, particleMaterial);
    particleSystem.position.y = 1;
    scene.add(particleSystem);
}

// 更新边框颜色
function updateFrameColor() {
    poemObject.traverse((child) => {
        if (child.isMesh && child.material && child.material.color) {
            child.material.color.set(frameColor);
        }
    });
}

// 下载诗笺
function downloadPoem() {
    if (!poemObject) {
        alert('请先生成诗笺');
        return;
    }
    
    // 创建临时canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1024;
    tempCanvas.height = 1024;
    const tempCtx = tempCanvas.getContext('2d');
    
    // 填充背景
    tempCtx.fillStyle = '#f0e6d3';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // 绘制标题
    tempCtx.font = 'bold 48px "Noto Serif SC", serif';
    tempCtx.fillStyle = '#8a3324';
    tempCtx.textAlign = 'center';
    tempCtx.fillText(currentPoem.title, tempCanvas.width / 2, 80);
    
    // 绘制作者
    tempCtx.font = '32px "Noto Serif SC", serif';
    tempCtx.fillStyle = '#4e342e';
    tempCtx.fillText(`—— ${currentPoem.author} ——`, tempCanvas.width / 2, 140);
    
    // 绘制诗句
    const lines = currentPoem.poemText.split('\n');
    tempCtx.font = '40px "Ma Shan Zheng", cursive';
    tempCtx.fillStyle = '#3e2723';
    
    lines.forEach((line, index) => {
        tempCtx.fillText(line, tempCanvas.width / 2, 250 + index * 80);
    });
    
    // 创建下载链接
    const link = document.createElement('a');
    link.download = `${currentPoem.title}_${currentPoem.author}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}

// 重置场景
function resetScene() {
    if (poemObject) {
        scene.remove(poemObject);
        poemObject = null;
    }
    
    if (particleSystem) {
        scene.remove(particleSystem);
        particleSystem = null;
    }
    
    poemSelect.selectedIndex = 0;
    styleSelect.selectedIndex = 0;
    frameColorInput.value = "#d4b36a";
    animationSpeedInput.value = 3;
    particleEffectCheckbox.checked = true;
    
    currentPoem = null;
    poemInfoContent.innerHTML = '<p>选择诗歌后，赏析内容将显示在这里...</p>';
    canvasPlaceholder.style.display = 'flex';
}

// 窗口大小调整处理
function onWindowResize() {
    camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
}

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    
    // 更新控制器
    controls.update();
    
    // 旋转诗笺
    if (poemObject) {
        poemObject.rotation.y += rotationSpeed;
    }
    
    // 更新粒子
    if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // 随机移动粒子
            positions[i] += (Math.random() - 0.5) * 0.02;
            positions[i + 1] += (Math.random() - 0.5) * 0.02;
            positions[i + 2] += (Math.random() - 0.5) * 0.02;
            
            // 边界检查
            if (positions[i + 1] < -2) positions[i + 1] = 5;
            if (Math.abs(positions[i]) > 5) positions[i] *= -0.8;
            if (Math.abs(positions[i + 2]) > 5) positions[i + 2] *= -0.8;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    renderer.render(scene, camera);
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init);