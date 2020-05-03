#!/bin/sh

set -xeuv

node src/i18n/utils/export-reference-language.js
node src/i18n/utils/import-and-chunk-languages.js
