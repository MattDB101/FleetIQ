cd "C:\Users\Matt\Documents\FleetIQ\FleetIQ - dev"
call npm run build
call firebase deploy --only hosting
pause