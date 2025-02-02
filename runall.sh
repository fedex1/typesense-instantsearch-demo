#!
# TARGET="rentals"
TARGET="elections"
cp src/app.${TARGET}.js src/app.js
npm run clean
npm run build${TARGET}
# npm run start${TARGET}

exit

cp src/app.elections.js src/app.js
# cp src/app.rentals.js src/app.js
# cp src/app.transcripts.js src/app.js
npm run clean
npm run buildelections
# npm run buildrentals
# npm run buildtranscripts

