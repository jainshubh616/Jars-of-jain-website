const fs = require('fs');
let content = fs.readFileSync('code.html', 'utf8');

const trustBarHtml = `
    <!-- ═══════════════════════════════════════════
         TRUST BLOCK
         ═══════════════════════════════════════════ -->
    <div class="trust-bar">
        <div class="trust-item"><span class="icon">🌿</span> 100% Natural</div>
        <div class="trust-item"><span class="icon">✨</span> Heritage Recipes</div>
        <div class="trust-item"><span class="icon">👨‍👩‍👧</span> 5000+ Happy Families</div>
        <div class="trust-item"><span class="icon">📜</span> FSSAI Certified</div>
    </div>
`;

// It might be slightly different in whitespace, let's just find and replace the block
const startIndex = content.indexOf('    <!-- ═══════════════════════════════════════════\n         TRUST BLOCK');
if (startIndex !== -1) {
    const endIndex = content.indexOf('    </div>', startIndex) + 10;
    // Remove the trust block from current position
    content = content.substring(0, startIndex) + content.substring(endIndex);
    
    // Insert it after the Hero section
    const insertPoint = content.indexOf('    <!-- ═══════════════════════════════════════════\n         CHAPTER I — THE ORIGIN STORY');
    if (insertPoint !== -1) {
        content = content.substring(0, insertPoint) + trustBarHtml + content.substring(insertPoint);
        fs.writeFileSync('code.html', content, 'utf8');
        console.log('Successfully moved the trust bar below the hero section.');
    } else {
        console.log('Could not find insert point.');
    }
} else {
    console.log('Could not find trust block.');
}
