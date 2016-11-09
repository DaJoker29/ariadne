#!/bin/sh
#
# Checks the repository for upgrades and restarts the server if tests are passed.
#

git fetch origin
if [ `git rev-list HEAD...origin/master --count` != 0 ] ; then
  echo "Up to date"
else
  echo "Fetching"
  git pull
  npm test
  pm2 reload ariadne
fi