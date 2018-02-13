import babel from "rollup-plugin-babel";
import rootImport from "rollup-plugin-root-import";
import resolve from "rollup-plugin-node-resolve";
const commonjs = require("rollup-plugin-commonjs");
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
        code: transformedCode,
        map: { mappings: "" }
      };

    }

  };
}

export default {
  input: "src/index.js",
  plugins: [
    glsl(),
    eslint({
      exclude: [
        "src/styles/**"
      ]}),
    babel({ babelrc: false,
      presets: ["es2015-rollup"],
      exclude: "node_modules/**"
    }),
    rootImport({
      root: `${__dirname}/src`,
      useEntry: "prepend",
      extensions: ".js"
    }),
    resolve({
      browser: true
    }),
    commonjs()
  ],
  output: [
    {
      name: "CellVis",
      sourcemap: true,
      file: "./dist/cellvis.js",
      format: "iife"
    }
  ]
};
