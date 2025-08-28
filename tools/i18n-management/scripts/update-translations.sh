# !/bin/sh

echo "*"
echo "⏳ Start building source/translations.json file"
pnpm exec tsx ./scripts/build-source-translations-json.ts
echo "✅ Successfully built source/translations.json file"

echo "*"
echo "⏳ Start splitting build/[locale].translations.json files across projects"
pnpm exec tsx ./scripts/split-in-projects-build-translations-json.ts
echo "✅ Successfully generated @project/public/locales/[locale]/[namespace].translations.json files in projects"

echo "*"
echo "⏳ Start copying translations files to public locales of Transifexed projects"
pnpm exec tsx ./scripts/build-public-locales-files.ts
echo "✅ Successfully loaded @project/public/locales/[locale]/[namespace].translations.json files in projects"
