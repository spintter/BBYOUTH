const fs = require('fs');
const path = '/Users/nodeusr/Bbyouths/public/models';

const assets = [
  'african-girl-optimized.glb',
  'african-girl.glb',
  'african-queen-optimized.glb',
  'african-queen.glb',
  'stars.glb',
  'chessboard.glb',
  'queen.glb'
];

const consolidated = { assets: {} };

assets.forEach(asset => {
  const filePath = `${path}/${asset}_metadata.json`;
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      consolidated.assets[asset] = data;
    } else {
      consolidated.assets[asset] = { error: `Metadata file not found for ${asset}` };
    }
  } catch (err) {
    consolidated.assets[asset] = { error: `Failed to process metadata for ${asset}: ${err.message}` };
  }
});

try {
  fs.writeFileSync(`${path}/all_assets_metadata.json`, JSON.stringify(consolidated, null, 2));
  console.log('Consolidated metadata saved to all_assets_metadata.json');
} catch (err) {
  console.error(`Error writing all_assets_metadata.json: ${err.message}`);
  process.exit(1);
}
