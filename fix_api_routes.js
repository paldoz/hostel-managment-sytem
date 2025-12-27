const fs = require('fs');
const path = require('path');

const routes = [
    'app/api/students/route.ts',
    'app/api/students/[id]/route.ts',
    'app/api/rooms/route.ts',
    'app/api/rooms/[id]/route.ts',
    'app/api/fees/route.ts',
    'app/api/complaints/route.ts',
    'app/api/complaints/[id]/route.ts',
    'app/api/announcements/route.ts',
    'app/api/auth/student-login/route.ts',
    'app/api/profile/route.ts'
];

const configToAdd = `
// Force dynamic rendering - don't run during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
`;

routes.forEach(routePath => {
    const fullPath = path.join(process.cwd(), routePath);

    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');

        // Check if config already exists
        if (!content.includes('export const dynamic')) {
            // Find the position after imports
            const lines = content.split('\n');
            let insertIndex = 0;

            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith('import ')) {
                    insertIndex = i + 1;
                } else if (lines[i].trim() === '' && insertIndex > 0) {
                    insertIndex = i + 1;
                    break;
                }
            }

            // Insert config
            lines.splice(insertIndex, 0, configToAdd);
            content = lines.join('\n');

            fs.writeFileSync(fullPath, content, 'utf8');
            console.log(`✅ Updated: ${routePath}`);
        } else {
            console.log(`⏭️  Skipped (already has config): ${routePath}`);
        }
    } else {
        console.log(`❌ Not found: ${routePath}`);
    }
});

console.log('\n✅ All API routes updated!');
