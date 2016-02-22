//ver 1.5.4
#include "phase3head.h"

void purchase(char *string)
{
	char *field = (char *) malloc(10 * sizeof(char)); // For some reason field[10] broke my programme, so I had to do it this way instead
	char isbn2Find[14];
	int quan;
	int numPurchases = 0;
	int i, j;
	char delim[] = "&=";
	char *token;
	char *input = strstr(string, "=");
	sscanf(input, "%s", input); // David- Basically changing its name so it works with later parts of the function
	
	urlDecode(input);
	replaceChar(input, '+', ' ');

	// David from here
	char isbn[14] = "default";
	int quantity = 0;
	char name[40] = "default";
	char email[40] = "default";
	char encrypted[25] = "";
	char cCardNo[25] = "";
	char address[400] = "default";
	char date[30] = "Insert Date here";
	char time[20] = "Insert Time here";
	token = strtok(input, delim);
	strcpy(name, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy(email, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy(encrypted, token);
	decryptCardNum(encrypted, cCardNo); // passes in encrypted and a blank string in which the plain text card number is stored

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy(time, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy(date, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy(address, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	numPurchases = atoi(token);

	FILE *salesfptr = fopen("sales.txt", "r");
	if (salesfptr == NULL) // ie. if it doesn't exist, do...
	{
		salesfptr = fopen("sales.txt", "w+");
		fprintf(salesfptr, "Name\tDate\tTime\tE-mail\tCard#\tAddress\tISBN\tQuantity");
		fclose(salesfptr);
	}
	else fclose(salesfptr); // already exists so we close it in r mode so we can re-open it in a+ mode
	salesfptr = fopen("sales.txt", "a+");


	// Back to Labhras
	// At this point the string looks like this:
	// "&isbn=9781234567891&quan=2&isbn=..."

	token = strtok(NULL, delim);
	strcpy(field, token);

	for (i = 0; i < numPurchases; i++)
	{
		token = strtok(NULL, delim);
		strcpy(isbn2Find, token);
		token = strtok(NULL, delim);
		strcpy(field, token);
		token = strtok(NULL, delim);
		quan = atoi(token);
		// David:
		fprintf(salesfptr, "\n%s\t%s\t%s\t%s\t%s\t%s", name, date, time, email, cCardNo, address);
		fprintf(salesfptr, "\t%s\t%d", isbn2Find, quan);
		// Back to Labhras:

		for (j = 0; j < numBooks; j++)
		{
			if (!strcmp((aryptr + j)->isbn, isbn2Find)) // Remove the number of books bought from the inventory
			{
				(aryptr + j)->stock = (aryptr + j)->stock - quan;
			}
		}
		if ((i + 1) < numPurchases)
		{
			token = strtok(NULL, delim);
			strcpy(field, token);
		}
	}
	// The code below's only purpose is to bring the user back to the homepage
	printf("<html><head>"); 
	printf("<title>The Working Title Bookshop</title>");
	printf("<script type='text/javascript' src='../labhrasJS.js'></script>");
	printf("<script type='text/javascript' src='../davidJS.js'></script>");
	printf("<link rel = 'stylesheet' type = 'text/css' href = '../bookshop.css'>");
	printf("<body onload='checkoutComplete()'"); // Run a JS function to give an alert and redirect to the homepage
	printf("</body></html>");

}
int miniSearch(char *isbn) // This is an internal search engine, totally unrelated to the WIP MiniSearch in the JS
{
	int i;

	for (i = 0; i < numBooks; i++)
	{
		if (!strcmp(isbn, (aryptr + i)->isbn))
		{
			return i;
		}
	}
	return -1;
}

int search(char *query)
{
	char *delim = "&=";
	char *token;
	char waste;
	char field[40];
	char temp[4][101];
	int i;
	int numMatches = 0, matchFound = -1, mode;
	char *input = strstr(query, "=");
	sscanf(input, "%c%d%s", &waste, &mode, query);
	char toFind[7][101];
	/*
	toFind Index:
	->0 - ISBN
	->1 - Title
	->2 - Author
	->3 - Publisher
	->4 - Price
	->5 - Year
	->6 - Genre
	*/

	urlDecode(query);
	replaceChar(query, '+', ' ');

	webHead();
	if (!isAdmin) shopping();
	//printf("<input type='text' onkeypress='return alphaCheck(event, this)' onkeyup='browseSearch(this)' placeholder='Title or Author'><br>");

	printf("<table width='150px' id='allTheBooks'><tr><td>"); // Have a table to contain each book, and then the printBook function 
																// will do the rest of the formatting
	token = strtok(query, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	custStrLwr(token);
	strcpy(toFind[0], token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	custStrLwr(token);
	strcpy(toFind[1], token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	custStrLwr(token);
	strcpy(toFind[2], token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	custStrLwr(token);
	strcpy(toFind[3], token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	custStrLwr(token);
	strcpy(toFind[4], token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	custStrLwr(token);
	strcpy(toFind[5], token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	custStrLwr(token);
	strcpy(toFind[6], token);

	for (i = 0; i < numBooks; i++) // looping through each book
	{
		strcpy(temp[0], (aryptr + i)->title); // Change each string to lowercase
		custStrLwr(temp[0]);
		strcpy(temp[1], (aryptr + i)->author);
		custStrLwr(temp[1]);
		strcpy(temp[2], (aryptr + i)->publisher);
		custStrLwr(temp[2]);
		strcpy(temp[3], (aryptr + i)->genre);
		custStrLwr(temp[3]);
		if (mode) // == 1 -> Full search logic
		{ 
			/*
				This checks each field of the search, and checks it against the entries in the aryptr variable
			*/
			if ((!strcmp(toFind[0], (aryptr + i)->isbn) || !strcmp(toFind[0], "null")) &&
				((strstr(temp[0], toFind[1]) != NULL) || !strcmp(toFind[1], "null")) &&
				((strstr(temp[1], toFind[2]) != NULL) || !strcmp(toFind[2], "null")) &&
				((strstr(temp[2], toFind[3]) != NULL) || !strcmp(toFind[3], "null")) &&
				(((float)atof(toFind[4]) >= (aryptr + i)->price) || !strcmp(toFind[4], "null")) &&
				(((int)strtol(toFind[5], NULL, 10) == (aryptr + i)->year) || !strcmp(toFind[5], "null")) &&
				((strstr(temp[3], toFind[6]) != NULL) || !strcmp(toFind[6], "null")))
			{
				numMatches++;
				matchFound = i;
				printBook(*(aryptr + i), numMatches);
				printf("</td><td>");
				if (numMatches % 2 == 0) printf("</tr><tr><td>");
			}
		}
		else // For the mini-search logic, only check the title and author
		{
			if ((strstr(temp[0], toFind[1]) != NULL || strstr(temp[1], toFind[2]) != NULL))
			{
				numMatches++;
				matchFound = i;
				printBook(*(aryptr + i), numMatches);
				printf("</td><td>");
				if (numMatches % 2 == 0) printf("</tr><tr><td>");
			}
		}
	}

	if (numMatches == 0)
	{
		printf("No results matched your query!");
	}

	printf("</td></tr></table>");
	webFoot();

	if (numMatches != 1) return -1;

	return matchFound;
	//this way, -1 is returned if more or less than 1 result, and the index is returned for a single match
}

void custStrLwr(char *string) // Couldn't use _strlwr because it's MS-only, wrote this instead
{
	for (int i = 0; string[i] != '\0'; i++) string[i] = tolower(string[i]);
}

void listAll() // Loop through and print each book in the aryptr variable
{
	int i;

	webHead();
	if (!isAdmin) shopping();
	//printf("<input type='text' onkeypress='return alphaCheck(event, this)' onkeyup='browseSearch(this)' placeholder='Title or Author'><br>");

	printf("<table width='400px' id='allTheBooks'>");

	for (i = 1; i <= numBooks; i++)
	{
		if (i % 2 == 1)printf("<tr>");
		printf("<td>");
		printBook(*(aryptr + (i - 1)), i);
		printf("</td>");
		if (i % 2 == 0) printf("</tr>");
	}

	printf("</table>");
	webFoot();

}

void printBook(struct book abook, int count)
{
	/*table for the actual books*/
	printf("<table id = 'item%d'>", count);
	printf("<tr><td align = 'right'>ISBN</td><td class = 'isbn'>%s</td></tr>", abook.isbn);
	printf("<tr><td align = 'right'>Title</td><td class = 'title'>%s</td></tr>", abook.title);
	printf("<tr><td align = 'right'>Author</td><td class = 'author'>%s</td></tr>", abook.author);
	printf("<tr><td align = 'right'>Publisher</td><td>%s</td></tr>", abook.publisher);
	printf("<tr><td align = 'right'>Genre</td><td>%s</td></tr>", abook.genre);
	printf("<tr><td align = 'right'>Year</td><td>%d</td></tr>", abook.year);
	printf("<tr><td align = 'right'>Price</td><td class = 'price'>%.2f</td></tr>", abook.price);
	printf("<tr><td align='right'>Stock</td><td id='%s'>%d</td></tr>", abook.isbn, abook.stock);
	if (!isAdmin)
	{
		printf("<tr><td></td><td><input type = 'button' value = 'Add to Cart' onclick = 'addingToCart(\"item%d\")'></td></tr>", count);
	}
	else
	{

		printf("<tr><td><input type = 'button' value = 'Modify Book' onclick = 'editRecord(\"item%d\")'></td>", count);
		printf("<td><input type = 'button' value = 'Delete Book' onclick = 'deleteRecord(\"%s\")'></td></tr>", abook.isbn);
	}
	printf("</table>");
}

void webHead()
{
	printf("<!DOCTYPE html><html><head><meta charset = 'utf-8'><meta http - equiv = 'x-ua-compatible' content = 'IE=edge'>");
	printf("<title>The Working Title Bookshop</title>");
	printf("<meta name = 'description' content = 'Your One Stop Shop for All Your Reading Needs'>");
	printf("<meta name = 'viewport' content = 'width=device-width, initial-scale=1'>");
	printf("<link rel = 'stylesheet' href = '../bookshop.css'><link rel = 'stylesheet' href = '../listall.css'>");
	printf("<script src = '../labhrasJS.js'></script><script src = '../davidJS.js'></script>");
	printf("</head><body onload='menu(); stockAndPrice()'>");
	printf("<input type = 'checkbox' id = 'sliding-menu-toggle' name = 'sliding-menu-toggle'/>");
	printf("<label for = 'sliding-menu-toggle' id = 'sliding-menu-toggle-label'></label>");
	printf("<header>The Working Title</header><nav id = 'sliding-menu'><ul class = 'link-styles'></ul></nav>");
	printf("<form id='mainForm' METHOD=post ACTION='/cgi-bin/classProjectWebVersion.exe'>");
	printf("<input type='hidden' id='mainChoice' name='MainChoice' value=''>");
	printf("<input type='hidden' id='adminChoice' name='AdminChoice' value=''>");
	printf("<input type='hidden' id='otherData' name='OtherData' value=''>");
	printf("</form>");
}

void shopping()
{
	printf("<div id='shoppingCart'><div class = 'runningTotCart'>Books in Cart: <span id = 'totInCart'>0</span>");
	printf("<br>Total Price: <span id = 'totPrice'>0.00</span></div></br>");
	printf("<input type=button id = 'checkout' onclick = 'goToCheckout()' value = 'Checkout'><br>");
	//printf("<input type=button id = 'showHideCart' onclick = 'showHideCart()' value = 'Show/Hide Cart'>");
	printf("<table id = 'cart'><tr><td class = 'cartISBN'>ISBN</td><td class = 'cartTitle'>Title</td>");
	printf("<td class = 'cartQuan'>Quantity</td><td class = 'cartPrice'>Price</td></tr></table></div>");
	printf("<div id='page - content'>");
}

void webFoot()
{
	printf("</div></body></html>");
}