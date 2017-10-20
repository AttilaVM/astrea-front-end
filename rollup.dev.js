import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";
const commonjs = require('rollup-plugin-commonjs');
import eslint from "rollup-plugin-eslint";

function glsl() {

  return {

    transform( code, id ) {

      if ( /\.glsl$/.test( id ) === false ) return;

      var transformedCode = "export default " + JSON.stringify(
        code
          .replace( /[ \t]*\/\/.*\n/g, "" ) // remove //
          .replace( /[ \t]*\/\*[\s\S]*?\*\//g, "" ) // remove /* */
          .replace( /\n{2,}/g, "\n" ) // # \n+ to \n
      ) + ";";
      return {
        code: transformedCode
        ,map: { mappings: "" }
      };

    }

  };
}

export default {
  entry: "src/index.js"
  ,plugins: [
    glsl()
    , eslint({
      exclude: [
        "src/styles/**"
      ]})
    , babel({exclude: "node_modules/**"})
    // , commonjs({
    //   include: 'node_modules/**'
    // })
    , resolve({
      browser: true
    })
    , commonjs()
    // , resolve({
    //   // use "module" field for ES6 module if possible
    //   module: true // Default: true

    //   // use "jsnext:main" if possible
    //   // – see https://github.com/rollup/rollup/wiki/jsnext:main
    //   ,jsnext: true  // Default: false

    //   // use "main" field or index.js, even if it's not an ES6 module
    //   // (needs to be converted from CommonJS to ES6
    //   // – see https://github.com/rollup/rollup-plugin-commonjs
    //   ,main: true  // Default: true

    //   // some package.json files have a `browser` field which
    //   // specifies alternative files to load for people bundling
    //   // for the browser. If that's you, use this option, otherwise
    //   // pkg.browser will be ignored
    //   ,browser: true  // Default: false

    //   // not all files you want to resolve are .js files
    //   ,extensions: [ ".js", ".json" ]  // Default: ['.js']

    //   // whether to prefer built-in modules (e.g. `fs`, `path`) or
    //   // local ones with the same names
    //   ,preferBuiltins: false  // Default: true

    //   // Lock the module search in this path (like a chroot). Module defined
    //   // outside this path will be mark has external
    //   // jail: '/my/jail/path', // Default: '/'

    //   // If true, inspect resolved files to check that they are
    //   // ES2015 modules
    //   // modulesOnly: true, // Default: false

    //   // Any additional options that should be passed through
    //   // to node-resolve
    //   // customResolveOptions: {
    //   //		moduleDirectory: 'js_modules'
    //   // }
    // })
  ]
  ,sourceMap: true
  ,targets: [
    {
      format: "iife"
      ,moduleName: "CellVis"
      ,dest: "app/dist/cellvis.js"
    }
    ,{
      format: "es"
      ,dest: "app/dist/cellvis.module.js"
    }
  ]
};
