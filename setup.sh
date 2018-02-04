#!/usr/bin/env bash

mkdir -p "dist"
cd "dist"
ln -s "../src/app.js" "app.js"
ln -s "../src/lib/shaders" "shaders"
ln -s "../static/favicons" "favicons"
ln -s "../static/fonts" "fonts"
ln -s "../static/icons" "icons"
