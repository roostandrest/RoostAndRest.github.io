/**
 * 💼 REAL-TIME PAYMENT RECEIVER & CASH LEDGER
 * Tracks live money held by each receiver, caretaker, manager, and company account.
 * "Kiske paas kitna paisa hai, real-time me"
 * Roost And Rest CRM (100% Isolated for Roost)
 */

window._myLedgerSelectedPerson = window._myLedgerSelectedPerson || 'ALL';
window._roostCustomReceiversCache = null;
window._roostHandoversCache = null;

// ═══ Robust Payment Receiver Resolver ═══
// Extracts receiver from p.received_by, notes tag, or payment mode
window.resolvePaymentReceiver = function(p) {
  if (!p) return 'Anwar-OD';
  
  // 1. Direct mode check: Airbnb payouts always belong to Company / Airbnb
  const mode = (p.payment_mode || '').trim();
  const method = (p.payment_method || '').trim();
  const notes = (p.notes || '').trim();

  if (mode === 'Online-Airbnb' || method === 'Airbnb-Payout' || /airbnb/i.test(notes) || /auto-synced from gmail/i.test(notes)) {
    return 'Company / Airbnb';
  }

  // 2. Check notes for (Received by: ...) or [Received By: ...]
  const rxMatch = notes.match(/\[Received By:\s*([^\]]+)\]/i) || 
                  notes.match(/\(Received by:\s*([^\)]+)\)/i) ||
                  notes.match(/\[Advance Recv:\s*([^\]]+)\]/i) ||
                  notes.match(/Receiver:\s*([^,\.\)\n]+)/i);
  if (rxMatch && rxMatch[1]) {
    return window.normalizeReceiverName(rxMatch[1]);
  }

  // 3. Check p.received_by if present
  if (p.received_by && p.received_by.trim() && p.received_by !== 'Unassigned') {
    return window.normalizeReceiverName(p.received_by);
  }

  // 4. Default for offline cash / direct payments
  return 'Anwar-OD';
};

window.normalizeReceiverName = function(raw) {
  if (!raw) return 'Anwar-OD';
  const clean = raw.trim();
  if (/^anwar$/i.test(clean)) return 'Anwar-OD'; // User requirement: "anwar nahi rahega, anwar-od rahega"
  if (/^anwar[\s_-]?od$/i.test(clean)) return 'Anwar-OD';
  if (/^(company|roost and rest|airbnb|online|online-airbnb|airbnb payout)$/i.test(clean)) return 'Company / Airbnb';
  return clean;
};

// ═══ Custom Receivers Data Layer (Uses app_settings + localStorage) ═══
window.getRoostCustomReceivers = async function() {
  if (window._roostCustomReceiversCache) return window._roostCustomReceiversCache;
  let list = ['Shahenshah'];
  try {
    const { data } = await sb.from('app_settings').select('value').eq('key', 'custom_payment_receivers').maybeSingle();
    if (data && data.value) {
      list = JSON.parse(data.value);
    } else {
      const local = localStorage.getItem('roost_custom_receivers');
      if (local) list = JSON.parse(local);
    }
  } catch (e) {
    const local = localStorage.getItem('roost_custom_receivers');
    if (local) list = JSON.parse(local);
  }
  // Sanitize list
  list = (list || []).map(n => (n || '').trim()).filter(n => n && !/^(anwar|anwar-od|anwar od|company|airbnb)$/i.test(n));
  window._roostCustomReceiversCache = [...new Set(list)];
  return window._roostCustomReceiversCache;
};

window.persistRoostCustomReceivers = async function(list) {
  const cleanList = [...new Set((list || []).map(n => (n || '').trim()).filter(n => n && !/^(anwar|anwar-od|anwar od|company|airbnb)$/i.test(n)))];
  window._roostCustomReceiversCache = cleanList;
  window._receiveHoldersCache = null; // bust dropdown cache
  localStorage.setItem('roost_custom_receivers', JSON.stringify(cleanList));

  try {
    const val = JSON.stringify(cleanList);
    const { data: existing } = await sb.from('app_settings').select('id').eq('key', 'custom_payment_receivers').maybeSingle();
    if (existing) {
      await sb.from('app_settings').update({ value: val, updated_at: new Date().toISOString() }).eq('key', 'custom_payment_receivers');
    } else {
      await sb.from('app_settings').insert({ key: 'custom_payment_receivers', value: val });
    }
  } catch (err) {
    console.warn('Sync custom receivers to app_settings notice:', err);
  }
};

