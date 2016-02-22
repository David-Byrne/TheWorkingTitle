//version 1.8.2
var cartEmpty = false;//variable to check if the cart is empty or not

function menu()//build the menu manually
{
    var admin = parseInt(sessionStorage.getItem('admin'));//get the value of the admin variable
    var newLi, newLink;
    var theList = document.getElementsByClassName('link-styles')[0];//the menu list, to be able to append list items
    if(admin != null)//small error check
    {
        newLi = document.createElement('li');// create a list item variable
        newLink = document.createElement('a');// create a link variable
		newLink.href = '../index.shtml';// set the link to point to the correct page
        newLink.innerHTML = 'Home';// set the text of the link
        newLi.appendChild(newLink);// append the link to the list item
        theList.appendChild(newLi);// append the list item to the full menu
// The code for the following list items is largely the same as the above
        newLi = document.createElement('li');
        newLink = document.createElement('a');
		newLink.href = '../bookSearch.shtml';
        newLink.innerHTML = 'Search';
        newLi.appendChild(newLink);
        theList.appendChild(newLi);

        newLi = document.createElement('li');
        newLink = document.createElement('a');
        newLink.href = 'javascript:listAll()';// just call the relevant JS function
        newLink.innerHTML = 'Browse All Books';
        newLi.appendChild(newLink);
        theList.appendChild(newLi);

        if(admin == 1)//admin only options
        {
            newLi = document.createElement('li');
            newLink = document.createElement('a');
            newLink.innerHTML = 'Add Book';
			newLink.href = '../adminAdd.shtml';
            newLi.appendChild(newLink);
            theList.appendChild(newLi);

            newLi = document.createElement('li');
            newLink = document.createElement('a');
            newLink.innerHTML = 'Log Out';
            newLink.href = 'javascript:logOut()';
            newLi.appendChild(newLink);
            theList.appendChild(newLi);
        }
        else// currently not logged in
        {
			newLi = document.createElement('li');
			newLink = document.createElement('a');
			newLink.href = '../contactUs.shtml';
			newLink.innerHTML = 'Contact Us';
			newLi.appendChild(newLink);
			theList.appendChild(newLi);
		
            newLi = document.createElement('li');
            newLink = document.createElement('a');
            newLink.innerHTML = 'Administrator Login';
			newLink.href = '../adminLogin.shtml';
            newLi.appendChild(newLink);
            theList.appendChild(newLi);
        }
    }
    else // Just in case there's a problem with the admin variable
    {
        alert('Oops, something went wrong...');
    }
}

function readCartContents(op)//op variable handles whether the call is coming from browsing/searching or checking out
{
    var table = document.getElementById('cart');
    var	cell1, cell2, cell3, cell4, aRow;
    var cellText1, cellText2, cellText3, cellText4;
    var items, numItems, curItem;
    var i, j;
    var quanMinus = new Array();
    var quanQuan, quanSpan;
    var quanPlus = new Array();
    var aTextNode;

    var cartContents = sessionStorage.getItem('cartContents');
    // these are the books that were in the cart before refreshing the page or going into checkout
    // it's a snapshot of the contents of the cart basically

    if(cartContents != null)
    {
        items = cartContents.split('$');
        numItems = items.length - 1; // the -1 is because the last item in the items array is just "", e.g. totally useless

        for(i = 0; i < numItems; i++)
        {
            curItem = items[i].split('|');

            /*
				An index of what's in each item, and the order
				curItem[0] = current book's ISBN
				curItem[1] = current book's Title
				curItem[2] = quantity of current book in the Cart
				curItem[3] = Sum total for the current book
				curItem[4] = ID for the quantity <span> element
				curItem[5] = ID for the price <span> element
            */

            aRow = document.createElement('tr'); // create a table row

            cell1 = document.createElement('td'); // create a table cell
            cell2 = document.createElement('td');
            cell3 = document.createElement('td');
            cell4 = document.createElement('td');

            cellText1 = document.createTextNode(curItem[0]);//ISBN text node
            cell1.appendChild(cellText1);

            cellText2 = document.createTextNode(curItem[1]);//Title text node
            cell2.appendChild(cellText2);

            quanMinus[i] = document.createElement('input');//the minus button
            quanMinus[i].type = 'button';
            quanMinus[i].value = 'X';

            quanMinus[i].id = curItem[4] + 'minus';
            quanMinus[i].onclick = (function(opt) {
                return function() {decrement(opt);};
            })(curItem[4]);	//courtesy of Stack Overflow
			/*
				The above line attaches the decrement function to the button in this row, so that it affects the stock in the current row.
				If I just did:
					quanMinus[i].onclick = function() {
						decrement(opt);
					}
				the button on each row would only affect the stock in the last row only.
			*/

            quanQuan = document.createTextNode(curItem[2]); // Quantity text node
            quanSpan = document.createElement('span');
            quanSpan.id = curItem[4];
            quanSpan.appendChild(quanQuan);

            quanPlus[i] = document.createElement('input'); // The plus button
            quanPlus[i].type = 'button';
            quanPlus[i].value = '+';
            quanPlus[i].onclick = (function(opt) {
                return function() {increment(opt);};
            })(curItem[4]);

            cellText3 = document.createElement('span'); // Building the complete cell data from each individual component above
            cellText3.appendChild(quanMinus[i]);
            cellText3.appendChild(quanSpan);
            cellText3.appendChild(quanPlus[i]);
            cell3.appendChild(cellText3);

            priceText = document.createTextNode(curItem[3]);
            cellText4 = document.createElement('span');
            cellText4.appendChild(priceText);
            cellText4.id = curItem[5];
            cell4.appendChild(cellText4);

            aRow.appendChild(cell1); // Building the full row data
            aRow.appendChild(cell2);
            aRow.appendChild(cell3);
            aRow.appendChild(cell4);

            table.getElementsByTagName('tbody')[0].appendChild(aRow); // Append the row to the cart table element
        }
        cartEmpty = false; // set this variable to false, indicating that there is something in the cart
        stockAndPrice(op); // Call the update function to create a div containing the max stock of each book, meaning that too many books can't be added
    }
}

