from flask import Flask, render_template, jsonify
import psutil
import time
from datetime import datetime

app = Flask(__name__)

def get_system_stats():
    # CPU
    cpu_percent = psutil.cpu_percent(interval=1)
    cpu_count = psutil.cpu_count()
    load_avg = psutil.getloadavg() if hasattr(psutil, 'getloadavg') else [0,0,0]

    # Memory
    mem = psutil.virtual_memory()
    ram_total = mem.total
    ram_used = mem.used
    ram_percent = mem.percent

    # Disk (root partition)
    disk = psutil.disk_usage('/')
    disk_total = disk.total
    disk_used = disk.used
    disk_percent = disk.percent

    # Uptime
    boot_time = psutil.boot_time()
    uptime_seconds = int(time.time() - boot_time)

    return {
        'timestamp': datetime.utcnow().isoformat(),
        'status': 'online',   # container is always running
        'cpu': {
            'percent': cpu_percent,
            'cores': cpu_count,
            'load_avg': load_avg
        },
        'ram': {
            'total': ram_total,
            'used': ram_used,
            'percent': ram_percent
        },
        'disk': {
            'total': disk_total,
            'used': disk_used,
            'percent': disk_percent
        },
        'uptime': uptime_seconds
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/stats')
def stats():
    return jsonify(get_system_stats())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
