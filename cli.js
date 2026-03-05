#!/usr/bin/env node

/**
 * @everystate/router CLI - opt-in self-test
 *
 * Usage:
 *   npx everystate-router-self-test          # run self-test
 *   npx everystate-router-self-test --help   # show help
 */

(async () => {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
@everystate/router - self-test CLI

Usage:
  everystate-router-self-test          Run the bundled self-test
  everystate-router-self-test --help   Show this help message

The self-test verifies the pure-function core of the router:
pattern compilation, path normalization, and route resolution.

It is zero-dependency - no @everystate/core or DOM required.
It is opt-in and never runs automatically on install.
`.trim());
    process.exit(0);
  }

  try {
    await import('./self-test.js');
  } catch (err) {
    console.error('Self-test failed:', err.message);
    process.exit(1);
  }
})();
