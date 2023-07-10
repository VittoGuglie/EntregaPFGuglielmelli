export default {
    testMatch: ['**/src/testing/**/users.router.test.js'],

    // Directorios que deben ser ignorados durante las pruebas
    testPathIgnorePatterns: ['/node_modules/'],

    // Configura los transformadores para los diferentes tipos de archivos
    transform: {
      '^.+\\.js$': 'babel-jest', // Utiliza Babel para transpilar archivos JavaScript
    },
};