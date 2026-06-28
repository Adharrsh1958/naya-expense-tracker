$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $root "index.html"
$indexUrl = (New-Object System.Uri($indexPath)).AbsoluteUri

$browsers = @(
  "$env:ProgramFiles(x86)\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
  "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
  "$env:ProgramFiles(x86)\Google\Chrome\Application\chrome.exe"
)

$browser = $browsers | Where-Object { Test-Path $_ } | Select-Object -First 1

if ($browser) {
  Start-Process -FilePath $browser -ArgumentList "--app=$indexUrl","--user-data-dir=$root\profile"
} else {
  Invoke-Item $indexPath
}
