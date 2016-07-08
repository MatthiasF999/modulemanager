[![Build Status](https://travis-ci.org/MatthiasF999/modulemanager.svg?branch=master)](https://travis-ci.org/MatthiasF999/modulemanager)[![Coverage Status](https://coveralls.io/repos/github/MatthiasF999/modulemanager/badge.svg?branch=master)](https://coveralls.io/github/MatthiasF999/modulemanager?branch=master)[![Doc Status](https://doc.esdoc.org/github.com/MatthiasF999/modulemanager/badge.svg)](https://doc.esdoc.org/github.com/MatthiasF999/modulemanager)[![npm version](https://badge.fury.io/js/modulemanager.svg)](https://badge.fury.io/js/modulemanager)[![Node version](https://img.shields.io/node/v/modulemanager.svg)](http://nodejs.org/download/)[![Dependencie Status](https://img.shields.io/david/MatthiasF999/modulemanager.svg?maxAge=2592000)](https://david-dm.org/MatthiasF999/modulemanager#info=dependencies)[![Dev Dependencie Status](https://img.shields.io/david/dev/MatthiasF999/modulemanager.svg?maxAge=2592000)](https://david-dm.org/MatthiasF999/modulemanager#info=devDependencies)[![npm](https://img.shields.io/npm/l/modulemanager.svg?maxAge=2592000)](https://spdx.org/licenses/ISC)

# Feature
This module allows to initialize modules during runtime. It is designed to allow a modular system in node js.

## ModuleManager

Create a new Manager with
```javascript
import ModuleManager from 'modulemanager';

const moduleManager = new ModuleManager(options);
```

### Variables
Place the variables in a JSON Object

| optional  | variable     | default   | description                          |
| --------- | ------------ | --------- | ------------------------------------ |
| yes       | folder       | ./modules | folderpath relative to current file as string       |
| yes       | moduleList   |           | List of modules by name or name and path to load |
| yes       | options      |           | JSON Object for options to pass to modules      |

#### Example
```javascript
const options = {
	folder: './folder/plugins',
	// loads plugin1 and plugin2 from ./folder/plugins and plugin3 from ../
	moduleList: ['plugin1', 'plugin2', {name: 'plugin3', path: '../plug3'}],
	// the options will be available through this.KEY
	options: {
		app: app, 			// available through this.app
		db: connection,	// available through this.db
		socket: io			// available through this.socket
	}
}

const moduleManager = new ModuleManager(options);
```

### Functions
#### Install
You can either install a module if it is in a subfolder containing their name or by giving the path.
```javascript
moduleManager.install('plugin1');
```

#### Activate
You can either activate a module if it is in a subfolder containing their name or by giving the path.
```javascript
moduleManager.activate('plugin1');
```

#### Update
You can either update a module if it is in a subfolder containing their name or by giving the path.
**Warning:** their is no check if the installed version is newer, please do this before updating the module.
```javascript
moduleManager.update('plugin1');
```

#### Deactivate
You can deactivate an active module by calling its name.
If no such module is active, an error is logged.
```javascript
moduleManager.deactivate('plugin1');
```

#### Uninstall
You can either uninstall a module if it is active by calling the name or if it is in a subfolder containing their name or by giving the path.
```javascript
moduleManager.uninstall('plugin1');
```
## Modules

### Creating Modules

#### Package.json
Create a package.json containing a main key for the entrypoint.
```javascript
{
	"main": "./index.js"
}
```

#### Extend Module class
Import the Modules class
```javascript
import { Module } from 'modulemanager';
```

Create a default class, which extends Module in the entrypoint
```javascript
export default class Module1 extends Module {
	// functions here
};
```

#### Necessary functions
You need to create the functions install, uninstall, activate, deactivate and update (only if it isn't the first version)

Currently the package is built for ES7 async, so async functions are necessary.
```javascript
async install() {
	// Your code here
}

async uninstall() {
	// Your code here
}

// for all versions newer then first release
async update() {
	// Your code here
}

async activate() {
	// Your code here
}

async deactivate() {
	// Your code here
	}
```

### Variables
you can access the objects with
```javascript
this.OBJECTKEY
```

# License
ISC License

Copyright (c) [year], [fullname]

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

# Author
Matthias Feldmann
