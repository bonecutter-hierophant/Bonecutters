export function createTestHarness() {
  const tests = [];

  return {
    test(name, fn) {
      tests.push({ name, fn });
    },
    async run() {
      for (const entry of tests) {
        await entry.fn();
        console.log(`ok - ${entry.name}`);
      }
      console.log(`\n${tests.length} test${tests.length === 1 ? "" : "s"} passed.`);
    }
  };
}
