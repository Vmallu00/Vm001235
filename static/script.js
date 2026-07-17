function formatBytes(bytes) {
    return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB';
}

function formatUptime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
}

async function fetchStats() {
    try {
        const res = await fetch('/api/stats');
        const data = await res.json();

        // CPU
        document.getElementById('cpuValue').textContent = data.cpu.percent + '%';
        document.getElementById('cpuBar').style.width = data.cpu.percent + '%';
        document.getElementById('loadAvg').textContent = data.cpu.load_avg.map(v => v.toFixed(2)).join(' ');

        // RAM
        document.getElementById('ramValue').textContent = data.ram.percent + '%';
        document.getElementById('ramBar').style.width = data.ram.percent + '%';
        document.getElementById('ramUsed').textContent = formatBytes(data.ram.used);
        document.getElementById('ramTotal').textContent = formatBytes(data.ram.total);

        // DISK
        document.getElementById('diskValue').textContent = data.disk.percent + '%';
        document.getElementById('diskBar').style.width = data.disk.percent + '%';
        document.getElementById('diskUsed').textContent = formatBytes(data.disk.used);
        document.getElementById('diskTotal').textContent = formatBytes(data.disk.total);

        // Uptime
        document.getElementById('uptimeValue').textContent = formatUptime(data.uptime);

        // Status (always online)
        const badge = document.getElementById('statusBadge');
        badge.textContent = '🟢 ONLINE';
        badge.style.color = '#00ff88';
        badge.style.borderColor = '#00ff88';
        badge.style.textShadow = '0 0 10px #00ff88';
    } catch (e) {
        console.error('Failed to fetch stats', e);
    }
}

fetchStats();
setInterval(fetchStats, 2000);
