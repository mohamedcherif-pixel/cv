const fs = require('fs');
const path = require('path');
const { DracoEncoder } = require('draco3d');
const gltfPipeline = require('gltf-pipeline');
const { processGltf } = gltfPipeline;

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

async function compressGlbFile(filePath, outputPath) {
    try {
        console.log(`\n🗜️  Compressing ${path.basename(filePath)}...`);
        
        // Read the original GLB file
        const originalBuffer = fs.readFileSync(filePath);
        const originalSize = originalBuffer.length;
        
        // Process with Draco compression
        const options = {
            dracoOptions: {
                compressionLevel: 7, // 0-10, higher = more compression but slower
                quantizePositionBits: 14,
                quantizeNormalBits: 10,
                quantizeTexcoordBits: 12,
                quantizeColorBits: 8,
                quantizeGenericBits: 12
            }
        };
        
        const results = await processGltf(originalBuffer, options);
        
        // Write compressed file
        fs.writeFileSync(outputPath, results.glb);
        
        const compressedSize = results.glb.length;
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ Compression complete!`);
        console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`   Compression: ${compressionRatio}%`);
        
        return {
            original: originalSize,
            compressed: compressedSize,
            ratio: compressionRatio
        };
        
    } catch (error) {
        console.error(`❌ Error compressing ${path.basename(filePath)}:`, error.message);
        return null;
    }
}

async function compressAllFiles() {
    console.log('\n🚀 Starting Draco compression...\n');
    
    const results = [];
    
    for (const file of glbFiles) {
        const inputPath = path.join(filesDir, file);
        const outputPath = path.join(outputDir, file);
        
        const result = await compressGlbFile(inputPath, outputPath);
        if (result) {
            results.push({
                file,
                ...result
            });
        }
    }
    
    // Summary
    console.log('\n📊 Compression Summary:');
    console.log('─'.repeat(60));
    let totalOriginal = 0;
    let totalCompressed = 0;
    
    results.forEach(({ file, original, compressed, ratio }) => {
        console.log(`${file.padEnd(25)} | ${(original / 1024 / 1024).toFixed(2).padStart(6)} MB → ${(compressed / 1024 / 1024).toFixed(2).padStart(6)} MB (${ratio.padStart(5)}%)`);
        totalOriginal += original;
        totalCompressed += compressed;
    });
    
    console.log('─'.repeat(60));
    const totalRatio = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);
    console.log(`Total`.padEnd(25) + ' | ' + `${(totalOriginal / 1024 / 1024).toFixed(2).padStart(6)} MB → ${(totalCompressed / 1024 / 1024).toFixed(2).padStart(6)} MB (${totalRatio.padStart(5)}%)`);
    
    console.log(`\n🎉 All files compressed and saved to: ${outputDir}/`);
}

// Run compression
compressAllFiles().catch(console.error);
