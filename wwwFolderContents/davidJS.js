//davidJS.js ver 1.4.2

if (sessionStorage.getItem('admin') === null)//if it doesn't exist, create it
{
	sessionStorage.setItem('admin', '0');
}

if (sessionStorage.getItem('attemptNo') === null)
{
	sessionStorage.setItem('attemptNo', '1');
}

function choose(choice)//test function that won't be included in final version
{
	document.getElementById('mainChoice').value = choice;
	document.getElementById('admin').value = sessionStorage.admin;
	document.getElementById('mainForm').submit();
}
function returnTime()
{
	var date = new Date();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	if ( hours < 10 )
	{
		hours = "0"+hours;
	}
	if ( minutes < 10 )
	{
		minutes = "0"+minutes;
	}
	if ( seconds  < 10 )
	{
		seconds = "0"+seconds;
	}
	date = hours +":"+ minutes +":"+ seconds;
	return date;
}

function returnDate()
{
	var date = new Date();
	var day = date.getDate();
	if (day < 10)
	{
		day = "0"+day;//concatenates a 0 to make 5 be 05 for human readability
	}
	var month = date.getMonth();
	month++;//month is returned between 0 and 11, not 1 and 12 like humans want
	if (month < 10)
	{
		month = "0"+month;//concatenates a 0 to make 5 be 05 for human readability
	}
	var year = date.getFullYear();
	date = day +"/"+ month +"/"+ year;
	return date;
}
function contUsValidate(choice)
{
	//put in client side validation here
	document.getElementById('contUsChoice').value = choice;
	document.getElementById('contUsAdmin').value = sessionStorage.admin;
	var selected = document.getElementById("contUsOption");
	document.getElementById('contUsDDB').value = selected.value;
	document.getElementById('contUsTime').value = returnTime();
	document.getElementById('contUsDate').value = returnDate();
	document.getElementById('query').value = document.getElementById('query').value.replace(/(\r\n|\n|\r)/gm," "); // Labhras here for this line
	document.getElementById('contactUsForm').submit();
}

function addBookValidate(choice)
{
	//put in client side validation here
	document.getElementById('addChoice').value = choice;
	document.getElementById('addIsAdmin').value = sessionStorage.admin;
	var selected = document.getElementById("addGenre");
	document.getElementById('addGenreDDB').value = selected.value;
	document.getElementById('adminAddForm').submit();
}

function encrypt( number )
{
	//window.alert("Called");
	number = parseFloat(number);
	var e = 61, n = 10579;//The 2 components of the public key
	var i = 0;
	var tot = 1;
	for (; i < (e); i++)
	{
		tot = (tot * number )%n;
	}
	tot = tot%n;
	//document.write("Changes to " + tot + " ?");
	return tot;
}

function encryptCardNum(card)
{
	card = card.toString();
	var chunk = card.match(/.{1,4}/g);//should turn 1234567890 into ["1234", "5678", "90"]
	var part = [];
	var i = 0;
	for ( i = 0; i < 4; i++)
	{
		chunk[i] = parseFloat(chunk[i]);
		part[i] = encrypt(chunk[i]);
		part[i] = part[i].toString();
		while (part[i].length < 4)
		{
			part[i] = 0 + part[i];
		}
	}
	var encrypted = part[0] +"~"+ part[1] +"~"+ part[2] +"~"+ part[3];
	//window.alert(encrypted);Used to test only
	return encrypted;
}

function logIn( choice )
{
	var entered = document.getElementById('logInAttempt').value;
	var attemptNum = parseInt(sessionStorage.attemptNo);
	//window.alert("Called");
	if (attemptNum > 3)
	{
		window.alert("You have used too many attempts.");
		return;
	}
	document.getElementById('logInChoice').value = choice;
	document.getElementById('logInAdmin').value = sessionStorage.admin;
	document.getElementById('logInForm').submit();
}

function logOut()
{
	sessionStorage.admin = 0;
	sessionStorage.attemptNo = 1;
	window.alert('You have successfully logged out');
	window.location = '../index.shtml';
}

function deleteRecord(isbn)
{
	if (sessionStorage.admin != 1)
	{
		window.alert("You do not have the authority to do this, please sign in first!");
		window.location ='adminLogin.shtml';
		return;
	}
	
	var ans = window.confirm("Are you sure you want to delete this record?\n Once gone, it cannot be recovered.");
	if (ans == true)
	{
		//delete book
		document.getElementById('mainChoice').value = 8;
		document.getElementById('adminChoice').value = sessionStorage.admin;
		document.getElementById('otherData').value = isbn;
		document.getElementById('mainForm').submit();
		return;
	}
	else
	{
		window.alert("The book record was not deleted");
		return;
	}
}

function editRecord(bookID)
{
	//window.alert("Test");
	if (sessionStorage.getItem('isbn') === null)//if it doesn't exist, create it
	{
		sessionStorage.setItem('isbn', 'default');
	}
	if (sessionStorage.getItem('title') === null)//if it doesn't exist, create it
	{
		sessionStorage.setItem('title', 'default');
	}
	if (sessionStorage.getItem('author') === null)//if it doesn't exist, create it
	{
		sessionStorage.setItem('author', 'default');
	}
	if (sessionStorage.getItem('publisher') === null)//if it doesn't exist, create it
	{
		sessionStorage.setItem('publisher', 'default');
	}
	if (sessionStorage.getItem('genre') === null)//if it doesn't exist, create it
	{
		sessionStorage.setItem('genre', 'default');
	}
	if (sessionStorage.getItem('year') === null)//if it doesn't exist, create it
	{
		sessionStorage.setItem('year', 'default');
	}
	if (sessionStorage.getItem('price') === null)//if it doesn't exist, create it
	{
		sessionStorage.setItem('price', 'default');
	}
	if (sessionStorage.getItem('stock') === null)//if it doesn't exist, create it
	{
		sessionStorage.setItem('stock', 'default');
	}
	sessionStorage.isbn = document.getElementById(bookID).rows[0].cells[1].innerHTML;
	sessionStorage.title = document.getElementById(bookID).rows[1].cells[1].innerHTML;
	sessionStorage.author = document.getElementById(bookID).rows[2].cells[1].innerHTML;
	sessionStorage.publisher = document.getElementById(bookID).rows[3].cells[1].innerHTML;
	sessionStorage.genre = document.getElementById(bookID).rows[4].cells[1].innerHTML;
	sessionStorage.year = document.getElementById(bookID).rows[5].cells[1].innerHTML;
	sessionStorage.price = document.getElementById(bookID).rows[6].cells[1].innerHTML;
	sessionStorage.stock = document.getElementById(bookID).rows[7].cells[1].innerHTML;
	//window.open('http://localhost/WorkingTitle/editRecords.shtml','_self');
	window.location = '../editRecords.shtml';
	//Now that it has saved all the book's details to session storage, we can go to the edit records page
}

function editRecordValidate(choice)
{
	document.getElementById('editChoice').value = choice;
	document.getElementById('editAdmin').value = sessionStorage.admin;
	document.getElementById('editForm').submit();
}

function checkIsPurComplete()
{
	if ((checkoutForm.purName.value.length != 0) && (checkoutForm.purEmail.value.length != 0) 
		&& (checkoutForm.purCardNo.value.length != 0) && (checkoutForm.purAddress.value.length != 0)) return true;
	else return false;
}

function formSubmitted() // Small function to be run after the checkout is completed - runs on a page written by the CGI
{
    alert('It has been submitted and we will get back to you as soon as possible\n\nYou will now be redirected to the homepage!');
    window.location = '../index.shtml';
}