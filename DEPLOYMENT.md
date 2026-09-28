# Lacy Digital hosting

Production is hosted on Cloudflare Workers Static Assets, Worker `lacy-digital`.

- Primary domain: https://lacydigital.org
- Alternate domain: https://www.lacydigital.org
- Preview: https://lacy-digital.lazarbeamfortnite2.workers.dev
- Cloudflare account: be750c84bcffd12d3bed87a36a19b05c

## Publish updates

The GitHub repository stores source code. Git pushes do not publish Cloudflare updates.
In Cloudflare, open Workers & Pages → lacy-digital → New deployment.
Upload a folder containing the root HTML, CSS, and JavaScript files plus `assets/` and `demos/`, preserving folder paths.
Exclude `.git`, documentation, and any private files. Use the root assets directory, auto-trailing-slash HTML handling, and no SPA fallback.
Verify the preview, then both custom domains, package selection, contact form preparation, and booking link.

Cloudflare manages domain DNS and certificates. Do not restore the old GitHub Pages A records or CNAME.
