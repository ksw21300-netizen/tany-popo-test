document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const body = document.body;

    // Categorized menus
    const menuData = {
        korean: ["김치찌개", "된장찌개", "불고기", "비빔밥", "삼겹살", "제육볶음", "국밥", "닭갈비", "보쌈", "비빔냉면"],
        japanese: ["초밥", "라멘", "돈카츠", "규동", "우동", "소바", "텐동", "사케동", "가츠동"],
        chinese: ["짜장면", "짬뽕", "탕수육", "마라탕", "꿔바로우", "볶음밥", "양꼬치", "마파두부"],
        western: ["파스타", "피자", "스테이크", "햄버거", "샐러드", "리조또", "샌드위치", "오므라이스"],
        snack: ["떡볶이", "김밥", "치킨", "족발", "튀김", "라면", "순대", "핫도그"]
    };

    let currentCategory = 'all';

    // Category selection logic
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
        });
    });

    const getRandomMenu = () => {
        let availableMenus = [];
        if (currentCategory === 'all') {
            Object.values(menuData).forEach(categoryMenus => {
                availableMenus = availableMenus.concat(categoryMenus);
            });
        } else {
            availableMenus = menuData[currentCategory];
        }
        
        const randomIndex = Math.floor(Math.random() * availableMenus.length);
        return availableMenus[randomIndex];
    };

    const displayMenu = (menu, isFinal = false) => {
        numbersContainer.innerHTML = '';
        const menuElement = document.createElement('div');
        menuElement.classList.add('menu-item');
        if (!isFinal) {
            menuElement.classList.add('spinning');
        }
        menuElement.textContent = menu;
        numbersContainer.appendChild(menuElement);
    };

    generateBtn.addEventListener('click', () => {
        generateBtn.disabled = true;
        let count = 0;
        const totalSteps = 15;
        
        const interval = setInterval(() => {
            displayMenu(getRandomMenu());
            count++;
            if (count >= totalSteps) {
                clearInterval(interval);
                const finalMenu = getRandomMenu();
                displayMenu(finalMenu, true);
                generateBtn.disabled = false;
            }
        }, 80);
    });

    // Form submission logic
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = '보내는 중...';

            const formData = new FormData(contactForm);
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('문의가 성공적으로 전송되었습니다. 곧 연락드리겠습니다!');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                    }
                }
            } catch (error) {
                alert('연결 중 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
