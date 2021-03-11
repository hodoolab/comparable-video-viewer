// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!

const ts = require('@wessberg/rollup-plugin-ts');
const visualizer = require('rollup-plugin-visualizer');
const copy = require('rollup-plugin-copy');

const now = new Date(Date.now());

const config = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    const { plugins } = config;

    // swap out rollup-plugin-typescript2
    config.plugins = plugins.map(plugin => {
      if (plugin && plugin.name === 'rpt2') {
        return ts({
          tsconfig: tsconfig => {
            return {
              ...tsconfig,
              target: 'ESNext',
              sourceMap: true,
              declaration: true,
              open: true,
            };
          },
          transpiler: 'babel',
        });
      }
      return plugin;
    });

    config.plugins.push(
      visualizer({
        filename: `buildStats.html`,
        title: `${options.name} Rollup Report (${now.toDateString()})`,
        template: 'circlepacking',
        sourcemap: true,
      }),
      copy({
        targets: [{ src: 'src/assets/*', dest: 'dist/assets' }],
        // copyOnce: true,

        // targets: [{ src: 'src/assets/*', dest: ['dist/assets', 'lib/src/assets'] }],
      })
    );
    return { ...config }; // always return a config.
  },
};

module.exports = config;
