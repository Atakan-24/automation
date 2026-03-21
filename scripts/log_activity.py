import sys
from datetime import datetime
from pathlib import Path

def log(message):
    path = Path('data/activity_log.txt')
    path.parent.mkdir(exist_ok=True)
    timestamp = datetime.utcnow().isoformat()
    with path.open('a', newline='') as f:
        f.write(f"{timestamp} – {message}\n")
    print(f"Logged: {message}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print('Usage: python scripts/log_activity.py "message"')
        sys.exit(1)
    log(' '.join(sys.argv[1:]))
