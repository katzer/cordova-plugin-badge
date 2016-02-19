#!/bin/sh

# nodemon --exec "sh" ./entrago.sh

catn8 --nowatch;

sleep 1;

catn8 --nowatch;

echo "copying m8 => entrago";

cp ./m8.js /Volumes/beesknees/client/entrago/cms/web_ui/lib/external/
