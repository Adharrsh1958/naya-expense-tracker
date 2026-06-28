$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$launcher = Join-Path $root "run-naya.cmd"
$shell = New-Object -ComObject WScript.Shell

$desktop = [Environment]::GetFolderPath("Desktop")
$startMenu = Join-Path ([Environment]::GetFolderPath("Programs")) "Naya Expense Tracker"
New-Item -ItemType Directory -Force -Path $startMenu | Out-Null

$shortcuts = @(
  (Join-Path $desktop "Naya Expense Tracker.lnk"),
  (Join-Path $startMenu "Naya Expense Tracker.lnk")
)

foreach ($path in $shortcuts) {
  $shortcut = $shell.CreateShortcut($path)
  $shortcut.TargetPath = $launcher
  $shortcut.WorkingDirectory = $root
  $shortcut.Description = "Naya Expense Tracker"
  $shortcut.Save()
}

Write-Host "Naya Expense Tracker shortcuts installed."
