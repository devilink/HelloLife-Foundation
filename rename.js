const fs = require('fs');
const path = require('path');

const files = [
  "src/components/donate/DonateClient.tsx",
  "src/lib/email.ts",
  "src/components/layout/Navbar.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/help/RequestForm.tsx",
  "src/app/volunteer/page.tsx",
  "src/app/transparency/page.tsx",
  "src/app/request-help/page.tsx",
  "src/app/projects/page.tsx",
  "src/app/layout.tsx",
  "src/app/gallery/page.tsx",
  "src/app/donate/page.tsx",
  "src/app/donate/confirm/page.tsx",
  "src/app/admin/login/page.tsx",
  "package.json"
];

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/Hello Life NGO/g, "Hello Life Foundation");
    content = content.replace(/HelloLife NGO/g, "Hello Life Foundation");
    content = content.replace(/HelloLife Admin/g, "Hello Life Foundation Admin");
    content = content.replace(/HelloLife Notifications/g, "Hello Life Foundation Notifications");
    content = content.replace(/HelloLife Logo/g, "Hello Life Foundation Logo");
    content = content.replace(/\| HelloLife/g, "| Hello Life Foundation");
    content = content.replace(/HelloLife \|/g, "Hello Life Foundation |");
    content = content.replace(/HelloLife staff/g, "Hello Life Foundation staff");
    content = content.replace(/admin@hellolife\.org/g, "admin@hellolifefoundation.org");
    content = content.replace(/HelloLife as a volunteer/g, "Hello Life Foundation as a volunteer");
    content = content.replace(/"name": "hellolife"/g, '"name": "hello-life-foundation"');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
}
