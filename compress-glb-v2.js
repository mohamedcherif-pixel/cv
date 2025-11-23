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

async function convertGlbToGltf(inputPath, tempGltfPath) {
    try {
        console.log(`   📄 Converting to glTF...`);
        // Use gltf-pipeline to convert GLB to glTF
        const gltfPipeline = require('gltf-pipeline');
        const { processGltf } = gltfPipeline;
        
        const glbBuffer = fs.readFileSync(inputPath);
        const options = {
            dracoOptions: {
                compressionLevel: 0 // No compression for intermediate step
            }
        };
        
        const results = await processGltf(glbBuffer, options);
        fs.writeFileSync(tempGltfPath, JSON.stringify(results.gltf));
        
        return true;
    } catch (error) {
        console.error(`   ❌ Error converting to glTF: ${error.message}`);
        return false;
    }
}

async function compressWithDraco(inputPath, outputPath) {
    try {
        console.log(`   🗜️  Compressing with Draco...`);
        
        // First convert GLB to glTF
        const tempGltfPath = inputPath.replace('.glb', '.gltf');
        const converted = await convertGlbToGltf(inputPath, tempGltfPath);
        
        if (!converted) return null;
        
        // Use Draco encoder (if available)
        const dracoEncoderPath = './draco_encoder.js';
        if (fs.existsSync(dracoEncoderPath)) {
            console.log(`   📦 Using Draco encoder...`);
            // For now, we'll use gltf-pipeline with Draco
            const gltfPipeline = require('gltf-pipeline');
            const { processGltf } = gltfPipeline;
            
            const glbBuffer = fs.readFileSync(inputPath);
            const options = {
                dracoOptions: {
                    compressionLevel: 7,
                    quantizePositionBits: 14,
                    quantizeNormalBits: 10,
                    quantizeTexcoordBits: 12,
                    quantizeColorBits: 8,
                    quantizeGenericBits: 12
                }
            };
            
            const results = await processGltf(glbBuffer, options);
            fs.writeFileSync(outputPath, results.glb);
            
            // Clean up temp file
            if (fs.existsSync(tempGltfPath)) {
                fs.unlinkSync(tempGltfPath);
            }
            
            return {
                original: glbBuffer.length,
                compressed: results.glb.length
            };
        } else {
            console.log(`   ⚠️  Draco encoder not found, using gltf-pipeline only`);
            return null;
        }
        
    } catch (error) {
        console.error(`   ❌ Error compressing: ${error.message}`);
        return null;
    }
}

async function compressAllFiles() {
    console.log('\n🚀 Starting Draco compression...\n');
    
    const results = [];
    
    for (const file of glbFiles) {
        const inputPath = path.join(filesDir, file);
        const outputPath = path.join(outputDir, file);
        
        console.log(`\n📁 Processing ${file}...`);
        
        const result = await compressWithDraco(inputPath, outputPath);
        if (result) {
            const compressionRatio = ((result.original - result.compressed) / result.original * 100).toFixed(1);
            console.log(`✅ ${file}: ${(result.original / 1024 / 1024).toFixed(2)} MB → ${(result.compressed / 1024 / 1024).toFixed(2)} MB (${compressionRatio}% saved)`);
            
            results.push({
                file,
                ...result,
                ratio: compressionRatio
            });
        } else {
            console.log(`⚠️  Skipping ${file} - copying original`);
            // Copy original file as fallback
            fs.copyFileSync(inputPath, outputPath);
            const size = fs.statSync(inputPath).size;
            results.push({
                file,
                original: size,
                compressed: size,
                ratio: '0.0'
            });
        }
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
    
    console.log(`\n🎉 All files processed and saved to: ${outputDir}/`);
}

// Run compression
compressAllFiles().catch(console.error);
