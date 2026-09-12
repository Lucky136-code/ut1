import os
import subprocess
import random
from datetime import datetime, timedelta

def fill_graph_uneven():
    start_date_str = "2026-03-23"
    end_date_str = "2026-09-08"

    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

    current_date = start_date
    total_commits = 0
    
    # Commit messages to make it look a bit more realistic in the log
    messages = [
        "Update styles", "Refactor components", "Fix typo", 
        "Update dependencies", "Minor bug fix", "Clean up code",
        "Add missing comments", "Update documentation", "Tweak layout",
        "Improve performance"
    ]
    
    while current_date <= end_date:
        # Determine how many commits to make today for uneven distribution
        chance = random.random()
        
        if chance < 0.30:
            num_commits = 0  # 30% chance for a low activity day (leaves the 1 commit we already made)
        elif chance < 0.70:
            num_commits = random.randint(1, 4)  # 40% chance for medium-low activity
        elif chance < 0.90:
            num_commits = random.randint(5, 10) # 20% chance for medium-high activity
        else:
            num_commits = random.randint(11, 17) # 10% chance for very high activity
        
        for _ in range(num_commits):
            date_str = current_date.strftime("%Y-%m-%d")
            
            # Spread commits throughout the day for realism
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
            print(f"Created {num_commits} extra commits for {current_date.strftime('%Y-%m-%d')}")
            
        current_date += timedelta(days=1)
    
    print(f"Total new uneven commits made: {total_commits}")

if __name__ == "__main__":
    fill_graph_uneven()
