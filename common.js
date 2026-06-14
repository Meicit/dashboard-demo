// Cấu trúc HTML của Header
const headerHTML = `
<header class="main-header w-full py-6 px-6 md:px-12 select-none relative transition-all duration-300">
    <div class="max-w-[1550px] mx-auto flex flex-col items-center justify-center relative header-layout">
        <div class="flex flex-row items-center space-x-6 w-auto">
            <div class="flex-shrink-0"><img src="logo.png" alt="Logo" class="logo-main w-20 h-auto"></div>
            <div class="flex flex-col items-start justify-center space-y-2 text-left">
                <p class="text-white font-black tracking-[0.12em] text-xl md:text-2xl uppercase font-['Montserrat']">IOC BINH HUNG</p>
                <h1 class="text-sm font-bold uppercase text-white/90">Cổng thông tin và điều hành xã Bình Hưng</h1>
            </div>
        </div>
        <div class="theme-selector-vertical lg:absolute lg:top-0 lg:right-0 bg-white/10 backdrop-blur-md border border-white/20 p-1.5 rounded-xl flex flex-col space-y-1.5 w-[75px] z-20 shadow-inner">
            <button onclick="switchSystemTheme('xanh')" id="btn-theme-xanh" class="w-full text-center text-[10px] font-extrabold uppercase py-1.5 rounded-lg transition-all duration-300 bg-blue-600 text-white shadow-md">🔵 Xanh</button>
            <button onclick="switchSystemTheme('do')" id="btn-theme-do" class="w-full text-center text-[10px] font-extrabold uppercase py-1.5 rounded-lg transition-all duration-300 text-white/80 hover:text-white">🔴 Đỏ</button>
        </div>
    </div>
</header>
`;

// Logic đổi Theme
window.switchSystemTheme = function(modeName) {
    const body = document.getElementById('dynamic-body');
    const btnXanh = document.getElementById('btn-theme-xanh');
    const btnDo = document.getElementById('btn-theme-do');
    if (modeName === 'do') {
        body.classList.remove('theme-xanh-ios'); body.classList.add('theme-do-hanhchinh');
        btnDo.className = "w-full text-center text-[10px] font-extrabold uppercase py-1.5 rounded-lg transition-all duration-300 bg-red-600 text-white shadow-md";
        btnXanh.className = "w-full text-center text-[10px] font-extrabold uppercase py-1.5 rounded-lg transition-all duration-300 text-white/80 hover:text-white";
    } else {
        body.classList.remove('theme-do-hanhchinh'); body.classList.add('theme-xanh-ios');
        btnXanh.className = "w-full text-center text-[10px] font-extrabold uppercase py-1.5 rounded-lg transition-all duration-300 bg-blue-600 text-white shadow-md";
        btnDo.className = "w-full text-center text-[10px] font-extrabold uppercase py-1.5 rounded-lg transition-all duration-300 text-white/80 hover:text-white";
    }
};

// Tự động chèn Header vào trang khi tải xong
document.addEventListener('DOMContentLoaded', () => {
    const headerContainer = document.createElement('div');
    headerContainer.innerHTML = headerHTML;
    document.body.prepend(headerContainer);
});