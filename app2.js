const url = require('url');
const Connection = require('pg').Pool;
const myconnect = new Connection({
    user:'lolhjxpokcsecd',
	host:'ec2-52-7-115-250.compute-1.amazonaws.com',
	database:'d4juj45rq7vo7c',
	password:'ea860c5f937749f03df02d976a849a39a82ac570ee10c4faab2be3ae165b0be8',
	port:'5432',
	ssl: {
		rejectUnauthorized: false,
  },
});
var queryResult;
myconnect.query('SELECT * FROM public."category"',(error,results)=>{
    if(error){
        console.log(error);
        return;
    }
    queryResult = results;
    console.log(results);
});
var queryResult1;
myconnect.query('SELECT * FROM public."customer"',(error,results)=>{
    if(error){
        console.log(error);
        return;
    }
    queryResult1 = results;
    console.log(results);
});

const express = require('express');
const app = express();
const path = require ('path');
const router = express.Router();
const port = process.env.PORT || 3000; 
app.use(express.static(path.join(__dirname,'public')));

router.get('/home',(req,res)=>{
   res.sendFile(path.join(__dirname +'/home.html'));
});
//customer
router.get('/customer',(req,res)=>{
	var q = url.parse(req.url,true);
	var qparams = q.query;
	console.log(qparams);
	if (qparams.cusid && qparams.cusname && qparams.cusaddr)
	{
		console.log(qparams);
		var queryString = `INSERT INTO public."customer" (customerid,customer_name,address,email,phone) 
			VALUES ('${qparams.cusid}','${qparams.cusname}','${qparams.cusaddr}','${qparams.cusemail}','${qparams.cusphone}')`; 
		console.log(queryString);
		myconnect.query(queryString, (error,results) => {if (error)
			{
				console.log(error);
				res.send('Error:Your Insert query has been Failed');
				return;
			}
				else console.log(results);
		});
		res.sendFile(path.join(__dirname + '/customer.html'));
	}
	else
		res.sendFile(path.join(__dirname + '/customer.html'));
});

router.get('/viewcustomer',(req,res)=>{
    var queryResult;
	myconnect.query('SELECT * FROM public."customer"',(error,results) => {
	if (error)
	{
		console.log(error);
		return;
	}
	queryResult = results;
	console.log(results);
	var tableRow = '';
	var i;
	for (i = 0; i < queryResult.rowCount; i++)
	{
		tableRow = tableRow + `<tr>
			<td >${queryResult.rows[i].customerid}</td>
			<td >${queryResult.rows[i].customer_name}</td>
			<td >${queryResult.rows[i].address}</td>
			<td >${queryResult.rows[i].email}</td>
			<td >${queryResult.rows[i].phone}</td>
		</tr>`;
	}
	res.send( `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/style.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
		<title>ATN Sales Management </title>
	</head>
	<body>
		<header>
			<div>
				<div><h1>ATN SALES MANAGEMENT </h1></div>
				<div>
					<ul>
						<li><a href="home"> Home</a></li>
						<li><a href="viewproduct"> View Product</a></li>
						<li><a href="viewcustomer"> View Customer</a></li>
						<li><a href="viewcategory"> View Category</a></li>
					</ul>
				</div>
				<div>
					<table>
						<tr>
						  <th>${queryResult.fields[0].name}</th>
						  <th>${queryResult.fields[1].name}</th>
						  <th>${queryResult.fields[4].name}</th>
						  <th>${queryResult.fields[2].name}</th>
						  <th>${queryResult.fields[3].name}</th>
						  
						</tr>
						${tableRow}
					  </table>
				</div>
			</div>
		</header>
	</body>
	</html>`);
});
});
//end customer


