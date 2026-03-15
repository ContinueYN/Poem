document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('gallery-grid');
    const filterAuthor = document.getElementById('filter-author');
    const filterStyle = document.getElementById('filter-style');
    const filterTheme = document.getElementById('filter-theme');
    const footer = document.querySelector('.footer p');
    
    // 从 metadata.json 加载作品数据
    fetch('assets/data/metadata.json')
        .then(response => response.json())
        .then(data => {
            renderGallery(data);
            setupFilters(data);
            updateFooter(data.length);
        })
        .catch(error => console.error('Error loading metadata:', error));
    
    // 更新页脚作品数量
    function updateFooter(count) {
        if (footer) {
            footer.textContent = `© 2025 ContinueYN | 已收录 ${count} 幅数字诗笺作品`;
        }
    }
    
    // 渲染画廊
    function renderGallery(artworks, filters = {}) {
        galleryGrid.innerHTML = '';
        
        const filteredArtworks = artworks.filter(artwork => {
            return (
                (filters.author ? artwork.author === filters.author : true) &&
                (filters.style ? artwork.style === filters.style : true) &&
                (filters.theme ? artwork.background === filters.theme : true)
            );
        });
        
        filteredArtworks.forEach(artwork => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.id = artwork.id;
            
            item.innerHTML = `
                <div class="item-image" style="background-image: url('${artwork.calligraphy}')">
                    <div class="item-overlay">
                        <button class="view-btn">查看详情</button>
                    </div>
                </div>
                <div class="item-content">
                    <h3 class="item-title">${artwork.title}</h3>
                    <p class="item-author">${artwork.author}</p>
                    <div class="item-meta">
                        <span>${artwork.background}</span>
                        <span>${artwork.id}</span>
                    </div>
                </div>
            `;
            
            galleryGrid.appendChild(item);
        });
        
        // 添加点击事件
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const item = this.closest('.gallery-item');
                showArtworkDetail(item.dataset.id);
            });
        });
    }
    
    // 设置筛选器
    function setupFilters(artworks) {
        // 作者筛选
        const authors = [...new Set(artworks.map(a => a.author))];
        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            filterAuthor.appendChild(option);
        });
        
        // 风格筛选
        const styles = [...new Set(artworks.map(a => a.style))];
        styles.forEach(style => {
            const option = document.createElement('option');
            option.value = style;
            option.textContent = style;
            filterStyle.appendChild(option);
        });
        
        // 主题筛选
        const themes = [...new Set(artworks.map(a => a.background))];
        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme;
            option.textContent = theme;
            filterTheme.appendChild(option);
        });
        
        // 筛选事件
        [filterAuthor, filterStyle, filterTheme].forEach(filter => {
            filter.addEventListener('change', function() {
                const filters = {
                    author: filterAuthor.value !== 'all' ? filterAuthor.value : null,
                    style: filterStyle.value !== 'all' ? filterStyle.value : null,
                    theme: filterTheme.value !== 'all' ? filterTheme.value : null
                };
                renderGallery(artworks, filters);
            });
        });
    }
    
    // 显示作品详情
    function showArtworkDetail(id) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'artwork-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body">
                    <div class="artwork-3dview" id="artwork-viewer-${id}"></div>
                    <div class="artwork-info">
                        <h3>${id}</h3>
                        <p>加载中...</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 关闭模态框
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // 点击外部关闭
        modal.addEventListener('click', function(e) {
            if(e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // 加载3D视图
        init3DViewer(`artwork-viewer-${id}`, id);
    }
    
    // 初始化3D查看器
    function init3DViewer(containerId, artworkId) {
        const container = document.getElementById(containerId);
        if(!container) return;
        
        // 简单实现 - 实际应根据artworkId加载对应模型
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // 添加光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // 添加书法平面
        const geometry = new THREE.PlaneGeometry(3, 2);
        const textureLoader = new THREE.TextureLoader();
        
        // 根据ID加载不同书法纹理
        textureLoader.load(`../calligraphy/poem${artworkId.replace('dh', '')}.jpg`, function(texture) {
            const material = new THREE.MeshStandardMaterial({ 
                map: texture,
                side: THREE.DoubleSide
            });
            const plane = new THREE.Mesh(geometry, material);
            scene.add(plane);
            
            // 添加控制器
            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.enableRotate = true;
            
            camera.position.z = 5;
            
            // 动画循环
            function animate() {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            }
            
            animate();
            
            // 响应式调整
            window.addEventListener('resize', function() {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
        });
    }
});