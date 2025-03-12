# Script to fix file structure and import paths
# This script will move files to the correct locations and update import paths

# Set the root directory
$rootDir = "D:\SITES\vault.darco.studio"

# Backup the original [id].tsx file
Copy-Item -Path "$rootDir\pages\admin\edit-component\[id].tsx" -Destination "$rootDir\pages\admin\edit-component\[id].tsx.bak" -Force

# Replace the [id].tsx file with the corrected version
Copy-Item -Path "$rootDir\pages\admin\edit-component-corrected.tsx" -Destination "$rootDir\pages\admin\edit-component\[id].tsx" -Force

# Ensure MediaUploader is in the correct location
Copy-Item -Path "$rootDir\components\admin\MediaUploader-updated.tsx" -Destination "$rootDir\components\admin\MediaUploader.tsx" -Force

# Ensure supabaseStorage.ts is in the correct location
Copy-Item -Path "$rootDir\lib\supabaseStorage-updated.ts" -Destination "$rootDir\lib\supabaseStorage.ts" -Force

Write-Host "File structure fixed successfully!"
