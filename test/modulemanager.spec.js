/* eslint-disable no-unused-expressions */
const chai = require('chai');
const path = require('path');
import ModuleManager from '../src/index';
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);

const mochaAsync = (fn) =>
	async(done) => {
		try {
			await fn();
			done();
		} catch (err) {
			done(err);
		}
	};

/**
 * @test {ModuleManager}
 */
describe('ModuleManager', () => {
	/**
	* @test {ModuleManager#constructor}
	*/
	describe('ModuleManager#constructor', () => {
		/**
		 * @test {ModuleManager#constructor}
		 */
		it('ModuleManager#constructor accepts missing options', () => {
			const mmanager = new ModuleManager();
			const dir = path.dirname(__filename);
			const folder = path.normalize(`${dir}/modules`);
			expect(mmanager.folder).to.be.equal(folder);
			expect(mmanager.moduleMap).to.be.blank;
			expect(mmanager.options).to.be.blank;
			expect(mmanager.logging).to.be.false;
		});
			/**
			 * @test {ModuleManager#constructor}
			 */
		it('ModuleManager#constructor with blank constructor', () => {
			const mmanager = new ModuleManager({});
			const dir = path.dirname(__filename);
			const folder = path.normalize(`${dir}/modules`);
			expect(mmanager.folder).to.be.equal(folder);
			expect(mmanager.moduleMap).to.be.blank;
			expect(mmanager.options).to.be.blank;
			expect(mmanager.logging).to.be.false;
		});
			/**
			 * @test {ModuleManager#constructor}
			 */
		it('ModuleManager#constructor with list', () => {
			const mmanager = new ModuleManager({
				moduleList: ['Module1', 'Mod2'],
				folder: './Modules',
				done: (result) => {
					expect(mmanager.moduleMap).to.not.be.blank;
					expect(mmanager.moduleMap.has('Module1')).to.be.true;
					expect(mmanager.moduleMap.has('Mod2')).to.be.true;
					expect(mmanager.options).to.be.blank;
					expect(mmanager.logging).to.be.false;
					expect(result).to.be.equal('finished');
				},
			});
		});
	});
	/**
	* @test {ModuleManager}
	*/
	describe('ModuleManager logging', () => {
		let mmanager;
		const test = sinon.stub();
		beforeEach(() => {
			mmanager = new ModuleManager({
				folder: './Modules',
				logging: true,
				options: {
					test,
				},
			});
		});
		/**
		 * @test {ModuleManager#install}
		 */
		it('ModuleManager#install',
			mochaAsync(async() => {
				sinon.stub(console, 'info');
				await mmanager.install('Module1');
				expect(console.info).to.be.calledOnce;
				console.info.restore();
			})
		);
		/**
		 * @test {ModuleManager#uninstall}
		 */
		it('ModuleManager#uninstall',
			mochaAsync(async() => {
				sinon.stub(console, 'info');
				await mmanager.uninstall('Module1');
				expect(console.info).to.be.calledOnce;
				console.info.restore();
			})
		);
		/**
		 * @test {ModuleManager#update}
		 */
		it('ModuleManager#uninstall',
			mochaAsync(async() => {
				sinon.stub(console, 'info');
				await mmanager.update('Module1');
				expect(console.info).to.be.calledOnce;
				console.info.restore();
			})
		);
		/**
		 * @test {ModuleManager#activate}
		 */
		it('ModuleManager#activate',
			mochaAsync(async() => {
				sinon.stub(console, 'info');
				await mmanager.activate('Module1');
				expect(console.info).to.be.calledOnce;
				console.info.restore();
			})
		);
		/**
		 * @test {ModuleManager#deactivate}
		 */
		it('ModuleManager#deactivate',
			mochaAsync(async() => {
				sinon.stub(console, 'info');
				await mmanager.activate('Module1');
				await mmanager.deactivate('Module1');
				expect(console.info).to.be.calledTwice;
				console.info.restore();
			})
		);
	});
	/**
	* @test {ModuleManager}
	*/
	describe('ModuleManager functions', () => {
		let mmanager;
		const test = sinon.stub();
		beforeEach(() => {
			mmanager = new ModuleManager({
				folder: './Modules',
				caller: true,
				options: {
					test,
				},
			});
		});
		afterEach(() => {
			test.reset();
		});
		/**
		 * @test {ModuleManager#createModule}
		 */
		it('ModuleManager#createModule passes caller',
			mochaAsync(async() => {
				const mod = await mmanager
					.createModule('Module2', './Modules/Mod2');
				expect(mod.module.parent).to.be.equal(mmanager);
			})
		);
		/**
		 * @test {ModuleManager}
		 */
		describe('ModuleManager private functions', () => {
			/**
			 * @test {ModuleManager#createModule}
			 */
			describe('ModuleManager#createModule', () => {
				/**
				 * @test {ModuleManager#createModule}
				 */
				it('ModuleManager#createModule loads Module',
					mochaAsync(async() => {
						const mod = await mmanager.createModule('Module1');
						mod.module.test('test');
						expect(test).to.have.been.calledWith('test');
					})
				);
				/**
				 * @test {ModuleManager#createModule}
				 */
				it('ModuleManager#createModule loads Module with Path',
					mochaAsync(async() => {
						const mod = await mmanager
							.createModule('Module2', './Modules/Mod2');
						mod.module.test('test');
						expect(mod.data).to.not.be.empty;
						expect(test).to.have.been.calledWith('test');
					})
				);
				/**
				 * @test {ModuleManager#createModule}
				 */
				it('ModuleManager#createModule loads Module without package.json',
					mochaAsync(async() => {
						const mod = await mmanager
							.createModule('Module3', './Modules/Mod3');
						mod.module.test('test');
						expect(mod.data).to.be.empty;
						expect(test).to.have.been.calledWith('test');
					})
				);
			});
			/**
			 * @test {ModuleManager#setModule}
			 */
			describe('ModuleManager#setModule', () => {
				/**
				 * @test {ModuleManager#setModule}
				 */
				it('ModuleManager#setModule loads Module',
					mochaAsync(async() => {
						const mod = await mmanager.setModule('Module1');
						mod.module.test('test');
						expect(test).to.have.been.calledWith('test');
					})
				);
				/**
				 * @test {ModuleManager#setModule}
				 */
				it('ModuleManager#setModule loads Module with path',
					mochaAsync(async() => {
						const mod = await mmanager
							.setModule('Module2', './Modules/Mod2');
						mod.module.test('test');
						expect(test).to.have.been.calledWith('test');
					})
				);
				/**
				 * @test {ModuleManager#setModule}
				 */
				it('ModuleManager#setModule returns Module',
					mochaAsync(async() => {
						const mod = { name: 'Module' };
						const modReturn = await mmanager.setModule(mod);
						expect(modReturn).to.be.equal(mod);
					})
				);
			});
			/**
			 * @test {ModuleManager#getModule}
			 */
			describe('ModuleManager#getModule', () => {
				/**
				 * @test {ModuleManager#getModule}
				 */
				it('ModuleManager#getModule gets Module', () => {
					mmanager.moduleMap.set('Module1', 'test');
					const mod = mmanager.getModule('Module1');
					expect(mod).to.be.equal('test');
				});
				/**
				 * @test {ModuleManager#getModule}
				 */
				it('ModuleManager#getModule logs error', () => {
					const fn = () => {
						mmanager.getModule('Module1');
					};
					expect(mmanager.moduleMap.has('Module1')).to.be.false;
					expect(fn).to.throw(ReferenceError);
					expect(fn).to.throw('Module1 not found in active list');
				});
			});
		});
		/**
		 * @test {ModuleManager#activate}
		 */
		describe('ModuleManager#activate', () => {
			/**
			 * @test {ModuleManager#activate}
			 */
			it('ModuleManager#activate runs activate function of Module',
				mochaAsync(async() => {
					await mmanager.activate('Module1');
					expect(mmanager.moduleMap.has('Module1')).to.be.true;
					expect(test).to.have.been.calledWith('activate');
				})
			);
		});
		/**
		 * @test {ModuleManager#activate}
		 */
		it('ModuleManager#update runs activate function of Module with Path',
			mochaAsync(async() => {
				await mmanager.activate('Module2', {
					path: './Modules/Mod2',
				});
				expect(test).to.have.been.calledWith('activate');
			})
		);
		/**
		 * @test {ModuleManager#deactivate}
		 */
		describe('ModuleManager#deactivate', () => {
			/**
			 * @test {ModuleManager#deactivate}
			 */
			it('ModuleManager#deactivate logs error when module is not active',
				mochaAsync(async() => {
					expect(mmanager.moduleMap.has('Module1')).to.be.false;

					sinon.stub(console, 'error');

					await mmanager.deactivate('Module1');

					expect(console.error).to.be.calledOnce;
					console.error.restore();
				})
			);
			/**
			 * @test {ModuleManager#deactivate}
			 */
			it('ModuleManager#activate runs deactivate function of Module',
				mochaAsync(async() => {
					await mmanager.activate('Module1');
					expect(mmanager.moduleMap.has('Module1')).to.be.true;
					expect(test).to.have.been.calledWith('activate');
					await mmanager.deactivate('Module1');
					expect(mmanager.moduleMap.has('Module1')).to.be.false;
					expect(test).to.have.been.calledWith('deactivate');
				})
			);
		});
		/**
		 * @test {ModuleManager#install}
		 */
		describe('ModuleManager#install', () => {
			/**
			 * @test {ModuleManager#install}
			 */
			it('ModuleManager#install runs install function of Module',
				mochaAsync(async() => {
					await mmanager.install('Module1');
					expect(mmanager.moduleMap.has('Module1')).to.be.false;
					expect(test).to.have.been.calledWith('install');
				})
			);
			/**
			 * @test {ModuleManager#install}
			 */
			it('ModuleManager#update runs install function of Module with Path',
				mochaAsync(async() => {
					await mmanager.install('Module2', {
						path: './Modules/Mod2',
					});
					expect(test).to.have.been.calledWith('install');
				})
			);
			/**
			 * @test {ModuleManager#install}
			 */
			it('ModuleManager#install runs install function and activate of Module',
				mochaAsync(async() => {
					await mmanager.install('Module1', { activate: true });
					expect(test).to.have.been.calledWith('install');
					expect(mmanager.moduleMap.has('Module1')).to.be.true;
					expect(test).to.have.been.calledWith('activate');
				})
			);
		});
		/**
		 * @test {ModuleManager#uninstall}
		 */
		describe('ModuleManager#uninstall', () => {
			/**
			 * @test {ModuleManager#uninstall}
			 */
			it('ModuleManager#uninstall runs uninstall function of Module',
				mochaAsync(async() => {
					await mmanager.uninstall('Module1');
					expect(mmanager.moduleMap.has('Module1')).to.be.false;
					expect(test).to.have.been.calledWith('uninstall');
				})
			);
			/**
			 * @test {ModuleManager#uninstall}
			 */
			it('ModuleManager#update runs uninstall function of Module with Path',
				mochaAsync(async() => {
					await mmanager.uninstall('Module2', {
						path: './Modules/Mod2',
					});
					expect(test).to.have.been.calledWith('uninstall');
				})
			);
			/**
			 * @test {ModuleManager#uninstall}
			 */
			it('ModuleManager#uninstall runs deactivate and uninstall function of Module',
				mochaAsync(async() => {
					await mmanager.activate('Module1');
					expect(mmanager.moduleMap.has('Module1')).to.be.true;
					expect(test).to.have.been.calledWith('activate');
					await mmanager.uninstall('Module1');
					expect(test).to.have.been.calledWith('uninstall');
					expect(mmanager.moduleMap.has('Module1')).to.be.false;
					expect(test).to.have.been.calledWith('deactivate');
				})
			);
		});
		/**
		 * @test {ModuleManager#update}
		 */
		describe('ModuleManager#update', () => {
			/**
			 * @test {ModuleManager#update}
			 */
			it('ModuleManager#update runs update function of Module',
				mochaAsync(async() => {
					await mmanager.update('Module1');
					expect(mmanager.moduleMap.has('Module1')).to.be.false;
					expect(test).to.have.been.calledWith('update');
				})
			);
			/**
			 * @test {ModuleManager#update}
			 */
			it('ModuleManager#update runs update function of Module with Path',
				mochaAsync(async() => {
					await mmanager.update('Module2', {
						path: './Modules/Mod2',
					});
					expect(test).to.have.been.calledWith('update');
				})
			);
			/**
			 * @test {ModuleManager#update}
			 */
			it('ModuleManager#update runs deactivate and update function of Module',
				mochaAsync(async() => {
					await mmanager.activate('Module1');
					expect(mmanager.moduleMap.has('Module1')).to.be.true;
					expect(test).to.have.been.calledWith('activate');
					await mmanager.update('Module1');
					expect(test).to.have.been.calledWith('update');
					expect(mmanager.moduleMap.has('Module1')).to.be.false;
					expect(test).to.have.been.calledWith('deactivate');
				})
			);
			/**
			 * @test {ModuleManager#update}
			 */
			it('ModuleManager#update runs update and activate function of Module',
				mochaAsync(async() => {
					await mmanager.update('Module1', { activate: true });
					expect(mmanager.moduleMap.has('Module1')).to.be.true;
					expect(test).to.have.been.calledWith('update');
				})
			);
		});
	});
});
