#!/usr/bin/env node
import { createTestHarness } from "./test-runner.mjs";
import { registerSiteFooterTests } from "../client/src/components/site-footer/tests/site-footer.test.mjs";
import { registerSiteHeaderTests } from "../client/src/components/site-header/tests/site-header.test.mjs";
import { registerHomePageTests } from "../client/src/pages/home/tests/home-page.test.mjs";

const harness = createTestHarness();

registerSiteFooterTests(harness.test);
registerSiteHeaderTests(harness.test);
registerHomePageTests(harness.test);

await harness.run();
