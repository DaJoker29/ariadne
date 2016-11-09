#!/bin/sh
#
# Checks the repository for upgrades and restarts the server if tests are passed.
#

# git fetch origin
# if [ `git rev-list HEAD...origin/master --count` != 0 ] ; then
#   echo "Up to date"
# else
#   echo "Fetching"
#   git pull
#   npm test
#   pm2 reload ariadne
# fi


UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Need to pull"
    git pull
    npm test
    pm2 reload ariadne
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
else
    echo "Diverged"
fi