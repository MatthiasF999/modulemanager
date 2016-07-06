# Modules

## Creating Modules

### Package.json
Create a package.json containing a main key for the entrypoint.
```javascript
{
	"main": "./index.js"
}
```

### Extend Module class
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

### Necessary functions
You need to create the functions install, uninstall, activate, deactivate and update (only if it isn't the first version)

Currently the package is built for ES7 async, so async functions are necessary.
```javascript
export default class Module1 extends Module {
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
};
```

## Optional constructor
If you want to use a constructor, extend the following code
```javascript
export default class Module1 extends Module {
	constructor(options) {
		super(options);
		// Your code here
	}
};
```
