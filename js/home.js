document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('preview-canvas');
    if (!container) return;
    
    // 1. 初始化场景、相机和渲染器
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.z = 10;
    
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // 2. 敦煌风格灯光设置
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xfff5e6, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    const rimLight = new THREE.DirectionalLight(0xd4b36a, 0.4);
    rimLight.position.set(-5, 3, 5);
    scene.add(rimLight);
    
    // 3. 加载敦煌风格纹理
    const textureLoader = new THREE.TextureLoader();
    const scrollTexture = textureLoader.load('../assets/textures/dunhuang-scroll.jpg');
    const silkTexture = textureLoader.load('../assets/textures/silk-texture.jpg');
    const goldTexture = textureLoader.load('../assets/textures/gold-texture.jpg');
    
    // 4. 创建高级敦煌卷轴
    const createAdvancedScroll = () => {
        const group = new THREE.Group();
        
        // 卷轴杆 - 更精细的模型
        const scrollGeometry = new THREE.CylinderGeometry(0.15, 0.15, 5, 64);
        const scrollMaterial = new THREE.MeshStandardMaterial({ 
            map: goldTexture,
            metalness: 0.7,
            roughness: 0.3,
            envMapIntensity: 0.5
        });
        
        const topScroll = new THREE.Mesh(scrollGeometry, scrollMaterial);
        topScroll.position.y = 2.5;
        topScroll.rotation.x = Math.PI/2;
        topScroll.castShadow = true;
        
        const bottomScroll = new THREE.Mesh(scrollGeometry, scrollMaterial);
        bottomScroll.position.y = -2.5;
        bottomScroll.rotation.x = Math.PI/2;
        bottomScroll.castShadow = true;
        
        // 卷轴布 - 丝绸材质
        const clothGeometry = new THREE.PlaneGeometry(6, 5, 100, 100);
        const clothMaterial = new THREE.MeshStandardMaterial({
            map: scrollTexture,
            side: THREE.DoubleSide,
            roughness: 0.7,
            metalness: 0.1,
            displacementMap: silkTexture,
            displacementScale: 0.1
        });
        
        const cloth = new THREE.Mesh(clothGeometry, clothMaterial);
        cloth.position.z = -0.01;
        cloth.receiveShadow = true;
        
        // 添加边缘装饰
        const borderGeometry = new THREE.PlaneGeometry(6.2, 5.2);
        const borderMaterial = new THREE.MeshStandardMaterial({
            color: 0x8a3324,
            metalness: 0.3,
            roughness: 0.7
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        border.position.z = -0.02;
        
        group.add(topScroll);
        group.add(bottomScroll);
        group.add(border);
        group.add(cloth);
        
        return group;
    };
    
    const scroll = createAdvancedScroll();
    scene.add(scroll);
    
    // 5. 创建敦煌飞天粒子系统
    const createFlyingApsaras = () => {
        const count = 1000;
        const particlesGeometry = new THREE.BufferGeometry();
        
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        // 敦煌风格颜色 (红、金、青绿)
        const colorPalette = [
            new THREE.Color(0x8a3324), // 敦煌红
            new THREE.Color(0xd4b36a), // 金色
            new THREE.Color(0x4a6b3a), // 青绿色
            new THREE.Color(0x7a9cc5)  // 青蓝色
        ];
        
        for (let i = 0; i < count; i++) {
            // 位置
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = Math.random() * 10 - 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            // 颜色
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            
            // 大小
            sizes[i] = Math.random() * 0.5 + 0.1;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        return new THREE.Points(particlesGeometry, particlesMaterial);
    };
    
    const flyingApsaras = createFlyingApsaras();
    scene.add(flyingApsaras);
    
    // 6. 添加敦煌云纹背景
    const createCloudPattern = () => {
        const geometry = new THREE.TorusKnotGeometry(5, 1.5, 256, 32);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x8a3324,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        const cloud = new THREE.Mesh(geometry, material);
        cloud.position.z = -8;
        return cloud;
    };
    
    const cloudPattern = createCloudPattern();
    scene.add(cloudPattern);
    
    // 7. 动画循环
    const clock = new THREE.Clock();
    const animate = () => {
        requestAnimationFrame(animate);
        
        const elapsedTime = clock.getElapsedTime();
        
        // 卷轴动画
        scroll.rotation.y = elapsedTime * 0.2;
        scroll.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
        
        // 飞天粒子动画
        const positions = flyingApsaras.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(elapsedTime * 0.5 + i) * 0.01;
            positions[i + 1] += Math.cos(elapsedTime * 0.3 + i * 0.5) * 0.02;
            positions[i + 2] += Math.sin(elapsedTime * 0.7 + i * 0.3) * 0.01;
        }
        flyingApsaras.geometry.attributes.position.needsUpdate = true;
        
        // 云纹背景动画
        cloudPattern.rotation.x = elapsedTime * 0.05;
        cloudPattern.rotation.y = elapsedTime * 0.03;
        
        renderer.render(scene, camera);
    };
    
    animate();
    
    // 8. 响应式调整
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});