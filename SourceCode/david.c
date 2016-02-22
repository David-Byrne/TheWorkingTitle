//ver 1.7.2
#include "phase3head.h"

void initArray()
{
	strcpy(fileLoc, "books100.txt");//sets variable fileLoc to the location of the books file
	FILE *fptr = fopen(fileLoc, "r");
	int i = 0;
	char temp[500];
	int j = 0;
	int cntr = 0;
	char *token;
	char delim[5] = "\t";
	//char tempdate[10];

	if (fptr == NULL)
	{
		printf("Error opening file ! \n");
	}

	while (!feof(fptr))
	{
		fgets(temp, 500, fptr);//reads in one line at a time to find the number of lines in the file
		i++;
	}

	numBooks = i - 1; //-1 due to first line of text file not being a book and the last line being blank
	aryptr = (struct book *)malloc(numBooks*sizeof(struct book));//allocates block of memory to array of book structures
	fseek(fptr, 0, SEEK_SET);//goes back to start of file
	fgets(temp, 500, fptr);//reads in pointless opening line

	for (j = 0; j < numBooks; j++)
	{
		*fgets(temp, 700, fptr);
		token = strtok(temp, delim);
		strcpy((aryptr + j)->isbn, token);

		token = strtok(NULL, delim);
		strcpy((aryptr + j)->title, token);

		token = strtok(NULL, delim);
		strcpy((aryptr + j)->author, token);

		token = strtok(NULL, delim);
		strcpy((aryptr + j)->publisher, token);

		token = strtok(NULL, delim);
		(aryptr + j)->stock = atoi(token);

		token = strtok(NULL, delim);
		(aryptr + j)->price = (float)atof(token);

		token = strtok(NULL, delim);
		(aryptr + j)->year = atoi(token);

		token = strtok(NULL, delim);
		for (; cntr < (int)(strlen(token)); cntr++)
		{
			if (token[cntr] == '\n')//replaces \n with \0 to terminate the string.
			{
				token[cntr] = '\0';
			}
		}
		cntr = 0;
		strcpy((aryptr + j)->genre, token);
		token = strtok(NULL, delim);
		(aryptr + j)->aMatch = 1;
	}
	fclose(fptr);
}

int validatePassword(double attempt)
{
	int i = 0;
	double plaintxt = 6;//password stored after RSA encryption
	double tot = 1;
	double e = 13, n = 247;//The 2 components of the public key
	for (; i < (e); i++)
	{
		tot = fmod((tot * attempt), n);//multiplies attempt by total and then mods it
	}
	if (tot == plaintxt) return 1;//if password is valid
	else return 0;

}

int validateisbn(char isbn[14])
{
	int i = 0;
	int checksum = 0;
	if (strlen(isbn) != 13) return 0;//checks if length is correct; if not it returns 0.
	for (; i < 13; i++)
	{
		if ((isbn[i] < 48) || (isbn[i] > 57)) return 0; // checks if character is a number and if not it returns 0.
		if (i % 2 == 0) checksum = checksum + isbn[i] - 48;//deals with ascii character values as atoi() works with strings, not characters
		else checksum = checksum + 3 * (isbn[i] - 48);//odd number locations have their balue multiplied by 3
	}
	if (checksum % 10 == 0)//if it's valid
	{
		//printf("Correct\n");
		return 1;
	}
	else
	{
		//printf("Error %d\n", (checksum % 10));
		return 0;
	}
}

void updateTxtFile()
{
	int i = 0;
	FILE *fptr = fopen(fileLoc, "w");
	if (fptr == NULL)
	{
		printf("Error opening file ! \n");
	}
	fprintf(fptr, "ISBN\tTitle\tAuthor\tPublisher\tStock\tPrice\tPubl Date\tGenre\n");//puts in titles of catagories
	for (; i < (numBooks); i++)
	{
		fprintf(fptr, "%s\t%s\t%s\t%s\t%d\t%.2f\t%d\t%s", (aryptr + i)->isbn, (aryptr + i)->title, (aryptr + i)->author, (aryptr + i)->publisher, ((aryptr + i)->stock), ((aryptr + i)->price), ((aryptr + i)->year), (aryptr + i)->genre);
		//puts in data for each book
		if (i < (numBooks - 1)) fprintf(fptr, "\n");//if it's not the last book:
	}
}

void urlDecode(char *str)
{
	unsigned int i;
	char tmp[512];
	char *ptr = tmp;
	char *endptr;
	char hexString[3];
	char c;//the charagter int d represents
	int d;//numeric representation of a character using ascii

	for (i = 0; i < strlen(str); i++)
	{
		if (str[i] != '%')
		{
			*ptr++ = str[i];
			continue;
		}

		hexString[0] = str[i + 1];//gets value after %
		hexString[1] = str[i + 2];//gets value after that
		hexString[2] = '\0';
		d = strtol(hexString, &endptr, 16);//converts string to long int
		c = d;//saves long int as ascii character 
		*ptr++ = c;
		i = i + 2;
	}
	*ptr = '\0';
	strcpy(str, tmp);//copies tmp into str
}