// Inline Add Receiver (NO POPUP / NO PROMPT)
window.saveInlineCustomReceiver = async function() {
  const input = document.getElementById('inlineNewReceiverName');
  if (!input) return;
  const name = (input.value || '').trim();
  if (!name) {
    input.focus();
    return;
  }
  const norm = window.normalizeReceiverName(name);
  if (/^(anwar-od|company \/ airbnb)$/i.test(norm)) {
    alert(`"${norm}" is already a primary system account.`);
    input.value = '';
    return;
  }
  const current = await window.getRoostCustomReceivers();
  if (current.some(x => x.toLowerCase() === norm.toLowerCase())) {
    alert(`Receiver "${norm}" is already in the list.`);
    input.value = '';
    return;
  }
  current.push(norm);
  await window.persistRoostCustomReceivers(current);
  input.value = '';
  window.renderMyLedger();
};

// Inline Remove Receiver (NO POPUP)
window.removeInlineCustomReceiver = async function(name) {
  if (!confirm(`Remove "${name}" from custom receivers?`)) return;
  const current = await window.getRoostCustomReceivers();
  const updated = current.filter(x => x.toLowerCase() !== name.toLowerCase());
  await window.persistRoostCustomReceivers(updated);
  window.renderMyLedger();
};

// ═══ Cash Handovers Data Layer (Uses app_settings + localStorage) ═══
window.getRoostHandovers = async function() {
  if (window._roostHandoversCache) return window._roostHandoversCache;
  let list = [];
  try {
    const { data } = await sb.from('app_settings').select('value').eq('key', 'cash_handovers').maybeSingle();
    if (data && data.value) {
      list = JSON.parse(data.value);
    } else {
      const local = localStorage.getItem('roost_cash_handovers');
      if (local) list = JSON.parse(local);
    }
  } catch (e) {
    const local = localStorage.getItem('roost_cash_handovers');
    if (local) list = JSON.parse(local);
  }
  window._roostHandoversCache = list || [];
  return window._roostHandoversCache;
};

window.persistRoostHandovers = async function(list) {
  window._roostHandoversCache = list || [];
  localStorage.setItem('roost_cash_handovers', JSON.stringify(list || []));
  try {
    const val = JSON.stringify(list || []);
    const { data: existing } = await sb.from('app_settings').select('id').eq('key', 'cash_handovers').maybeSingle();
    if (existing) {
      await sb.from('app_settings').update({ value: val, updated_at: new Date().toISOString() }).eq('key', 'cash_handovers');
    } else {
      await sb.from('app_settings').insert({ key: 'cash_handovers', value: val });
    }
  } catch (err) {
    console.warn('Sync handovers to app_settings notice:', err);
  }
};

window.saveInlineHandover = async function() {
  const fromSel = document.getElementById('hoFromPerson');
  const toSel = document.getElementById('hoToPerson');
  const amtInp = document.getElementById('hoAmount');
  const noteInp = document.getElementById('hoNotes');
  const dateInp = document.getElementById('hoDate');

  const from = fromSel?.value?.trim();
  const to = toSel?.value?.trim() || 'Anwar-OD';
  const amt = parseFloat(amtInp?.value) || 0;
  const notes = noteInp?.value?.trim() || 'Cash Handover to Anwar-OD';
  const hDate = dateInp?.value || new Date().toISOString().slice(0, 10);

  if (!from) {
    alert('Please select who is handing over the cash.');
    fromSel?.focus();
    return;
  }
  if (amt <= 0) {
    alert('Please enter a valid cash amount.');
    amtInp?.focus();
    return;
  }

  const newHandover = {
    id: 'ho_' + Date.now(),
    from_person: from,
    to_person: to,
    amount: amt,
    notes: notes,
    handover_date: hDate,
    created_at: new Date().toISOString(),
    created_by: SESSION?.displayName || SESSION?.role || 'Admin'
  };

  const handovers = await window.getRoostHandovers();
  handovers.unshift(newHandover);
  await window.persistRoostHandovers(handovers);

  if (amtInp) amtInp.value = '';
  if (noteInp) noteInp.value = '';
  window.renderMyLedger();
};

