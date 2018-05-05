let mysql = require("mysql"); 
let inquirer = require ("inquirer");
let table = require("easy-table")
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'Bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id" + connection.threadId);
    startBuying();
 });




function printstuff (res){
    var table = new Table({
        head: ["item_id", "product_name", "department_name", "cost", "stock"],
        colWidths: [10, 45, 40, 8, 8]
    });
    for (i=0; i<res.length; i++) {
        table.push([res[i].item_id])
        // table.push([res[i].product_name])
        // table
    }
}  
console.log(table.toString());

var startbuying = function(){
    connection.query("SELECT * FROM products", function(err,res){
        printStuff(res);
        var ChoiceArray = [];
        for (var i=0; i <res.length; i++){
            ChoiceArray.push(res[i].product_name);
        }

        inquirer.prompt([{
            name:"item",
            type: "input",
            message: "what item would you like to purchase? (enter item Id)"
        },
            {
                name:"quantity",
                type:"input",
                message:"How many would you like to purchase?"
        
    
    }]).then(function(answer) {
            console.log(answer);
            var itemID = answer.item;
            console.log(itemID)
            var chosenItem = res[itemID-1];
            console.log(chosenItem);
            var newQuantity = chosenItem.stock_quantity - answer.quantity;
            if (newQuantity <=0) {
                connection.query("UPDATE products SET ? WHERE itemID = ?", [{stock_quantity: newQuantity}, itemID]);
                startBuying();
            } else {
                console.log("there are not enough in stock for you to purchase")
            }
        })

    })
};

     