router.get('/product',(req,res)=>{
	var queryResult;
	myconnect.query('SELECT catename FROM public."category" ',(error,results) => {
	if (error)
	{
		console.log(error);
		return;
	}
	queryResult = results;
	console.log(results);
	var tableRow = '';
	var i;
	var selettag ='<select name="category">';
	for (i = 0; i < queryResult.rowCount; i++)
	{
		selettag += `<option>${queryResult.rows[i].catename}</option>`
	}
	selettag += "</select>";

	res.send( `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/style.css">
		<title>ADD A PRODUCT</title>
	</head>
	<body> 
		<header>
		<div>
			<div><h1>ATN ADD PRODUCT</h1></div>
			<div>
				<ul>
					<li><a href="home"> Home</a></li>
					<li><a href="viewproduct"> View Product</a></li>
					<li><a href="viewcustomer"> View Customer</a></li>
					<li><a href="viewcategory"> View Category</a></li>
				</ul>
			</div>
			<div>
				<ul>
					<li><a href="customer"><button>ADD A CUSTOMER</button></a></li>
					<li><a href="category"><button>ADD A CATEGORY</button></a></li>
					<li><a href="checkout"><button>CHECK-OUT/INVOICE</button></a></li>
				</ul>
			</div>
		</div>
	</header>
	<div>
		<form action="" method="get">
			<div>
				<label>Product ID<label>
					<br>
				<input type="text" value="" name="productid">
			</div>
			<div> 
				<label>Product Name<label>
					<br>
				<input type="text" value="" name="productname">
			</div>
			<div>
				<label>Product Category<label>
					<br>
				${selettag}
			</div>
			<div>
				<label>Product Price<label></label>
				<br>
				<input type="text" value="" name="productprice">
			</div>
			<div>
				<label>Product Descriptions<label>
					<br>
				<input type="textarea" value="" name="productdesc">
			</div>
			<input name="submit" type="submit" value="ADD PRODUCT">
		</form>
	</div>
	</body>
	</html>`);
	var q = url.parse(req.url,true);
	var qparams = q.query;
	console.log(qparams);
	if (qparams.productid && qparams.productname && qparams.category)
	{
		console.log(qparams);
		var queryString = `INSERT INTO product (id,product_name,category,price,description) 
			VALUES ('${qparams.productid}','${qparams.productname}','${qparams.category}','${qparams.productprice}','${qparams.productdesc}')`; 
		console.log(queryString);
		myconnect.query(queryString, (error,results) => {if (error)
			{
				console.log(error);
				res.send('Error:Your Insert query has been Failed');
				return;
			}
				else console.log(results);
		});
	}

});
});


router.get('/viewproduct',(req,res)=>{
    var queryResult;
	myconnect.query('SELECT * FROM public."product" ',(error,results) => {
	if (error)
	{
		console.log(error);
		return;
	}
	queryResult = results;
	console.log(results);
	var tableRow = '';
	var i;
	for (i = 0; i < queryResult.rowCount; i++)
	{
		tableRow = tableRow + `<tr>
			<td >${queryResult.rows[i].id}</td>
			<td >${queryResult.rows[i].product_name}</td>
			<td >${queryResult.rows[i].category}</td>
			<td >${queryResult.rows[i].price}</td>
			<td >${queryResult.rows[i].description}</td>
		</tr>`;
	}
	res.send( `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/style.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
		<title>ATN Sales Management </title>
	</head>
	<body>
		<header>
			<div>
				<div><h1>ATN SALES MANAGEMENT </h1></div>
				<div>
					<ul>
						<li><a href="home"> Home</a></li>
						<li><a href="viewproduct"> View Product</a></li>
						<li><a href="viewcustomer"> View Customer</a></li>
						<li><a href="viewcategory"> View Category</a></li>
					</ul>
				</div>
				<div>
					<table>
						<tr>
						  <th>${queryResult.fields[0].name}</th>
						  <th>${queryResult.fields[1].name}</th>
						  <th>${queryResult.fields[2].name}</th>
						  <th>${queryResult.fields[3].name}</th>
						  <th>${queryResult.fields[4].name}</th>
						</tr>
						${tableRow}
					  </table>
				</div>
			</div>
		</header>
	</body>
	</html>`);
});
});

//end product

