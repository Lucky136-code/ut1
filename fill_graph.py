import os
import subprocess
from datetime import datetime, timedelta

def fill_graph():
    start_date_str = "2026-03-23"
    end_date_str = "2026-09-08"

    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

    # Get existing commit dates
    result = subprocess.run(["git", "log", "--format=%ad", "--date=short"], capture_output=True, text=True)
    existing_dates = set(result.stdout.strip().split('\n'))

    current_date = start_date
    commits_made = 0
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        if date_str not in existing_dates:
            # Create a commit
            env = os.environ.copy()
            iso_date = current_date.strftime("%Y-%m-%dT12:00:00")
            env["GIT_AUTHOR_DATE"] = iso_date
            env["GIT_COMMITTER_DATE"] = iso_date
            subprocess.run(["git", "commit", "--allow-empty", "-m", f"Work on project: {date_str}"], env=env, check=True)
            print(f"Created commit for {date_str}")
            commits_made += 1
        current_date += timedelta(days=1)
    
    print(f"Total new commits made: {commits_made}")

if __name__ == "__main__":
    fill_graph()
