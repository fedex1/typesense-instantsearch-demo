#!
export NVM_DIR=$HOME/.nvm;
source $NVM_DIR/nvm.sh;
nvm use v18.18.2
# TARGET="rentals"
TARGET="elections"
# TARGET="voters"
# TARGET="socialsearch"
# TARGET="nycdelinquentproperty"
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

