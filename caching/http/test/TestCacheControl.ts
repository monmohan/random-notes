import CacheControlMaxAge from "../src/CacheControlMaxAge";
import CacheControlNative from "../src/CacheControlNative";
import LastModifiedHeader from "../src/LastModifiedHeader";
function testwithNativeHttp() {
    let cc = new CacheControlNative();
    cc.startServer();

}


function testMaxAge() {
    let cc = new CacheControlMaxAge();
    cc.startServer();

}

function testLastMod() {
    let cc = new LastModifiedHeader();
    cc.startServer();

}

(function () {
    //testMaxAge()
    //testLastMod()
    testwithNativeHttp()
})()