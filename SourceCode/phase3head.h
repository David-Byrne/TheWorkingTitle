//version 1.1.1
#include "stdafx.h"
#include "stdio.h"
#include "string.h"
#include "stdlib.h"
#include "ctype.h"
#include "math.h"


struct book
{
	char title[70];
	char author[70];
	char publisher[70];
	float price;
	int year;
	char genre[70];
	char isbn[14];
	int stock;
	int aMatch;
};

/*David's functions*/
void initArray();
int validatePassword(double attempt);
int validateisbn(char string[14]);
void updateTxtFile();
void urlDecode(char *str);
void replaceChar(char input[], char oldChar, char newChar);
void saveFormDetails(char *string);
void addBook(char* inputString);
double decrypt(double number);
void logIn(char *numberString);
void deleteRecord(char *isbn);
void editRecord(char *string);
void decryptCardNum(char *cardNo, char ans[20]);

/*Labhras' functions*/
void printBook(struct book abook, int count);
int search(char *query);
void custStrLwr(char *string); // custom string lower, converts mixed case to lower case
void listAll();
void purchase(char *string);
void webHead(); // the HTML for the head of the web page (includes the .js and .css files)
void shopping(); // the shopping cart, separate because it doesn't need to be on every page
int miniSearch(char *isbn);
void webFoot();

/*Global variables*/
struct book *aryptr; // Global array of books
int numBooks;
int isAdmin;
char fileLoc[50]; // location of the books100.txt file