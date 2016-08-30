#!/bin/bash -e

git checkout gh-pages
git reset --hard master
npm run build
git add -f bundle.js
git commit -m "Update gh-pages"
git push -f origin gh-pages
git checkout master
