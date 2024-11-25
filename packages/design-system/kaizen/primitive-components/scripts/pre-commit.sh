#!/bin/sh
echo "---------- Icon Generation ----------" &&
pnpm run icon:generate
echo "---------- add Icon to Git ----------" &&
git add ./src/components/Icon/assets ./src/components/Icon/icons.ts
echo "---------- TSC Check ----------" &&
npx tsc -p .