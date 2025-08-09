// NBA 2K26 Builder - 交互脚本
document.addEventListener('DOMContentLoaded', function() {
    initializeBuilder();
    initializeAnimations();
    initializeMobileMenu();
});

// 球员创建工具初始化
function initializeBuilder() {
    const sliders = document.querySelectorAll('.slider');
    const totalPoints = 450; // 总属性点数
    
    // 初始化所有滑块事件监听
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            updateSliderValue(this);
            updatePreview();
            calculateRemainingPoints();
            updateBadges();
        });
    });
    
    // 初始化基本信息输入框
    const playerNameInput = document.getElementById('playerName');
    const positionSelect = document.getElementById('position');
    
    if (playerNameInput) {
        playerNameInput.addEventListener('input', updatePreview);
    }
    
    if (positionSelect) {
        positionSelect.addEventListener('change', updatePreview);
    }
    
    // 初始化预览
    updatePreview();
    calculateRemainingPoints();
    updateBadges();
}

// 更新滑块显示值
function updateSliderValue(slider) {
    const valueElement = document.getElementById(slider.id + 'Value');
    if (valueElement) {
        let displayValue = slider.value;
        
        // 特殊处理身高和体重
        if (slider.id === 'height') {
            displayValue = slider.value + 'cm';
        } else if (slider.id === 'weight') {
            displayValue = slider.value + 'kg';
        } else if (slider.id === 'wingspan') {
            displayValue = slider.value + 'cm';
        }
        
        valueElement.textContent = displayValue;
    }
}

// 更新预览面板
function updatePreview() {
    // 更新球员基本信息
    const playerName = document.getElementById('playerName').value || '我的球员';
    const height = document.getElementById('height').value + 'cm';
    const weight = document.getElementById('weight').value + 'kg';
    const position = document.getElementById('position');
    const positionText = position.options[position.selectedIndex].text;
    
    // 更新预览显示
    document.getElementById('previewName').textContent = playerName;
    document.getElementById('previewHeight').textContent = height;
    document.getElementById('previewWeight').textContent = weight;
    document.getElementById('previewPosition').textContent = positionText;
    
    // 更新属性条
    updateStatBars();
}

// 更新属性条显示
function updateStatBars() {
    const attributes = ['speed', 'shooting', 'defense'];
    
    attributes.forEach(attr => {
        const slider = document.getElementById(attr);
        const bar = document.getElementById(attr + 'Bar');
        const preview = document.getElementById(attr + 'Preview');
        
        if (slider && bar && preview) {
            const value = slider.value;
            bar.style.width = value + '%';
            preview.textContent = value;
            
            // 根据数值设置颜色
            if (value >= 90) {
                bar.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
            } else if (value >= 80) {
                bar.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
            } else if (value >= 70) {
                bar.style.background = 'linear-gradient(90deg, #3498db, #2980b9)';
            } else {
                bar.style.background = 'linear-gradient(90deg, #95a5a6, #7f8c8d)';
            }
        }
    });
}

// 计算剩余属性点
function calculateRemainingPoints() {
    const attributeSliders = ['speed', 'agility', 'strength', 'vertical', 'shooting', 'defense'];
    const basePoints = 25; // 每个属性的基础点数
    const totalPoints = 450; // 总可用点数
    
    let usedPoints = 0;
    attributeSliders.forEach(attr => {
        const slider = document.getElementById(attr);
        if (slider) {
            usedPoints += parseInt(slider.value) - basePoints;
        }
    });
    
    const remaining = totalPoints - usedPoints;
    const remainingElement = document.getElementById('remainingPoints');
    
    if (remainingElement) {
        remainingElement.textContent = remaining;
        
        // 根据剩余点数设置颜色
        if (remaining < 0) {
            remainingElement.style.color = '#e74c3c';
            remainingElement.parentElement.style.borderColor = '#e74c3c';
        } else if (remaining === 0) {
            remainingElement.style.color = '#27ae60';
            remainingElement.parentElement.style.borderColor = '#27ae60';
        } else {
            remainingElement.style.color = '#f39c12';
            remainingElement.parentElement.style.borderColor = '#f39c12';
        }
    }
}

