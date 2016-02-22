INSTRUCTIONS
------------
	Put the contents of 'wwwFolderContents.zip' in the 'www' folder in your WAMP directory.
	Put the contents of 'CGI.zip' in the 'bin\apache\apache2.4.9\cgi-bin' directory (if you're running Windows).
	If you're building the .exe yourself, use the contents of the 'SourceCode.zip'.
	
	NOTES
	*The Programme expects the C executable to be called 'classProjectWebVersion.exe'.
	*Make sure you have CGI and SSI (Server-Side Includes) enabled on your WAMP server.
	*To login to the Admin account, use '123' as the password.

CITATIONS
------------
	Stack Overflow (various solutions and fixes)
	Wikipedia (To find the 13-digit ISBN validation formula)
	The Guardian (for the link to the Google Docs, which is where we got the books100.txt file, although we did edit it to suit our needs)
		Source Link (The Guardian): http://www.theguardian.com/news/datablog/2011/jan/01/top-100-books-of-all-time#data
		Source Link (Google Docs): https://docs.google.com/spreadsheet/ccc?key=0AonYZs4MzlZbdEpsS2MtbmEyU1BNVXBhMjdWcVctMFE&hl=en#gid=0

CHANGELOG
------------
	List of Changes Since Demo:

	NEW	Error checking for the Admin forms (adding and editing)
	FIX	Cart logic now works, you can delete any item from the cart without it breaking
	FIX 	Style now works on both Firefox and Chrome
	FIX 	UX improved

	Also other bug fixes.