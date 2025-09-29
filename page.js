// Initialize performance chart
const ctx = document.getElementById('performanceChart').getContext('2d');
let performanceChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [{
            label: 'CH₄ Production Rate',
            data: [0.78, 0.82, 0.85, 0.79, 0.65, 0.58, 0.83],
            borderColor: '#ff6b35',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            fill: true,
            tension: 0.4
        }, {
            label: 'System Efficiency',
            data: [80, 83, 85, 81, 68, 62, 82],
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            fill: true,
            tension: 0.4
        }, {
            label: 'Power Consumption',
            data: [3.2, 3.1, 3.0, 3.3, 4.2, 4.8, 3.2],
            borderColor: '#ffaa00',
            backgroundColor: 'rgba(255, 170, 0, 0.1)',
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#ffffff' }
            }
        },
        scales: {
            x: {
                ticks: { color: '#ffffff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            },
            y: {
                ticks: { color: '#ffffff' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' }
            }
        }
    }
});

// Slider event handlers
document.getElementById('pressure-slider').oninput = function() {
    document.getElementById('pressure-val').textContent = this.value;
}

document.getElementById('temp-slider').oninput = function() {
    document.getElementById('temp-val').textContent = this.value;
}

document.getElementById('solar-slider').oninput = function() {
    document.getElementById('solar-val').textContent = this.value;
}

document.getElementById('dust-slider').oninput = function() {
    document.getElementById('dust-val').textContent = this.value;
}

function runSimulation() {
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '⏳ Running Simulation...';
    button.disabled = true;

    // Get parameter values
    const pressure = parseFloat(document.getElementById('pressure-slider').value);
    const temp = parseFloat(document.getElementById('temp-slider').value);
    const solar = parseFloat(document.getElementById('solar-slider').value);
    const dust = parseFloat(document.getElementById('dust-slider').value);

    setTimeout(() => {
        // Calculate production based on parameters
        let ch4Rate = 0.83 * (pressure / 0.6) * Math.min(1.3, temp / 233) * (solar / 590) * Math.exp(-dust);
        ch4Rate = Math.max(0.1, Math.min(1.5, ch4Rate));
        
        let o2Rate = ch4Rate * 2;
        let powerConsumption = 3.2 * (ch4Rate / 0.83);
        let efficiency = 82 * (ch4Rate / 0.83) * Math.exp(-dust * 0.3);
        efficiency = Math.max(35, Math.min(95, efficiency));

        // Update display
        document.getElementById('ch4-production').textContent = ch4Rate.toFixed(2);
        document.getElementById('o2-production').textContent = o2Rate.toFixed(2);
        document.getElementById('power-consumption').textContent = powerConsumption.toFixed(1);
        document.getElementById('efficiency').textContent = efficiency.toFixed(0);

        // Update chart with new simulated data
        const newData = Array.from({length: 7}, () => ch4Rate + (Math.random() - 0.5) * 0.3);
        const newEfficiency = Array.from({length: 7}, () => efficiency + (Math.random() - 0.5) * 10);
        const newPower = Array.from({length: 7}, () => powerConsumption + (Math.random() - 0.5) * 0.8);
        
        performanceChart.data.datasets[0].data = newData;
        performanceChart.data.datasets[1].data = newEfficiency;
        performanceChart.data.datasets[2].data = newPower;
        performanceChart.update();

        button.textContent = originalText;
        button.disabled = false;
        
        // Show success feedback
        button.style.background = 'linear-gradient(45deg, #00ff88, #00cc66)';
        setTimeout(() => {
            button.style.background = 'linear-gradient(45deg, #ff6b35, #f7931e)';
        }, 1500);

    }, 2500);
}

// Add some dynamic visual effects
document.addEventListener('DOMContentLoaded', function() {
    // Animate sections on scroll
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });

    // Update real-time data simulation
    setInterval(() => {
        const elements = ['ch4-production', 'o2-production', 'power-consumption', 'efficiency'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            const current = parseFloat(element.textContent);
            const variation = (Math.random() - 0.5) * 0.1;
            const newValue = current + variation;
            element.textContent = id === 'efficiency' ? Math.round(newValue) : newValue.toFixed(2);
        });
    }, 5000);
});