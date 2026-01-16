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

    window.openModal = function(type) {
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

    window.closeModal = function() {
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
            .then(function(response) {
            console.log('EMAIL GỬI THÀNH CÔNG!', response.status, response.text);
            }, function(error) {
            console.error('LỖI GỬI EMAIL:', error);
            });
    }
});