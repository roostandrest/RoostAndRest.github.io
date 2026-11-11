// ═══════════════════════════════════════════════════════════
// ❓ ROOST AND REST STAYS (Roost & Rest) — HELP CENTER & OPERATING GUIDE
// Complete Step-by-Step Software Manual, Workflows & Keyboard Shortcuts
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  window._helpActiveTab = 'all';

  window.renderHelpAndGuide = function() {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0 || /iPad|iPhone|iPod/.test(navigator.userAgent);
    const cmdSymbol = isMac ? '⌘' : 'Ctrl+';
    const altSymbol = isMac ? '⌥' : 'Alt+';

    const SHORTCUTS_DATA = [
      { key: `${cmdSymbol}K`, single: '/', title: 'Universal Command Search', desc: 'Poore CRM me koi bhi guest name, phone, flat number ya screen 1 second me dhoondhein.', action: 'window.openCommandPalette()' },
      { key: `${altSymbol}O`, single: 'O', title: 'Today · Operations Hub', desc: 'Aaj ke check-ins, check-outs, in-house guests aur frontdesk execution queue.', action: 'window.openOperationsShortcut()' },
      { key: `${altSymbol}H`, single: 'H', title: 'Executive Financial Dashboard', desc: 'Real-time Net Revenue, ADR, RevPAR, NOI, channels aur 18 properties leaderboard.', action: 'window.openDashboardShortcut()' },
      { key: `${altSymbol}N`, single: 'N', title: 'New Booking Create Karein', desc: 'Naya reservation wizard kholein aur guest details enter karein.', action: 'window.openNewBookingShortcut()' },
      { key: `${cmdSymbol}S`, single: 'S', title: 'Save Booking / Form Instantly', desc: 'Booking form ya wizard open hone par turant save karein.', action: 'if(window.triggerSaveBookingShortcut) window.triggerSaveBookingShortcut()' },
      { key: 'E', single: 'E', title: 'Edit Selected Booking / Expenses', desc: 'Booking card ya drawer open hone par direct E dabakar edit karein.', action: 'if(window.editCurrentSelectedBooking) window.editCurrentSelectedBooking()' },
      { key: `${altSymbol}P`, single: 'P', title: 'Quick Payment / Add Payment', desc: 'Active booking ka payment add karein ya pending dues settle karein.', action: 'window.openQuickPaymentShortcut()' },
      { key: `${altSymbol}D`, single: 'D', title: 'Duplicate Booking / Rebook', desc: 'Purane guest ki details clone karke nayi date par re-book karein.', action: 'window.duplicateExistingBookingShortcut()' },
      { key: `${altSymbol}C`, single: 'C', title: 'Reservations Calendar', desc: 'Sabhi 18 properties ka multi-unit occupancy timeline grid dekhein.', action: 'window.openCalendarShortcut()' },
      { key: `${altSymbol}B`, single: 'B', title: 'Bookings Management Hub', desc: 'All confirmed, active, check-in aur check-out bookings ki complete register.', action: 'window.openBookingsShortcut()' },
      { key: `${altSymbol}F`, single: 'F', title: 'Flats Status & Turnaround', desc: 'Real-time room cleanliness, dirty status aur turnaround Kanban board.', action: 'window.openFlatsShortcut()' },
      { key: `${altSymbol}U`, single: 'U', title: 'Units & Master Pricing', desc: '19 units ki live inventory, nightly rates, caretaker & manager contacts.', action: 'window.openUnitsShortcut()' },
      { key: `${altSymbol}Q`, single: 'Q', title: 'Universal Claims & Anwar OD', desc: 'Daily Closing Statements, Anwar OD ledger & vendor claim approvals.', action: 'window.openClaimShortcut()' },
      { key: `${altSymbol}E`, single: 'E', title: 'Expenses & Outflow Hub', desc: 'Expenses page par jayein (Wi-Fi, Maintenance, Laundry, Staff Advances & P&L).', action: 'window.openExpensesShortcut()', altKey: `${altSymbol}⇧E for Add Expense` },
      { key: `${altSymbol}T`, single: 'T', title: 'Staff Tasks & Checklists', desc: 'Housekeeping, deep cleans aur staff maintenance tasks list.', action: 'window.openTasksShortcut()', altKey: `${altSymbol}⇧T for New` },
      { key: `${altSymbol}A`, single: 'A', title: 'Staff Salary Advances Tracker', desc: 'Employees ko di gayi peshgi (loan/advance) aur pending balance.', action: 'window.openAdvanceShortcut()', altKey: `${altSymbol}⇧A for New` },
      { key: `${altSymbol}W`, single: 'W', title: 'WhatsApp Communications Hub', desc: 'Guest ko welcome letter, invoice, location map aur directions bhejein.', action: 'window.openWhatsAppShortcut()' },
      { key: `${altSymbol}I`, single: 'I', title: 'Investors Hub & Payouts', desc: 'Property investors ke shares, payout slips aur monthly sheets.', action: 'window.openInvestorsShortcut()' },
      { key: `${altSymbol}L`, single: 'L', title: 'Laundry Management', desc: 'Linens, chadar, towels wash cycles aur vendor payments.', action: 'window.openLaundryShortcut()' },
      { key: `${altSymbol}X`, single: 'X', title: 'Monthly Expenses & P&L', desc: 'Property-wise Wi-Fi, maintenance aur operational profit-loss.', action: 'window.openExpensesShortcut()' },
      { key: '?', single: 'F1', title: 'Help Center & Manual', desc: 'Is Help page aur keyboard cheatsheet modal ko kisi bhi waqt kholein.', action: 'navigate("help")' },
      { key: 'ESC', single: 'Esc', title: 'Close Drawer / Dismiss Modal', desc: 'Kisi bhi khule hue drawer, popup ya menu ko turant band karein.', action: 'document.querySelectorAll(".modal-overlay").forEach(m=>m.remove())' }
    ];

    window._helpShortcutsData = SHORTCUTS_DATA;

    const html = `
      <style id="roost-help-center-css">
        .tuhh-help-wrap {
          max-width: 1140px;
          margin: 0 auto;
          padding: 20px 16px 80px;
          color: #1E293B;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* Hero Header */
        .tuhh-help-hero {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 28px 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          text-align: center;
          margin-bottom: 20px;
        }
        .tuhh-help-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #EFF6FF;
          color: #1D4ED8;
          padding: 4px 12px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .tuhh-pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2563EB;
          animation: tuhhPulse 1.8s infinite;
        }
        @keyframes tuhhPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        .tuhh-help-hero-title {
          font-size: 24px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px 0;
          letter-spacing: -0.4px;
        }
        .tuhh-help-hero-sub {
          font-size: 13.5px;
          color: #64748B;
          max-width: 650px;
          margin: 0 auto 20px auto;
          line-height: 1.5;
        }

        /* Search & Actions */
        .tuhh-help-search-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          max-width: 720px;
          margin: 0 auto;
          flex-wrap: wrap;
        }
        .tuhh-help-search-box {
          position: relative;
          flex: 1 1 320px;
          display: flex;
          align-items: center;
        }
        .tuhh-help-search-box .tuhh-search-icon {
          position: absolute;
          left: 14px;
          font-size: 16px;
          color: #94A3B8;
          pointer-events: none;
        }
        .tuhh-help-search-box input {
          width: 100%;
          height: 42px;
          background: #F8FAFC;
          border: 1.5px solid #CBD5E1;
          border-radius: 9999px;
          padding: 0 36px 0 38px;
          font-size: 13.5px;
          color: #0F172A;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .tuhh-help-search-box input:focus {
          background: #FFFFFF;
          border-color: #0F766E;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.12);
        }
        .tuhh-help-search-clear {
          position: absolute;
          right: 10px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #E2E8F0;
          border: none;
          color: #475569;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 0;
          min-height: unset;
        }
        .tuhh-help-search-clear:hover {
          background: #CBD5E1;
          color: #0F172A;
        }
        .tuhh-help-cheatsheet-btn {
          height: 42px;
          padding: 0 16px;
          border-radius: 9999px;
          background: #F1F5F9;
          border: 1.5px solid #CBD5E1;
          color: #334155;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          min-height: unset;
          transition: all 0.15s ease;
        }
        .tuhh-help-cheatsheet-btn:hover {
          background: #0F172A;
          color: #FFFFFF;
          border-color: #0F172A;
        }

        /* Nav Tabs */
        .tuhh-help-nav-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 4px 2px 14px;
          margin-bottom: 18px;
          scrollbar-width: none;
        }
        .tuhh-help-nav-tabs::-webkit-scrollbar { display: none; }
        .tuhh-help-tab-btn {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #475569;
          padding: 6px 14px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
          min-height: unset;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .tuhh-help-tab-btn:hover {
          background: #F8FAFC;
          color: #0F172A;
          border-color: #94A3B8;
        }
        .tuhh-help-tab-btn.active {
          background: #0F172A !important;
          color: #FFFFFF !important;
          border-color: #0F172A !important;
          box-shadow: 0 2px 6px rgba(15,23,42,0.18) !important;
          font-weight: 700 !important;
        }

        /* Section Blocks */
        .tuhh-help-section-block {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 14px;
          padding: 22px 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }
        .tuhh-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #F1F5F9;
        }
        .tuhh-section-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .tuhh-section-title {
          font-size: 16.5px;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }
        .tuhh-section-subtitle {
          font-size: 12.5px;
          color: #64748B;
          margin: 2px 0 0 0;
        }

        /* Steps Grid */
        .tuhh-steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 12px;
        }
        .tuhh-step-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 8px;
          transition: all 0.15s ease;
        }
        .tuhh-step-card:hover {
          background: #FFFFFF;
          border-color: #CBD5E1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.04);
        }
        .tuhh-step-num {
          font-size: 10.5px;
          font-weight: 800;
          color: #0284C7;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .tuhh-step-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          margin: 0;
        }
        .tuhh-step-desc {
          font-size: 12px;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }
        .tuhh-step-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #334155;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 3px 8px;
          border-radius: 6px;
          width: fit-content;
        }

        /* Workflows */
        .tuhh-workflow-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .tuhh-wf-card {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 16px;
        }
        .tuhh-wf-badge {
          display: inline-block;
          background: #0F172A;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 5px;
          margin-bottom: 10px;
        }
        .tuhh-wf-content h4 {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 6px 0;
        }
        .tuhh-wf-content p, .tuhh-wf-content ul {
          font-size: 12.5px;
          color: #334155;
          line-height: 1.55;
          margin: 0;
        }
        .tuhh-wf-content ul {
          padding-left: 18px;
          margin-top: 6px;
        }
        .tuhh-wf-content li {
          margin-bottom: 4px;
        }
        .tuhh-tip-box {
          background: #EFF6FF;
          border-left: 3px solid #3B82F6;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          color: #1E40AF;
          margin-top: 10px;
        }

        /* Grids & Cards */
        .tuhh-grid-2 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 12px;
        }
        .tuhh-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }
        .tuhh-grid-4 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 12px;
        }
        .tuhh-info-box, .tuhh-card-compact, .tuhh-wa-card, .tuhh-faq-item {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 14px;
        }
        .tuhh-info-box h4, .tuhh-card-compact h4, .tuhh-wa-card h4, .tuhh-faq-item h4 {
          font-size: 13.5px;
          font-weight: 700;
          color: #0F172A;
          margin: 0 0 6px 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tuhh-info-box p, .tuhh-card-compact p, .tuhh-wa-card p, .tuhh-faq-item p {
          font-size: 12px;
          color: #475569;
          line-height: 1.5;
          margin: 0;
        }
        .tuhh-info-box ul {
          font-size: 12px;
          color: #475569;
          padding-left: 18px;
          margin: 6px 0 0 0;
        }
        .tuhh-info-box li {
          margin-bottom: 4px;
        }
        .tuhh-card-icon, .tuhh-wa-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          margin-bottom: 8px;
        }
        .tuhh-legend-item {
          font-size: 12px;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .tuhh-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .tuhh-action-inline-btn {
          background: #0F172A;
          color: #FFFFFF;
          border: none;
          padding: 7px 14px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: unset;
          transition: all 0.15s ease;
        }
        .tuhh-action-inline-btn:hover {
          background: #1E293B;
        }

        /* Keyboard Shortcuts Grid */
        .tuhh-shortcuts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
          gap: 10px;
        }
        .tuhh-sc-item {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          transition: all 0.15s ease;
        }
        .tuhh-sc-item:hover {
          background: #FFFFFF;
          border-color: #CBD5E1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .tuhh-sc-keys {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }
        .tuhh-sc-keys kbd, .tuhh-step-badge kbd, .tuhh-card-link kbd {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-bottom: 2px solid #94A3B8;
          border-radius: 5px;
          padding: 2px 6px;
          font-size: 11px;
          font-weight: 700;
          color: #0F172A;
          box-shadow: 0 1px 1px rgba(0,0,0,0.04);
          white-space: nowrap;
        }
        .tuhh-sc-or {
          font-size: 10px;
          color: #94A3B8;
          font-weight: 600;
        }
        .tuhh-sc-details {
          flex: 1;
          min-width: 0;
        }
        .tuhh-sc-title {
          font-size: 12.5px;
          font-weight: 700;
          color: #0F172A;
          margin-bottom: 1px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tuhh-sc-desc {
          font-size: 11px;
          color: #64748B;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tuhh-sc-run-btn {
          background: #FFFFFF;
          color: #0F766E;
          border: 1px solid #CBD5E1;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          min-height: unset;
          transition: all 0.15s ease;
        }
        .tuhh-sc-run-btn:hover {
          background: #0F766E !important;
          color: #FFFFFF !important;
          border-color: #0F766E !important;
        }

        @media (max-width: 640px) {
          .tuhh-help-wrap { padding: 12px 10px 80px; }
          .tuhh-help-hero { padding: 20px 14px; }
          .tuhh-help-hero-title { font-size: 20px; }
          .tuhh-help-search-row { flex-direction: column; width: 100%; }
          .tuhh-help-search-box { width: 100%; }
          .tuhh-help-cheatsheet-btn { width: 100%; justify-content: center; }
          .tuhh-help-section-block { padding: 16px 12px; }
          .tuhh-grid-2, .tuhh-grid-3, .tuhh-grid-4, .tuhh-steps-grid { grid-template-columns: 1fr; }
        }
      </style>

      <div class="tuhh-help-wrap">
        <!-- ─── HERO HEADER ─── -->
        <div class="tuhh-help-hero">
          <div class="tuhh-help-hero-badge">
            <span class="tuhh-pulse-dot"></span>
            <span>Roost &amp; Rest Stays · Knowledge Base &amp; Manual</span>
          </div>
          <h1 class="tuhh-help-hero-title">Help Center &amp; Operating Guide</h1>
          <p class="tuhh-help-hero-sub">
            Step-by-step software manual, guest check-in workflows, financial intelligence &amp; high-speed shortcuts for managing 18 properties.
          </p>

          <!-- Search & Filter Bar inside Help -->
          <div class="tuhh-help-search-row">
            <div class="tuhh-help-search-box">
              <span class="tuhh-search-icon">🔍</span>
              <input type="text" id="helpGuideSearch" placeholder="Search guide: e.g. 'check-in', 'upi', 'advance', 'shortcut', 'wifi', 'adr'..." oninput="window.filterHelpGuideContent(this.value)" autocomplete="off" />
              <button type="button" class="tuhh-help-search-clear" onclick="const i=document.getElementById('helpGuideSearch');i.value='';window.filterHelpGuideContent('');" title="Clear Search">✕</button>
            </div>
            <button type="button" class="tuhh-help-cheatsheet-btn" onclick="window.openShortcutsModal()" title="View Keyboard Cheatsheet Modal">
              <span>⌨️ Shortcuts Cheatsheet (${cmdSymbol}K / ?)</span>
            </button>
          </div>
        </div>

        <!-- ─── TAB FILTER BAR ─── -->
        <div class="tuhh-help-nav-tabs">
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'all' ? 'active' : ''}" data-tab="all" onclick="window.switchHelpTab('all')">
            <span>✨ All Modules</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'overview' ? 'active' : ''}" data-tab="overview" onclick="window.switchHelpTab('overview')">
            <span>🚀 Quick Start</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'bookings' ? 'active' : ''}" data-tab="bookings" onclick="window.switchHelpTab('bookings')">
            <span>🛏️ Bookings &amp; Check-In</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'calendar' ? 'active' : ''}" data-tab="calendar" onclick="window.switchHelpTab('calendar')">
            <span>📅 Calendar &amp; Sync</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'analytics' ? 'active' : ''}" data-tab="analytics" onclick="window.switchHelpTab('analytics')">
            <span>📊 Analytics &amp; NOI</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'upi-sync' ? 'active' : ''}" data-tab="upi-sync" onclick="window.switchHelpTab('upi-sync')">
            <span>⚡ Zero-Fee UPI Engine</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'claims' ? 'active' : ''}" data-tab="claims" onclick="window.switchHelpTab('claims')">
            <span>📜 Claims &amp; OD</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'expenses' ? 'active' : ''}" data-tab="expenses" onclick="window.switchHelpTab('expenses')">
            <span>💰 Expenses &amp; Wi-Fi</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'hrms' ? 'active' : ''}" data-tab="hrms" onclick="window.switchHelpTab('hrms')">
            <span>👥 Staff &amp; Tasks</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'whatsapp' ? 'active' : ''}" data-tab="whatsapp" onclick="window.switchHelpTab('whatsapp')">
            <span>💬 WhatsApp Hub</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'shortcuts' ? 'active' : ''}" data-tab="shortcuts" onclick="window.switchHelpTab('shortcuts')">
            <span>⌨️ Keyboard Shortcuts</span>
          </button>
          <button type="button" class="tuhh-help-tab-btn ${window._helpActiveTab === 'tips' ? 'active' : ''}" data-tab="tips" onclick="window.switchHelpTab('tips')">
            <span>💡 Pro Tips &amp; FAQ</span>
          </button>
        </div>

        <!-- ─── GUIDE CONTENT CONTAINER ─── -->
        <div class="tuhh-help-sections" id="helpSectionsContainer">

          <!-- SECTION 1: QUICK START WORKFLOW -->
          <div class="tuhh-help-section-block" data-category="overview" id="section-overview">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#EFF6FF;color:#2563EB;">🚀</div>
              <div>
                <h2 class="tuhh-section-title">1. Daily Manager Routine (5-Minute Quick Start)</h2>
                <p class="tuhh-section-subtitle">Rozana subah CRM open karke sabse pehle ye 4 steps follow karein across 18 properties:</p>
              </div>
            </div>

            <div class="tuhh-steps-grid">
              <div class="tuhh-step-card">
                <div>
                  <div class="tuhh-step-num">Step 1</div>
                  <h3 class="tuhh-step-title">Today's Operations Queue</h3>
                  <p class="tuhh-step-desc">
                    Top bar me <strong>All Properties (18)</strong> select karein. <strong>Today · Operations</strong> par dekhein ki aaj kin guests ka <strong>Check-in</strong> hai aur kinka <strong>Check-out</strong>.
                  </p>
                </div>
                <div class="tuhh-step-badge"><kbd>${altSymbol}O</kbd> Operations Hub</div>
              </div>

              <div class="tuhh-step-card">
                <div>
                  <div class="tuhh-step-num">Step 2</div>
                  <h3 class="tuhh-step-title">Staff Attendance &amp; Tasks</h3>
                  <p class="tuhh-step-desc">
                    <strong>HRMS &gt; Attendance</strong> me subah duty par aane wale staff ko <strong>Present</strong> mark karein aur cleaning tasks assign karein.
                  </p>
                </div>
                <div class="tuhh-step-badge"><kbd>${altSymbol}T</kbd> Tasks &amp; HRMS</div>
              </div>

              <div class="tuhh-step-card">
                <div>
                  <div class="tuhh-step-num">Step 3</div>
                  <h3 class="tuhh-step-title">Room Cleanliness &amp; Turnaround</h3>
                  <p class="tuhh-step-desc">
                    <strong>Properties &gt; Flat Status</strong> me check karein kaunse room <strong>Clean &amp; Ready</strong> hain aur kaunse <strong>Dirty</strong> hain taaki fast turnaround ho sake.
                  </p>
                </div>
                <div class="tuhh-step-badge"><kbd>${altSymbol}F</kbd> Flats Status</div>
              </div>

              <div class="tuhh-step-card">
                <div>
                  <div class="tuhh-step-num">Step 4</div>
                  <h3 class="tuhh-step-title">Executive Financial Overview</h3>
                  <p class="tuhh-step-desc">
                    <strong>Finances &gt; Executive Dashboard</strong> me live portfolio metrics (Net Revenue, Net Operating Income, Occupancy %, ADR, RevPAR) track karein.
                  </p>
                </div>
                <div class="tuhh-step-badge"><kbd>${altSymbol}H</kbd> Analytics Suite</div>
              </div>
            </div>
          </div>

          <!-- SECTION 2: BOOKINGS & CHECK-IN -->
          <div class="tuhh-help-section-block" data-category="bookings" id="section-bookings">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#F0FDF4;color:#16A34A;">🛏️</div>
              <div>
                <h2 class="tuhh-section-title">2. Bookings, Check-In &amp; Special Timing Guide</h2>
                <p class="tuhh-section-subtitle">Nayi reservation create karne se lekar special timings, Aadhaar upload aur instant settlement tak ka complete flow:</p>
              </div>
            </div>

            <div class="tuhh-workflow-list">
              <div class="tuhh-wf-card">
                <div class="tuhh-wf-badge">1. Nayi Booking Banana</div>
                <div class="tuhh-wf-content">
                  <h4>Kaise banayein?</h4>
                  <p>Top-right me <strong>+ New Booking</strong> button par click karein ya keyboard par <strong>N</strong> dabayein.</p>
                  <ul>
                    <li><strong>Guest Info:</strong> Guest ka Name, Mobile Number aur City enter karein.</li>
                    <li><strong>Dates &amp; Room:</strong> Check-in Date, Check-out Date aur Property / Flat number select karein.</li>
                    <li><strong>Channel:</strong> Select karein ki booking Direct (Phone/Walk-in) aayi hai ya Airbnb / Booking.com / Agoda se.</li>
                    <li><strong>Pricing:</strong> Total amount enter karein. Advance amount enter karte hi remaining balance auto-calculate ho jayega.</li>
                  </ul>
                  <div class="tuhh-tip-box">
                    💡 <strong>Fast Key Tip:</strong> Form fill karte waqt direct <strong>${cmdSymbol}S</strong> dabane se booking form instantly save ho jata hai!
                  </div>
                </div>
              </div>

              <div class="tuhh-wf-card">
                <div class="tuhh-wf-badge">2. Guest Check-In &amp; ID Proof</div>
                <div class="tuhh-wf-content">
                  <h4>Guest Aane Par:</h4>
                  <ul>
                    <li>Bookings list me guest ke card par <strong>Check-In</strong> button dabayein.</li>
                    <li>Camera icon par tap karke guest ka <strong>Aadhaar Card / Passport</strong> upload karein.</li>
                    <li>Room status automatically <strong>Occupied</strong> mark ho jayega.</li>
                    <li>Guest ko <strong>WhatsApp</strong> icon par click karke welcome message aur Wi-Fi password bhej dein.</li>
                  </ul>
                </div>
              </div>

              <div class="tuhh-wf-card">
                <div class="tuhh-wf-badge">3. Payment &amp; Balance Settlement</div>
                <div class="tuhh-wf-content">
                  <h4>Payment Log Karna:</h4>
                  <ul>
                    <li>Kisi bhi booking ka payment add karne ke liye booking card par <strong>Add Payment</strong> dabayein ya keyboard par <strong>P</strong> press karein.</li>
                    <li>Payment mode select karein: <strong>UPI / Bank Transfer / Cash</strong>.</li>
                    <li>Jab full payment settle ho jaye to status automatically <strong>Paid (Full Balance Settled)</strong> ho jayega.</li>
                    <li>Guest ko digital receipt bhejne ke liye <strong>Receipt</strong> button dabayein.</li>
                  </ul>
                </div>
              </div>

              <div class="tuhh-wf-card">
                <div class="tuhh-wf-badge">4. Guest Check-Out &amp; Turnaround</div>
                <div class="tuhh-wf-content">
                  <h4>Departure ke waqt:</h4>
                  <ul>
                    <li>Ensure karein ki koi payment pending nahi hai.</li>
                    <li><strong>Check-Out</strong> button dabayein. Booking status 'Completed' ho jayega.</li>
                    <li>Room status automatically <strong>Dirty / Cleaning Required</strong> me convert ho jata hai taaki staff ko turnaround ka notification mil sake.</li>
                  </ul>
                </div>
              </div>

              <div class="tuhh-wf-card" style="border:1.5px solid #DDD6FE;background:#FAF5FF;">
                <div class="tuhh-wf-badge" style="background:#7C3AED;color:#fff;">5. Special Timing Presets (Day-Use, Early Check-In &amp; Late Check-Out)</div>
                <div class="tuhh-wf-content">
                  <h4 style="color:#6D28D9;">Special Timing Scenarios:</h4>
                  <ul>
                    <li><strong>⚡ Same-Day / Day-Use Booking (e.g. 9:30 AM Check-in &amp; 4:30 PM Check-out):</strong><br>
                      New Booking wizard me direct <strong>⚡ Same-Day / Day-Use Preset</strong> button par click karein. Check-in aur Check-out dates automatically Aaj ki set ho jayengi, check-in time <strong>09:30 AM</strong> aur checkout time <strong>04:30 PM</strong> fill ho jayega. Calendar me ye <strong>⚡ Day Use</strong> pill ban kar aayega.
                    </li>
                    <li><strong>🌅 Early Check-In (Subah 09:30 AM ya standard 1 PM se pehle):</strong><br>
                      Booking banate waqt ya Edit me <strong>🌅 09:30 AM</strong> preset dabayein. Flats status me Housekeeping ko priority turnaround banner dikhega.
                    </li>
                    <li><strong>🌇 Late Check-Out (Shaam 4:30 PM ya 6:00 PM tak rukne par):</strong><br>
                      Booking card ya drawer me <strong>🌇 Late Check-Out</strong> button par click karein. New time select karein aur optional late fee enter karke save karein.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 3: CALENDAR & ICAL SYNC -->
          <div class="tuhh-help-section-block" data-category="calendar" id="section-calendar">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#FAF5FF;color:#9333EA;">📅</div>
              <div>
                <h2 class="tuhh-section-title">3. Reservations Calendar &amp; Airbnb iCal Sync</h2>
                <p class="tuhh-section-subtitle">Multi-property timeline calendar ko samajhna aur automated clash prevention:</p>
              </div>
            </div>

            <div class="tuhh-grid-2">
              <div class="tuhh-info-box">
                <h4>🎨 Calendar Color Legend</h4>
                <div class="tuhh-legend-item"><span class="tuhh-dot" style="background:#0284C7;"></span> <strong>Blue Bar:</strong> Direct / Offline Walk-in reservation.</div>
                <div class="tuhh-legend-item"><span class="tuhh-dot" style="background:#FF385C;"></span> <strong>Red/Pink Bar:</strong> Airbnb confirmed reservation.</div>
                <div class="tuhh-legend-item"><span class="tuhh-dot" style="background:#003580;"></span> <strong>Dark Blue:</strong> Booking.com reservation.</div>
                <div class="tuhh-legend-item"><span class="tuhh-dot" style="background:#64748B;"></span> <strong>Slate Grey Bar:</strong> 🔒 Airbnb Blocked / Maintenance dates.</div>
                <div class="tuhh-legend-item"><span class="tuhh-dot" style="background:#10B981;"></span> <strong>Empty White Box:</strong> Available for immediate booking.</div>
              </div>

              <div class="tuhh-info-box">
                <h4>🔄 Airbnb Auto iCal Synchronization</h4>
                <p>
                  CRM me <strong>Multi-Property Realtime iCal Engine</strong> active hai. Jab bhi Airbnb par koi guest booking karta hai ya date block hoti hai, dates automatically CRM me sync hokar block ho jati hain to prevent double-booking across all 18 units.
                </p>
                <p style="margin-top:6px;">
                  Aap Calendar view par kisi bhi empty date par direct click karke instant reservation create kar sakte hain.
                </p>
                <div style="margin-top:14px;">
                  <button type="button" class="tuhh-action-inline-btn" onclick="navigate('calendar')">📅 Open Calendar View (${altSymbol}C)</button>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 4: EXECUTIVE FINANCIAL DASHBOARD -->
          <div class="tuhh-help-section-block" data-category="analytics" id="section-analytics">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#ECFDF5;color:#059669;">📊</div>
              <div>
                <h2 class="tuhh-section-title">4. Executive Financial Analytics &amp; KPIs Guide</h2>
                <p class="tuhh-section-subtitle">Real financial performance metrics samajhna (Finances &gt; Executive Dashboard):</p>
              </div>
            </div>

            <div class="tuhh-grid-3">
              <div class="tuhh-card-compact">
                <div class="tuhh-card-icon" style="background:#EFF6FF;color:#2563EB;">💰</div>
                <h4>Net Revenue &amp; NOI</h4>
                <p><strong>Net Revenue</strong> total room earnings minus OTA commissions hai. <strong>Net Operating Income (NOI)</strong> actual profit hai jo operational kharche deduct karne ke baad bachta hai.</p>
              </div>

              <div class="tuhh-card-compact">
                <div class="tuhh-card-icon" style="background:#F0FDF4;color:#16A34A;">📈</div>
                <h4>Occupancy Rate %</h4>
                <p>18 managed properties me se kitne room-nights book huye. Target 75%+ occupancy maintain karna hota hai taaki revenue maximize ho sake.</p>
              </div>

              <div class="tuhh-card-compact">
                <div class="tuhh-card-icon" style="background:#FFF7ED;color:#EA580C;">🏷️</div>
                <h4>ADR &amp; RevPAR</h4>
                <p><strong>ADR</strong> (Average Daily Rate): Per room average bikne wala rate. <strong>RevPAR</strong> (Revenue Per Available Room): Total inventory capacity ke hisab se per-room performance.</p>
              </div>
            </div>

            <div style="margin-top:14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:14px;">
              <h4 style="margin:0 0 6px 0;font-size:13.5px;color:#0F172A;">📊 Property Rankings &amp; Excel Download</h4>
              <p style="font-size:12px;color:#475569;margin:0 0 10px 0;">
                Dashboard ke bottom me sabhi 18 properties ka real-time performance leaderboard hai. Aap ise <strong>By revenue</strong> ya <strong>By profit</strong> sort kar sakte hain aur top bar me <strong>⬇ Excel</strong> button par click karke complete report download kar sakte hain.
              </p>
              <button type="button" class="tuhh-action-inline-btn" onclick="navigate('analytics')">📊 Open Executive Dashboard (${altSymbol}H)</button>
            </div>
          </div>

          <!-- SECTION 5: ZERO-FEE UPI & BANK AUTO-SYNC -->
          <div class="tuhh-help-section-block" data-category="upi-sync" id="section-upi-sync">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#FEF3C7;color:#D97706;">⚡</div>
              <div>
                <h2 class="tuhh-section-title">5. Roost &amp; Rest Zero-Fee UPI Auto-Sync Engine</h2>
                <p class="tuhh-section-subtitle">100% Free · 0% Payment Gateway Commission · 0-Day Instant Settlement:</p>
              </div>
            </div>

            <div class="tuhh-grid-2">
              <div class="tuhh-wf-card">
                <div class="tuhh-wf-badge" style="background:#10B981;color:#fff;">0% Brokerage Advantage</div>
                <div class="tuhh-wf-content">
                  <h4>Razorpay vs Native UPI Engine:</h4>
                  <ul>
                    <li><strong>Razorpay / Gateways:</strong> 2% + 18% GST (₹5,000 transaction par ₹118 cut hota hai aur paisa T+2 working days me aata hai).</li>
                    <li><strong>Roost &amp; Rest Native Engine:</strong> <strong>₹0 (100% Free)</strong>. Paisa seedha aapke Bank Account me 0 seconds me aata hai without any corporate KYC or monthly quota blocks.</li>
                  </ul>
                </div>
              </div>

              <div class="tuhh-wf-card">
                <div class="tuhh-wf-badge" style="background:#0F172A;color:#fff;">12-Digit UTR Bank Auto-Match</div>
                <div class="tuhh-wf-content">
                  <h4>Kaise Kaam Karta Hai?</h4>
                  <ul>
                    <li><strong>1-Tap UPI Apps:</strong> Guest mobile screen par PhonePe, Google Pay, Paytm, BHIM aur "Open Any UPI App" ka direct button milta hai.</li>
                    <li><strong>Live Radar Backend:</strong> Booking confirmation screen par live radar backend par chalte huye bank settlement match karta hai.</li>
                    <li><strong>Auto-Settlement:</strong> Jaise hi match hota hai, status automatically <strong>"Paid"</strong> ho jata hai aur official digital invoice receipt unlock ho jati hai.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 6: CLAIMS & Anwar OD STATEMENT -->
          <div class="tuhh-help-section-block" data-category="claims" id="section-claims">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#FEF2F2;color:#DC2626;">📜</div>
              <div>
                <h2 class="tuhh-section-title">6. Universal Claims, Anwar OD &amp; Daily Closing Statement</h2>
                <p class="tuhh-section-subtitle">Vendor claims, company advances aur daily financial balance reconciliation:</p>
              </div>
            </div>

            <div class="tuhh-grid-2">
              <div class="tuhh-info-box">
                <h4>💼 Anwar OD Account &amp; Claims Balance</h4>
                <p>
                  Company account (Anwar OD) se staff ko diye gaye funds, deposit entries, aur verified vendor bills (plumbing, electrical, laundry, grocery) <strong>Finances &gt; Anwar OD &amp; Claims</strong> me maintain hote hain.
                </p>
                <div style="margin-top:12px;">
                  <button type="button" class="tuhh-action-inline-btn" onclick="window.openClaimShortcut()">📜 Open Claims Manager (${altSymbol}Q)</button>
                </div>
              </div>

              <div class="tuhh-info-box">
                <h4>📱 Daily Closing Statement &amp; Mobile Proof</h4>
                <p>
                  Roz raat ko daily closing statement auto-generate hota hai: <strong>Today's Inflow (Deposits)</strong> vs <strong>Today's Outflow (Claims)</strong> = <strong>Net Movement &amp; Closing Balance</strong>.
                </p>
                <p style="margin-top:6px;">
                  Aap 1 click me <strong>Download Mobile Proof</strong> (PNG image card) download kar sakte hain ya <strong>Send to WhatsApp Group</strong> par bhej kar owners ko official update de sakte hain.
                </p>
              </div>
            </div>
          </div>

          <!-- SECTION 7: EXPENSES & WI-FI -->
          <div class="tuhh-help-section-block" data-category="expenses" id="section-expenses">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#FFF7ED;color:#EA580C;">💰</div>
              <div>
                <h2 class="tuhh-section-title">7. Expenses, Wi-Fi Recharge &amp; Laundry Management</h2>
                <p class="tuhh-section-subtitle">Kharche kaise enter karein aur company outflow kaise track karein:</p>
              </div>
            </div>

            <div class="tuhh-grid-3">
              <div class="tuhh-card-compact">
                <div class="tuhh-card-icon" style="background:#EFF6FF;color:#2563EB;">🧾</div>
                <h4>Add Expense &amp; Outflow</h4>
                <p>Kisi bhi flat ka kharcha direct log karein. Bill receipt photo attach karein taaki audit trail maintain rahe.</p>
                <div style="margin-top:10px;" class="tuhh-card-link"><kbd>${altSymbol}E</kbd> Expenses Hub</div>
              </div>

              <div class="tuhh-card-compact">
                <div class="tuhh-card-icon" style="background:#F0FDF4;color:#16A34A;">📶</div>
                <h4>Wi-Fi Plans &amp; Recharges</h4>
                <p>Sabhi 18 properties ke Wi-Fi plan expiry dates aur bill payments <strong>Expenses &gt; Wi-Fi</strong> me track hote hain.</p>
                <div style="margin-top:10px;" class="tuhh-card-link"><kbd>${altSymbol}X</kbd> Expenses &amp; P&amp;L</div>
              </div>

              <div class="tuhh-card-compact">
                <div class="tuhh-card-icon" style="background:#FAF5FF;color:#9333EA;">🧺</div>
                <h4>Laundry &amp; Linen Cycles</h4>
                <p>Dhobi ko di gayi chadar, towel aur pillow covers ka count aur per-piece cost <strong>Expenses &gt; Laundry</strong> me enter karein.</p>
                <div style="margin-top:10px;" class="tuhh-card-link"><kbd>${altSymbol}L</kbd> Laundry Tracker</div>
              </div>
            </div>
          </div>

          <!-- SECTION 8: HRMS & TASKS -->
          <div class="tuhh-help-section-block" data-category="hrms" id="section-hrms">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#FDF2F8;color:#DB2777;">👥</div>
              <div>
                <h2 class="tuhh-section-title">8. Staff Attendance, Tasks &amp; Salary Advances</h2>
                <p class="tuhh-section-subtitle">Employees management, daily tasks aur salary advance ka hisab-kitab:</p>
              </div>
            </div>

            <div class="tuhh-grid-2">
              <div class="tuhh-info-box">
                <h4>🧹 Housekeeping &amp; Maintenance Tasks</h4>
                <ul>
                  <li><strong>New Task:</strong> Staff ko task assign karne ke liye <strong>${altSymbol}⇧T</strong> dabayein.</li>
                  <li>Task category select karein: <em>Cleaning, Deep Clean, AC Repair, Plumbing, Grocery</em>.</li>
                  <li>Staff task complete karke status 'Done' mark karta hai jisse live confirmation milta hai.</li>
                </ul>
              </div>

              <div class="tuhh-info-box">
                <h4>💸 Staff Salary Advances (Peshgi)</h4>
                <ul>
                  <li>Kisi employee ko advance cash ya UPI diya jaye, to <strong>${altSymbol}⇧A</strong> dabakar turant record karein.</li>
                  <li>Month-end par salary slip banate waqt system total advance ko salary se <strong>automatically deduct</strong> kar deta hai.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- SECTION 9: WHATSAPP HUB -->
          <div class="tuhh-help-section-block" data-category="whatsapp" id="section-whatsapp">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#ECFDF5;color:#059669;">💬</div>
              <div>
                <h2 class="tuhh-section-title">9. WhatsApp Hub &amp; Automated Guest Messages</h2>
                <p class="tuhh-section-subtitle">Bina mobile number save kiye professional 1-tap WhatsApp messages bhejna:</p>
              </div>
            </div>

            <div class="tuhh-grid-4">
              <div class="tuhh-wa-card">
                <div class="tuhh-wa-icon" style="background:#EFF6FF;color:#2563EB;">📝</div>
                <h4>Booking Confirmation</h4>
                <p>Dates, check-in time, property address aur advance receipt instant 1-tap message.</p>
              </div>

              <div class="tuhh-wa-card">
                <div class="tuhh-wa-icon" style="background:#F0FDF4;color:#16A34A;">📍</div>
                <h4>Location &amp; Directions</h4>
                <p>Apartment/Villa ka Google Map GPS location pin aur caretaker ka contact number.</p>
              </div>

              <div class="tuhh-wa-card">
                <div class="tuhh-wa-icon" style="background:#FFF7ED;color:#EA580C;">📶</div>
                <h4>Wi-Fi &amp; House Rules</h4>
                <p>Flat ka specific Wi-Fi SSID, Password, swimming pool timing aur house rules.</p>
              </div>

              <div class="tuhh-wa-card">
                <div class="tuhh-wa-icon" style="background:#FAF5FF;color:#9333EA;">⭐</div>
                <h4>Checkout &amp; Review Link</h4>
                <p>Checkout reminder aur 5-Star Google / Airbnb review link send karke rating badhayein.</p>
              </div>
            </div>
          </div>

          <!-- SECTION 10: INTERACTIVE KEYBOARD SHORTCUTS MATRIX -->
          <div class="tuhh-help-section-block" data-category="shortcuts" id="section-shortcuts">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#F0F9FF;color:#0284C7;">⌨️</div>
              <div>
                <h2 class="tuhh-section-title">10. High-Speed Keyboard Shortcuts Matrix</h2>
                <p class="tuhh-section-subtitle">Mouse use kiye bina super-fast speed se CRM chalayein (Click 'Run' to test any shortcut now):</p>
              </div>
            </div>

            <div class="tuhh-shortcuts-grid">
              ${SHORTCUTS_DATA.map(sc => `
                <div class="tuhh-sc-item">
                  <div class="tuhh-sc-keys">
                    <kbd>${sc.key}</kbd>
                    ${sc.single && sc.single !== sc.key ? `<span class="tuhh-sc-or">or</span> <kbd>${sc.single}</kbd>` : ''}
                  </div>
                  <div class="tuhh-sc-details">
                    <div class="tuhh-sc-title">${sc.title}</div>
                    <div class="tuhh-sc-desc">${sc.desc}</div>
                  </div>
                  <button type="button" class="tuhh-sc-run-btn" onclick="${sc.action}" title="Test shortcut">
                    <span>▶ Run</span>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- SECTION 11: PRO TIPS & TROUBLESHOOTING -->
          <div class="tuhh-help-section-block" data-category="tips" id="section-tips">
            <div class="tuhh-section-header">
              <div class="tuhh-section-icon" style="background:#FEF2F2;color:#DC2626;">💡</div>
              <div>
                <h2 class="tuhh-section-title">11. Pro Tips, Safety &amp; Troubleshooting</h2>
                <p class="tuhh-section-subtitle">Common questions aur important operating precautions:</p>
              </div>
            </div>

            <div class="tuhh-grid-2">
              <div class="tuhh-faq-item">
                <h4>❓ Double-Booking Se Kaise Bachein?</h4>
                <p>
                  Jab bhi direct walk-in booking aaye, <strong>pehle 1 minute ke andar</strong> CRM me booking log karein ya calendar par dates block karein taaki Airbnb par wahi dates automatically block ho jayein aur koi clash na ho.
                </p>
              </div>

              <div class="tuhh-faq-item">
                <h4>❓ Data Offline / Slow Internet Par Save Hota Hai?</h4>
                <p>
                  Haan! Roost And Rest CRM PWA enabled hai. Form save karte hi data local encrypted storage me store hota hai aur internet reconnect hote hi Supabase cloud se synchronize ho jata hai.
                </p>
              </div>

              <div class="tuhh-faq-item">
                <h4>❓ Mobile Phone / iPad Par Kaise Install Karein?</h4>
                <p>
                  Safari (iPhone) me <strong>Share &gt; Add to Home Screen</strong> karein, ya Chrome (Android) me <strong>Install App</strong> dabayein. Ye app ki tarah bina browser bar ke fullscreen chalti hai.
                </p>
              </div>

              <div class="tuhh-faq-item">
                <h4>❓ Kisi Bhi Screen Par Fast Jump Chahiye?</h4>
                <p>
                  Keyboard par <strong>Ctrl+K / Cmd+K</strong> dabayein aur search box me kuch bhi type karein — command palette aapko direct exact screen par le jayegi!
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    renderShell(html, 'help');
  };

  // Switch tab filter
  window.switchHelpTab = function(tabId) {
    window._helpActiveTab = tabId;
    document.querySelectorAll('.tuhh-help-tab-btn').forEach(btn => {
      const cat = btn.getAttribute('data-tab');
      if (cat === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const sections = document.querySelectorAll('.tuhh-help-section-block');
    sections.forEach(sec => {
      const cat = sec.getAttribute('data-category') || '';
      if (tabId === 'all' || cat === tabId) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });

    try {
      const targetSec = document.getElementById('section-' + tabId);
      if (targetSec && tabId !== 'all') {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch(e) {}
  };

  // Live search filtering inside Help Page
  window.filterHelpGuideContent = function(query) {
    const q = (query || '').trim().toLowerCase();
    const clearBtn = document.querySelector('.tuhh-help-search-clear');
    if (clearBtn) clearBtn.style.display = q ? 'flex' : 'none';

    const sections = document.querySelectorAll('.tuhh-help-section-block');
    const items = document.querySelectorAll('.tuhh-step-card, .tuhh-wf-card, .tuhh-card-compact, .tuhh-sc-item, .tuhh-faq-item, .tuhh-info-box, .tuhh-wa-card');

    if (!q) {
      window.switchHelpTab(window._helpActiveTab || 'all');
      items.forEach(el => { el.style.display = ''; el.style.opacity = '1'; });
      return;
    }

    sections.forEach(sec => {
      const text = (sec.textContent || '').toLowerCase();
      if (text.includes(q)) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });

    items.forEach(el => {
      const text = (el.textContent || '').toLowerCase();
      if (text.includes(q)) {
        el.style.display = '';
        el.style.opacity = '1';
      } else {
        el.style.display = 'none';
      }
    });
  };

})();
