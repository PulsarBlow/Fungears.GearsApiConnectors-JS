**GearsApi Connectors** is a Javascript library that makes it easier to plug your applications to the our gamification engine API (aka GearsApi)

## Getting Started
##### Totally new to Fungears and gamification ?  
Check our [website](http://fungears.com/) for a presentation of who we are and what we do.

##### Documentation of this library
The complete documentation of this library can be found on our [Developers Hub](http://devhub.fungears.com)

## Downloading or building the library

###### Current version : 0.1.3

[Downloads](dist/)

###### Build environment requirements

This library is written in TypeScript (a typed superset of JavaScript) and compiled into a pure Javascript distribution by a GruntJS task.

To build the minified and css versions of the library you will need [node](http://nodejs.org) and [TypeScript v0.9.1.1](http://www.typescriptlang.org/) installed.

Install the [Grunt](http://gruntjs.com/) command line. This might require `sudo`.

```shell
npm install -g grunt-cli
```

Then, from the main project folder run this command. This should not require `sudo`.

```shell
npm install
```

At this point the dependencies have been installed and you can build the library.

```shell
grunt
```


## Running the tests

All test specs are in the "tests" directory and run against the [Jasmine](http://pivotal.github.io/jasmine/) testing library.  
The SpecRunner is the index.html file of the test directory. Simply open it in your browser.

## License

BSD-Clause 3 : http://opensource.org/licenses/BSD-3-Clause
