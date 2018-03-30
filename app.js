const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/analog.html");
});

//Rotating  watch hands
function tick() {
    var date = new Date();
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();

    var value = {
        secAngle: seconds * 6,
        minAngle: minutes * 6 + seconds * (360 / 3600),
        hourAngle: hours * 30 + minutes * (360 / 720)
    };
    return value;
}

//Client emit to call time function
io.on("connection", function(client) {
    client.on("time", function(data) {
        var result = tick();
        //Server emit back to client with hand rotation values
        io.sockets.emit("time", result);
    });
});


server.listen(process.env.PORT || 8000);
console.log(`server is running....`);