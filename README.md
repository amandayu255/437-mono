# 437-mono

Run Local:
cd packages/proto
npm run dev 

Run Server:
npm -w proto run build
npm -w proto start

Kill Process:
lsof -i :3000
kill -9 <pid>

rm -rf dist/

  // "scripts": {
  //   "dev": "nodemon",
  //   "build": "npx etsc",
  //   "start": "npm run build && npm run start:node",
  //   "start:node": "node dist/index.js",
  //   "start:proto": "cross-env STATIC=../proto/public npm run start",
  //   "check": "tsc --noEmit"
  // },