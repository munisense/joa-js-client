# joa-js-client
JOA is a protocol used to communicate with the backoffice of Munisense. This standalone Javascript library will be able to construct a (syntactically) valid payload according to the ms-tech-141003-3 specification. Knowledge of the ms-tech-141003-3 document and the ZigBee cluster specification is required. 

Currently this implementation only supports the MuniRPC version 2 protocol (JOA3).

ZigBee cluster specification: https://people.ece.cornell.edu/land/courses/ece4760/FinalProjects/s2011/kjb79_ajm232/pmeter/ZigBee%20Cluster%20Library.pdf.
##### Version
0.0.1
## Getting started
### Installation
To use this software simply include it into your HTML file like so:
```html
<script src="/dist/JOA-0.0.1.js".js></script>
```
Afterwards the JOA object should accessible on the global scope.
### Contribute
In order to contribute to this project you have to install some packages first. This project uses Gulp to automatically generate a dist file of the source, documentation, runs tests and checks the Javascript code using JSHint. Usage of Gulp is therefore recommended. To install Gulp we need to install Node.JS. Node.JS contains a package manager that keeps your project neat and organized, called NPM. Both Node.JS (>= v6.6) and Gulp are mandatory dependencies when developing. Get Node.JS from: https://nodejs.org/en/.

Prior to developing you'll have to install all the developer packages. Run this command in the root project folder:
```sh
$ npm install --only=dev
```
After this command Gulp and all other Gulp plugins including JSHint should be installed and are ready to go. To actually use Gulp in development open up a command prompt/terminal in de root project folder and run this command:
```sh
$ gulp
```
You should see several Gulp tasks start running and finally the last 'build' task finishes and waits. Whenever you save the source file (**/src/Joa.js**) all Gulp task will be run again.
## Documentation and Examples
To see an implementation example see the folder **/examples** the **index.html** file will contain an eloborate example. If the example is not sufficient enough, please see the documentation in the **/doc** folder.
## License
MIT Licensed

Copyright © 2016 Munisense
