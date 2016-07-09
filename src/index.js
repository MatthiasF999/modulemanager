const path = require('path');
const callsite = require('callsite');

/**
 * Manages different modules
 * @example
 * import ModuleManager from modulemanager;
 *
 * let moduleManager = new ModuleManager({folder: 'folder'});
 */
export default class ModuleManager {
	/**
	 * initializes all variables
	 * @param {Object}  [options] - requires a json object with options
	 * @param {string} [options.folder='modules'] - string with the folderPath relative to caller
	 * @param {boolean} [options.logging=false] - logs if a method is run
	 * @param {boolean} [options.done] - called when constructor completed
	 * @param {boolean} [options.passCaller=true] - pass modulemanager as parrent to modules
	 * @param {Array<string, Object>} [options.moduleList] - array of modules to activate
	 * @param {Object} [options.moduleList.name] - module name
	 * @param {Object} [options.moduleList.path] - path to the module
	 * @param {Object} [options.options] - options to pass to the modules
	 * @throws {ReferenceError} throw referencerror when necessary options are missing
	 */
	constructor(options) {
		const opt = options || {};
		const folder = opt.folder || 'modules';
		const stack = callsite();
		const blank = () => {};
		const done = opt.done || blank();
		const caller = opt.passCaller || true;
		/**
		 * Creates a module from the module subclass
		 * @private
		 * @param {Array<string, Object>} [list] - array of modules to activate
		 * @param {Object} [list.name] - module name
		 * @param {Object} [list.path] - path to the module
		 */
		async function activateAll(list) {
			for (const mod of list) {
				const module = mod.name || mod;
				const modulePath = mod.path || module;

				await this.activate(module, { modulePath });
			}
			done('finished');
		}
		/**
		 * folder of caller
		 * @type {string}
		 */
		this.requester = path.dirname(stack[1].getFileName());
		/**
		 * folder seen from caller
		 * @type {string}
		 */
		this.folder = path.normalize(`${this.requester}/${folder}`);
		/**
		 * Map containing all active modules
		 * @type {Map<string, Object>}
		 */
		this.moduleMap = new Map();
		/**
		 * JSON object containing additional options
		 * @type {Object}
		 */
		this.options = opt.options || {};
		if (caller === true) this.options.parent = this;
		/**
		 * logging when function is run
		 * @type {boolean}
		 */
		this.logging = opt.logging || false;

		if (opt.moduleList) {
			activateAll(opt.moduleList);
		}
	}


	/**
	 * installs a module and activates it afterwards
	 * @param {!(Object|string)} module - name of the module or module object
	 * @param {Object} [options] - additional options
	 * @param {string} [options.path] - path to the module
	 * @param {boolean} [options.activate] - activate the module after updating
	 * @throws {SyntaxError} throw syntaxerror when error in modules installfunction
	 */
	async install(module, options) {
		const opt = options || {};
		await this.callModule(module, async (mod) => {
			try {
				await mod.module.install();
				if (this.logging) console.info(`${module} installed`);
				if (opt.activate) await this.activate(mod);
			} catch (e) {
				throw new SyntaxError(
`Error installing ${module}
${e}`
				);
			}
		}, { modulePath: opt.path, get: false });
	}

	/**
	 * deactivates a module, then removes it
	 * @param {!(Object|string)} module - name of the module or module object
	 * @param {Object} [options] - additional options
	 * @param {string} [options.path] - path to the module
	 * @throws {SyntaxError} throw syntaxerror when error in modules updatefunction
	 */
	async uninstall(module, options) {
		const opt = options || {};
		// deactivate module if active
		if (this.moduleMap.has(module) || typeof module === 'object') {
			await this.callModule(module, async (mod) => {
				try {
					await this.deactivate(module);
					await mod.module.uninstall();
					if (this.logging) console.info(`${module} uninstalled`);
				} catch (e) {
					throw new SyntaxError(
`Error uninstalling ${module}
${e}`
					);
				}
			});
		} else {
			await this.callModule(module, async (mod) => {
				try {
					await mod.module.uninstall();
					if (this.logging) console.info(`${module} uninstalled`);
				} catch (e) {
					throw new SyntaxError(
`Error uninstalling ${module}
${e}`
					);
				}
			}, { modulePath: opt.path, get: false });
		}
	}

	/**
	 * activates a module
	 * @param {!(Object|string)} module - name of the module or module object
	 * @param {Object} [options] - additional options
	 * @param {string} [options.path] - path to the module
	 * @throws {SyntaxError} throw syntaxerror when error in modules activatefunction
	 */
	async activate(module, options) {
		const opt = options || {};
		await this.callModule(module, async (mod) => {
			try {
				await mod.module.activate();
				const name = typeof module === 'object' ? module.name : module;
				this.moduleMap.set(name, mod);
				if (this.logging) console.info(`${module} activated`);
			} catch (e) {
				throw new SyntaxError(
`Error activating ${module}
${e}`
				);
			}
		}, { modulePath: opt.path, get: false });
	}

	/**
	 * deactivates a module
	 * @param {!(Object|string)} module - name of the module or module object
	 * @throws {SyntaxError} throw syntaxerror when error in modules deactivatefunction
	 */
	async deactivate(module) {
		await this.callModule(module, async (mod) => {
			try {
				await mod.module.deactivate();
				this.moduleMap.delete(module);
				if (this.logging) console.info(`${module} deactivated`);
			} catch (e) {
				throw new SyntaxError(
`Error deactivating ${module}
${e}`
				);
			}
		});
	}

