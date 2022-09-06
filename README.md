# African Elephant Database Screencapper

This is a small utility to automate creation of PDFs for AED tables.

Pre-requisites:
- Install [NodeJS](https://nodejs.org/en/)
- `npm instal` to install dependencies

Usage:<br />
*Replace <URL> with a base URL including the protocol and excluding trailing slash, ex: http://staging.africanelephantdatabase.org:*
```bash
$ node index.js <URL>
```

After running the script the PDFs can be found in the `pdfs` subdirectory of this utility.
