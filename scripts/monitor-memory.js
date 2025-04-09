/**
 * Simple memory usage monitoring script
 * Run with: node scripts/monitor-memory.js
 */

const os = require('os');

// Format memory size to human-readable format
function formatMemoryUsage(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// Get current memory usage
function getMemoryUsage() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const usedPercent = Math.round((used / total) * 100);

  const nodeUsage = process.memoryUsage();

  console.log('\n--- System Memory Usage ---');
  console.log(`Total Memory: ${formatMemoryUsage(total)}`);
  console.log(`Used Memory: ${formatMemoryUsage(used)} (${usedPercent}%)`);
  console.log(`Free Memory: ${formatMemoryUsage(free)}`);

  console.log('\n--- Node.js Process Memory Usage ---');
  console.log(`RSS (Resident Set Size): ${formatMemoryUsage(nodeUsage.rss)}`);
  console.log(`Heap Total: ${formatMemoryUsage(nodeUsage.heapTotal)}`);
  console.log(`Heap Used: ${formatMemoryUsage(nodeUsage.heapUsed)}`);
  console.log(`External: ${formatMemoryUsage(nodeUsage.external)}`);
  console.log(`ArrayBuffers: ${formatMemoryUsage(nodeUsage.arrayBuffers || 0)}`);
}

// Monitor memory usage every 5 seconds
console.log('Starting memory usage monitoring...');
console.log('Press Ctrl+C to stop');

// Initial reading
getMemoryUsage();

// Set up interval for continuous monitoring
const interval = setInterval(getMemoryUsage, 5000);

// Handle termination
process.on('SIGINT', () => {
  clearInterval(interval);
  console.log('\nMemory monitoring stopped');
  process.exit(0);
});
