# Modules
## Package.json
```javascript
{
	"main": "./index.js",
  "author": "Matthias Feldmann",
  "version": "1.0.0"
}
```

## Module class
### Without constructor (default)
```javascript
import { Module } from 'modulemanager';

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

### With constructor
```javascript
import { Module } from 'modulemanager';

export default class Module1 extends Module {
	constructor(options) {
		super(options);
		// Your code here
	}

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