function increment(y) // where y is the ISBN of the book, which is used in a few places to identify the book
{
    var quantity;
    var theValue;
    var stock;
    var bookIndex;

    stock = document.getElementById(y + 'stock').innerHTML; // Get stock from invisible element on page
    quantity = document.getElementById(y); // The span containing the stock in cart

    theValue = parseInt(quantity.innerHTML); // Actual numerical value of current stock level

    if((theValue + 1) <= parseInt(stock))
    {
        theValue++;
    }
    else // error checking
    {
        alert("Could not complete request! Insufficient stock!");
    }

    if(theValue == 2) // Change the button's value from 'X' to '-', showing that the book won't be removed when the decrement
    { 					// button is clicked
		var theButton = document.getElementById(y + 'minus');
        theButton.value = '-';
    }

    quantity.innerHTML = theValue;
    stockAndPrice();
}

function decrement(x) // x is the ISBN of the book, used for various IDs and classes
{
    var quantity = document.getElementById(x);
    var theValue = parseInt(quantity.innerHTML);
    var rowIndex = quantity.parentNode.parentNode.parentNode; // the row of this cart item

    if(theValue > 1)
    {
        theValue--;
        if(theValue == 1)
        {
            // change the button's value to delete
            var theButton = document.getElementById(x + 'minus');
            theButton.value = 'X';
        }
        quantity.innerHTML = theValue;
    }
    else // when (theValue - 1) == 0
    {
        // get rid of the book
        rowIndex.parentNode.removeChild(rowIndex); // remove the relevant row from the cart
		document.getElementById(x + 'stock').parentNode.removeChild(document.getElementById(x + 'stock')); // remove the invisible element
    } 																										// from the body
    stockAndPrice();
}