window.toggleHandoverBox = function() {
  const box = document.getElementById('inlineHandoverFormBox');
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
};

// ═══ Main Ledger Render ═══
window.renderMyLedger = async function() {
  renderShell('<div class="card"><h1>💼 Cash & Payment Receiver Ledger</h1><div class="loading">Loading real-time transactions & balances...</div></div>', 'my-ledger');

  try {
    const [
      customReceivers,
      handovers,
      { data: employees },
      { data: payments },
      { data: expenses }
    ] = await Promise.all([
      window.getRoostCustomReceivers(),
      window.getRoostHandovers(),
      sb.from('employees').select('name, role').eq('status', 'Active'),
      sb.from('payment_history')
        .select('id, amount, payment_date, payment_mode, payment_method, notes, recorded_by, verification_status, booking_id, guest_register(guest_name, room_id, property_name)')
        .neq('verification_status', 'rejected')
        .order('payment_date', { ascending: false })
        .limit(1000),
      sb.from('expenses').select('amount, paid_by, payment_mode, expense_date, description').order('expense_date', { ascending: false }).limit(500)
    ]);

    const activeEmployees = (employees || [])
      .map(e => (e.name || '').trim())
      .filter(n => n && !/^(anwar|anwar-od|company|airbnb)$/i.test(n));

    // Stats dictionary
    const stats = {};
    const initReceiver = (name, category) => {
      const norm = window.normalizeReceiverName(name);
      if (!stats[norm]) {
        stats[norm] = {
          name: norm,
          category: category || (norm === 'Company / Airbnb' ? 'Online' : norm === 'Anwar-OD' ? 'Default OD' : 'Receiver'),
          cashInHand: 0,
          cashHandedOver: 0,
          upiOnline: 0,
          totalCollected: 0,
          handoversGiven: 0,
          handoversRecv: 0,
          expensesPaid: 0,
          paymentsList: []
        };
      }
      return stats[norm];
    };

    // Pre-populate core receivers in strict required order
    initReceiver('Company / Airbnb', 'Online Channel');
    initReceiver('Anwar-OD', 'Default Account');
    customReceivers.forEach(r => initReceiver(r, 'Custom Receiver / Caretaker'));
    activeEmployees.forEach(e => initReceiver(e, 'Staff Member'));

    // Process all payments
    (payments || []).forEach(p => {
      const rec = window.resolvePaymentReceiver(p);
      const s = initReceiver(rec, rec === 'Company / Airbnb' ? 'Online Channel' : rec === 'Anwar-OD' ? 'Default Account' : 'Receiver');
      const amt = Number(p.amount || 0);
      s.totalCollected += amt;
      s.paymentsList.push({ ...p, resolvedReceiver: rec });

      const mode = (p.payment_mode || '').trim();
      const isOnline = mode === 'Online-Airbnb' || mode === 'Airbnb Payout' || rec === 'Company / Airbnb';

      if (isOnline || mode === 'UPI' || mode === 'Bank' || mode === 'Bank Transfer') {
        s.upiOnline += amt;
      } else {
        // Cash payment
        if (rec === 'Anwar-OD') {
          // Company OD is master depository — cash is deposited/accounted
          s.cashHandedOver += amt;
        } else {
          // Team member holds cash in hand until handed over
          s.cashInHand += amt;
        }
      }
    });

    // Process handovers
    (handovers || []).forEach(h => {
      const amt = Number(h.amount || 0);
      if (h.from_person) {
        const sFrom = initReceiver(h.from_person);
        sFrom.handoversGiven += amt;
        sFrom.cashHandedOver += amt;
        sFrom.cashInHand = Math.max(0, sFrom.cashInHand - amt);
      }
      if (h.to_person) {
        const sTo = initReceiver(h.to_person);
        sTo.handoversRecv += amt;
      }
    });

    // Process cash expenses
    (expenses || []).forEach(e => {
      const amt = Number(e.amount || 0);
      if (e.paid_by && e.payment_mode === 'Cash') {
        const sPaid = initReceiver(e.paid_by);
        sPaid.expensesPaid += amt;
        sPaid.cashInHand = Math.max(0, sPaid.cashInHand - amt);
      }
    });

    const allReceiversList = Object.values(stats);

    // Calculate totals across whole system
    const totalCashInHandAll = allReceiversList
      .filter(x => x.name !== 'Company / Airbnb' && x.name !== 'Anwar-OD')
      .reduce((sum, x) => sum + x.cashInHand, 0);

    const totalUPIAll = allReceiversList.reduce((sum, x) => sum + x.upiOnline, 0);
    const totalHandedOverAll = allReceiversList.reduce((sum, x) => sum + x.cashHandedOver, 0);
    const totalGrossCollectedAll = allReceiversList.reduce((sum, x) => sum + x.totalCollected, 0);

    const selectedPerson = window._myLedgerSelectedPerson || 'ALL';
    const displayList = selectedPerson === 'ALL'
      ? allReceiversList.filter(x => x.totalCollected > 0 || x.cashInHand > 0 || customReceivers.includes(x.name) || x.name === 'Company / Airbnb' || x.name === 'Anwar-OD')
      : allReceiversList.filter(x => x.name === selectedPerson);

    // Filter payments for bottom table
    const displayedPayments = (payments || []).map(p => ({
      ...p,
      resolvedReceiver: window.resolvePaymentReceiver(p)
    })).filter(p => selectedPerson === 'ALL' || p.resolvedReceiver === selectedPerson);

    let html = `
      <div style="padding:10px 0;">
        <!-- Header & Action Bar -->
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div>
            <h1 style="margin:0; font-size:22px; font-weight:800; color:#0f172a;">💼 Cash & Payment Receiver Ledger</h1>
            <p style="margin:4px 0 0; color:#64748b; font-size:13px;">Real-time tracking of money collected across Airbnb, Anwar-OD, caretakers & staff</p>
          </div>
          <div style="display:flex; gap:8px;">
            <button type="button" onclick="window.toggleHandoverBox()" style="background:#047857; color:#fff; border:none; padding:8px 14px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
              🤝 Record Handover
            </button>
            <button type="button" onclick="window.renderMyLedger()" style="background:#f1f5f9; color:#334155; border:1px solid #cbd5e1; padding:8px 14px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">
              🔄 Refresh
            </button>
          </div>
        </div>

        <!-- 1. Inline Custom Receiver Manager (SIMPLE FORM — ZERO POPUPS) -->
        <div class="card" style="margin-bottom:16px; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:16px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="margin-bottom:8px;">
            <strong style="color:#0f172a; font-size:14px;">➕ Manage Payment Receivers</strong>
            <span style="font-size:12px; color:#64748b; margin-left:6px;">(Add caretakers, partners or non-employees here — available instantly in booking & payment dropdowns)</span>
          </div>
          <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <input type="text" id="inlineNewReceiverName" placeholder="Enter Receiver Name (e.g. Shahenshah, Caretaker Ramesh...)" 
                   style="flex:1; min-width:260px; padding:9px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none;"
                   onkeydown="if(event.key==='Enter') window.saveInlineCustomReceiver()" />
            <button type="button" onclick="window.saveInlineCustomReceiver()" 
                    style="padding:9px 18px; background:#b45309; color:#fff; border:none; border-radius:8px; font-weight:700; font-size:13px; cursor:pointer;">
              💾 Save Receiver
            </button>
          </div>
          <div style="margin-top:12px; display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
            <span style="font-size:12px; font-weight:700; color:#475569;">Active Custom Receivers:</span>
            ${customReceivers.length === 0 ? '<span style="font-size:12px; color:#94a3b8;">None added yet. Default is Anwar-OD.</span>' : ''}
            ${customReceivers.map(name => `
              <span style="display:inline-flex; align-items:center; gap:6px; background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:700;">
                👤 ${name}
                <button type="button" onclick="window.removeInlineCustomReceiver('${name}')" title="Delete receiver" style="background:none; border:none; color:#b45309; cursor:pointer; font-size:14px; line-height:1; padding:0;">✕</button>
              </span>
            `).join('')}
          </div>
        </div>

        <!-- 2. Collapsible Handover Form (SIMPLE INLINE FORM) -->
        <div id="inlineHandoverFormBox" class="card" style="display:none; margin-bottom:16px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:16px;">
          <div style="margin-bottom:10px;">
            <strong style="color:#166534; font-size:14px;">🤝 Record Cash Handover</strong>
            <span style="font-size:12px; color:#15803d; margin-left:6px;">(Transfer cash collected by team member into Anwar-OD depository)</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:#166534; display:block; margin-bottom:4px;">Cash Handed Over By *</label>
              <select id="hoFromPerson" style="width:100%; padding:8px 10px; border:1px solid #86efac; border-radius:6px; font-weight:600;">
                <option value="">-- Select Person --</option>
                ${allReceiversList.filter(x => x.name !== 'Company / Airbnb' && x.name !== 'Anwar-OD').map(x => `
                  <option value="${x.name}">${x.name} (Held: ₹${x.cashInHand.toLocaleString('en-IN')})</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#166534; display:block; margin-bottom:4px;">Deposited To *</label>
              <select id="hoToPerson" style="width:100%; padding:8px 10px; border:1px solid #86efac; border-radius:6px; font-weight:600;">
                <option value="Anwar-OD">Anwar-OD (Primary Cash Account)</option>
              </select>
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#166534; display:block; margin-bottom:4px;">Amount ₹ *</label>
              <input type="number" id="hoAmount" placeholder="Amount ₹" style="width:100%; padding:8px 10px; border:1px solid #86efac; border-radius:6px;" />
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#166534; display:block; margin-bottom:4px;">Handover Date</label>
              <input type="date" id="hoDate" value="${new Date().toISOString().slice(0, 10)}" style="width:100%; padding:8px 10px; border:1px solid #86efac; border-radius:6px;" />
            </div>
          </div>
          <div style="display:flex; gap:10px; margin-top:10px; align-items:center;">
            <input type="text" id="hoNotes" placeholder="Optional notes (e.g. Cleared 22 Nov collections)" style="flex:1; padding:8px 10px; border:1px solid #86efac; border-radius:6px;" />
            <button type="button" onclick="window.saveInlineHandover()" style="background:#166534; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-weight:700; cursor:pointer;">
              ✅ Confirm Handover
            </button>
            <button type="button" onclick="window.toggleHandoverBox()" style="background:#e2e8f0; color:#334155; border:none; padding:8px 14px; border-radius:6px; font-weight:600; cursor:pointer;">
              Cancel
            </button>
          </div>
        </div>

        <!-- 3. KPI Summary Cards -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:12px; margin-bottom:16px;">
          <div class="card" style="border-left:4px solid #ef4444; background:#fff; padding:14px; border-radius:8px;">
            <div style="font-size:11px; font-weight:800; color:#ef4444; text-transform:uppercase; letter-spacing:0.5px;">💵 Total Cash In Hand (Team)</div>
            <div style="font-size:24px; font-weight:900; color:#0f172a; margin-top:4px;">₹${totalCashInHandAll.toLocaleString('en-IN')}</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Currently held by on-ground team</div>
          </div>
          <div class="card" style="border-left:4px solid #3b82f6; background:#fff; padding:14px; border-radius:8px;">
            <div style="font-size:11px; font-weight:800; color:#3b82f6; text-transform:uppercase; letter-spacing:0.5px;">📱 UPI & Online Total</div>
            <div style="font-size:24px; font-weight:900; color:#0f172a; margin-top:4px;">₹${totalUPIAll.toLocaleString('en-IN')}</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Airbnb payouts & direct UPI receipts</div>
          </div>
          <div class="card" style="border-left:4px solid #10b981; background:#fff; padding:14px; border-radius:8px;">
            <div style="font-size:11px; font-weight:800; color:#10b981; text-transform:uppercase; letter-spacing:0.5px;">🤝 Cash Handed Over / Accounted</div>
            <div style="font-size:24px; font-weight:900; color:#0f172a; margin-top:4px;">₹${totalHandedOverAll.toLocaleString('en-IN')}</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Safely deposited to Anwar-OD</div>
          </div>
          <div class="card" style="border-left:4px solid #b45309; background:#fff; padding:14px; border-radius:8px;">
            <div style="font-size:11px; font-weight:800; color:#b45309; text-transform:uppercase; letter-spacing:0.5px;">💰 Gross Revenue Collected</div>
            <div style="font-size:24px; font-weight:900; color:#0f172a; margin-top:4px;">₹${totalGrossCollectedAll.toLocaleString('en-IN')}</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Total booking receipts tracked</div>
          </div>
        </div>

        <!-- 4. Receiver Balances Table -->
        <div class="card" style="background:#fff; border-radius:12px; padding:16px; margin-bottom:16px; border:1px solid #e2e8f0;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
            <strong style="color:#0f172a; font-size:15px;">👥 Live Balances by Receiver ("Kiske Paas Kitna Hai")</strong>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:12px; font-weight:600; color:#64748b;">Filter View:</span>
              <select onchange="window._myLedgerSelectedPerson=this.value; window.renderMyLedger();" style="padding:6px 10px; border-radius:6px; border:1px solid #cbd5e1; font-weight:700; font-size:13px;">
                <option value="ALL" ${selectedPerson === 'ALL' ? 'selected' : ''}>👥 All Receivers (Overview)</option>
                <option value="Company / Airbnb" ${selectedPerson === 'Company / Airbnb' ? 'selected' : ''}>🌐 Company / Airbnb</option>
                <option value="Anwar-OD" ${selectedPerson === 'Anwar-OD' ? 'selected' : ''}>🏦 Anwar-OD</option>
                ${customReceivers.map(r => `<option value="${r}" ${selectedPerson === r ? 'selected' : ''}>👤 ${r}</option>`).join('')}
                ${activeEmployees.map(e => `<option value="${e}" ${selectedPerson === e ? 'selected' : ''}>🧑‍💼 ${e}</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; text-align:left;">
                  <th style="padding:10px 12px; font-weight:700; color:#475569;">Receiver / Account</th>
                  <th style="padding:10px 12px; font-weight:700; color:#475569;">Account Type</th>
                  <th style="padding:10px 12px; font-weight:700; color:#ef4444; text-align:right;">Cash In Hand</th>
                  <th style="padding:10px 12px; font-weight:700; color:#3b82f6; text-align:right;">UPI & Online</th>
                  <th style="padding:10px 12px; font-weight:700; color:#10b981; text-align:right;">Handed Over</th>
                  <th style="padding:10px 12px; font-weight:700; color:#0f172a; text-align:right;">Total Collected</th>
                </tr>
              </thead>
              <tbody>
                ${displayList.map(r => {
                  let badgeBg = '#f1f5f9';
                  let badgeColor = '#475569';
                  if (r.name === 'Company / Airbnb') { badgeBg = '#ede9fe'; badgeColor = '#6d28d9'; }
                  else if (r.name === 'Anwar-OD') { badgeBg = '#fef3c7'; badgeColor = '#b45309'; }
                  else if (customReceivers.includes(r.name)) { badgeBg = '#e0f2fe'; badgeColor = '#0369a1'; }
                  else { badgeBg = '#dcfce7'; badgeColor = '#15803d'; }

                  return `
                    <tr style="border-bottom:1px solid #f1f5f9; cursor:pointer;" onclick="window._myLedgerSelectedPerson='${r.name}'; window.renderMyLedger();">
                      <td style="padding:10px 12px; font-weight:700; color:#0f172a;">
                        ${r.name === 'Company / Airbnb' ? '🌐' : r.name === 'Anwar-OD' ? '🏦' : '👤'} ${r.name}
                      </td>
                      <td style="padding:10px 12px;">
                        <span style="background:${badgeBg}; color:${badgeColor}; padding:3px 8px; border-radius:12px; font-size:11px; font-weight:700;">
                          ${r.category}
                        </span>
                      </td>
                      <td style="padding:10px 12px; text-align:right; font-weight:800; color:${r.cashInHand > 0 ? '#dc2626' : '#64748b'};">
                        ₹${r.cashInHand.toLocaleString('en-IN')}
                      </td>
                      <td style="padding:10px 12px; text-align:right; font-weight:700; color:#2563eb;">
                        ₹${r.upiOnline.toLocaleString('en-IN')}
                      </td>
                      <td style="padding:10px 12px; text-align:right; font-weight:700; color:#059669;">
                        ₹${r.cashHandedOver.toLocaleString('en-IN')}
                      </td>
                      <td style="padding:10px 12px; text-align:right; font-weight:800; color:#0f172a;">
                        ₹${r.totalCollected.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. Recent Booking Payments Log -->
        <div class="card" style="background:#fff; border-radius:12px; padding:16px; border:1px solid #e2e8f0;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <strong style="color:#0f172a; font-size:15px;">📋 Recent Booking Payments Log (${displayedPayments.length} Transactions)</strong>
            ${selectedPerson !== 'ALL' ? `<button onclick="window._myLedgerSelectedPerson='ALL'; window.renderMyLedger();" style="background:#f1f5f9; border:none; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Show All</button>` : ''}
          </div>

          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; text-align:left;">
                  <th style="padding:8px 10px; color:#475569;">Date</th>
                  <th style="padding:8px 10px; color:#475569;">Guest / Booking</th>
                  <th style="padding:8px 10px; color:#475569;">Mode</th>
                  <th style="padding:8px 10px; color:#475569;">Received By</th>
                  <th style="padding:8px 10px; color:#475569;">Notes</th>
                  <th style="padding:8px 10px; color:#475569; text-align:right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${displayedPayments.length === 0 ? '<tr><td colspan="6" style="padding:20px; text-align:center; color:#94a3b8;">No payments recorded for this receiver.</td></tr>' : ''}
                ${displayedPayments.slice(0, 100).map(p => {
                  const guestName = p.guest_register?.guest_name || 'Guest';
                  const room = p.guest_register?.room_id || '';
                  const isAirbnb = p.resolvedReceiver === 'Company / Airbnb';

                  return `
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      <td style="padding:8px 10px; white-space:nowrap; color:#64748b;">${p.payment_date || '-'}</td>
                      <td style="padding:8px 10px; font-weight:600; color:#0f172a;">
                        ${guestName} ${room ? `<span style="color:#64748b; font-size:11px;">(${room})</span>` : ''}
                      </td>
                      <td style="padding:8px 10px;">
                        <span style="background:${isAirbnb ? '#fee2e2' : '#f1f5f9'}; color:${isAirbnb ? '#991b1b' : '#334155'}; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:700;">
                          ${p.payment_mode || 'Payment'}
                        </span>
                      </td>
                      <td style="padding:8px 10px; font-weight:700; color:${isAirbnb ? '#6d28d9' : p.resolvedReceiver === 'Anwar-OD' ? '#b45309' : '#0f172a'};">
                        ${isAirbnb ? '🌐' : p.resolvedReceiver === 'Anwar-OD' ? '🏦' : '👤'} ${p.resolvedReceiver}
                      </td>
                      <td style="padding:8px 10px; color:#64748b; max-width:240px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${p.notes || ''}">
                        ${p.notes || '-'}
                      </td>
                      <td style="padding:8px 10px; text-align:right; font-weight:800; color:#0f172a;">
                        ₹${Number(p.amount || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    renderShell(html, 'my-ledger');
  } catch (err) {
    console.error('Error rendering my-ledger:', err);
    renderShell(`<div class="card"><div class="error">❌ Error loading ledger: ${err.message}</div><button onclick="renderMyLedger()" class="btn btn-primary" style="margin-top:10px;">Retry</button></div>`, 'my-ledger');
  }
};
