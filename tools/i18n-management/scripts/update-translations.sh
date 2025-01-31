# !/bin/sh

echo "*"
echo "Make sur monorepo utils constants are built"
pnpm exec nx build @bsport/typescript-monorepo-utils

echo "*"
echo "⏳ Start building source/translations.json file"
pnpm exec tsx ./scripts/build-source-translations-json.ts
echo "*"
echo "✅ Successfully built source/translations.json file"

echo "*"
echo "⏳ Start splitting build/[locale].translations.json files across projects"
pnpm exec tsx ./scripts/split-in-projects-build-translations-json.ts
echo "*"
echo "✅ Successfully generate @project/public/locales/[locale]/[namespace].translations.json files in projects"