// 更新推荐徽章
function updateBadges() {
    const speed = parseInt(document.getElementById('speed').value);
    const shooting = parseInt(document.getElementById('shooting').value);
    const defense = parseInt(document.getElementById('defense').value);
    const agility = parseInt(document.getElementById('agility').value);
    const strength = parseInt(document.getElementById('strength').value);
    
    const badgeList = document.querySelector('.badge-list');
    if (!badgeList) return;
    
    badgeList.innerHTML = '';
    
    // 根据属性推荐徽章
    if (shooting >= 85) {
        addBadge(badgeList, '神射手', 'gold');
    } else if (shooting >= 75) {
        addBadge(badgeList, '投篮专家', 'silver');
    }
    
    if (speed >= 85) {
        addBadge(badgeList, '闪电突破', 'gold');
    } else if (speed >= 75) {
        addBadge(badgeList, '快速移动', 'silver');
    }
    
    if (defense >= 85) {
        addBadge(badgeList, '防守专家', 'gold');
    } else if (defense >= 75) {
        addBadge(badgeList, '防守威慑', 'silver');
    }
    
    if (agility >= 80 && speed >= 80) {
        addBadge(badgeList, '敏捷大师', 'silver');
    }
    
    if (strength >= 80) {
        addBadge(badgeList, '力量型', 'bronze');
    }
    
    // 如果没有推荐徽章，显示默认徽章
    if (badgeList.children.length === 0) {
        addBadge(badgeList, '新手', 'bronze');
        addBadge(badgeList, '努力训练', 'bronze');
    }
}

// 添加徽章
function addBadge(container, text, type) {
    const badge = document.createElement('span');
    badge.className = `badge ${type}`;
    badge.textContent = text;
    container.appendChild(badge);
}

// 动画效果初始化
function initializeAnimations() {
    // 为元素添加淡入动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.build-card, .feature-card, .builder-controls, .builder-preview');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// 移动端菜单初始化
function initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // 切换图标
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // 点击菜单项时关闭菜单
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
}

// 平滑滚动到指定区域
function smoothScrollTo(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 保存建模功能
function saveBuild() {
    const buildData = {
        name: document.getElementById('playerName').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        wingspan: document.getElementById('wingspan').value,
        position: document.getElementById('position').value,
        attributes: {
            speed: document.getElementById('speed').value,
            agility: document.getElementById('agility').value,
            strength: document.getElementById('strength').value,
            vertical: document.getElementById('vertical').value,
            shooting: document.getElementById('shooting').value,
            defense: document.getElementById('defense').value
        },
        timestamp: new Date().toISOString()
    };
    
    // 保存到本地存储
    const savedBuilds = JSON.parse(localStorage.getItem('nba2k26_builds') || '[]');
    savedBuilds.push(buildData);
    localStorage.setItem('nba2k26_builds', JSON.stringify(savedBuilds));
    
    // 显示成功消息
    showNotification('建模已保存！', 'success');
}

// 分享建模功能
function shareBuild() {
    const buildData = {
        name: document.getElementById('playerName').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        position: document.getElementById('position').value,
        attributes: {
            speed: document.getElementById('speed').value,
            agility: document.getElementById('agility').value,
            strength: document.getElementById('strength').value,
            vertical: document.getElementById('vertical').value,
            shooting: document.getElementById('shooting').value,
            defense: document.getElementById('defense').value
        }
    };
    
    // 生成分享链接（实际项目中会上传到服务器）
    const shareData = btoa(JSON.stringify(buildData));
    const shareUrl = `${window.location.origin}${window.location.pathname}?build=${shareData}`;
    
    // 复制到剪贴板
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).then(() => {
            showNotification('分享链接已复制到剪贴板！', 'success');
        });
    } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('分享链接已复制到剪贴板！', 'success');
    }
}

