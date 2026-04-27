// js/utils.js

document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');

    if (menuBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            // sidebar에 active 클래스가 있으면 제거, 없으면 추가
            sidebar.classList.toggle('active');
        });
    }
});