function stockAndPrice(op) // function to update background variables and the running total elements
{
	if(sessionStorage.admin != '1')
	{
		var stock = document.getElementById('totInCart'); // Total number of books in the cart
		var price = document.getElementById('totPrice'); // total price of the contents of the cart
		var itemTitle, itemISBN, itemPrice, itemQuan;
		var totalStock = 0, totalPrice = 0;
		var i = 0, x, y, bookID;
		var table = document.getElementById('cart');
		var limit = table.rows.length;
		var stockDiv, stockVal;
		var cartContents;
		if(limit == 1) // if you've removed the last book from the cart
		{
			cartEmpty = true;
		}

		if(cartEmpty == false)
		{
			for(i=1;i<limit;i++)
			{
				itemISBN = table.rows[i].cells[0].innerHTML;
				itemTitle = table.rows[i].cells[1].innerHTML;
				
				x = itemISBN; // again, the ISBN is used for element IDs
				y = document.getElementById(x);

				z = (x + 'Price');
				w = document.getElementById(z);

			   
				itemQuan = y.innerHTML;
				itemPrice = w.innerHTML;

				if(op != 1) // if the call is coming from anywhere but the Checkout page
				{
					// using "|" to separate fields, and "$" to separate books
					if(i == 1) // Create a string which will contain all the needed information to go to checkout
					 {
						cartContents = itemISBN + '|' + itemTitle + '|' + itemQuan + '|' + itemPrice + '|' + x + '|' + z + '$';
					}
					else
					{
						cartContents += itemISBN + '|' + itemTitle + '|' + itemQuan + '|' + itemPrice + '|' + x + '|' + z + '$';
					}

				}
				else // if the call is coming from the checkout page's onload event
				{
					stockVal = sessionStorage.getItem(itemISBN + 'stock'); // get the max stock of each book
					if(stockVal != null) // error checking
					{
						stockDiv = document.createElement('div'); 
						stockDiv.id = itemISBN + 'stock';
						stockDiv.innerHTML = stockVal;
						stockDiv.style.display = 'none'; // make it so that the div is on the page but not visible
						document.getElementsByTagName('body')[0].appendChild(stockDiv); // append the div to the page
					}
				}
				totalStock += parseInt(y.innerHTML); // Add the total stock to the running total
				totalPrice += parseInt(y.innerHTML) * parseFloat(w.innerHTML);
				totalPrice *= 100; // Because there is no "%.2f" in JavaScript, I was getting that the total price was "19.888888888888889" 
									// instead of "19.9". These 3 last steps give the value only two decimal places.
				totalPrice = Math.ceil(totalPrice);
				totalPrice /= 100;
			}

			sessionStorage.setItem('cartContents', cartContents); // set the concatenated string from above as the contents of a 
																	// sessionStorage variable
			stock.innerHTML = totalStock; // Update the elements on screen
			price.innerHTML = totalPrice;
		}
		else // if there are no books in the cart, set values to 0
		{
			stock.innerHTML = 0;
			price.innerHTML = '0.00';
		}
	}
}

function addingToCart(x)
{
    var book = document.getElementById(x);
    var rows = book.getElementsByTagName("tr");
    var cells, itemRow;
    var isbn, title, price, quantity;
    var cart = document.getElementById("cart"), aCell, textNode;
    var i, j;
    var match;
    var stockDiv;

    var rowLength = cart.rows.length;

    isbn = book.getElementsByClassName("isbn")[0].innerHTML;
    title = book.getElementsByClassName("title")[0].innerHTML;
    price = book.getElementsByClassName("price")[0].innerHTML;

    var bookQuanID;
    var bookPriceID = isbn + 'Price';

    for(i=1;i<rowLength;i++) // This tests if the book is already in the cart, if it is, just increment it rather than add it twice
    {
        var isbn2Test = cart.rows[i].cells[0].innerHTML;
        if(isbn == isbn2Test)
        {
            bookQuanID = isbn;
            increment(bookQuanID);
            stockAndPrice();
            return;
        }
    }
    bookQuanID  = isbn; // The ID of the span tag containing the amount in cart

    stockDiv = document.createElement('div');
    stock = parseInt(document.getElementById(isbn).innerHTML);
    stockDiv.style.display = 'none'; // Make this div non-visible onscreen
    stockDiv.id = isbn + 'stock';
    stockDiv.innerHTML = stock;
    sessionStorage.setItem(isbn + 'stock', stock);
    document.getElementsByTagName('body')[0].appendChild(stockDiv);

    var quanMinus = document.createElement('input'); // The button for the minus function
    quanMinus.type = 'button';
    quanMinus.value = 'X';

    quanMinus.id = bookQuanID + 'minus';
    quanMinus.onclick = function(){
        decrement(bookQuanID); // Unlike above, this can be set normally because it's not in a loop
    };

    var quanQuan = document.createTextNode('1'); // Default value of one book in the cart
    var quanSpan = document.createElement('span');
    quanSpan.id = bookQuanID;
    quanSpan.appendChild(quanQuan);

    var quanPlus = document.createElement('input');
    quanPlus.type = 'button';
    quanPlus.value = '+';
    quanPlus.onclick = function(){
        increment(bookQuanID);
    };


    var quanFull = document.createElement('span'); // create single span tag to contain everything

    quanFull.appendChild(quanMinus); // Append everything to this single span tag
    quanFull.appendChild(quanSpan);
    quanFull.appendChild(quanPlus);

    var priceFull = document.createElement('span'); // create span to hold the price, allows easy access to the price from the stockAndPrice function
    priceFull.id = bookPriceID;
    var price1 = document.createTextNode(price);
    priceFull.appendChild(price1);

    itemRow = document.createElement('tr');

    for(i=0;i<4;i++)
    {
        aCell = document.createElement('td');
        switch(i)
        {
            case 0:
                textNode = document.createTextNode(isbn);
                break;
            case 1:
                textNode = document.createTextNode(title);
                break;
            case 2:
                textNode = quanFull;
                break;
            case 3:
                textNode = priceFull;
                break;
        }

        aCell.appendChild(textNode);//appending above text nodes to the cell
        itemRow.appendChild(aCell);//appending above cell to the row
    }

    document.getElementById('cart').getElementsByTagName('tbody')[0].appendChild(itemRow);
    cartEmpty = false;
    stockAndPrice();
}

