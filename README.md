##Installation
1. make sure you have MongoDB, Node, Npm, Bower and Grunt installed.
2. clone the repo and use the 'npm install' command to install server dependencies. 
3. run 'bower install' to install front-end dependencies
4. Project uses sass and compass as well so you may need to install those if you want to edit the css

###Populate Database
'mongod' to start mongoDB
in application directory root type 'mongoimport --db sachash --collection nbhoods --type json --file app/scripts/models/neighborhoods.json --jsonArray'

###Starting the server
type 'grunt' in the command line

###Notable files
so far the only files really in use are server/app.js for the back end stuff and app/scripts/application.js for front end
