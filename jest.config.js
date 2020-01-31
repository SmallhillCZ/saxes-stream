module.exports = {

    transform: { '^.+\\.ts?$': 'ts-jest' },

    testEnvironment: 'node',

    testRegex: '/tests/.*\\.ts$',

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']

};