function searchSubmit(full) // 1 for full search (coming from the search page), 0 for mini-search
{
    var newField;
    var i;
    var fields = ['isbn', 'title', 'author', 'publisher', 'price', 'year', 'genre']; // array containing all fields
    var admin = sessionStorage.getItem('admin'); // This value needs to be passed to the CGI to get the correct buttons showing up

    if(admin != null)
    {
        document.getElementById('mainSearchChoice').value = 2; // the correct choice in the main menu in CGI
        document.getElementById('adminSearchChoice').value = parseInt(admin);
        document.getElementById('searchMode').value = full;
    }

    if(full == 1) // Full search
    { // Give each field a value of 'null' if they're empty, allows me to discount them later in the C
        if(document.getElementById('isbn').value == "") document.getElementById('isbn').value = 'null'; 
        if(document.getElementById('title').value == "") document.getElementById('title').value = 'null';
        if(document.getElementById('author').value == "") document.getElementById('author').value = 'null';
        if(document.getElementById('publisher').value == "") document.getElementById('publisher').value = 'null';
        if(document.getElementById('price').value == "") document.getElementById('price').value = 'null';
        if(document.getElementById('year').value == "") document.getElementById('year').value = 'null';
        if(document.getElementById('genre').value == "") document.getElementById('genre').value = 'null';
    }
    else // Mini Search
    { // This only needs values in the Title and Author inputs, otherwise it can be discounted
        for(i=0;i<7;i++)
        {
            newField = document.createElement('input');
            newField.name = fields[i];
            newField.type = 'hidden';
            if(i == 1 || i == 2)
            {
                newField.value = document.getElementById('query').value;
            }
            else
            {
                newField.value = 'null';
            }
            document.getElementById('searchForm').appendChild(newField);
        }
    }
    document.getElementById('searchForm').submit();
}
/* This was a WIP, wanted to make a more dynamic search, wasn't able to figure out all the logic
function browseSearch(query)
{
    var curQuery = query.value;
    var i;
    var curBook, curTitle, curAuthor;
    var numBooks = 2 * document.getElementById('allTheBooks').rows.length;//twice to account for there being 2 books per row
    var numInvis, cell1, cell2;

    for(i = 0; i < numBooks; i++)
    {
        curBook = document.getElementById('item' + (i + 1));
        curTitle = curBook.getElementsByClassName('title')[0].innerHTML;
        curAuthor = curBook.getElementsByClassName('author')[0].innerHTML;

        if(curTitle.indexOf(curQuery) != -1 || curAuthor.indexOf(curQuery) != -1)
        {
            curBook.parentNode.style.display = 'table-cell';
            //curBook.parentNode.parentNode.style.display = 'table-row';
        }
        else
        {
            curBook.parentNode.style.display = 'none';
            numInvis++;
            if(numInvis == 1 && i % 2 == 1)
            {

            }
        }
    }
}
*/
function listAll() // This is probably the simplest form, just the menu choice and admin variable to set
{
    var admin = sessionStorage.getItem('admin');

    if(admin != null)
    {
        document.getElementById('mainChoice').value = 6;
        document.getElementById('adminChoice').value = parseInt(admin);
        document.getElementById('mainForm').submit();
    }
}

