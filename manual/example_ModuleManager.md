# ModuleManager
```javascript
import ModuleManager from 'modulemanager';

const options = {
	folder: './folder/plugins',
	// loads plugin1 and plugin2 from ./folder/plugins and plugin3 from ../
	moduleList: ['plugin1', 'plugin2', {name: 'plugin3', path: '../plug3'}],
	// pass modulemanager down to modules
	passCaller: true,
	// the options will be available through this.KEY
	options: {
		app: app, 			// available through this.app
		db: connection,	// available through this.db
		socket: io			// available through this.socket
	}
}

const moduleManager = new ModuleManager(options);



moduleManager.install('plugin1');

moduleManager.install('plugin2', { activate: true });

moduleManager.install('plugin3', { path: '../plug3' });

moduleManager.activate('plugin1');

moduleManager.activate('plugin3', { path: '../plug3' });

moduleManager.deactivate('plugin3');

moduleManager.update('plugin1');

moduleManager.update('plugin2', { activate: true });

// even if it is active, you need to give a path, since it is completly removed from moduleManager to update
moduleManager.update('plugin3', { path: '../plug3' });

moduleManager.uninstall('plugin1');

moduleManager.uninstall('plugin3', { path: '../plug3' });

moduleManager.install('plugin3', { path: '../plug3', activate: true });

moduleManager.uninstall('plugin3');
```