	/**
	 * deactivates a module, then updates it and optionaly activates it afterwards
	 * @param {!(Object|string)} module - name of the module or module object
	 * @param {Object} [options] - additional options
	 * @param {string} [options.path] - path to the module
	 * @param {boolean} [options.activate] - activate the module after updating
	 * @throws {SyntaxError} throw syntaxerror when error in modules updatefunction
	 */
	async update(module, options) {
		const opt = options || {};
		// deactivate module if active
		if (this.moduleMap.has(module)) {
			await this.deactivate(module);
		}

		await this.callModule(module, async (mod) => {
			try {
				await mod.module.update();
				if (this.logging) console.info(`${module} updated`);
				if (opt.activate) await this.activate(mod);
			} catch (e) {
				throw new SyntaxError(
`Error updating ${module}
${e}`
				);
			}
		}, { modulePath: opt.path, get: false });
	}

	/* private functions */

	/**
	 * if module is an object
	 * @private
	 * @param {!(Object|string)} module - name of the module or module object
	 * @param {string} [modulePath] - path to the module
	 * @throws {SyntaxError} throw syntaxerror when module couldn't be created
	 * @return {Object} returns a module
	 */
	async setModule(module, modulePath) {
		try {
			return typeof module === 'object'
				? module
				: await this.createModule(module, modulePath);
		} catch (e) {
			throw new SyntaxError(`could not create ${module}`);
		}
	}

	/**
	 * if module is an object
	 * @private
	 * @param {!(Object|string)} module - name of the module or module object
	 * @throws {ReferenceError} throw referencerror when module cannot be called
	 * @return {Object} returns a module
	 */
	getModule(module) {
		if (this.moduleMap.has(module)) {
			return typeof module === 'object'
				? module
				: this.moduleMap.get(module);
		}
		throw new ReferenceError(`${module} not found in active list`);
	}

	/**
	 * if module is an object
	 * @private
	 * @param {!(Object|string)} module - name of the module or module object
	 * @param {!function(module: Object)} fn - function to call with the module
	 * @param {Object} [options] - additional options
	 * @param {boolean} [options.get=true] - if true, gets the module, else sets it
	 * @param {string} [options.modulePath] - path to the module
	 */
	async callModule(module, fn, options) {
		const opt = options || { get: true };
		try {
			if (opt.get) {
				await fn.call(this, this.getModule(module));
			} else {
				await this.setModule(module, opt.modulePath)
					.then((mod2) => fn.call(this, mod2));
			}
		} catch (e) {
			console.error(e);
		}
	}

	/**
	 * Creates a module from the module subclass
	 * @private
	 * @param {!string} moduleName - name of the module
	 * @param {string} [modulePath] - path to the module
	 * @throws throw error when module cannot be created
	 * @return {Object} returns a new module
	 */
	async createModule(moduleName, modulePath) {
		let modPath = modulePath
			? `${this.requester}/${modulePath}`
			: `${this.folder}/${moduleName}`;
		modPath = path.normalize(modPath);
		try {
			let data;
			try {
				// eslint-disable-next-line global-require
				data = await require(`${modPath}/package.json`);
			} catch (e) {
				data = {};
			}
			const entry = data.main || 'index.js';
			const mainPath = path.normalize(`${modPath}/${entry}`);

			// eslint-disable-next-line global-require
			const Module = await require(mainPath);
				// eslint-disable-next-line new-cap
			const module = new Module.default(this.options);

			return { data, name: moduleName, module };
		} catch (e) {
			throw e;
		}
	}
}

/**
 * Module interface
 * @interface
 * @example
 * import { Module } from 'modulemanager';
 *
 * export default class extends Module {}
 */
export class Module {
	/**
	 * initializes all variables
	 * @param {!Object} options - requires a JSON object with options, the options are available with this.KEY
	 * @throws {ReferenceError} throw referencerror when options are missing
	 */
	constructor(options) {
		if (!options) {
			throw new ReferenceError('options missing');
		}
		// eslint-disable-next-line no-restricted-syntax
		for (const key in options) {
			if (options.hasOwnProperty(key)) {
				this[key] = options[key];
			}
		}
	}

	/**
   * this method must be overridden by sub class.
   * @abstract
	 * @throws {ReferenceError} throw referencerror when not overwritten
   */
	async install() {
		throw new ReferenceError('function not implemented');
	}

	/**
   * this method must be overridden by sub class.
   * @abstract
	 * @throws {ReferenceError} throw referencerror when not overwritten
   */
	async uninstall() {
		throw new ReferenceError('function not implemented');
	}

	/**
   * this method must be overridden by sub class.
   * @abstract
	 * @throws {ReferenceError} throw referencerror when not overwritten
   */
	async update() {
		throw new ReferenceError('function not implemented');
	}

	/**
	 * this method must be overridden by sub class.
	 * @abstract
	 * @throws {ReferenceError} throw referencerror when not overwritten
	 */
	async activate() {
		throw new ReferenceError('function not implemented');
	}

	/**
   * this method must be overridden by sub class.
   * @abstract
	 * @throws {ReferenceError} throw referencerror when not overwritten
   */
	async deactivate() {
		throw new ReferenceError('function not implemented');
	}
}