void replaceChar(char input[], char oldChar, char newChar)
{
	int i = 0;
	while (input[i] != '\0')
	{
		if (input[i] == oldChar) input[i] = newChar;//if it's the old char, put in the new char instead
		i++;
	}
}

void saveFormDetails(char* inputString)
{
	//printf("%s", *inputString);
	char name[40] = "default";
	char email[40] = "default";
	int catagory = 0;
	char question[500] = "default";
	char date[30] = "Insert Date here";
	char time[20] = "Insert Time here";
	char field[40];
	char *delim = "&=";
	char *token = "default";

	urlDecode(inputString);//decodes string from POST form
	replaceChar(inputString, '+', ' ');//replaces + with a space
	token = strtok(inputString, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy(name, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy(email, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	catagory = atoi(token);

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
	strcpy(question, token);


	FILE *formfptr = fopen("form.txt", "r");
	if (formfptr == NULL)//ie. if it doesn't exist, do...
	{
		formfptr = fopen("form.txt", "w+");
		fprintf(formfptr, "Name\tE-mail\tCatagory\tDate\tTime\tQuestion");//puts in catagory titles
		fclose(formfptr);
	}
	else fclose(formfptr);//already exists so we close it in r mode so we can re-open it in a+ mode
	formfptr = fopen("form.txt", "a+");
	fprintf(formfptr, "\n%s\t%s\t%d\t%s\t%s\t%s", name, email, catagory, date, time, question);//adds data to text file
	printf("<html><head>");
	printf("<script src = '../labhrasJS.js'></script><script src = '../davidJS.js'></script>");//includes the Javascript files into the CGI page
	printf("<body onload='formSubmitted()'></body>"); // calls formSubmitted function when the CGI page is loaded
	printf("</html></head>");
}


void addBook(char* inputString)
{
	char *token = "default";
	char field[40];
	char *delim = "&=";
	int genreChoice = 0;
	realloc(aryptr, ((numBooks + 1)*sizeof(struct book)));//reallocates the block of memory so that it can hold one more book
	if (aryptr == NULL)
	{
		//Error warning???
		printf("An error occured!\n");
		return;
	}

	urlDecode(inputString);
	replaceChar(inputString, '+', ' ');

	token = strtok(inputString, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy((aryptr + numBooks)->title, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy((aryptr + numBooks)->author, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy((aryptr + numBooks)->publisher, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	(aryptr + numBooks)->stock = atoi(token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	(aryptr + numBooks)->price = (float)atof(token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	(aryptr + numBooks)->year = atoi(token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy((aryptr + numBooks)->isbn, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	genreChoice = atoi(token);

	switch (genreChoice)//switches based on the value of genreChoice
	{
	case 1:
		strcpy((aryptr + numBooks)->genre, "Fiction");
		break;
	case 2:
		strcpy((aryptr + numBooks)->genre, "Crime");
		break;
	case 3:
		strcpy((aryptr + numBooks)->genre, "Young Adult");
		break;
	case 4:
		strcpy((aryptr + numBooks)->genre, "Non-Fiction");
		break;
	case 5:
		strcpy((aryptr + numBooks)->genre, "Children's");
		break;
	case 6:
		strcpy((aryptr + numBooks)->genre, "Travel");
		break;
	case 7:
		strcpy((aryptr + numBooks)->genre, "Other");
		break;
	}
	(aryptr + numBooks)->aMatch = 1;
	numBooks++;//increments numBooks global variable so all functions know there is one more book
	printf("<html><head>");
	printf("<script type='text/javascript'>");
	printf("window.alert('The book has been successfuly added.');");
	printf("window.location = '../index.shtml';");//brings the user to index.shtml
	printf("</script>");
	printf("<body></body>");
	printf("</html></head>");
}

double decrypt(double number)
{

	double d = 9341, n = 10579;//The 2 components of the private key
	int i = 0;
	double tot = 1;
	for (; i < (d); i++)
	{
		tot = fmod((tot * number), n);//does powers but mods after every multiplication so double size limit isn't exceeded
	}
	tot = fmod(tot, n);//mods it one last time
	return tot;
}

void decryptCardNum(char *cardNo, char plain[20])
{
	double part[4];
	char c = 'c';//waste
	char chunk[4][5];
	sscanf(cardNo, "%lf~%lf~%lf~%lf", &part[0], &part[1], &part[2], &part[3]);//splits cardNo into it's separate parts
	part[0] = decrypt(part[0]);
	sprintf(chunk[0], "%04.0lf", part[0]);//saves the double part[0] as a string called chunk[0]

	part[1] = decrypt(part[1]);
	sprintf(chunk[1], "%04.0lf", part[1]);

	part[2] = decrypt(part[2]);
	sprintf(chunk[2], "%04.0lf", part[2]);

	part[3] = decrypt(part[3]);
	sprintf(chunk[3], "%04.0lf", part[3]);
	strcat(plain, chunk[0]);//adds chunk[0] to an empty string which will end up storing all 16 digits
	strcat(plain, chunk[1]);
	strcat(plain, chunk[2]);
	strcat(plain, chunk[3]);
}

void logIn(char *numberString)
{
	char *string = strstr(numberString, "=");
	char waste;
	char unused[100];
	double attempt = 0;
	sscanf(string, "%c%lf%s", &waste, &attempt, unused);
	if (validatePassword(attempt) == 1)
	{
		//Log them in
		printf("<html><head>");
		printf("<script type='text/javascript'>");
		printf("sessionStorage.admin = 1;");
		printf("sessionStorage.attemptNo = 1;");//sets HTML session storage flag to 1
		printf("window.alert('You have successfully logged in');");
		printf("window.location = '../index.shtml';");//brings them back to them home page after logging them in
		printf("</script>");
		printf("<body></body>");
		printf("</html></head>");

	}
	else
	{
		//don't log them in...
		printf("<html><head>");
		printf("<script type='text/javascript'>");
		printf("window.alert('Incorrect on attempt number '+ sessionStorage.attemptNo +' of 3!');");
		printf("sessionStorage.attemptNo = sessionStorage.attemptNo - (-1);");//reduces the number of attempts left by 1
		printf("window.location = '../logIn.shtml';");//brings them to the log in page
		printf("</script>");
		printf("<body></body>");
		printf("</html></head>");
	}

}

void deleteRecord(char *string)
{
	char *token = "default";
	char field[40];
	char *delim = "&=";
	token = strtok(string, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);//now contains isbn
	int index = miniSearch(token);//searches for the isbn
	if (index == -1) return;//This shouldn't happen as it'll be buttons sending in the isbn.
	int i = index;
	for (; i < (numBooks - 1); i++)
	{
		strcpy((aryptr + i)->title, (aryptr + i + 1)->title);//copies (i+1)th values into i, overwriting it.
		strcpy((aryptr + i)->author, (aryptr + i + 1)->author);
		strcpy((aryptr + i)->publisher, (aryptr + i + 1)->publisher);
		(aryptr + i)->price = (aryptr + i + 1)->price;
		(aryptr + i)->year = (aryptr + i + 1)->year;
		strcpy((aryptr + i)->genre, (aryptr + i + 1)->genre);
		strcpy((aryptr + i)->isbn, (aryptr + i + 1)->isbn);
		(aryptr + i)->stock = (aryptr + i + 1)->stock;
		(aryptr + i)->aMatch = 1;
	}
	realloc(aryptr, ((numBooks - 1)*sizeof(struct book)));//reallocates the size of the memory block to one less book than it used to hold
	if (aryptr == NULL)
	{
		printf("An error occured\n");
		return;
	}
	numBooks--;//decrements numBooks by 1 to account for the deleted book
	printf("<html><head>");
	printf("<script type='text/javascript'>");
	printf("window.alert('The book has been deleted.');");
	printf("window.location = '../index.shtml';"); // brings them back to the home page
	printf("</script>");
	printf("<body></body>");
	printf("</html></head>");
}

void editRecord(char *inputString)
{
	char *token = "default";
	char field[40];
	char *delim = "&=";
	char isbn[14];
	urlDecode(inputString);
	replaceChar(inputString, '+', ' ');

	token = strtok(inputString, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy(isbn, token);

	int index = miniSearch(isbn); // searches for the isbn
	if (index == -1) return; // This shouldn't happen as it'll be buttons sending in the isbn.
	//printf("%d", index);
	strcpy((aryptr + index)->isbn, isbn);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy((aryptr + index)->title, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy((aryptr + index)->author, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy((aryptr + index)->publisher, token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	(aryptr + index)->stock = atoi(token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	(aryptr + index)->price = (float)atof(token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	(aryptr + index)->year = atoi(token);

	token = strtok(NULL, delim);
	strcpy(field, token);
	token = strtok(NULL, delim);
	strcpy((aryptr + index)->genre, token);

	printf("<html><head>");
	printf("<script type='text/javascript'>");
	printf("window.alert('The changes have been saved.');");
	printf("window.location = '../index.shtml';"); // brings them back to home page
	printf("</script>");
	printf("<body></body>");
	printf("</html></head>");
}