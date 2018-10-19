import CacheControlNative from "../src/CacheControlNative";
function startServer() {
    let cc = new CacheControlNative();
    cc.startServer();

}

(function () {
    startServer()
})()