function checkout()
{
    var cart = document.getElementById('cart');
    var numBooks = cart.rows.length;
    var submission = document.getElementById('checkoutForm');
    var newISBN, newQuan;
    var firstBookQuan;
    var admin = sessionStorage.getItem('admin');
	var formCheck = checkIsPurComplete(); // Separate Error checking function

    if(numBooks > 1 && admin != null && formCheck) // Will only execute if the error check returns true
    {
        document.getElementById('cOutChoice').value = 1;
        document.getElementById('cOutAdmin').value = parseInt(admin);
		document.getElementById('purTime').value = returnTime(); // Functions written by David to return Date and Time
        document.getElementById('purDate').value = returnDate();
		document.getElementById('purAddress').value = document.getElementById('purAddress').value.replace(/(\r\n|\n|\r)/gm," ");
		numPurchases = document.createElement('input');
        numPurchases.name = 'numPurchases';
        numPurchases.type = 'hidden';
        numPurchases.value = numBooks - 1; // The '- 1' is to account for the table header row
        submission.appendChild(numPurchases);

        for(i=1;i<numBooks;i++)
        {
			var isbn = cart.rows[i].cells[0].innerHTML;
            newISBN = document.createElement('input');
            newISBN.name = 'isbn' + i;
            newISBN.type = 'hidden';
            newISBN.value = isbn;
            submission.appendChild(newISBN);

            newQuan = document.createElement('input');
            newQuan.name = 'quan' + i;
            newQuan.type = 'hidden';
            newQuan.value = document.getElementById(isbn).innerHTML;
            submission.appendChild(newQuan);
        }
		var temp = encryptCardNum(document.getElementById('purCardNo').value); // encrypts it
        document.getElementById('purCardNo').value = temp; // the encrypted version is submitted instead
        submission.submit();
    }
    else if(numBooks == 1)
    {
        alert('You must have at least one book in your order.\n You will now be redirected to the Search Page!');
        window.location = '../bookSearch.shtml';
    }
	else
    {
        alert("Please review your order!");
    }
}

function checkoutComplete() // Small function to be run after the checkout is completed - runs on a page written by the CGI
{
    alert('Your order has been submitted!\n\nYou will now be redirected to the homepage!');
    window.location = '../index.shtml';
}

function goToCheckout() // The function to go from browsing/search to checkout
{
    var numBooks = document.getElementById('cart').rows.length;
    if(numBooks > 1) // If there's at least one book
    {
        window.location = '../checkout.html';
        stockAndPrice();
    }
    else
    {
        alert('You must have at least one book in the cart!');
    }
}
function isbnValid(testISBN) // Validate the ISBN using the standard formula
{
    var i;
    var checksum = 0;
    if(testISBN.length != 13) return false;

    for(i=0;i<testISBN.length;i++) // I know that the length is 13, but it's still better to check...
    {
        if(i%2 == 0)
        {
            checksum += (testISBN.charCodeAt(i) - 48); // to get the numbers from their ASCII values to their numerical values
        }
        else
        {
            checksum += 3 * (testISBN.charCodeAt(i) - 48); // The three or one accounts for the formula
        }
    } // The checksum will look like: (1*testISBN[0]) + (3*testISBN[1]) + (1*testISBN[2]) + (3*testISBN[3]) + (1*testISBN[4])
	//		+ (3*testISBN[5]) + (1*testISBN[6]) + (3*testISBN[7]) + (1*testISBN[8]) + (3*testISBN[9]) + (1*testISBN[10]) + 
	//		(1*testISBN[11]) + (1*testISBN[12])
	
    if(checksum % 10 == 0)
    {
        // alert('ISBN valid!');
        return true;
    }
    else
    {
        return false;
    }
}
function isbnCheck(e, x) // Actual error check for the ISBN
{
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode; // courtesy of Stack Overflow, compatible with IE and other browsers
    var actualChar = String.fromCharCode(charCode); // get the actual character
    var strlen = x.value.length + 1; // length of the new string, with the new character added in
    var validity = true;

    if((isNaN(actualChar) && charCode != 8 && charCode != 0) || (strlen > 13 && charCode != 8 && charCode != 0))
    { // if it's not a number, back space or delete key, and if there's more than 13 characters
    // don't print anything at all
        return false;
    }
    else if(strlen == 13)
    { // if the string's long enough, validate it
        validity = isbnValid(x.value + actualChar);
        if(validity == false)
        {
			x.setAttribute('data-isbn', 'true');
			x.style.borderColor = 'orange';
        }
		else
		{
			x.setAttribute('data-isbn', 'true');
			x.style.borderColor = 'green';
		}
		if(x.id.indexOf('add') != -1)
		{
			adminFunctionsValidCheck(0);
		}
		else if(x.id.indexOf('edit') != -1)
		{
			adminFunctionsValidCheck(1);
		}
        return true;
    }
}

