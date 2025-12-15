/* main.js - Core Logic & Analytics */

// --- UTILITIES ---
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(value);
};

// --- ANIMATION OBSERVER ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
            
            // Trigger Counters if exist
            if(entry.target.hasAttribute('data-count')) {
                animateValue(entry.target, 0, parseInt(entry.target.getAttribute('data-count')), 2000);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700', 'ease-out');
    observer.observe(el);
});

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// --- CHART.JS CONFIGURATION (Used in Dashboard) ---
function initDashboardCharts() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    // Create Gradient
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(42, 123, 136, 0.5)'); // Brand Teal
    gradient.addColorStop(1, 'rgba(136, 196, 108, 0.05)'); // Brand Green

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Packaging Returned (Units)',
                data: [1200, 1900, 3000, 5000, 4800, 6000, 7500, 8200, 9000, 11000, 13500, 15000],
                borderColor: '#2A7B88',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#88C46C',
                pointBorderColor: '#ffffff',
                pointHoverRadius: 8,
                fill: true,
                tension: 0.4 // Smooth curves
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#88C46C',
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    grid: { color: 'rgba(0,0,0,0.05)' },
                    ticks: { callback: function(value) { return value / 1000 + 'k'; } }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });

    // Donut Chart
    const ctx2 = document.getElementById('compositionChart');
    if(ctx2) {
        new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Compostable', 'Reusable Rigid', 'Recycled Paper'],
                datasets: [{
                    data: [55, 30, 15],
                    backgroundColor: ['#88C46C', '#2A7B88', '#cbd5e1'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '75%',
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initDashboardCharts();
});