Write-Host "build"
ionic build
Write-Host "sync android"
npx cap sync android
Write-Host "cd android"
cd .\android
Write-Host "gradlew clean"
./gradlew clean
Write-Host "gradlew assembleDebug"
./gradlew assembleDebug
Write-Host "install android app"
adb -s R5CT207NLFL install -r app/build/outputs/apk/debug/app-debug.apk
cd ..