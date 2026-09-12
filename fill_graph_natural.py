import os
import subprocess
import random
from datetime import datetime, timedelta

def fill_graph_natural():
    # Dates from the user's graph timeline
    start_date_str = "2026-03-23"
    end_date_str = "2026-09-08"

    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

    # Get the existing commits from the user's actual history
    result = subprocess.run(["git", "log", "--format=%ad", "--date=short"], capture_output=True, text=True)
    existing_dates = set(result.stdout.strip().split('\n'))

    current_date = start_date
    total_commits = 0
    
    messages = [
        "Update styles", "Refactor components", "Fix typo", 
        "Update dependencies", "Minor bug fix", "Clean up code",
        "Add missing comments", "Update documentation", "Tweak layout",
        "Improve performance", "Refactor server routing", "Update visualizer"
    ]
    
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        
        # Determine if this day should have commits based on a highly uneven distribution
        # We want maximum unevenness: mostly empty, some light, a few heavy
        chance = random.random()
        
        if date_str in existing_dates:
            # If the user actually made real commits this day, maybe add 0-2 extra to blend in
            num_commits = random.randint(0, 2)
        else:
            if chance < 0.60:
                # 60% chance of NO commits (empty square)
                num_commits = 0
            elif chance < 0.80:
                # 20% chance of 1-2 commits (light green)
                num_commits = random.randint(1, 2)
            elif chance < 0.90:
                # 10% chance of 3-5 commits (medium green)
                num_commits = random.randint(3, 5)
            elif chance < 0.97:
                # 7% chance of 6-9 commits (dark green)
                num_commits = random.randint(6, 9)
            else:
                # 3% chance of 10-15 commits (darkest green)
                num_commits = random.randint(10, 15)
        
        for _ in range(num_commits):
            hour = random.randint(9, 23)
            minute = random.randint(0, 59)
            second = random.randint(0, 59)
            
            iso_date = current_date.strftime(f"%Y-%m-%dT{hour:02d}:{minute:02d}:{second:02d}")
            
            env = os.environ.copy()
            env["GIT_AUTHOR_DATE"] = iso_date
            env["GIT_COMMITTER_DATE"] = iso_date
            
            msg = random.choice(messages)
            subprocess.run(["git", "commit", "--allow-empty", "-m", f"{msg} on {date_str}"], env=env, check=True)
            total_commits += 1
            
        if num_commits > 0:
            print(f"Created {num_commits} extra commits for {date_str}")
            
        current_date += timedelta(days=1)
    
    print(f"Total new natural commits made: {total_commits}")

if __name__ == "__main__":
    fill_graph_natural()
