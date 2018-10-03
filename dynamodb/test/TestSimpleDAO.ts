import SimpleDAO from "../src/SimpleDAO";
let dao = new SimpleDAO();
dao.ping();
(function runTest(){
   //testAddJsonData()
   let n: number;
   for (n = 1; n < 500; n++) {
    testQuery()
   }
   
})();

function testCreateTable(){
    dao.createTable()
}

function testListTables(){
    dao.listTables()
}
function testAddItemLowlevel(){
    dao.addEventItemLowLevelAPI("dm.file.create","100",1)  
}

function testAddItemDocClient(){
    let n: number;
    for (n = 1; n < 20; n++) {
        dao.addEventItemDocClient("dm.file.create", (n * 100)+"", n*10)
    }
}

function testQuery(){
    dao.getData("dm.file.create","100")
    dao.queryData("dm.file.create","1000","K")
}


function testAddJsonData(){
    class Payload{
        public data:string;
        ancestors:string[]
    }
    let p=new Payload();
    let acs=["parentFolder1K","grandparentFolder1K"]
    p.data="this is some payload";
    p.ancestors=acs;
    dao.addEventItemDocClient("dm.file.create", "1000",1,p) 
    
}

