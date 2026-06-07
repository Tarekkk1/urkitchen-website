const fs = require("fs");
const path = require("path");

// Define the correct .htaccess content for Next.js routing
const htaccessContent = `
RewriteEngine On
RewriteBase /

# Security headers
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"

# GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

# Page routes
RewriteRule ^home/$ home/index.html [L]
RewriteRule ^categories/$ categories/index.html [L]
RewriteRule ^categories/([^/]+)/$ categories/[slug]/index.html [L]
RewriteRule ^products/$ products/index.html [L]
RewriteRule ^feature-products/$ feature-products/index.html [L]
RewriteRule ^feature-products/([^/]+)/$ feature-products/[slug]/index.html [L]
RewriteRule ^offer/$ offer/index.html [L]
RewriteRule ^notifications/$ notifications/index.html [L]
RewriteRule ^faq/$ faq/index.html [L]
RewriteRule ^about-us/$ about-us/index.html [L]
RewriteRule ^contact-us/$ contact-us/index.html [L]
RewriteRule ^privacy-policy/$ privacy-policy/index.html [L]
RewriteRule ^terms-conditions/$ terms-conditions/index.html [L]
RewriteRule ^user/profile/$ user/profile/index.html [L]
RewriteRule ^user/cart/$ user/cart/index.html [L]
RewriteRule ^user/address/$ user/address/index.html [L]
RewriteRule ^user/favorites/$ user/favorites/index.html [L]
RewriteRule ^user/wallet/$ user/wallet/index.html [L]
RewriteRule ^user/my-orders/$ user/my-orders/index.html [L]
RewriteRule ^user/my-orders/([^/]+)/$ user/my-orders/[id]/index.html [L]
RewriteRule ^user/refer/$ user/refer/index.html [L]

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
`;

// Define the target directory and file path
const distFolder = path.resolve(__dirname, "dist");
const outputPath = path.join(distFolder, ".htaccess");

// Ensure the `dist` folder exists
if (!fs.existsSync(distFolder)) {
  fs.mkdirSync(distFolder, { recursive: true });
}

// Write the .htaccess file in the `dist` folder
fs.writeFileSync(outputPath, htaccessContent, "utf8");
console.log(".htaccess file generated successfully in the dist folder");
