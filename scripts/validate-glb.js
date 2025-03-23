const fs = require('fs');
const path = require('path');
const { Validator } = require('gltf-validator');
const os = require('os');

// Configuration
const projectRoot = path.join(__dirname, '..', 'public', 'models');
const desktopPath = os.homedir() + '/Desktop';
const outputFile = path.join(desktopPath, 'glb-validation-results.txt');
const filesToValidate = [
  path.join(projectRoot, 'african-girl.glb'),
  path.join(projectRoot, 'african-girl-optimized.glb'),
  path.join(projectRoot, 'chessboard-optimized.glb'),
  path.join(projectRoot, 'stars.glb')
];

// Structural Validation
async function validateStructure(filePath) {
  const results = {
    file: filePath,
    structural: {},
    validator: {}
  };

  try {
    const buffer = fs.readFileSync(filePath);
    const dataView = new DataView(buffer.buffer);

    // Header Validation
    const magic = new Uint8Array(buffer.slice(0, 4));
    const expectedMagic = new Uint8Array([0x67, 0x6C, 0x54, 0x46]); // 'glTF'
    const version = dataView.getUint32(4, true);
    const length = dataView.getUint32(8, true);

    results.structural = {
      magicValid: magic.every((val, i) => val === expectedMagic[i]),
      versionValid: version === 2,
      lengthValid: length === buffer.byteLength,
      chunks: []
    };

    // Chunk Validation
    let offset = 12;
    const chunkTypeMap = { 0x4A534F4E: 'JSON', 0x42494E00: 'BIN' };
    while (offset < buffer.byteLength) {
      const chunkLength = dataView.getUint32(offset, true);
      const chunkTypeValue = dataView.getUint32(offset + 4, true);
      offset += 8;

      results.structural.chunks.push({
        type: chunkTypeMap[chunkTypeValue] || chunkTypeValue.toString(16),
        length: chunkLength,
        valid: chunkLength <= (buffer.byteLength - offset)
      });

      offset += chunkLength;
    }
  } catch (error) {
    results.structural.error = error.message;
  }

  return results;
}

// GLTF Validation
async function validateWithGLTFValidator(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    return await Validator.validateBytes(new Uint8Array(buffer));
  } catch (error) {
    return { issues: { messages: [{ severity: 'ERROR', message: error.message }] } };
  }
}

// Main Execution
(async () => {
  const results = await Promise.all(filesToValidate.map(async (filePath) => {
    try {
      const result = await validateStructure(filePath);
      result.validator = await validateWithGLTFValidator(filePath);
      return result;
    } catch (error) {
      return {
        file: filePath,
        structural: { error: error.message },
        validator: { issues: { messages: [{ severity: 'ERROR', message: error.message }] } }
      };
    }
  }));

  // Format results
  const severityMap = { 0: 'ERROR', 1: 'WARNING', 2: 'INFO', 3: 'HINT' };
  const output = results.map(r => {
    return [
      `File: ${r.file}`,
      'Structural Validation:',
      `- Magic Valid: ${r.structural.magicValid ?? 'N/A'}`,
      `- Version Valid: ${r.structural.versionValid ?? 'N/A'}`,
      `- Length Valid: ${r.structural.lengthValid ?? 'N/A'}`,
      r.structural.error ? `Error: ${r.structural.error}` : '',
      'Chunks:',
      ...(r.structural.chunks?.map((c, i) => `  Chunk ${i + 1}: ${c.type} (Length: ${c.length}, Valid: ${c.valid})`) || []),
      'GLTF Validator Results:',
      ...(r.validator.issues?.messages || []).map(m => `- [${severityMap[m.severity] || m.severity}] ${m.message}`),
      '----------------------------------------'
    ].filter(Boolean).join('\n');
  }).join('\n\n');

  try {
    fs.writeFileSync(outputFile, output);
    console.log(`Validation complete. Results saved to: ${outputFile}`);
  } catch (error) {
    console.error(`Failed to write results to ${outputFile}: ${error.message}`);
    console.log('Results:\n', output);
  }
})();