@echo off
echo DELETING OLD FILES...
cd ../../"distribution frontend"
for %%i in (*.*) do if not "%%i"==".gitignore" if not "%%i"==".htaccess" del /q "%%i"
echo DELETING /static...
rd static /S /Q
echo COPYING OVER...
cd ../frontend/artiscribe/build
xcopy . ..\..\..\"distribution frontend" /E /V /Q
cd ../../../"distribution frontend"
git add -A
echo COMMITTING CHANGES...
echo %1
git commit -m %1
echo PUSHING TO GITHUB...
git push origin master
cd ../frontend/artiscribe
echo FINISHED!