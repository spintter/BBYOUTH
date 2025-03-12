const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

// Configuration
const desktopPath = os.homedir() + '/Desktop';
const outputLogFile = path.join(desktopPath, 'glb-processing-log.txt');
const inputFiles = [
  '/Users/nodeusr/Projects/Bbyouths/public/models/african-girl.glb',
  '/Users/nodeusr/Projects/Bbyouths/public/models/african-queen.glb'
];
const backupDir = path.join(desktopPath, 'glb-backups');

// Verify gltf-transform installation
try {
  const version = execSync('gltf-transform --version', { encoding: 'utf8' }).trim();
  console.log(`Using gltf-transform version: ${version}`);
} catch (error) {
  throw new Error('gltf-transform not found. Install it with: npm install -g @gltf-transform/cli');
}

// Utility to log results
const log = (message) => {
  fs.appendFileSync(outputLogFile, `${new Date().toISOString()} - ${message}\n`);
};

// Ensure backup directory exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// Process each file
async function processFile(inputFile) {
  const fileName = path.basename(inputFile, '.glb');
  const tempFile1 = path.join(desktopPath, `${fileName}-temp1.glb`);
  const tempFile2 = path.join(desktopPath, `${fileName}-temp2.glb`);
  const outputFile = path.join(desktopPath, `${fileName}-processed.glb`);
  const backupFile = path.join(backupDir, `${fileName}-original.glb`);

  try {
    // Backup original file
    fs.copyFileSync(inputFile, backupFile);
    log(`Backed up ${inputFile} to ${backupFile}`);

    // Step 1: Decompress Draco
    log(`Decompressing Draco for ${inputFile}...`);
    execSync(`gltf-transform copy "${inputFile}" "${tempFile1}" --verbose`, {
      stdio: 'inherit'
    });
    log(`Draco decompression complete: ${tempFile1}`);

    // Step 2: Simplify meshes with adaptive ratio
    const originalSize = fs.statSync(inputFile).size;
    const simplifyRatio = originalSize < 20000 ? 0.2 : 0.5; // More aggressive for small files
    log(`Simplifying meshes for ${tempFile1} with ratio ${simplifyRatio}...`);
    execSync(
      `gltf-transform simplify "${tempFile1}" "${tempFile2}" --ratio ${simplifyRatio} --error 0.01 --verbose`,
      { stdio: 'inherit' }
    );
    log(`Simplification complete: ${tempFile2}`);

    // Step 3: Compress with MeshOptimizer only if simplified size > 20KB
    const simplifiedSize = fs.statSync(tempFile2).size;
    if (simplifiedSize > 20000) {
      log(`Compressing meshes for ${tempFile2}...`);
      execSync(
        `gltf-transform meshopt "${tempFile2}" "${outputFile}" --level high --verbose`,
        { stdio: 'inherit' }
      );
      log(`Compression complete: ${outputFile}`);
    } else {
      fs.renameSync(tempFile2, outputFile);
      log(`Skipped compression (small file, ${simplifiedSize} bytes): ${outputFile}`);
    }

    // Clean up temp files
    fs.unlinkSync(tempFile1);
    if (simplifiedSize > 20000) fs.unlinkSync(tempFile2);

    // Validate file size change
    const processedSize = fs.statSync(outputFile).size;
    const percentChange = ((processedSize - originalSize) / originalSize) * 100;
    log(
      `Size change: ${originalSize} bytes -> ${processedSize} bytes (${percentChange > 0 ? '+' : ''}${percentChange.toFixed(2)}%)`
    );
  } catch (error) {
    log(`Error processing ${inputFile}: ${error.message}`);
    console.error(`Terminal error: ${error.stderr || error.message}`);
    throw error;
  }
}

// Main execution
(async () => {
  log('Starting GLB processing...');

  for (const inputFile of inputFiles) {
    if (!fs.existsSync(inputFile)) {
      log(`File not found: ${inputFile}. Skipping.`);
      continue;
    }

    try {
      await processFile(inputFile);
      log(`Successfully processed ${inputFile}`);
    } catch (error) {
      log(`Failed to process ${inputFile}: ${error.message}`);
    }
  }

  log('Processing complete. Results saved to: ' + outputLogFile);
  console.log('Processing complete. Check log at: ' + outputLogFile);
})();