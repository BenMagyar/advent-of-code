const { spawn, execSync } = require('child_process');

const day = process.argv[2];

spawn('nodemon', ['-x', 'ts-node', `src/${day}/index.ts`], {
  stdio: 'inherit'
});
