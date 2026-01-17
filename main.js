document.addEventListener('DOMContentLoaded', function () {

    // --- PHẦN 1: ĐẾM NGƯỢC ---
    const countDownDate = new Date("Jan 28, 2026 10:30:00").getTime();

    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMinutes = document.getElementById("minutes");
    const elSeconds = document.getElementById("seconds");
    const elTitle = document.querySelector(".text-gold");

    const x = setInterval(function () {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (elDays) elDays.innerHTML = days;
        if (elHours) elHours.innerHTML = hours.toString().padStart(2, '0');
        if (elMinutes) elMinutes.innerHTML = minutes.toString().padStart(2, '0');
        if (elSeconds) elSeconds.innerHTML = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(x);
            if (elTitle) elTitle.innerHTML = "Lễ cưới đang diễn ra!";
        }
    }, 1000);


    // --- PHẦN 2: POPUP & EMAIL ---
    const modal = document.getElementById('wedding-modal');
    const modalContent = document.getElementById('modal-content');

    window.openModal = function (type) {
        if (!modal || !modalContent) return;

        modal.classList.remove('hidden');

        if (type === 'join') {
            modalContent.innerHTML = `
                <div class="relative py-6 px-4 animate-in fade-in zoom-in duration-300">
                    <div class="text-6xl mb-4 animate-bounce">❤️</div>
                    <h3 class="text-3xl font-serif font-bold text-primary mb-4 tracking-wide">Cảm ơn bạn!</h3>
                    <div class="w-20 h-px bg-[#D4AF37]/40 mx-auto mb-6"></div>
                    <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                        Sự hiện diện của bạn là món quà ý nghĩa nhất đối với chúng mình.<br>
                        <span class="italic font-serif text-primary mt-2 block text-lg">Hẹn gặp bạn tại buổi lễ nhé!</span>
                    </p>
                    <button onclick="closeModal()" 
                        class="bg-primary text-white px-12 py-3 rounded-full text-sm font-bold tracking-[0.2em] uppercase hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        Đóng
                    </button>
                </div>
            `;
            sendEmailNotification("XÁC NHẬN THAM GIA");
        } else {
            modalContent.innerHTML = `
                <div class="relative py-6 px-4 animate-in fade-in zoom-in duration-300">
                    <div class="text-5xl mb-4 grayscale opacity-70">😌</div>
                    <h3 class="text-2xl font-serif font-bold text-primary mb-2">Tiếc quá đi thôi...</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-6 text-sm">Chúng mình rất trân trọng tình cảm của bạn dù bạn không thể góp mặt.</p>
                    
                    <div class="relative p-2 border-2 border-[#D4AF37]/20 rounded-2xl bg-white dark:bg-gray-900 inline-block shadow-xl mb-6">
                        <img src="image/qr_code.jpg" alt="QR Code" class="mx-auto max-w-[180px] rounded-lg">
                        <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-[10px] px-4 py-1 rounded-full whitespace-nowrap font-bold shadow-md">
                            MỪNG CƯỚI ONLINE
                        </div>
                    </div>

                    <p class="text-[11px] text-gray-400 mt-4 uppercase tracking-[0.2em]">Cảm ơn bạn đã luôn yêu thương!</p>
                    <button onclick="closeModal()" class="mt-8 text-gray-400 text-xs underline hover:text-primary transition-colors uppercase tracking-widest">Quay lại</button>
                </div>
            `;
            // sendEmailNotification("KHÁCH BẬN (KHÔNG THAM GIA)");
        }
    };

    window.closeModal = function () {
        if (modal) modal.classList.add('hidden');
    };

    const btnJoin = document.getElementById('btn-join');
    const btnBusy = document.getElementById('btn-busy');
    if (btnJoin) btnJoin.addEventListener('click', () => openModal('join'));
    if (btnBusy) btnBusy.addEventListener('click', () => openModal('busy'));

    window.addEventListener('click', (e) => { if (e.target == modal) closeModal(); });

    // HÀM GỬI EMAIL THẬT
    function sendEmailNotification(statusValue) {
        console.log("Đang gửi thông báo: " + statusValue);

        // Lưu ý: Các key 'status' và 'time' phải khớp với {{status}} và {{time}} trong Template
        const templateParams = {
            status: statusValue,
            time: new Date().toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            })
        };

        // Thay thế 'YOUR_SERVICE_ID' và 'YOUR_TEMPLATE_ID' bằng ID thật của bạn
        emailjs.send('service_1orvapl', 'template_23gvezz', templateParams)
            .then(function (response) {
                console.log('EMAIL GỬI THÀNH CÔNG!', response.status, response.text);
            }, function (error) {
                console.error('LỖI GỬI EMAIL:', error);
            });
    }

    // --- PHẦN 3: NHẠC NỀN (BỎ QUA NẾU KHÔNG CẦN) ---
    const xemBtn = document.getElementById('xem');

    const musicBtn = document.getElementById('music-control');
    const musicIcon = document.getElementById('music-icon');
    const audio = document.getElementById('bg-music');

    let isPlaying = false;
    let autoScrollInterval = null;

    // ===== HÀM PHÁT NHẠC =====
    function playMusic() {
        if (!isPlaying) {
            audio.play();
            audio.muted = false;

            musicIcon.classList.remove('music-paused');
            musicIcon.innerText = 'music_note';

            isPlaying = true;
        }
    }

    let autoScrollFrame = null;

    function startAutoScroll(duration = 120000) {
        const start = window.pageYOffset;
        const end = document.body.scrollHeight - window.innerHeight;
        const distance = end - start;

        let startTime = null;

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function scrollStep(timestamp) {
            if (!startTime) startTime = timestamp;

            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = easeOutCubic(progress);

            window.scrollTo(0, start + distance * eased);

            if (progress < 1) {
                autoScrollFrame = requestAnimationFrame(scrollStep);
            }
        }

        autoScrollFrame = requestAnimationFrame(scrollStep);
    }

    // dừng scroll
    function stopAutoScroll() {
        if (autoScrollFrame) {
            cancelAnimationFrame(autoScrollFrame);
        }
    }

    ['touchstart', 'wheel', 'mousedown', 'keydown'].forEach(evt => {
        window.addEventListener(evt, stopAutoScroll, { passive: true });
    });

    // ===== CLICK VÀO SPAN "Xem Thiệp" =====
    xemBtn.addEventListener('click', () => {
        playMusic();
        startAutoScroll(120000); // 10 giây
    });
    // ===== NÚT BẬT/TẮT NHẠC CỦA BẠN =====
    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            musicIcon.classList.add('music-paused');
            musicIcon.innerText = 'music_off';
        } else {
            audio.play();
            audio.muted = false;
            musicIcon.classList.remove('music-paused');
            musicIcon.innerText = 'music_note';
        }
        isPlaying = !isPlaying;
    });

    // Fallback nếu trình duyệt chặn autoplay
    document.body.addEventListener('click', () => {
        playMusic();
    }, { once: true });

    //Menu mobile toggle

    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const header = document.getElementById('header');

    function updateMenuTop() {
        // Tính height header động
        const headerHeight = header.offsetHeight;
        const menuContent = mobileMenu.querySelector('.relative');  // Phần content bên trong
        if (menuContent) {
            menuContent.style.paddingTop = `${headerHeight}px`;
        }
        console.log('Header height updated:', headerHeight);  // Debug
    }

    function toggleMenu() {
        const isOpen = mobileMenu.classList.contains('open');
        console.log('Toggle menu:', isOpen ? 'Closing' : 'Opening');  // Debug

        if (!isOpen) {
            // Mở menu
            mobileMenu.classList.add('open');
            menuIcon.innerText = 'close';
            document.body.classList.add('menu-open');
            updateMenuTop();  // Update top động
        } else {
            // Đóng menu
            mobileMenu.classList.remove('open');
            menuIcon.innerText = 'menu';
            document.body.classList.remove('menu-open');
            console.log('Menu closed, body unlocked');  // Debug
        }
    }

    // Mở/đóng khi bấm nút Menu
    menuButton.addEventListener('click', toggleMenu);

    // Tự động đóng khi bấm link (và scroll đến section)
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();  // Ngăn default scroll jump tạm thời
            const href = link.getAttribute('href');
            setTimeout(() => {
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }, 300);  // Delay để menu đóng mượt
            toggleMenu();  // Đóng menu
        });
    });

    // Đóng khi click outside (trên backdrop)
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            toggleMenu();
        }
    });

    // Update height khi resize (ví dụ: orientation change trên mobile)
    window.addEventListener('resize', updateMenuTop);

    // Khởi tạo
    updateMenuTop();  // Set initial top

    // Hiệu Ứng Cuộn Hiện Dần
    const observerOptions = {
            threshold: 0.2 // Kích hoạt khi phần tử hiện ra 15%
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Tìm tất cả các phần tử có class 'reveal' để theo dõi
        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));    
});