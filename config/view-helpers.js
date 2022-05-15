const env = require("./environment");
const fs = require('fs');
const path = require('path');
//Helpers are basically functions which, can be used in views by passing them to locals.
// it will receive the express app instance
module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            //because we would remove '/' from path when we would pass as argument in assetPath function
            // in views, becasue in manifest we have key without forward slash
            return '/' + filePath;
        }

        // to access keys in parsed json object from the require file, we added [filePath],just like
        // we fetch any property of json object
        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}

//now we can call assetPath function in views, we will pass the path of the css, js files
// if the environment is development it will return same path, and if the environment is production
// it will return required path in public directory