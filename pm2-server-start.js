const { start } = require ('./server')

const startServer = async() => {
    await start();
}
startServer().then((server) => {
    console.log("server started ");
}).catch((error) =>{
    console.error("Error in server start");
});