function intCheck(e, x) // Error check to only allow integers
{
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    var actualChar = String.fromCharCode(charCode);
    var strlen = x.value.length + 1; // the extra 1 is to include the character that is currently being checked

    if(isNaN(actualChar) && charCode != 8 && charCode != 0 || (strlen > 16 && charCode != 8 && charCode != 0))
    { // if it's not a number, backspace or delete key, or if it's too long and you're not deleting
        return false;
    }
	if(x.id.indexOf('add') != -1)
	{
		if(x.id.indexOf('Year') != -1)
		{
			x.setAttribute('data-year', 'true');
		}
		else if(x.id.indexOf('Stock') != -1)
		{
			x.setAttribute('data-stock', 'true');
		}
		adminFunctionsValidCheck(0);
	}
	else if(x.id.indexOf('edit') != -1)
	{
		if(x.id.indexOf('Year') != -1)
		{
			x.setAttribute('data-year', 'true');
		}
		else if(x.id.indexOf('Stock') != -1)
		{
			x.setAttribute('data-stock', 'true');
		}
		adminFunctionsValidCheck(1);
	}
	else if(strlen == 1)
	{
		if(x.id.indexOf('Year') != -1)
		{
			x.setAttribute('data-year', 'true');
		}
		else if(x.id.indexOf('Stock') != -1)
		{
			x.setAttribute('data-stock', 'true');
		}
		return false;
	}
}

function checkCCard(e, x) // check the credit card
{
	var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
	var numLength = x.value.length;
	
	if((charCode > 57 || charCode < 48) && charCode != 8 && charCode != 0 || (charCode != 8 && charCode != 0 && numLength > 15))
	{
		return false;
    }
	else
	{
		if(numLength == 15)
		{
			x.style.borderColor = 'green';
			x.setAttribute('data-cCardValid', 'true'); // Used in a later function to allow the form to be submitted only
		}												// if all of the fields are 'true'
		else
		{
			x.style.borderColor = 'orange';
			x.setAttribute('data-cCardValid', 'false');
		}
	}
	checkContValid();
}

function floatCheck(e, x)
{
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    var numStops = 0; // number of full stops in string, cannot be greater than 1
    var numLength = x.value.length + 1; // length of the string/number
    var i;
    var curCharVal; // variable to keep track of each character in the string as it's looped through

    for(i = 0;i<numLength;i++)
    { // loop through each number to check it's not '.'
        curCharVal = x.value.charCodeAt(i);
        if(curCharVal == 46) numStops++; // if it is, increment numStops
    }

    if((charCode > 57 || charCode < 48) && charCode != 8 && charCode != 0 && charCode != 46)
    { // if the character is not a number or a full stop, or the back space or delete key, or if it's too long, don't print it
        return false;
    }
    else if(numStops == 1 && charCode != 8 && charCode != 0 && (charCode > 57 || charCode < 48))
    { // this means that one, and only one full stop can be printed
        return false;
    }
	else if(numLength > 20 && charCode != 8 && charCode != 0 && charCode != 46)
	{
		return false;
	}
	
	if(x.id.indexOf('add') != -1)
	{
		x.setAttribute('data-price', 'true');
		adminFunctionsValidCheck(0);
	}
	else if(x.id.indexOf('edit') != -1)
	{
		x.setAttribute('data-price', 'true');
		adminFunctionsValidCheck(1);
	}
}

