const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration for BALANCED Earth compression
const filesDir = './files';
const outputDir = './files/compressed';
const earthFile = 'earthback.glb';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function compressEarthBalanced() {
    try {
        console.log(`🌍 Compressing Earth model with BALANCED quality...`);
        
        const inputPath = path.join(filesDir, earthFile);
        const outputPath = path.join(outputDir, earthFile);
        
        // Check if original file exists
        if (!fs.existsSync(inputPath)) {
            console.error(`❌ Original Earth file not found: ${inputPath}`);
            return;
        }
        
        // Get original file size
        const originalStats = fs.statSync(inputPath);
        const originalSize = originalStats.size;
        
        console.log(`📏 Original Earth size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        
        // BALANCED COMPRESSION OPTIONS:
        // Option 1: Moderate Draco + Higher Texture Resolution
        const command1 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco --texture-size 2048 --texture-format webp`;
        
        // Option 2: Light Draco + Original Texture Size  
        const command2 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco --texture-size 4096`;
        
        // Option 3: Draco Only (no texture compression)
        const command3 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco`;
        
        console.log(`\n🎯 Trying BALANCED compression (Option 1 - Moderate Draco + 2048 textures)...`);
        
        try {
            const { stdout, stderr } = await execAsync(command1);
            
            // Get compressed file size
            const compressedStats = fs.statSync(outputPath);
            const compressedSize = compressedStats.size;
            
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
            const sizeReduction = ((originalSize - compressedSize) / 1024 / 1024).toFixed(1);
            
            console.log(`✅ BALANCED compression complete!`);
            console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Space saved: ${sizeReduction} MB (${compressionRatio}% compression)`);
            console.log(`   Quality: HIGH (2048px textures + Draco)`);
            
            // Check if compression ratio is reasonable (not too aggressive)
            if (parseFloat(compressionRatio) > 95) {
                console.log(`⚠️  Compression too aggressive (${compressionRatio}%), trying lighter option...`);
                
                // Try lighter compression
                console.log(`\n🎯 Trying LIGHTER compression (Option 3 - Draco only)...`);
                await execAsync(command3);
                
                const lighterStats = fs.statSync(outputPath);
                const lighterSize = lighterStats.size;
                const lighterRatio = ((originalSize - lighterSize) / originalSize * 100).toFixed(1);
                const lighterReduction = ((originalSize - lighterSize) / 1024 / 1024).toFixed(1);
                
                console.log(`✅ LIGHTER compression complete!`);
                console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
                console.log(`   Compressed: ${(lighterSize / 1024 / 1024).toFixed(2)} MB`);
                console.log(`   Space saved: ${lighterReduction} MB (${lighterRatio}% compression)`);
                console.log(`   Quality: VERY HIGH (Original textures + Draco)`);
            }
            
        } catch (error) {
            console.error(`❌ Error with balanced compression:`, error.message);
            
            // Fallback to Draco only
            console.log(`\n🔄 Falling back to Draco-only compression...`);
            await execAsync(command3);
            
            const fallbackStats = fs.statSync(outputPath);
            const fallbackSize = fallbackStats.size;
            const fallbackRatio = ((originalSize - fallbackSize) / originalSize * 100).toFixed(1);
            
            console.log(`✅ Fallback compression complete!`);
            console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Compressed: ${(fallbackSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Compression: ${fallbackRatio}%`);
            console.log(`   Quality: MAXIMUM (Draco geometry only)`);
        }
        
        console.log(`\n🌍 Earth compression complete!`);
        console.log(`💡 Update your HTML to use: files/compressed/${earthFile}`);
        
    } catch (error) {
        console.error(`❌ Error compressing Earth:`, error.message);
    }
}

// Run the balanced Earth compression
compressEarthBalanced();
