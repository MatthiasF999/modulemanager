/* eslint-disable no-unused-expressions */

import 'babel-polyfill';
import {
	Module,
} from '../src/index';
import Module1 from './Modules/Module1/Module';
const expect = require('chai').expect;

const mochaAsync = (fn) =>
	async(done) => {
		try {
			await fn();
			done();
		} catch (err) {
			done(err);
		}
	};

class Blank extends Module {}

/** @test {Module} */
describe('Module', () => {
	/** @test {Module} */
	describe('Module missing functions', () => {
		/** @test {Module} */
		it('Module fails without options', () => {
			const fn = () => {
				// eslint-disable-next-line no-new
				new Blank();
			};
			expect(fn).to.throw(ReferenceError);
			expect(fn).to.throw('options missing');
		});
		/** @test {Module#update} */
		it('Module#update fails without overwriting', mochaAsync(async() => {
			// eslint-disable-next-line no-new
			const blank = new Blank({});
			let error;
			try {
				await blank.update();
			} catch (e) {
				error = e;
			} finally {
				const fn = () => { throw error; };
				expect(fn).to.throw(ReferenceError);
				expect(fn).to.throw('function not implemented');
			}
		}));
		/** @test {Module#deactivate} */
		it('Module#deactivate fails without overwriting', mochaAsync(
			async() => {
				// eslint-disable-next-line no-new
				const blank = new Blank({});
				let error;
				try {
					await blank.deactivate();
				} catch (e) {
					error = e;
				} finally {
					const fn = () => { throw error; };
					expect(fn).to.throw(ReferenceError);
					expect(fn).to.throw('function not implemented');
				}
			})
		);
		/** @test {Module#install} */
		it('Module#install fails without overwriting', mochaAsync(async() => {
			// eslint-disable-next-line no-new
			const blank = new Blank({});
			let error;
			try {
				await blank.install();
			} catch (e) {
				error = e;
			} finally {
				const fn = () => { throw error; };
				expect(fn).to.throw(ReferenceError);
				expect(fn).to.throw('function not implemented');
			}
		}));
		/** @test {Module#uninstall} */
		it('Module#uninstall fails without overwriting', mochaAsync(async() => {
			// eslint-disable-next-line no-new
			const blank = new Blank({});
			let error;
			try {
				await blank.uninstall();
			} catch (e) {
				error = e;
			} finally {
				const fn = () => { throw error; };
				expect(fn).to.throw(ReferenceError);
				expect(fn).to.throw('function not implemented');
			}
		}));
		/** @test {Module#activate} */
		it('Module#activate fails without overwriting', mochaAsync(async() => {
			// eslint-disable-next-line no-new
			const blank = new Blank({});
			let error;
			try {
				await blank.activate();
			} catch (e) {
				error = e;
			} finally {
				const fn = () => { throw error; };
				expect(fn).to.throw(ReferenceError);
				expect(fn).to.throw('function not implemented');
			}
		}));
	});

	/** @test {Module} */
	describe('Module with functions', () => {
		/** @test {Module} */
		it('Module creates items', () => {
			// eslint-disable-next-line no-new
			const mod = new Module1({
				test: {},
			});
			expect(mod.test).to.be.empty;
		});
		/** @test {Module} */
		it('Module creates subitems', () => {
			// eslint-disable-next-line no-new
			const mod = new Module1({
				test: {
					var: 1,
				},
			});
			expect(mod.test.var).to.equal(1);
		});
	});
});
