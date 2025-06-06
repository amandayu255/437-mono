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

nohup npm -w app start &