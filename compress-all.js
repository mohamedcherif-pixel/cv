const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const filesDir = './files';
const outputDir = './files/compressed';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all .glb files
const glbFiles = fs.readdirSync(filesDir).filter(file => file.endsWith('.glb'));

console.log(`Found ${glbFiles.length} .glb files to compress:`);
glbFiles.forEach(file => console.log(`  - ${file}`));

async function compressGlbFile(filename) {
    try {
        console.log(`\n🗜️  Compressing ${filename}...`);
        
        const inputPath = path.join(filesDir, filename);
        const outputPath = path.join(outputDir, filename);
        
        // Get original file size
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;
        
        // Run gltf-transform with Draco compression
        const command = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco --texture-size 1024`;
        
        console.log(`   📦 Running Draco compression...`);
        const { stdout, stderr } = await execAsync(command);
        
        // Get compressed file size
        const compressedStats = fs.statSync(outputPath);
        const compressedSize = compressedStats.size;
        
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ Compression complete!`);
        console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Compression: ${compressionRatio}%`);
        
        return {
            file: filename,
            original: originalSize,
            compressed: compressedSize,
            ratio: compressionRatio
        };
        
    } catch (error) {
        console.error(`❌ Error compressing ${filename}:`, error.message);
        
        // Copy original file as fallback
        const inputPath = path.join(filesDir, filename);
        const outputPath = path.join(outputDir, filename);
        fs.copyFileSync(inputPath, outputPath);
        
        const stats = fs.statSync(inputPath);
        return {
            file: filename,
            original: stats.size,
            compressed: stats.size,
            ratio: '0.0'
        };
    }
}

async function compressAllFiles() {
    console.log('\n🚀 Starting Draco compression with gltf-transform...\n');
    
    const results = [];
    
    for (const file of glbFiles) {
        const result = await compressGlbFile(file);
        results.push(result);
    }
    
    // Summary
    console.log('\n📊 Compression Summary:');
    console.log('─'.repeat(70));
    let totalOriginal = 0;
    let totalCompressed = 0;
    
    results.forEach(({ file, original, compressed, ratio }) => {
        console.log(`${file.padEnd(25)} | ${(original / 1024 / 1024).toFixed(2).padStart(6)} MB → ${(compressed / 1024 / 1024).toFixed(2).padStart(6)} MB (${ratio.padStart(5)}%)`);
        totalOriginal += original;
        totalCompressed += compressed;
    });
    
    console.log('─'.repeat(70));
    const totalRatio = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);
    console.log(`Total`.padEnd(25) + ' | ' + `${(totalOriginal / 1024 / 1024).toFixed(2).padStart(6)} MB → ${(totalCompressed / 1024 / 1024).toFixed(2).padStart(6)} MB (${totalRatio.padStart(5)}%)`);
    
    console.log(`\n🎉 All files compressed and saved to: ${outputDir}/`);
    
    // Show next steps
    const anyCompressed = results.some(r => parseFloat(r.ratio) > 0);
    if (anyCompressed) {
        console.log(`\n💡 Next steps:`);
        console.log(`   1. Update your HTML to use compressed files from the 'compressed' folder`);
        console.log(`   2. Make sure to include Draco decoder for browser decompression`);
        console.log(`   3. Test that models load correctly with compressed files`);
    } else {
        console.log(`\n⚠️  No compression achieved. Files copied as-is.`);
    }
}

// Run compression
compressAllFiles().catch(console.error);
