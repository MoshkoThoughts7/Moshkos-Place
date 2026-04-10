$files = @("Timeline.html", "resource-pack.html", "script.js", "shared.js", "home.html")

foreach ($f in $files) {
    if (Test-Path $f) {
        try {
            $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $f))
            $utf8String = [System.Text.Encoding]::UTF8.GetString($bytes)
            $originalBytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($utf8String)
            [System.IO.File]::WriteAllBytes((Resolve-Path $f), $originalBytes)
            Write-Host "Fixed encoding for $f"
        } catch {
            Write-Host "Could not fix $f: $_"
        }
    }
}
