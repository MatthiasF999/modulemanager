# ModuleManager

Create a new Manager with
```javascript
import ModuleManager from 'modulemanager';

const moduleManager = new ModuleManager(options);
```

## Variables
Place the variables in a JSON Object

| optional  | variable     | default   | description                          |
| --------- | ------------ | --------- | ------------------------------------ |
| yes       | folder       | ./modules | folderpath relative to current file as string       |
| yes       | moduleList   |           | List of modules by name or name and path to load |
| yes       | options      |           | JSON Object for options to pass to modules      |

### Example
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

## Modules
Modules need to be in a subfolder containing their name in the folder set in the options.
Otherwise you have to set the path to the folder manually (relative to your file)

## Functions
### Install
You can either install a module if it is in a subfolder containing their name or by giving the path.
You can also activate the module after installing.
```javascript
moduleManager.install('plugin1');

moduleManager.install('plugin2', { activate: true });

moduleManager.install('plugin3', { path: '../plug3' });
```

### Activate
You can either activate a module if it is in a subfolder containing their name or by giving the path.
```javascript
moduleManager.activate('plugin1');

moduleManager.activate('plugin3', { path: '../plug3' });
```

### Update
You can either update a module if it is in a subfolder containing their name or by giving the path.
You can also activate the module after updating.
**Warning:** their is no check if the installed version is newer, please do this before updating the module.
```javascript
moduleManager.update('plugin1');

moduleManager.update('plugin2', { activate: true });

moduleManager.update('plugin3', { path: '../plug3' });
```

### Deactivate
You can deactivate an active module by calling its name.
If no such module is active, an error is logged.
```javascript
moduleManager.deactivate('plugin1');

moduleManager.deactivate('plugin3');
```

### Uninstall
You can either uninstall a module if it is active by calling the name or if it is in a subfolder containing their name or by giving the path.
```javascript
moduleManager.uninstall('plugin1');

// if plugin3 is active, you can use
moduleManager.uninstall('plugin3');
// can always be used
moduleManager.uninstall('plugin3', { path: '../plug3' });
```
