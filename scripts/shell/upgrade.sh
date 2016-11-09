#!/bin/sh
#
# Checks the repository for upgrades and restarts the server if tests are passed.
#
git fetch origin
if [ "$(git rev-parse HEAD)" -ne "$(git rev-parse @{u})" ] ; then
  echo "Fetching"
  git pull
  npm test
  pm2 restart ariadne
else
  echo "Up to date"
fi