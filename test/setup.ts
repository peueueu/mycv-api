// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
import { join } from 'path';

global.beforeEach(async () => {
  await fs.rm(join(__dirname, '..', 'test.sqlite'), (err) => {
    if (err) {
      console.log(err.message);
    }

    console.log('Test db deleted successfully');
  });
});

// function getCurrentFilenames() {
//   console.log('\nCurrent filenames:');
//   fs.readdirSync(__dirname).forEach((file) => {
//     console.log(file);
//   });
//   console.log('');
// }