// 性能分析功能
function analyzeBuild() {
    const attributes = {
        speed: parseInt(document.getElementById('speed').value),
        agility: parseInt(document.getElementById('agility').value),
        strength: parseInt(document.getElementById('strength').value),
        vertical: parseInt(document.getElementById('vertical').value),
        shooting: parseInt(document.getElementById('shooting').value),
        defense: parseInt(document.getElementById('defense').value)
    };
    
    // 计算综合评分
    const overallRating = Math.round(Object.values(attributes).reduce((a, b) => a + b, 0) / 6);
    
    // 分析建模特点
    let analysis = `综合评分: ${overallRating}\n\n`;
    
    if (attributes.shooting >= 85) {
        analysis += '✅ 出色的投篮能力，适合外线进攻\n';
    }
    if (attributes.speed >= 85) {
        analysis += '✅ 极佳的速度，适合快攻和突破\n';
    }
    if (attributes.defense >= 85) {
        analysis += '✅ 强大的防守能力，是团队防守支柱\n';
    }
    if (attributes.strength >= 85) {
        analysis += '✅ 出众的力量，适合内线对抗\n';
    }
    
    // 提供改进建议
    analysis += '\n改进建议:\n';
    const weakestStat = Object.keys(attributes).reduce((a, b) => attributes[a] < attributes[b] ? a : b);
    analysis += `🔸 考虑提升${getStatName(weakestStat)}属性\n`;
    
    if (overallRating < 75) {
        analysis += '🔸 整体属性偏低，建议重新分配点数\n';
    }
    
    showNotification(analysis, 'info', 5000);
}

// 获取属性中文名称
function getStatName(stat) {
    const statNames = {
        speed: '速度',
        agility: '敏捷',
        strength: '力量',
        vertical: '跳跃',
        shooting: '投篮',
        defense: '防守'
    };
    return statNames[stat] || stat;
}

// 显示通知
function showNotification(message, type = 'info', duration = 3000) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-primary);
        padding: 16px 20px;
        border-radius: var(--border-radius);
        border-left: 4px solid var(--primary-color);
        box-shadow: var(--shadow-heavy);
        z-index: 10000;
        max-width: 400px;
        white-space: pre-line;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    // 根据类型设置颜色
    if (type === 'success') {
        notification.style.borderLeftColor = '#27ae60';
    } else if (type === 'error') {
        notification.style.borderLeftColor = '#e74c3c';
    } else if (type === 'warning') {
        notification.style.borderLeftColor = '#f39c12';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, duration);
}

// 绑定按钮事件
document.addEventListener('DOMContentLoaded', function() {
    // 保存按钮
    const saveBtn = document.querySelector('.btn-save');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveBuild);
    }
    
    // 分享按钮
    const shareBtn = document.querySelector('.btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareBuild);
    }
    
    // 分析按钮
    const analyzeBtn = document.querySelector('.btn-analyze');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeBuild);
    }
    
    // 导航链接平滑滚动
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            smoothScrollTo(targetId);
        });
    });
    
    // 英雄区域按钮
    const heroButtons = document.querySelectorAll('.hero-buttons .btn-primary, .hero-buttons .btn-secondary');
    heroButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            if (index === 0) {
                smoothScrollTo('builder');
            } else {
                smoothScrollTo('community');
            }
        });
    });
});

// 从URL加载分享的建模
function loadSharedBuild() {
    const urlParams = new URLSearchParams(window.location.search);
    const buildData = urlParams.get('build');
    
    if (buildData) {
        try {
            const build = JSON.parse(atob(buildData));
            
            // 填充表单数据
            document.getElementById('playerName').value = build.name || '';
            document.getElementById('height').value = build.height || 200;
            document.getElementById('weight').value = build.weight || 100;
            document.getElementById('position').value = build.position || 'PG';
            
            if (build.attributes) {
                Object.keys(build.attributes).forEach(attr => {
                    const element = document.getElementById(attr);
                    if (element) {
                        element.value = build.attributes[attr];
                    }
                });
            }
            
            // 更新显示
            updatePreview();
            calculateRemainingPoints();
            updateBadges();
            
            showNotification('已加载分享的建模！', 'success');
        } catch (error) {
            console.error('Error loading shared build:', error);
            showNotification('加载分享建模失败', 'error');
        }
    }
}

// 页面加载完成后检查分享链接
document.addEventListener('DOMContentLoaded', loadSharedBuild);
