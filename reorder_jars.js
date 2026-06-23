const fs = require('fs');
const content = fs.readFileSync('code.html', 'utf8');

function extract(startStr, endStr) {
    const startIndex = content.indexOf(startStr);
    if (startIndex === -1) return null;
    const endIndex = content.indexOf(endStr, startIndex + startStr.length);
    if (endIndex === -1) return null;
    return {
        start: startIndex,
        end: endIndex + endStr.length,
        content: content.substring(startIndex, endIndex + endStr.length)
    };
}

const jar1 = extract('    <!-- ═══════════════════════════════════════════\n         CHAPTER I', '</section>');
const quote = extract('    <!-- ═══════════════════════════════════════════\n         PARALLAX QUOTE', '</section>');
const jar2 = extract('    <!-- ═══════════════════════════════════════════\n         CHAPTER II', '</section>');
const why = extract('    <!-- ═══════════════════════════════════════════\n         WHY CHOOSE US', '</section>');
const manifesto = extract('    <!-- ═══════════════════════════════════════════\n         MANIFESTO', '</section>');
const jar3 = extract('    <!-- ═══════════════════════════════════════════\n         CHAPTER III', '</section>');
const jar4 = extract('    <!-- ═══════════════════════════════════════════\n         CHAPTER IV', '</section>');

// Ornament Divider snippet
const dividerSnippet = `

    <!-- Ornament Divider -->
    <div class="ornament-divider reveal">
        <span class="ornament-divider__line"></span>
        <span class="ornament-divider__diamond"></span>
        <span class="ornament-divider__line"></span>
    </div>

`;

if (!jar1 || !jar2 || !jar3 || !jar4 || !quote || !why || !manifesto) {
    console.error("Failed to find some sections");
    console.log({ jar1: !!jar1, jar2: !!jar2, jar3: !!jar3, jar4: !!jar4, quote: !!quote, why: !!why, manifesto: !!manifesto });
    process.exit(1);
}

// Find the start and end of this entire group
// The group spans from Jar1 start to Jar4 end
const groupStart = Math.min(jar1.start, quote.start, jar2.start, why.start, manifesto.start, jar3.start, jar4.start);
const groupEnd = Math.max(jar1.end, quote.end, jar2.end, why.end, manifesto.end, jar3.end, jar4.end);

// Also we need to be careful about the original dividers inside this group.
// Let's just wipe out everything from groupStart to groupEnd, and replace it with our reordered content.
// Wait, is there any other content in between? Let's check what else is between groupStart and groupEnd.
// The only things are the ornament dividers and maybe some whitespace. We can safely replace the whole block!

const newGroupContent = jar1.content + dividerSnippet +
                        jar2.content + dividerSnippet +
                        jar3.content + dividerSnippet +
                        jar4.content + dividerSnippet +
                        quote.content + '\n\n' +
                        why.content + '\n\n' +
                        manifesto.content;

const newFileContent = content.substring(0, groupStart) + newGroupContent + content.substring(groupEnd);

fs.writeFileSync('code.html', newFileContent, 'utf8');
console.log("Successfully reordered the sections!");
