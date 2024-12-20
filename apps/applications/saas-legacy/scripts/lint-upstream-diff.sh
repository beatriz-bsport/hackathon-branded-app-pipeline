if [ -z "$(git rev-parse --abbrev-ref @{upstream} 2>/dev/null)" ];then
        echo "No remote found"
        pnpm run lint-old:cache
else
        # We only lint files included in the diff between local and remote branch (and we use eslint cache)
        pnpm run eslint $(git diff --name-only --diff-filter=d @{upstream} -- 'src/**/*.js' 'src/**/*.ts' 'src/**/*.jsx' 'src/**/*.tsx') --cache
fi