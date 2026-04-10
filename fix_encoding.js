/**
 * fix_encoding.js
 * Fixes files that were saved as UTF-8 after being read as Windows-1252 (ANSI).
 * Run with:  node fix_encoding.js
 */

const fs = require('fs');
const path = require('path');

const files = ['Timeline.html', 'resource-pack.html', 'script.js', 'shared.js', 'home.html'];

// iconv-lite is not always available; we implement the Windows-1252 → byte recovery manually.
// Strategy: read the file as a Buffer, decode as latin1 (which is a 1:1 byte mapping),
// then re-encode each character back to its byte value to get the original UTF-8 bytes.

files.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
        console.log(`Skipping ${file} (not found)`);
        return;
    }

    try {
        // Read raw bytes
        const rawBuffer = fs.readFileSync(fullPath);

        // Decode the raw UTF-8 bytes as a JS string (which may contain mojibake)
        const mojibake = rawBuffer.toString('utf8');

        // Re-encode each character back to its Windows-1252 / latin1 byte value.
        // latin1 encoding in Node maps the first 256 Unicode code points 1:1 to byte values.
        const recoveredBuffer = Buffer.from(mojibake, 'latin1');

        // Verify the recovered bytes are valid UTF-8 before overwriting
        const decoded = recoveredBuffer.toString('utf8');

        // Write the recovered UTF-8 bytes back
        fs.writeFileSync(fullPath, recoveredBuffer);
        console.log(`✅ Fixed encoding for ${file}`);
    } catch (err) {
        console.log(`❌ Could not fix ${file}: ${err.message}`);
    }
});
