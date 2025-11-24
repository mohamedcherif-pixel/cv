const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration for OPTIMIZED Earth compression
const filesDir = './files';
const outputDir = './files/compressed';
const earthFile = 'earthback.glb';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function compressEarthOptimized() {
    try {
        console.log(`🌍 Compressing Earth model with OPTIMIZED settings...`);
        
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
        
        // OPTIMIZED COMPRESSION - Draco with better texture handling
        
        // Option 1: Draco + 3072px textures (still very high quality)
        const command1 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco --texture-size 3072`;
        
        // Option 2: Draco + 2048px textures (high quality)
        const command2 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco --texture-size 2048`;
        
        // Option 3: Draco only (maximum texture quality)
        const command3 = `npx gltf-transform optimize "${inputPath}" "${outputPath}" --compress draco`;
        
        console.log(`\n🎯 Trying OPTIMIZED compression (Draco + 3072px textures)...`);
        
        let compressionUsed = '';
        let finalSize = 0;
        
        try {
            // Try Option 1 first - 3072px textures (still very high quality)
            await execAsync(command1);
            
            const compressedStats = fs.statSync(outputPath);
            finalSize = compressedStats.size;
            
            const compressionRatio = ((originalSize - finalSize) / originalSize * 100).toFixed(1);
            const sizeReduction = ((originalSize - finalSize) / 1024 / 1024).toFixed(1);
            
            console.log(`✅ OPTIMIZED compression complete!`);
            console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Compressed: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Space saved: ${sizeReduction} MB (${compressionRatio}% compression)`);
            console.log(`   Quality: VERY HIGH (3072px textures + Draco)`);
            
            compressionUsed = '3072px + Draco';
            
            // Check if compression is reasonable
            if (parseFloat(compressionRatio) > 95) {
                console.log(`\n⚠️  Compression too aggressive, trying 2048px textures...`);
                
                await execAsync(command2);
                
                const mediumStats = fs.statSync(outputPath);
                finalSize = mediumStats.size;
                const mediumRatio = ((originalSize - finalSize) / originalSize * 100).toFixed(1);
                const mediumReduction = ((originalSize - finalSize) / 1024 / 1024).toFixed(1);
                
                console.log(`✅ MEDIUM-HIGH compression complete!`);
                console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
                console.log(`   Compressed: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
                console.log(`   Space saved: ${mediumReduction} MB (${mediumRatio}% compression)`);
                console.log(`   Quality: HIGH (2048px textures + Draco)`);
                
                compressionUsed = '2048px + Draco';
            }
            
        } catch (error) {
            console.error(`❌ Error with optimized compression:`, error.message);
            console.log(`\n🔄 Falling back to Draco-only compression...`);
            
            // Fallback to Draco only
            await execAsync(command3);
            
            const fallbackStats = fs.statSync(outputPath);
            finalSize = fallbackStats.size;
            const fallbackRatio = ((originalSize - finalSize) / originalSize * 100).toFixed(1);
            const fallbackReduction = ((originalSize - finalSize) / 1024 / 1024).toFixed(1);
            
            console.log(`✅ Draco-only compression complete!`);
            console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Compressed: ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
            console.log(`   Space saved: ${fallbackReduction} MB (${fallbackRatio}% compression)`);
            console.log(`   Quality: MAXIMUM (Original textures + Draco)`);
            
            compressionUsed = 'Original + Draco';
        }
        
        // Final summary
        const finalRatio = ((originalSize - finalSize) / originalSize * 100).toFixed(1);
        const finalReduction = ((originalSize - finalSize) / 1024 / 1024).toFixed(1);
        
        console.log(`\n🌍🎯 EARTH COMPRESSION SUMMARY 🎯🌍`);
        console.log(`═══════════════════════════════════════════════════════════`);
        console.log(`📁 File: ${earthFile}`);
        console.log(`📏 Size: ${(originalSize / 1024 / 1024).toFixed(2)} MB → ${(finalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`💾 Saved: ${finalReduction} MB (${finalRatio}% compression)`);
        console.log(`🎨 Quality: ${compressionUsed}`);
        console.log(`⚡ Load improvement: ${(61.30 / (finalSize / 1024 / 1024)).toFixed(1)}x faster`);
        console.log(`═══════════════════════════════════════════════════════════`);
        console.log(`💡 Update HTML to use: files/compressed/${earthFile}`);
        
    } catch (error) {
        console.error(`❌ Error compressing Earth:`, error.message);
    }
}

// Run the optimized Earth compression
compressEarthOptimized();
