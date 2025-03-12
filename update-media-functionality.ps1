# Script to update media upload functionality files
# This script moves the updated files to replace the existing ones

# Function to copy a file with backup
function Copy-WithBackup {
    param (
        [string]$source,
        [string]$destination
    )
    
    # Create backup if destination exists
    if (Test-Path $destination) {
        $backupPath = "$destination.bak"
        Write-Host "Creating backup: $backupPath"
        Copy-Item -Path $destination -Destination $backupPath -Force
    }
    
    # Copy the file
    Write-Host "Copying $source to $destination"
    Copy-Item -Path $source -Destination $destination -Force
}

# Set the root directory
$rootDir = "D:\SITES\vault.darco.studio"

# Update supabaseStorage.ts
Copy-WithBackup -source "$rootDir\lib\supabaseStorage-updated.ts" -destination "$rootDir\lib\supabaseStorage.ts"

# Update MediaUploader component
Copy-WithBackup -source "$rootDir\components\admin\MediaUploader-updated.tsx" -destination "$rootDir\components\admin\MediaUploader.tsx"

# Update edit component page
Copy-WithBackup -source "$rootDir\pages\admin\edit-component-temp.tsx" -destination "$rootDir\pages\admin\edit-component\[id].tsx"

# Update API endpoints
Copy-WithBackup -source "$rootDir\pages\api\components\[id]-updated.ts" -destination "$rootDir\pages\api\components\[id].ts"

Write-Host "Media upload functionality update completed!"
