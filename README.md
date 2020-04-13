## HAPI - SEQUELIZE - PM2
____
### Overview

Built this application to demonstrate and understand the feasibility of integrating 
and working of below servers and frameworks

* Hapi server `https://hapi.dev/` - server framework to build web services, API 
* Sequelize `https://sequelize.org/` - ORM framework for Postgres, MySQL, MariaDB, 
SQLite and Microsoft SQL Server
* PM2 `https://pm2.keymetrics.io/` - process manager for a production grade system.

___
### Plugins & Extensions

Hapi works in a way that we can easily install the plugins and extension without 
doing a major change to server. Each plugin or extension will be build in a isolated 
way and can be integrated. If there is any change required for a particular plugin 
or for any fix there will be zero impact to the actual server, we need to update 
only the specific plugin. In case of any issues, we can directly unplug the 
plugin which caused the issue and other plugins will work without any issues. 
Mostly the extension and plugins will be in a form of configuration. Once we build 
the plugin or extension we can add the configuration to a manifest from where the Hapi 
server will detect and add for processing. As part of the feasibility study we add 
a database and logger an extension. These extensions will be used common across all plugins. 

#### Plugins 

_**customer-api**_

For demonstration purpose, I have built this sample plugin, wherein it will integrate with 
Hapi sever, sqlite3 using sequelize ORM. 

- Created an API which will add the customer information to sqlite database and returns the customer id. 
- Used Joi framework to do the validation. Here I have checked only the String validation, 
but Joi is the most powerfull tool to perform validation to incoming request. Done in various other projects
- Used Hapi family tools such as Boom, Hoek, inert, version, hapi-swagger which are 
basically used to enhance the framework capability.

#### Extension

_**database**_

For local development, I have used sqllite. The database will automatically initiates
by the configuration that is supplied by the manidfest file. It will be create a database and 
execute the migration scripts with the help of Sequelize ORM framework. Once done, the database object will be 
injected to the server.

_**log**_

Used winston logger. The winston logger will automatically initialises when the hapi server starts 
and added to the server properties and this will be used across various other plugins. 

___

### Usage

This project is built with **node version 13** 

`nvm use 13`  - if nvm is already installed. Otherwise, use the traditional way to install node 13

`npm install` - Install the dependencies

`npm run test` - Runs the test case, since most of the Hapi framework works in a configuration mode, tests are 
written for the routes and repositories only. 

`npm run start` - to start the application 

Swagger editor - `http://localhost:2000/documentation`

Swagger documentation - `http://localhost:2000/swagger.json`

Sample CURL 

`curl -X POST "http://localhost:2000/customer" \
 -H "accept: application/json" \
 -H "Content-Type: application/json" \
 -d "{\"firstName\": \"John\",\"lastName\" : \"Smith\"}"`
 
 
#### Running in PM2 mode - **be mindful while running in local machine**

`node pm2-server.js` 

used the below code, which will get the OS metrics and calculate the instances and memory requirment.

`const instances = require("os").cpus().length;
const maxMemory =  require('os').freemem() * 0.9 / instances;`

Once the server started in PM2 mode, we can visualise the system performance (bucket name may vary)
`https://app.pm2.io/bucket/5b29a9c1cb4ff1cbfed5f9ba/backend/overview/servers`

or use `pm2 list` - to list all the instance of this application. 
use `pm2 stop all` and `pm2 delete all` to clean up.
