#!/bin/sh
#
# Still under development

NODE_ENV=production SESSION_SECRET=secret node --prof ./bin/server.js &&
ab -k -c 20 -n 250 http://localhost:3000/ &&
node --prof-process isolate-* > profile.log