//category
router.get('/category',(req,res)=>{
	var q = url.parse(req.url,true);
	var qparams = q.query;
	if (qparams.cateid && qparams.catename && qparams.catedesc)
	{
		console.log(qparams);
		var queryString = `INSERT INTO public."category" (cateid,catename) 
			VALUES ('${qparams.cateid}','${qparams.catename}')`; 
		myconnect.query(queryString, (error,results) => {if (error)
			{
				console.log(error);
				res.send('Error:Your Insert query has been Failed');
				return;
			}
		});
		res.sendFile(path.join(__dirname + '/category.html'));
	}
	else
		res.sendFile(path.join(__dirname + '/category.html'));
});
router.get('/viewcategory',(req,res)=>{
    var queryResult;
	myconnect.query('SELECT * FROM public."category" ',(error,results) => {
	if (error)
	{
		console.log(error);
		return;
	}
	queryResult = results;
	console.log(results);
	var tableRow = '';
	var i;
	for (i = 0; i < queryResult.rowCount; i++)
	{
		tableRow = tableRow + `<tr>
			<td >${queryResult.rows[i].cateid}</td>
			<td >${queryResult.rows[i].catename}</td>
		</tr>`;
	}
	res.send( `<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" href="/style.css">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato">
		<title>ATN Sales Management </title>
	</head>
	<body>
		<header>
			<div>
				<div><h1>ATN SALES MANAGEMENT </h1></div>
				<div>
					<ul>
						<li><a href="home"> Home</a></li>
						<li><a href="viewproduct"> View Product</a></li>
						<li><a href="viewcustomer"> View Customer</a></li>
						<li><a href="viewcategory"> View Category</a></li>
					</ul>
				</div>
				<div>
					<table>
						<tr>
						  <th>${queryResult.fields[0].name}</th>
						  <th>${queryResult.fields[1].name}</th>
						</tr>
						${tableRow}
					  </table>
				</div>
			</div>
		</header>
	</body>
	</html>`);
});
});
//end category


router.get('/checkout',(req,res) => {
	var q = url.parse(req.url,true);
	var qparams = q.query;
	if (qparams.form)
	{
		console.log(qparams.form);
		switch (qparams.form)
		{
			case "Add":
				myconnect.query(`SELECT * FROM public."product" WHERE public."product".id = '${qparams.productid}'`,
				(error,results) => {
					if (error)
					{
						console.log(error);
					}
					var productPrice = results.rows[0].price;
					var productName = results.rows[0].product_name;
					var total = qparams.quantity * productPrice
					myconnect.query(`SELECT * FROM public."customer" WHERE public."customer".phone = '${qparams.phone}'`,
					(error,results1) => {
					if (error)
					{
						console.log(error);
					}
					res.send(`<!DOCTYPE html>
					<html lang="en">
					<meta charset="UTF-8">
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<link rel="stylesheet" href="/style.css">
						<head> <title>Check-out/Invoice</title></head>
						<body>
						<header>
						<div>
							<div><h1>ATN SALES MANAGEMENT</h1></div>
							<div>
								<ul>
									<li><a href="home"> Home</a></li>
									<li><a href="viewproduct"> View Product</a></li>
									<li><a href="viewcustomer"> View Customer</a></li>
									<li><a href="viewcategory"> View Category</a></li>
								</ul>
							</div>
						</div>
					</header>
						<form action="checkout" method="get">
							<div>	
								<h1>Check-out/Invoice Information</h1>
								<label>Invoice ID</label>
								<input type="text" name="invoiceid" value="${qparams.invoiceid}">
								<label>Invoice Date</label>
								<input type="date" name="invoicedate" value="${qparams.invoicedate}">
								<h1>Check-out/Invoice Details</h1>
								<label>Product ID</label>
								<input type="text" name="productid" value="${qparams.productid}">
								<label>Product Name</label>
								<input type="text" name="productname" value="${results.rows[0].product_name}">
								<label>Price</label>
								<input type="text" name="price" value="${results.rows[0].price}">
								<label>Quantity</label>
								<input type="text" name="quantity" value="${qparams.quantity}">
								<label>Customer ID</label>
								<input type="text" name="cusid" value="${results1.rows[0].customerid}">
								<label>Name</label>
								<input type="text" name="cusname" value="${results1.rows[0].customer_name}">
								<label>Phone</label>
								<input type="text" name="phone" value="${qparams.phone}">
								<label>Address</label>
								<input type="text" name="address" value="${results1.rows[0].address}">
								<label>Email</label>
								<input type="text" name="email" value="${results1.rows[0].email}">
								<br><br>
								<label>Total</label>
								<input type="text" name="total" value="${total}">
								<br><br>
								<input type="submit" name="form" value="Submit">
							</div>
						</form>
						</body>
					</html>`);
					});
				});
				break;

			case"Submit":
			myconnect.query(`INSERT INTO public."invoice" (id, date, productid, cusid, quantity, total) VALUES ('${qparams.invoiceid}','${qparams.invoicedate}',
			'${qparams.productid}','${qparams.cusid}','${qparams.quantity}','${qparams.total}')`, 
			(error) => {
				if (error){
				console.log(error);
				}
				res.sendFile(path.join(__dirname + '/checkout.html'));	
			}); break;

			default: break;
		}
	} else{
		res.sendFile(path.join(__dirname + '/checkout.html'));
	}
});
app.use('/', router);

app.listen(port);