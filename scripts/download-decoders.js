const fs = require('fs');
const path = require('path');
const https = require('https');

// Create directories if they don't exist
const directories = ['public/draco', 'public/basis'];
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Files to download
const files = [
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/draco_decoder.js',
    dest: 'public/draco/draco_decoder.js'
  },
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/draco_decoder.wasm',
    dest: 'public/draco/draco_decoder.wasm'
  },
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/draco_encoder.js',
    dest: 'public/draco/draco_encoder.js'
  },
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/draco/draco_encoder.wasm',
    dest: 'public/draco/draco_encoder.wasm'
  },
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/basis/basis_transcoder.js',
    dest: 'public/basis/basis_transcoder.js'
  },
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/jsm/libs/basis/basis_transcoder.wasm',
    dest: 'public/basis/basis_transcoder.wasm'
  }
];

// Download function
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${dest}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(dest, () => {}); // Delete the file if there's an error
      console.error(`Error downloading ${url}: ${err.message}`);
      reject(err);
    });
  });
}

// Download all files
async function downloadAll() {
  for (const file of files) {
    try {
      await downloadFile(file.url, file.dest);
    } catch (error) {
      console.error(`Failed to download ${file.url}`);
    }
  }
  console.log('All downloads completed!');
}

downloadAll(); 