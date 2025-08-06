#!/usr/bin/env node

/**
 * Test Runner Script
 *
 * This script provides different ways to run tests:
 * - Unit tests only
 * - Integration tests only
 * - E2E tests (requires backend running)
 * - All tests with coverage
 */

const { spawn } = require("child_process");
const path = require("path");

const testTypes = {
  unit: {
    pattern: "__tests__/(lib|utils|stores)/",
    description: "Run unit tests (API client, stores, utilities)",
  },
  component: {
    pattern: "__tests__/components/",
    description: "Run component tests",
  },
  integration: {
    pattern: "__tests__/integration/",
    description: "Run integration tests",
  },
  e2e: {
    pattern: "__tests__/e2e/",
    description: "Run end-to-end tests (requires backend running)",
    env: { RUN_E2E_TESTS: "true" },
  },
  all: {
    description: "Run all tests with coverage",
  },
};

function runTests(type, options = {}) {
  const testConfig = testTypes[type];
  if (!testConfig) {
    console.error(`Unknown test type: ${type}`);
    console.log("Available types:", Object.keys(testTypes).join(", "));
    process.exit(1);
  }

  const args = ["test"];

  if (testConfig.pattern) {
    args.push("--testPathPattern", testConfig.pattern);
  }

  if (options.watch) {
    args.push("--watch");
  }

  if (options.coverage || type === "all") {
    args.push("--coverage");
  }

  if (options.verbose) {
    args.push("--verbose");
  }

  const env = {
    ...process.env,
    ...testConfig.env,
  };

  console.log(`\n🧪 ${testConfig.description}`);
  console.log(`Running: npm ${args.join(" ")}\n`);

  const child = spawn("npm", args, {
    stdio: "inherit",
    env,
    cwd: process.cwd(),
  });

  child.on("exit", (code) => {
    process.exit(code);
  });
}

function showHelp() {
  console.log(`
🧪 Game Store Test Runner

Usage: node test-runner.js <type> [options]

Test Types:
${Object.entries(testTypes)
  .map(([key, config]) => `  ${key.padEnd(12)} - ${config.description}`)
  .join("\n")}

Options:
  --watch      Run tests in watch mode
  --coverage   Generate coverage report
  --verbose    Show verbose output
  --help       Show this help message

Examples:
  node test-runner.js unit                    # Run unit tests
  node test-runner.js component --watch       # Run component tests in watch mode
  node test-runner.js integration --coverage  # Run integration tests with coverage
  node test-runner.js e2e                     # Run E2E tests (backend must be running)
  node test-runner.js all                     # Run all tests with coverage

Note: E2E tests require the backend API to be running on http://localhost:5179
`);
}

// Parse command line arguments
const args = process.argv.slice(2);
const type = args[0];
const options = {
  watch: args.includes("--watch"),
  coverage: args.includes("--coverage"),
  verbose: args.includes("--verbose"),
};

if (!type || args.includes("--help")) {
  showHelp();
  process.exit(0);
}

runTests(type, options);
