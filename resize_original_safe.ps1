
try {
    Add-Type -AssemblyName System.Drawing
    $sourcePath = "C:\Users\user\original_cursor_temp.png"
    $destPath = "C:\Users\user\original_cursor_resized.png"
    
    Write-Host "Loading image from $sourcePath"
    $img = [System.Drawing.Image]::FromFile($sourcePath)
    
    Write-Host "Resizing to 64x64..."
    $canvas = New-Object System.Drawing.Bitmap(64, 64)
    $graph = [System.Drawing.Graphics]::FromImage($canvas)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    $graph.DrawImage($img, 0, 0, 64, 64)
    
    Write-Host "Saving to $destPath"
    $canvas.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graph.Dispose()
    $canvas.Dispose()
    $img.Dispose()
    
    Write-Host "Success!"
} catch {
    Write-Error $_.Exception.Message
}
