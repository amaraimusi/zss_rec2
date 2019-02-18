@echo off
ECHO My composer Start
ECHO waite 1 minute ... 

cd /d %~dp0
chdir
C:\xampp\php\php.exe composer.phar update

ECHO OK
PAUSE > NUL