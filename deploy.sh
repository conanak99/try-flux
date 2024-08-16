#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

git reset --hard origin/master
git pull origin master

rm -rf node_modules
npm ci

rm -rf .next
npm run build

pm2 startOrRestart pm2.json