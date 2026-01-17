document.addEventListener('DOMContentLoaded', function () {

    // ===============================
    // 1. ĐẾM NGƯỢC
    // ===============================
    const countDownDate = new Date("Jan 28, 2026 10:30:00").getTime();

    const elDays = document.getElementById("days");
    const elHours = document.getElementById("hours");
    const elMinutes = document.getElementById("minutes");
    const elSeconds = document.getElementById("seconds");
    const elTitle = document.querySelector(".text-gold");

    setInterval(function () {
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
            if (elTitle) elTitle.innerHTML = "Lễ cưới đang diễn ra!";
        }
    }, 1000);


    // ===============================
    // 2. RSVP + MODAL SIÊU XỊN
    // ===============================
    const modal = document.getElementById('wedding-modal');
    const modalContent = document.getElementById('modal-content');

    const btnJoin = document.getElementById('btn-join');
    const btnBusy = document.getElementById('btn-busy');

    // --- Đọc trạng thái cũ ---
    const saved = localStorage.getItem('wedding-rsvp');
    if (saved === 'join') markJoined();
    if (saved === 'busy') markBusy();

    function markJoined() {
        btnJoin.innerHTML = "Đã xác nhận ❤️";
        btnJoin.classList.add('opacity-70');

        btnBusy.classList.remove('opacity-70');
        btnBusy.innerHTML = "Bận Và Không Thể Tham Gia";
    }

    function markBusy() {
        btnBusy.innerHTML = "Đã gửi lời chúc 💌";
        btnBusy.classList.add('opacity-70');

        btnJoin.classList.remove('opacity-70');
        btnJoin.innerHTML = "Tham Gia";
    }


    // --- PHÁO GIẤY ---
    function fireConfetti() {
        const c = document.createElement('div');
        c.innerHTML = "🎉🎊✨";
        c.className = "fixed inset-0 flex items-center justify-center text-6xl pointer-events-none animate-bounce";
        document.body.appendChild(c);

        setTimeout(() => c.remove(), 2000);
    }

    // --- HOA RƠI ---
    function flowerEffect() {
        const f = document.createElement('div');
        f.innerHTML = "🌸🌼";
        f.className = "fixed inset-0 flex items-center justify-center text-6xl pointer-events-none animate-pulse";
        document.body.appendChild(f);

        setTimeout(() => f.remove(), 2000);
    }


    window.openModal = function (type) {
        modal.classList.remove('hidden');

        if (type === 'join') {

            markJoined();
            localStorage.setItem('wedding-rsvp', 'join');

            modalContent.innerHTML = `
                <div class="py-6 px-4 text-center">
                    <div class="text-6xl mb-4 animate-bounce">❤️</div>
                    <h3 class="text-3xl font-serif text-primary mb-4">
                        Cảm ơn bạn!
                    </h3>

                    <p class="mb-6 text-gray-600 dark:text-gray-300">
                        Sự hiện diện của bạn là niềm hạnh phúc của chúng mình.
                    </p>

                    <button onclick="closeModal()" 
                        class="bg-primary text-white px-10 py-3 rounded-full">
                        Đóng
                    </button>
                </div>
            `;

            fireConfetti();
            sendEmailNotification("THAM GIA");

            // Tự cuộn xuống map sau 1s
            setTimeout(() => {
                document.getElementById('vitri')
                    ?.scrollIntoView({ behavior: 'smooth' });
            }, 1000);

        } else {

            markBusy();
            localStorage.setItem('wedding-rsvp', 'busy');

            modalContent.innerHTML = `
                <div class="py-6 px-4 text-center">
                    <div class="text-5xl mb-4">😌</div>
                    <h3 class="text-2xl font-serif text-primary mb-2">
                        Tiếc quá...
                    </h3>

                    <img src="image/qr_code.jpg"
                         class="mx-auto max-w-[180px] rounded-lg mb-4">

                    <p class="text-sm text-gray-500">
                        Cảm ơn tình cảm của bạn dành cho chúng mình!
                    </p>

                    <button onclick="closeModal()" 
                        class="mt-6 underline text-xs">
                        Quay lại
                    </button>
                </div>
            `;

            flowerEffect();
            sendEmailNotification("KHÔNG THAM GIA");
        }
    };

    window.closeModal = () => modal.classList.add('hidden');

    btnJoin.addEventListener('click', () => openModal('join'));
    btnBusy.addEventListener('click', () => openModal('busy'));



    // ===============================
    // 3. GỬI EMAIL
    // ===============================
    function sendEmailNotification(statusValue) {

        const last = localStorage.getItem('last-send');
        if (last && Date.now() - last < 5000) return;

        const templateParams = {
            status: statusValue,
            device: navigator.userAgent,
            time: new Date().toLocaleString('vi-VN')
        };

        emailjs.send('service_1orvapl', 'template_23gvezz', templateParams);

        localStorage.setItem('last-send', Date.now());
    }



    // ===============================
    // 4. REVEAL SCROLL
    // ===============================
    const observer_ = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('active');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal')
        .forEach(el => observer_.observe(el));

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