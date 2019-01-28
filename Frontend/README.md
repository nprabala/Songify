# Local Server Instructions

This folder contains files needed to run an Angular JS based Node JS server that uses express. Some assembly required.

## Installations


### Remote

Our frontend is now hosted on a remote AWS Elastic Beanstalk instance. You can find it at: 

http://mixtape-env.un6w2kxpp2.us-east-2.elasticbeanstalk.com/

Configuring and redeploying is slightly difficult at the moment, so for simple, purely frontend features, I would still recommend local testing. 


The instance is contained in the Application Manager on AWS. You will probably need several layers of credentials to access it, so if you do need, ask me and we'll set something up.

To redeploy new versions of the code, you should follow the steps contained on the help page, and redescribed below.

1. Compress all of your project files into a zip folder. Do not compress from the highest level (ie your project folder itself), but from the layer below it.
2. Navigate to the Instance Dashboard in the Manager and click the Upload and Deploy button. We're currently using a simple numerical scheme for version naming, but might switch to more meaningful date-based conventions later on.
3. Make sure that you also include your node_modules folder. The npm start, install, and other initialization features for Elastic Beanstalk are known to be iffy. 
4. Ensure that your package.json is also in your zip folder.
5. Wait a minute or two, and the code should be redeployed to the remote site! 

Frontend.zip in this repository should always contain the latest stable release of our frontend code, though it may not always reflect what is loaded to the instance as we test new code on the server.

#### Command Line Interface

I am currently figuring out the right way to install and configure redeployment and management from a CLI tool. Will post more details as they are forthcoming.

### Local

You need to make sure that you have Node JS configured on your system along with the package manager npm. If you have them already, great! 
If not, then be sure to use the links below.

https://nodejs.org/en/

https://www.npmjs.com/get-npm

Afterwards, be sure to navigate to this folder (JS_frontend) on your local machine and install angular and express. 

``` 
    npm install express
    npm install angular
```


To run the server, type in `node server.js`.

Afterwards, navigate to localhost:3000, and you should be served a page with other links. Use the browser inspector to debug and navigate any error messages.


