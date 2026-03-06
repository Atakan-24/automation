Write-Host "Starting backup..."

$source = "C:\Users\Administrator\projects"
$destination = "C:\Users\Administrator\backup"

New-Item -ItemType Directory -Force -Path $destination

Copy-Item $source -Destination $destination -Recurse -Force

Write-Host "Backup completed."