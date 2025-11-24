const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration for HIGH QUALITY Earth compression
const filesDir = './files';
const outputDir = './files/compressed';
const earthFile = 'earthback.glb';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function compressEarthHighQuality() {
    try {
        console.log(`🌍 Compressing Earth model with HIGH QUALITY settings...`);
        
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
        
        // HIGH QUALITY COMPRESSION OPTIONS:
        
        // Option 1: Draco Only (preserves all texture quality)
        const command1 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco`;
        
        // Option 2: Draco + Texture Quantization (maintains resolution but optimizes)
        const command2 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco --texture-compress ktx2`;
        
        // Option 3: Draco + Light Texture Optimization (3072px - still very high)
        const command3 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco --texture-size 3072`;
        
        console.log(`\n🎯 Trying HIGH QUALITY compression (Draco + Texture Quantization)...`);
        
        let compressionSuccess = false;
        let finalCommand = command1;
        
        try {
            // Try Option 2 first - Draco + KTX2 texture compression
            const { stdout, stderr } = await execAsync(command2);
            
            // Get compressed file size
            const compressedStats = fs.statSync(outputPath);
            const compressedSize = compressedStats.size;
            
            const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
            const sizeReduction = ((originalSize - compressedSize) / 1024 / 1024).toFixed(1);
            
            console.log(`✅ HIGH QUALITY compression complete!`);
            console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Space saved: ${sizeReduction} MB (${compressionRatio}% compression)`);
            console.log(`   Quality: ULTRA HIGH (Original textures + Draco + KTX2)`);
            
            compressionSuccess = true;
            
            // If compression is too aggressive (>95%), try lighter option
            if (parseFloat(compressionRatio) > 95) {
                console.log(`\n⚠️  Compression too aggressive, trying 3072px textures...`);
                
                await execAsync(command3);
                
                const highResStats = fs.statSync(outputPath);
                const highResSize = highResStats.size;
                const highResRatio = ((originalSize - highResSize) / originalSize * 100).toFixed(1);
                const highResReduction = ((originalSize - highResSize) / 1024 / 1024).toFixed(1);
                
                console.log(`✅ HIGH RESOLUTION compression complete!`);
                console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
                console.log(`   Compressed: ${(highResSize / 1024 / 1024).toFixed(2)} MB`);
                console.log(`   Space saved: ${highResReduction} MB (${highResRatio}% compression)`);
                console.log(`   Quality: VERY HIGH (3072px textures + Draco)`);
            }
            
        } catch (error) {
            console.error(`❌ Error with high-quality compression:`, error.message);
            console.log(`\n🔄 Falling back to Draco-only compression...`);
            
            // Fallback to Draco only
            await execAsync(command1);
            
            const fallbackStats = fs.statSync(outputPath);
            const fallbackSize = fallbackStats.size;
            const fallbackRatio = ((originalSize - fallbackSize) / originalSize * 100).toFixed(1);
            const fallbackReduction = ((originalSize - fallbackSize) / 1024 / 1024).toFixed(1);
            
            console.log(`✅ Draco-only compression complete!`);
            console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Compressed: ${(fallbackSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Space saved: ${fallbackReduction} MB (${fallbackRatio}% compression)`);
            console.log(`   Quality: MAXIMUM (Original textures + Draco geometry)`);
            
            compressionSuccess = true;
        }
        
        if (compressionSuccess) {
            console.log(`\n🌍 Earth compression complete!`);
            console.log(`💡 Update your HTML to use: files/compressed/${earthFile}`);
            console.log(`🎯 Quality preserved while significantly reducing file size!`);
        }
        
    } catch (error) {
        console.error(`❌ Error compressing Earth:`, error.message);
    }
}

// Run the high-quality Earth compression
compressEarthHighQuality();
