### Reference sheet for Git 

Pull main 
- git checkout main
- git pull origin main

Merge develop into main
- ^^
- git merge develop
- git push origin main


Rename current branch 
- git branch -m new-name


Push changes
Current branch
- git push origin current-branch-name
New branch
- git push origin your-branch-name:new-remote-name


Replace current branch with remote main
- git fetch origin
- git reset --hard origin/main
- git push --force

New branch with main content 
- git checkout main
- git pull origin main
- git branch branch_name

Track branch 
- git push -u origin branch_name


Delete local branch 
- git branch -d branch_name