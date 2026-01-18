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

    // Hàm mở Modal dựa trên lựa chọn của khách
    window.openModal = function (type) {
        if (!modal || !modalContent) return;
        modal.classList.remove('hidden');

        // Tạo phần chọn nhà chung
        const sideSelector = `
    <div class="mb-4">
        <p class="text-[11px] text-gray-500 uppercase tracking-widest mb-3">Bạn là khách của:</p>
        <div class="flex gap-2 justify-center">
            <input type="radio" id="side-trai" name="guest-side" value="NHÀ TRAI" class="hidden peer/trai" checked>
            <label for="side-trai" class="px-5 py-2 border rounded-full text-sm cursor-pointer peer-checked/trai:bg-primary peer-checked/trai:text-white transition-all">Nhà Trai</label>
            
            <input type="radio" id="side-gai" name="guest-side" value="NHÀ GÁI" class="hidden peer/gai">
            <label for="side-gai" class="px-5 py-2 border rounded-full text-sm cursor-pointer peer-checked/gai:bg-primary peer-checked/gai:text-white transition-all">Nhà Gái</label>
        </div>
    </div>`;

        if (type === 'join') {
            modalContent.innerHTML = `
        <div class="py-6 px-4 animate-in fade-in zoom-in duration-300">
            <h3 class="text-2xl font-serif font-bold text-primary mb-4">Xác nhận tham dự</h3>
            ${sideSelector}
            <input type="text" id="guest-name" placeholder="Tên của bạn..." class="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-1 focus:ring-primary">
            <button onclick="submitGuestData('join')" class="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase w-full hover:shadow-lg transition-all">Gửi xác nhận</button>
        </div>`;
        } else {
            modalContent.innerHTML = `
        <div class="py-6 px-4 animate-in fade-in zoom-in duration-300">
            <h3 class="text-2xl font-serif font-bold text-primary mb-4">Gửi lời chúc</h3>
            ${sideSelector}
            <input type="text" id="guest-name" placeholder="Tên của bạn..." class="w-full p-3 border border-gray-300 rounded-lg mb-3 outline-none focus:ring-1 focus:ring-primary">
            <textarea id="guest-message" placeholder="Lời chúc của bạn..." class="w-full p-3 border border-gray-300 rounded-lg mb-4 outline-none focus:ring-1 focus:ring-primary" rows="3"></textarea>
            <button onclick="submitGuestData('busy')" class="bg-primary text-white px-8 py-3 rounded-full font-bold uppercase w-full hover:shadow-lg transition-all">Gửi lời chúc & Xem QR</button>
        </div>`;
        }
    };

    // Hàm xử lý dữ liệu khi khách nhấn nút Gửi
    window.submitGuestData = function (type) {
        const nameEl = document.getElementById('guest-name');
        const sideEl = document.querySelector('input[name="guest-side"]:checked');
        const messageInput = document.getElementById('guest-message');

        const name = nameEl ? nameEl.value.trim() : "";
        const side = sideEl ? sideEl.value : "CHƯA CHỌN";
        const message = (type === 'busy' && messageInput) ? messageInput.value.trim() : "Sẽ tham dự trực tiếp";
        const status = (type === 'join') ? "ĐI ĐƯỢC" : "KHÔNG ĐI ĐƯỢC";

        if (!name) {
            alert("Vui lòng nhập tên của bạn!");
            return;
        }

        // Gửi email và sheet kèm theo các biến cần thiết
        sendEmailNotification(status, name, message, side);
        saveToGoogleSheet(status, name, message, side);
        showFinalStep(type, side);
    };

    // Hàm hiển thị kết quả và QR tương ứng
    function showFinalStep(type, side) {
        if (type === 'join') {
            modalContent.innerHTML = `
        <div class="py-6 px-4 animate-in fade-in zoom-in duration-300 text-center">
            <div class="text-6xl mb-4 animate-bounce">❤️</div>
            <h3 class="text-3xl font-serif font-bold text-primary mb-4">Cảm ơn bạn!</h3>
            <p class="text-gray-600 dark:text-gray-300">Sự hiện diện của bạn là niềm vinh hạnh cho gia đình ${side.toLowerCase()}.</p>
            <button onclick="closeModal()" class="mt-8 text-sm underline text-gray-400 uppercase tracking-widest">Đóng</button>
        </div>`;
        } else {
            // Chọn đúng ảnh QR theo nhà
            const qrImage = (side === 'NHÀ TRAI') ? 'image/qr_nhatrai.jpg' : 'image/qr_nhagai.jpg';

            modalContent.innerHTML = `
        <div class="py-6 px-4 animate-in fade-in zoom-in duration-300 text-center">
            <div class="text-5xl mb-4 grayscale opacity-70">😌</div>
            <h3 class="text-2xl font-serif font-bold text-primary mb-2">Tiếc quá đi thôi...</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6 text-sm">Cảm ơn bạn vì lời chúc tốt đẹp gửi tới gia đình ${side.toLowerCase()}!</p>
            
            <div class="relative p-2 border-2 border-[#D4AF37]/20 rounded-2xl bg-white inline-block shadow-xl mb-6">
                <img src="${qrImage}" alt="QR Code" class="mx-auto max-w-[180px] rounded-lg">
                <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-white text-[10px] px-4 py-1 rounded-full whitespace-nowrap font-bold shadow-md uppercase">
                    MỪNG CƯỚI ${side}
                </div>
            </div>
            <button onclick="closeModal()" class="mt-4 text-gray-400 text-xs underline uppercase tracking-widest block w-full">Đóng</button>
        </div>`;
        }
    }

    // Hàm lưu vào Google Sheet
    function saveToGoogleSheet(status, name, message, side) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbw2DpFQDm-e6Omwo0dCPQi7NZMFVrnvxy_oBSI1KCRYzq2O_fHLVpxq5At_o5yUVrx24Q/exec'
        const data = {
            time: new Date().toLocaleString('vi-VN'),
            status: status,
            name: name,
            message: message,
            side: side
        };

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.error("Lỗi khi lưu Sheet:", err));
    }

    // Hàm gửi Email qua EmailJS
    function sendEmailNotification(statusValue, name, message, side) {
        const templateParams = {
            status: statusValue,
            guest_name: name,
            guest_message: message,
            guest_side: side,
            time: new Date().toLocaleString('vi-VN')
        };

        emailjs.send('service_1orvapl', 'template_23gvezz', templateParams)
            .then(() => console.log('EMAIL GỬI THÀNH CÔNG!'))
            .catch(err => console.error('LỖI GỬI EMAIL:', err));
    }

    window.closeModal = function () {
        if (modal) modal.classList.add('hidden');
    };

    // --- KÍCH HOẠT SỰ KIỆN CHO NÚT BẤM ---

    const btnJoin = document.getElementById('btn-join');
    const btnBusy = document.getElementById('btn-busy');

    if (btnJoin) btnJoin.onclick = function () { openModal('join'); };
    if (btnBusy) btnBusy.onclick = function () { openModal('busy'); };

    window.addEventListener('click', (e) => {
        if (e.target == modal) closeModal();
    });


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
        startAutoScroll(191000);
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

    // --- LIGHTBOX CHỨC NĂNG ---
    // --- LIGHTBOX CHỨC NĂNG ---
    const lightbox = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');

    // 1. Gán hàm vào window để HTML gọi được (SỬA LỖI TẠI ĐÂY)
    window.openLightbox = function (imageSrc) {
        if (!lightbox || !lightboxImg) return;

        // Gán đường dẫn ảnh
        lightboxImg.src = imageSrc;

        // Hiển thị modal
        lightbox.classList.remove('hidden');

        // Animation
        setTimeout(() => {
            lightbox.classList.remove('opacity-0');
            lightboxImg.classList.remove('scale-95');
            lightboxImg.classList.add('scale-100');
        }, 10);

        // Khóa cuộn trang
        document.body.style.overflow = 'hidden';
    };

    // 2. Gán hàm đóng vào window luôn
    window.closeLightbox = function () {
        if (!lightbox) return;

        // Animation ẩn
        lightbox.classList.add('opacity-0');
        lightboxImg.classList.add('scale-95');
        lightboxImg.classList.remove('scale-100');

        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightboxImg.src = '';
            document.body.style.overflow = '';
        }, 300);
    };

    // Các sự kiện lắng nghe (giữ nguyên, nhưng đảm bảo có kiểm tra tồn tại)
    if (lightbox) {
        // Đóng khi click ra ngoài
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                window.closeLightbox();
            }
        });

        // Đóng khi nhấn ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
                window.closeLightbox();
            }
        });
    }

});