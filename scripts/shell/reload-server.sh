#!/bin/sh
#
# Reload server with new configuration settings.
# 
pm2 delete ariadne
npm run start