//ver 1.2.3
#include "phase3head.h"

void main()
{
	printf("Content-type: text/html\n\n");

	initArray();
	int choice = 0;
	char *lenstr;
	long len;
	char input[512];
	char waste;
	char *anotherString;
	lenstr = getenv("CONTENT_LENGTH");
	sscanf(lenstr, "%ld", &len);
	fgets(input, len + 1, stdin);
	//printf("The content string looks like: %s<br>", input);
	char *string = strstr(input, "=");
	sscanf(string, "%c%d%s", &waste, &choice, string);

	anotherString = strstr(string, "=");
	sscanf(anotherString, "%c%d%s", &waste, &isAdmin, string);

	switch (choice)
	{
	case 1:
		purchase(string);
		break;
	case 2:
		search(string);
		break;
	case 3:
		//saveSalesDetails(); -> Not used anymore
		break;
	case 4:
		saveFormDetails(string);
		break;
	case 5:
		//printf("%s", string);
		addBook(string);
		break;
	case 6:
		listAll();
		break;
	case 7:
		logIn(string);
		break;
	case 8:
		deleteRecord(string);
		break;
	case 9:
		editRecord(string);
		break;
	default:
		// This should never happen as it'll be buttons manipulating the value of choice
		break;
	}
	updateTxtFile();
}