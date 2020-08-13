module.exports = {

    transform: { '^.+\\.ts?$': 'ts-jest' },

    testEnvironment: 'node',

    testRegex: '/src/tests/.*\\.ts$',

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']

};