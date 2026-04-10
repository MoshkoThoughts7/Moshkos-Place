const fs = require('fs');

const files = ['parlamentum.html', 'resource-pack.html'];

files.forEach(filepath => {
    let content = fs.readFileSync(filepath, 'utf-8');
    
    // Extract aos link and style
    const pattern = /(<link[^>]*href="[^"]*aos\.css"[^>]*>\s*)?(<style>[\s\S]*?<\/style>)/i;
    const match = content.match(pattern);
    
    if (match) {
        const extracted = match[0];
        
        if (content.indexOf(extracted) > content.indexOf('<main')) {
            console.log(`Styles already in main for ${filepath}`);
            return;
        }
        
        content = content.replace(extracted, '');
        const main_tag = '<main id="main-content">';
        content = content.replace(main_tag, main_tag + '\n' + extracted + '\n');
        
        fs.writeFileSync(filepath, content, 'utf-8');
        console.log(`Successfully updated ${filepath}`);
    } else {
        console.log(`Pattern not found in ${filepath}`);
    }
});
