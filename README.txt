Naya Expense Tracker
=====================

A private, local-first expense tracker with fast entry, trip splitting,
subscriptions, budgets, and spending insights. Works fully offline once
loaded, and installs like a native app on Android, iOS, and desktop.

It starts empty -- no preset expenses, trips, subscriptions, or splits.
All data is stored only in your browser's local storage on that device.
Nothing is ever uploaded anywhere. Use Settings > Backup & Restore to
export/import a JSON backup, especially before switching phones.


INSTALL ON ANDROID / PHONE (recommended)
-----------------------------------------
1. Host the folder somewhere reachable over HTTPS (GitHub Pages, Netlify,
   Vercel, or your own server all work) -- a service worker requires
   HTTPS (or localhost) to register.
2. Open the URL in Chrome on Android.
3. Tap the menu (⋮) > "Install app" or "Add to Home screen".
4. Naya now opens full-screen with its own icon, exactly like a Play
   Store app, and keeps working with no signal.

INSTALL ON WINDOWS DESKTOP
---------------------------
1. Unzip the folder.
2. Double-click install-windows.cmd to create a desktop/Start Menu
   shortcut, or run-naya.cmd for a one-off portable launch.

MANUAL / LOCAL SERVER
----------------------
1. Unzip the folder.
2. Either open index.html directly in a browser, or serve it locally:
     python -m http.server 4173
   then open http://127.0.0.1:4173/
3. Use the browser's Install / Add to Home Screen option to add it as
   an app icon.


QUICK ENTRY EXAMPLES
---------------------
- 120 dosa
- received 500 from Rahul
- Rahul owes 400
- I owe Rahul 300


FIRST-TIME TUTORIAL
---------------------
A short, skippable 5-step tutorial runs automatically the first time the
app opens. Replay it any time from the bottom nav: More -> Tutorial.


FOLDER CONTENTS
-----------------
index.html               Main app shell
styles.css                All styling, including dark mode
app.js                    All application logic
manifest.webmanifest      PWA metadata (name, icons, theme colors)
service-worker.js         Offline caching
icon.svg / icon-maskable.svg   Source icons
icons/                    Generated PNG icons (48-512px, incl. maskable)
README.txt                This file
install-windows.cmd/.ps1  Windows shortcut installer
run-naya.cmd/.ps1         Windows portable launcher