function alphaCheck(e, x)
{
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    var strlen = x.value.length;
    var i;

    if(strlen < 4)
    {
        x.style.borderColor = 'orange';
		if(x.id.indexOf('add') != -1 || x.id.indexOf('edit') != -1)
		{
			if(x.id.indexOf('Title') != -1)	x.setAttribute('data-title', 'false');
			if(x.id.indexOf('Author') != -1)	x.setAttribute('data-author', 'false');
			if(x.id.indexOf('Pub') != -1)	x.setAttribute('data-publisher', 'false');
		}
		if(x.id.indexOf('Genre') != -1) x.setAttribute('data-optionValid', 'false');
    }
    else
    {
        x.style.borderColor = 'green';
		if(x.id.indexOf('add') != -1 || x.id.indexOf('edit') != -1)
		{
			if(x.id.indexOf('Title') != -1)	x.setAttribute('data-title', 'true');
			if(x.id.indexOf('Author') != -1)	x.setAttribute('data-author', 'true');
			if(x.id.indexOf('Pub') != -1)	x.setAttribute('data-publisher', 'true');
		}
		if(x.id.indexOf('Genre') != -1) x.setAttribute('data-optionValid', 'true');
    }
	
	if(x.id.indexOf('add') != -1)
	{
		adminFunctionsValidCheck(0);
	}
	else if(x.id.indexOf('edit') != -1)
	{
		adminFunctionsValidCheck(1);
	}

    if(strlen == 1) // Only allow one space at a time
	{
		if(charCode == 32) return false;
	}
	else
	{
		if(charCode == 32 && x.value.charCodeAt(strlen - 1) == 32) return false;
	}

    if((charCode > 90 || charCode < 65) && (charCode > 122 || charCode < 97) && (charCode > 57 || charCode < 48)
        && charCode != 8 && charCode != 32  && charCode != 44 && charCode != 46 && charCode != 0
		|| (strlen > 70 && charCode != 8 && charCode != 0))
    { // Only allow letters (upper- and lower-case), numbers and some punctuation
        return false;
    }
}

function searchCheck(e, x)
{
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    var strlen = x.value.length + 1;
    var i;
	
	if(strlen == 1 && charCode == 32) return false;
	
    for(i=0;i<strlen;i++)
    {
        if(charCode == 32 && x.value.charCodeAt(i-1) == 32)
		{
			return false;
		}
    }

    if((charCode > 90 || charCode < 65) && (charCode > 122 || charCode < 97) && (charCode > 57 || charCode < 48)
    && charCode != 8 && charCode != 32  && charCode != 44 && charCode != 46 && charCode != 0 
	|| (strlen > 50 && charCode != 8 && charCode != 0))
    {
        return false;
    }
}

function emailCheck(email) // means that the email field needs a '@' and a '.'
{
    var emaillen=email.value.length;
    var emailat=email.value.indexOf("@");
    var emaildot=email.value.indexOf(".");

    if(emaillen < 10 || emailat < 0 || emaildot < 0)
    {
        email.style.borderColor = 'orange';
		email.setAttribute('data-emailValid', 'false');
    }
    else
    {
        email.style.borderColor = 'green';
		email.setAttribute('data-emailValid', 'true');
	}
	checkContValid(); // The function which validates the form
}

function queryCheck(x)
{
    var strlen = x.value.length;
	
	if(strlen < 10)
	{
		x.style.borderColor = 'orange';
		x.setAttribute('data-queryValid', 'false');
    }
    else
    {
        x.style.borderColor = 'green';
		x.setAttribute('data-queryValid', 'true');
	}
	checkContValid();
}

function optionVal(x) // An option must be selected
{
	var sel = x.options[x.selectedIndex].value;
	
	if(sel == 0)
	{
		x.style.borderColor = 'orange';
		x.setAttribute('data-optionValid', 'false');
    }
    else
    {
        x.style.borderColor = 'green';
		x.setAttribute('data-optionValid', 'true');
		if(x.id.indexOf('add') != -1)
		{
			adminFunctionsValidCheck(0);
		}
		checkContValid();
    }
}

function actualAlphaCheck(e, x) // Allow only letters
{
    var charCode = (typeof e.which == "number") ? e.which : e.keyCode;
    var strlen = x.value.length;

    if(strlen < 4)
    {
        x.style.borderColor = 'orange';
		if(x.id == 'fullname' || x.id == 'purName')
		{
			x.setAttribute('data-nameValid', 'false');
			checkContValid();
		}
    }
    else
    {
        x.style.borderColor = 'green';
		if(x.id == 'fullname' || x.id == 'purName')
		{
			x.setAttribute('data-nameValid', 'true');
			checkContValid();
		}
    }

    if((charCode > 90 || charCode < 65) && (charCode > 122 || charCode < 97) && charCode != 8
        && charCode != 32  && charCode != 44 && charCode != 0 || strlen > 399)
    {
        return false;
    }
}

