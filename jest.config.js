/** @type {import('jest').Config} */
module.exports = {
	roots: ['<rootDir>/dist'],
	testMatch: ['**/?(*.)+(test).js'],
	testPathIgnorePatterns: ['\\.d\\.ts$'],
	testEnvironment: 'node',
};
