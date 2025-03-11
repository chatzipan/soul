<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Soul Kitchen Bar Website
</h1>

### Netlify Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/263f593a-6adb-4395-a685-073fc3d6cf1c/deploy-status)](https://app.netlify.com/sites/comforting-kringle-dfc4ec/deploys)

### Copy Firestore from PROD

1. go to https://console.cloud.google.com/firestore/databases/-default-/data/panel/reservations/0p1Z0IpAoAGPy1vSNox1?project=soul-web-prod
2. From the sidebar click on "import/export"
3. click on "Export entire database"
4. Select Destination Bucket: soul-web-prod.appspot.com
5. click on "Export to Cloud Storage"
6. Goto your bucket: https://console.cloud.google.com/storage/browser?project=soul-web-prod. Select soul-web-prod.appspot.com
7. Download and replace the files all_namespaces_all_kinds.export_metadata, output-0 and firestore_export.overall_export_metadata.

### Deploy Functions:

1. first `firebase login --reauth`
2. then `npm run deploy`
