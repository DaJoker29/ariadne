[![GitHub issues](https://img.shields.io/github/issues/dajoker29/ariadne.svg)](https://github.com/dajoker29/ariadne/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/dajoker29/ariadne/develop/LICENSE)
[![GitHub forks](https://img.shields.io/github/forks/dajoker29/ariadne.svg)](https://github.com/dajoker29/ariadne/network)
[![GitHub stars](https://img.shields.io/github/stars/dajoker29/ariadne.svg)](https://github.com/dajoker29/ariadne/stargazers)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/dajoker29/ariadne.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=%5Bobject%20Object%5D)

# Ariadne 2.0 - Superior Productivity
Automated Productivity Helper

Build Instructions
===================
1. Ensure that proper config files exist in the `config` directory. Copy all `-sample.js` files removing `-sample` from the name and fill in the missing information within the code (typically API keys and sensitive information).
2. `npm start` to launch the production server. This will launch a PM2 process which keeps the server running continuously. Make sure that PM2 is installed globally with `npm install -g pm2`.
