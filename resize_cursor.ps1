
try {
    Add-Type -AssemblyName System.Drawing
    $sourcePath = "c:\Users\user\Documents\‫תבניות מותאמות אישית של Office‬\images\dragon-cursor-optimized.png"
    $destPath = "c:\Users\user\Documents\‫תבניות מותאמות אישית של Office‬\images\cursor-final.png"
    
    Write-Host "Loading image from $sourcePath"
    $img = [System.Drawing.Image]::FromFile($sourcePath)
    
    Write-Host "Resizing to 32x32..."
    $canvas = New-Object System.Drawing.Bitmap(32, 32)
    $graph = [System.Drawing.Graphics]::FromImage($canvas)
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    
    $graph.DrawImage($img, 0, 0, 32, 32)
    
    Write-Host "Saving to $destPath"
    $canvas.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graph.Dispose()
    $canvas.Dispose()
    $img.Dispose()
    
    Write-Host "Success!"
} catch {
    Write-Error $_.Exception.Message
}
