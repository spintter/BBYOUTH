/**
 * Production mode memory usage test script
 * Run with: node scripts/production-test.js
 */

const { spawn } = require('child_process');
const os = require('os');
const http = require('http');

// Format memory size to human-readable format
function formatMemoryUsage(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

// Log memory stats
function logMemoryStats(processInfo) {
  const { pid, mem, rss } = processInfo;
  console.log(`\n--- Process Memory Stats (PID: ${pid}) ---`);
  console.log(`Memory %: ${mem}%`);
  console.log(`RSS: ${formatMemoryUsage(rss)}`);

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  console.log(`\n--- System Memory ---`);
  console.log(`Total: ${formatMemoryUsage(totalMem)}`);
  console.log(`Free: ${formatMemoryUsage(freeMem)}`);
  console.log(
    `Used: ${formatMemoryUsage(totalMem - freeMem)} (${Math.round(((totalMem - freeMem) / totalMem) * 100)}%)`,
  );
}

// Start the production server
console.log('Starting production server...');
const server = spawn('npm', ['start'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NODE_ENV: 'production' },
});

let nextPid = null;

// Log standard output
server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`[Server]: ${output}`);

  // Check if ready
  if (output.includes('ready started server on')) {
    console.log('\nProduction server started! Testing memory usage...');
    setTimeout(runTests, 2000); // Allow server to stabilize for 2 seconds
  }
});

// Log errors
server.stderr.on('data', (data) => {
  console.error(`[Server Error]: ${data.toString()}`);
});

// Find the Next.js process ID
function findNextProcess() {
  const { execSync } = require('child_process');
  try {
    const cmd =
      process.platform === 'win32'
        ? `wmic process where "commandline like '%next start%'" get processid`
        : `ps aux | grep "next start" | grep -v grep | awk '{print $2}'`;

    const output = execSync(cmd).toString().trim();
    const pid = parseInt(output.match(/\d+/)?.[0], 10);
    return isNaN(pid) ? null : pid;
  } catch (err) {
    console.error('Error finding Next.js process:', err.message);
    return null;
  }
}

// Get process memory usage
function getProcessMemoryUsage(pid) {
  const { execSync } = require('child_process');
  try {
    let cmd;
    if (process.platform === 'win32') {
      cmd = `wmic process where processid=${pid} get workingsetsize`;
      const output = execSync(cmd).toString().trim();
      const lines = output.split('\n').filter(Boolean);
      if (lines.length > 1) {
        const rss = parseInt(lines[1], 10);
        // On Windows, getting % is more complex, so we'll approximate
        const totalMem = os.totalmem();
        const memPercent = (rss / totalMem) * 100;
        return { pid, mem: memPercent.toFixed(1), rss };
      }
    } else {
      cmd = `ps -p ${pid} -o %mem,rss`;
      const output = execSync(cmd).toString().trim();
      const lines = output.split('\n').filter(Boolean);
      if (lines.length > 1) {
        const parts = lines[1].trim().split(/\s+/);
        return {
          pid,
          mem: parseFloat(parts[0]),
          rss: parseInt(parts[1], 10) * 1024, // Convert to bytes
        };
      }
    }
    return null;
  } catch (err) {
    console.error('Error getting memory usage:', err.message);
    return null;
  }
}

// Make HTTP requests to test memory usage under load
function makeRequests(url, count) {
  return new Promise((resolve) => {
    let completed = 0;

    for (let i = 0; i < count; i++) {
      http
        .get(url, (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            completed++;
            if (completed === count) {
              resolve();
            }
          });
        })
        .on('error', (err) => {
          console.error(`Request error: ${err.message}`);
          completed++;
          if (completed === count) {
            resolve();
          }
        });
    }
  });
}

// Run memory tests
async function runTests() {
  // Find the Next.js process
  nextPid = findNextProcess();
  if (!nextPid) {
    console.error('Could not find Next.js process PID');
    stopServer();
    return;
  }

  console.log(`Found Next.js process with PID: ${nextPid}`);

  // Get initial memory stats
  const initialStats = getProcessMemoryUsage(nextPid);
  if (initialStats) {
    console.log('\n=== Initial Memory Usage ===');
    logMemoryStats(initialStats);
  }

  // Make requests to simulate load
  console.log('\nMaking 10 requests to test load...');
  await makeRequests('http://localhost:3000', 10);

  // Get memory stats after load
  const afterLoadStats = getProcessMemoryUsage(nextPid);
  if (afterLoadStats) {
    console.log('\n=== Memory Usage After Load ===');
    logMemoryStats(afterLoadStats);

    const memDiff = (afterLoadStats.mem - initialStats.mem).toFixed(2);
    const rssDiff = afterLoadStats.rss - initialStats.rss;

    console.log('\n=== Memory Usage Difference ===');
    console.log(`Memory % Change: ${memDiff > 0 ? '+' : ''}${memDiff}%`);
    console.log(`RSS Change: ${rssDiff > 0 ? '+' : ''}${formatMemoryUsage(rssDiff)}`);
  }

  // Stop server after tests
  console.log('\nTests completed, stopping server.');
  stopServer();
}

// Stop the server
function stopServer() {
  if (server) {
    console.log('Stopping server...');
    server.kill('SIGTERM');
  }
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', stopServer);
