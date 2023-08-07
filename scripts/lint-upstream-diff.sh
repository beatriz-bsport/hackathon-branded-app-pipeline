if [ -z "$(git rev-parse --abbrev-ref @{upstream} 2>/dev/null)" ];then
        echo "No remote found"
        yarn lint-cache
else
        # We only lint files included in the diff between local and remote branch (and we use eslint cache)
        yarn eslint $(git diff --name-only --diff-filter=d @{upstream} -- src/) --cache --ext .js,.jsx,.ts,.tsx
fi