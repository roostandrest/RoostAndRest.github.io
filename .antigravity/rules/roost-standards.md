# Roost & Rest CRM Development Standards

## 1. Dual Entry Points Sync (CRITICAL)
- The project has two HTML entry points: `admin.html` (direct web admin) and `index.html` (PWA start_url defined in `manifest.json`).
- Whenever scripts, version query params (`?v=...`), or headers are modified in `admin.html`, `index.html` **MUST BE UPDATED IN SYNC (100% IDENTICAL)**.
- If `index.html` is missed, installed PWA app users will run outdated, cached scripts.
- Always bump `sw.js` cache versions (`CACHE_NAME` & `RUNTIME_CACHE`) whenever JS modules are updated.

## 2. Modal Close Button Styling
- The CSS class `.modal-close` (in `style.css`) is hardcoded to `width: 30px; height: 30px; border-radius: 50%` designed ONLY for the top-right circular `✕` icon.
- **NEVER** apply `class="modal-close"` to text buttons in modal footers (e.g., `✕ Close Ledger`, `Close`).
- Modal footer close buttons must use standard button styling with explicit padding and text colors.

## 3. Strict UTF-8 Encoding (Zero BOM)
- All `.html`, `.js`, and `.css` files must strictly be UTF-8 without BOM (`byte[0] !== 0xEF`).
- Avoid using PowerShell `Set-Content` directly without strict ASCII/utf8NoBOM encoding as it can introduce byte-order marks that break emojis and layout.

## 4. No Fake Financial Multipliers
- Never hardcode mock operational expense fallbacks (e.g. `* 0.38` or `* 0.62`) in analytics or dashboards.
- All metrics (Revenue, Profit, Expenses) must derive 100% from actual database rows (`expenses`, `guest_register`, `payment_history`). If zero expenses are recorded in DB, expenses must strictly show as ₹0.