function checkContValid()
{ // also works for the Checkout page
	var name, email, option, query, cCard, address;
	var queryParent = null;
	
	if(document.getElementById('purName') != null) // If working from the Checkout page
	{
		name = document.getElementById('purName').getAttribute('data-nameValid');
		email = document.getElementById('purEmail').getAttribute('data-emailValid');
		cCard = document.getElementById('purCardNo').getAttribute('data-cCardValid');
		address = document.getElementById('purAddress').getAttribute('data-addressValid');
	}
	else if (document.getElementById('fullname') != null) // If working from the contact us form
	{
		name = document.getElementById('fullname').getAttribute('data-nameValid');
		email = document.getElementById('contUsEmail').getAttribute('data-emailValid');
		option = document.getElementById('contUsOption').getAttribute('data-optionValid');
		query = document.getElementById('query').getAttribute('data-queryValid');
	}
	
	if(name == 'true' && email == 'true' && option =='true' && query == 'true') // enable contact us button
	{
		document.getElementById('contUsSubmit').disabled = false; // Enable the submit button
	}
	else if (name == 'true' && email == 'true' && cCard == 'true' && address == 'true') // enable checkout button
	{
		document.getElementById('checkout').disabled = false;
	}
}

function addressValid(x) // Validate the address
{
    var len = x.value.length;
	
    if(len < 15) // While the field's length is shorter than 15
    {
        x.style.border = 'orange'; // Visual indicator
		if(x.id == 'purAddress')
		{
			x.setAttribute('data-addressValid', 'false');
			checkContValid();
		}
	}
	else
	{
		x.style.border = 'green';
		if(x.id == 'purAddress')
		{
			x.setAttribute('data-addressValid', 'true');
			checkContValid();
		}
	}
}

function adminFunctionsValidCheck(which) // which is 0 for adding, 1 for editing
{
	var title, author, publisher, stock, price, year, isbn, genre;
	var titleVal, authorVal, publisherVal, stockVal, priceVal, yearVal, isbnVal, genreVal;
	var theButton;
	
	
	if(!which) // for adding to inventory
	{
		title = document.getElementById('addTitle');
		author = document.getElementById('addAuthor');
		publisher = document.getElementById('addPub');
		stock = document.getElementById('addStock');
		price = document.getElementById('addPrice');
		year = document.getElementById('addYear');
		isbn = document.getElementById('addISBN');
		genre = document.getElementById('addGenre');
		theButton = document.getElementById('addSubmit');
	}
	else // For editing a book's detail
	{
		title = document.getElementById('editTitle');
		author = document.getElementById('editAuthor');
		publisher = document.getElementById('editPub');
		stock = document.getElementById('editStock');
		price = document.getElementById('editPrice');
		year = document.getElementById('editYear');
		genre = document.getElementById('editGenre');
		theButton = document.getElementById('editSubmit');
	}
	// Get the value of the HTML data attributes of each field
	titleVal = title.getAttribute('data-title');
	authorVal = author.getAttribute('data-author');
	publisherVal = publisher.getAttribute('data-publisher');
	stockVal = stock.getAttribute('data-stock');
	priceVal = price.getAttribute('data-price');
	yearVal = year.getAttribute('data-year');
	if (!which) // The ISBN is only checked if you're adding a book
	{			// otherwise it's ignored and assumed to be true
		isbnVal = isbn.getAttribute('data-isbn');
	}
	else
	{
		isbnVal = 'true';
	}
	genreVal = genre.getAttribute('data-optionValid');
	
	if(titleVal == 'true' && authorVal == 'true' && publisherVal == 'true' && stockVal == 'true' && 
		priceVal == 'true' && yearVal == 'true' && isbnVal == 'true' && genreVal == 'true')
	{
		theButton.removeAttribute('disabled'); // Enable when all checks are passed
	}
	else
	{
		theButton.disabled = true; // Disable the button if an error
	}								// check fails
}
function loadAdmin() // mode is 0 for adding and 1 for editing
{
	var currentPage = window.location.pathname; // Get the current URL
	if(currentPage.indexOf('editRecords.shtml') != -1) // Check if it's this page
	{ // Given that the edit page gives default values to each field, it can be assumed that the fields are valid by default
		document.getElementById('editTitle').setAttribute('data-title', 'true');
		document.getElementById('editAuthor').setAttribute('data-author', 'true');
		document.getElementById('editPub').setAttribute('data-publisher', 'true');
		document.getElementById('editStock').setAttribute('data-stock', 'true');
		document.getElementById('editPrice').setAttribute('data-price', 'true');
		document.getElementById('editYear').setAttribute('data-year', 'true');
		document.getElementById('editGenre').setAttribute('data-optionValid', 'true');
		document.getElementById('editISBN').setAttribute('data-isbn', 'true');
		
		adminFunctionsValidCheck(1);
	}
}