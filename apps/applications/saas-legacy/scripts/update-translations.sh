# !/bin/sh

echo "*"
echo "⏳ Start building the source translation file for Weblate in 'src/i18n/source/translations.json'"
pnpm exec ts-node ./src/i18n/utils/build-source-translations-json.ts
echo "*"
echo "✅ Successfully built source/translations.json file"

echo "*"
echo "⏳ Start building namespaces translations files in public/locales"
pnpm exec ts-node ./src/i18n/utils/build-static-chunks.ts
echo "*"
echo "✅ Successfully generated public/locales/[locale]/[namespace].translations.json files"