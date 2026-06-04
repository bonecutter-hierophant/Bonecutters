# Site Header

This component owns the reusable public site header and branded navigation.

Local diagram: `site-header.puml`.

Responsibilities:

- render the public `header` landmark
- keep the primary navigation semantic and keyboard accessible
- compose the reusable `SiteBrand`
- expose the launch page section anchors
- stay available at the top of the viewport while scrolling
- expose a mobile hamburger menu with the same section anchors
- compact the visible brand mark and apply scrolled header chrome at the same scroll threshold

Inputs:

- `SiteBrand`
- launch page section ids: `about`, `work`, `writing`, `name`, and `contact`

Outputs:

- branded top navigation for public pages
- sticky header behavior for long-page reading
- desktop and mobile navigation to the same page sections
- module-local tests under `tests/` linked through `npm run verify:test`

Contract rules:

- page-specific layout and copy should stay with the page owner
- navigation controls should use Web Awesome primitives when the interaction grows beyond plain text links
- this component owns only persistent labels and anchors, not section body copy
- mobile menu state stays local to the header and closes after a link is selected
- logo compaction and scrolled header chrome share one small hysteresis threshold
- the outer sticky header reserves the expanded header height while the inner nav owns the visible background band
- scroll state should not change the sticky header's layout height
- scroll state should only affect header presentation, not page routing

Verification:

- `npm run verify:test`
- `npm run verify:safe`
