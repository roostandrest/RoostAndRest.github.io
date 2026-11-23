/**
 * 💼 REAL-TIME PAYMENT RECEIVER & CASH LEDGER
 * Tracks live money held by each receiver, caretaker, manager, and company account.
 * "Kiske paas kitna paisa hai, real-time me"
 * Roost And Rest CRM (100% Isolated for Roost)
 */

window._myLedgerSelectedPerson = window._myLedgerSelectedPerson || 'ALL';
window._roostCustomReceiversCache = null;
window._roostHandoversCache = null;

// Expose renderMyLedger at script initialization to guarantee router never encounters undefined
window.renderMyLedger = async function() {
  if (typeof window._renderMyLedgerImpl === 'function') {
    return window._renderMyLedgerImpl();
  }
};

// ═══ Robust Payment Receiver Resolver ═══
// Extracts receiver from p.received_by, notes tag, or payment mode
window.resolvePaymentReceiver = function (p) {
  if (!p) return 'Anwar-OD';

  // 1. Direct mode check: Airbnb payouts always belong to Company / Airbnb
  const mode = (p.payment_mode || '').trim();
  const method = (p.payment_method || '').trim();
  const notes = (p.notes || '').trim();
  const bookingId = (p.booking_id || '').trim();

  const isAirbnb = /airbnb/i.test(mode) ||
    /airbnb/i.test(method) ||
    /airbnb/i.test(notes) ||
    (/online/i.test(mode) && /payout/i.test(mode)) ||
    /payout/i.test(mode) ||
    /auto-synced from gmail/i.test(notes) ||
    /^rr-nov-/i.test(bookingId);

  if (isAirbnb) {
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

window.normalizeReceiverName = function (raw) {
  if (!raw) return 'Anwar-OD';
  const clean = raw.trim();
  if (/^anwar$/i.test(clean)) return 'Anwar-OD'; // User requirement: "anwar nahi rahega, anwar-od rahega"
  if (/^anwar[\s_-]?od$/i.test(clean)) return 'Anwar-OD';
  if (/^(company|roost and rest|airbnb|online|online-airbnb|airbnb payout)$/i.test(clean)) return 'Company / Airbnb';
  return clean;
};

// ═══ Custom Receivers Data Layer (Uses app_settings + localStorage) ═══
window.getRoostCustomReceivers = async function () {
  if (window._roostCustomReceiversCache) return window._roostCustomReceiversCache;
  let list = [];
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

window.persistRoostCustomReceivers = async function (list) {
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
window.saveInlineCustomReceiver = async function () {
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

// ═══ EDIT / MODIFY RECEIVER MODAL ═══
window.openEditReceiverModal = function (oldName) {
  const existing = document.getElementById('editReceiverModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'editReceiverModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.6); backdrop-filter:blur(3px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:16px;';

  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:440px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); border:1px solid #cbd5e1; overflow:hidden;">
      <div style="background:linear-gradient(135deg, #1e293b, #0f172a); padding:16px 20px; color:#fff; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px;">
          <span>✏️</span> Modify / Edit Receiver
        </h3>
        <button onclick="document.getElementById('editReceiverModal').remove()" style="background:none; border:none; color:#cbd5e1; font-size:20px; cursor:pointer; line-height:1;">✕</button>
      </div>
      <div style="padding:20px;">
        <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:6px;">Receiver Name *</label>
        <input type="text" id="editReceiverNewName" value="${oldName}" placeholder="Enter Receiver Name..." 
               style="width:100%; padding:10px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:14px; font-weight:600; outline:none; box-sizing:border-box;" />

        <div style="margin-top:14px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px;">
          <label style="display:flex; align-items:flex-start; gap:8px; cursor:pointer; font-size:12.5px; color:#334155;">
            <input type="checkbox" id="editReceiverUpdatePast" checked style="margin-top:2px;" />
            <span><strong>Sync Past Records:</strong> Automatically rename past booking payment records & cash handovers from <em>"${oldName}"</em> to the new name.</span>
          </label>
        </div>

        <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" onclick="document.getElementById('editReceiverModal').remove()" 
                  style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:8px 16px; border-radius:8px; font-weight:600; cursor:pointer;">
            Cancel
          </button>
          <button type="button" onclick="window.saveModifiedReceiver('${oldName}')" 
                  style="background:#b45309; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-weight:700; cursor:pointer;">
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  setTimeout(() => document.getElementById('editReceiverNewName')?.focus(), 50);
};

window.saveModifiedReceiver = async function (oldName) {
  const input = document.getElementById('editReceiverNewName');
  const updatePast = document.getElementById('editReceiverUpdatePast')?.checked;
  const newName = (input?.value || '').trim();

  if (!newName) {
    alert('Please enter a valid receiver name.');
    input?.focus();
    return;
  }

  const normNew = window.normalizeReceiverName(newName);
  if (/^(anwar-od|company \/ airbnb)$/i.test(normNew)) {
    alert(`"${normNew}" is a reserved primary account name.`);
    return;
  }

  const current = await window.getRoostCustomReceivers();
  const idx = current.findIndex(x => x.toLowerCase() === oldName.toLowerCase());
  if (idx !== -1) {
    current[idx] = normNew;
  } else {
    current.push(normNew);
  }

  // Persist updated list
  await window.persistRoostCustomReceivers(current);

  // If updatePast is checked, update past payments & handovers in DB
  if (updatePast && oldName.toLowerCase() !== normNew.toLowerCase()) {
    try {
      const { data: pays } = await sb.from('payment_history').select('id, notes, payment_mode');
      const toUpdate = (pays || []).filter(p => {
        const r = window.resolvePaymentReceiver(p);
        return r.toLowerCase() === oldName.toLowerCase();
      });

      for (const p of toUpdate) {
        let newNotes = p.notes || '';
        newNotes = newNotes.replace(new RegExp(`\\(Received by:\\s*${oldName}\\)`, 'gi'), `(Received by: ${normNew})`);
        newNotes = newNotes.replace(new RegExp(`\\[Received By:\\s*${oldName}\\]`, 'gi'), `[Received By: ${normNew}]`);
        if (!newNotes.includes(normNew)) {
          newNotes = newNotes ? `${newNotes} (Received by: ${normNew})` : `(Received by: ${normNew})`;
        }
        await sb.from('payment_history').update({
          notes: newNotes
        }).eq('id', p.id);
      }

      const handovers = await window.getRoostHandovers();
      let hoUpdated = false;
      handovers.forEach(h => {
        if (h.from_person && h.from_person.toLowerCase() === oldName.toLowerCase()) {
          h.from_person = normNew;
          hoUpdated = true;
        }
        if (h.to_person && h.to_person.toLowerCase() === oldName.toLowerCase()) {
          h.to_person = normNew;
          hoUpdated = true;
        }
      });
      if (hoUpdated) {
        await window.persistRoostHandovers(handovers);
      }
    } catch (err) {
      console.warn('Error updating past records for modified receiver:', err);
    }
  }

  document.getElementById('editReceiverModal')?.remove();
  window._roostCustomReceiversCache = null;
  window._receiveHoldersCache = null;
  window.renderMyLedger();
};

// ═══ DELETE RECEIVER MODAL ═══
window.openDeleteReceiverModal = async function (name) {
  let payCount = 0;
  try {
    const { data: pays } = await sb.from('payment_history').select('id, notes, payment_mode');
    payCount = (pays || []).filter(p => window.resolvePaymentReceiver(p).toLowerCase() === name.toLowerCase()).length;
  } catch (e) { }

  if (payCount === 0) {
    if (!confirm(`Are you sure you want to delete receiver "${name}"?`)) return;
    const current = await window.getRoostCustomReceivers();
    const updated = current.filter(x => x.toLowerCase() !== name.toLowerCase());
    await window.persistRoostCustomReceivers(updated);
    window.renderMyLedger();
    return;
  }

  const existing = document.getElementById('deleteReceiverModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'deleteReceiverModal';
  modal.className = 'modal-overlay';
  modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.6); backdrop-filter:blur(3px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:16px;';

  modal.innerHTML = `
    <div style="background:#fff; border-radius:14px; max-width:440px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); border:1px solid #cbd5e1; overflow:hidden;">
      <div style="background:linear-gradient(135deg, #991b1b, #7f1d1d); padding:16px 20px; color:#fff; display:flex; justify-content:space-between; align-items:center;">
        <h3 style="margin:0; font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px;">
          <span>🗑️</span> Delete Receiver: ${name}
        </h3>
        <button onclick="document.getElementById('deleteReceiverModal').remove()" style="background:none; border:none; color:#fca5a5; font-size:20px; cursor:pointer; line-height:1;">✕</button>
      </div>
      <div style="padding:20px;">
        <p style="margin:0 0 14px; color:#334155; font-size:13.5px; line-height:1.5;">
          Receiver <strong>"${name}"</strong> has <strong>${payCount}</strong> past payment(s) recorded in the database.
        </p>

        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
          <label style="display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border:1px solid #e2e8f0; border-radius:8px; cursor:pointer; background:#f8fafc;">
            <input type="radio" name="delActionRadio" value="reassign" checked style="margin-top:3px;" />
            <div style="font-size:12.5px; color:#1e293b;">
              <strong>Reassign to Anwar-OD (Recommended)</strong>
              <div style="color:#64748b; font-size:11.5px; margin-top:2px;">Transfers all ${payCount} past payment(s) to Anwar-OD so accounting stays balanced.</div>
            </div>
          </label>
          <label style="display:flex; align-items:flex-start; gap:10px; padding:10px 12px; border:1px solid #e2e8f0; border-radius:8px; cursor:pointer; background:#f8fafc;">
            <input type="radio" name="delActionRadio" value="keep" style="margin-top:3px;" />
            <div style="font-size:12.5px; color:#1e293b;">
              <strong>Keep Past Payments (Archive)</strong>
              <div style="color:#64748b; font-size:11.5px; margin-top:2px;">Preserves historical payments under "${name}", but removes it from future booking dropdowns.</div>
            </div>
          </label>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px;">
          <button type="button" onclick="document.getElementById('deleteReceiverModal').remove()" 
                  style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:8px 16px; border-radius:8px; font-weight:600; cursor:pointer;">
            Cancel
          </button>
          <button type="button" onclick="window.confirmDeleteReceiver('${name}')" 
                  style="background:#dc2626; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-weight:700; cursor:pointer;">
            🗑️ Confirm Delete
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

window.confirmDeleteReceiver = async function (name) {
  const selectedAction = document.querySelector('input[name="delActionRadio"]:checked')?.value || 'reassign';

  if (selectedAction === 'reassign') {
    try {
      const { data: pays } = await sb.from('payment_history').select('id, notes, payment_mode');
      const toUpdate = (pays || []).filter(p => {
        const r = window.resolvePaymentReceiver(p);
        return r.toLowerCase() === name.toLowerCase();
      });

      for (const p of toUpdate) {
        let newNotes = p.notes || '';
        newNotes = newNotes.replace(new RegExp(`\\(Received by:\\s*${name}\\)`, 'gi'), '(Received by: Anwar-OD)');
        newNotes = newNotes.replace(new RegExp(`\\[Received By:\\s*${name}\\]`, 'gi'), '[Received By: Anwar-OD]');
        if (!newNotes.includes('Anwar-OD')) {
          newNotes = newNotes ? `${newNotes} (Received by: Anwar-OD)` : '(Received by: Anwar-OD)';
        }
        await sb.from('payment_history').update({
          notes: newNotes
        }).eq('id', p.id);
      }
    } catch (e) {
      console.warn('Reassign payments error:', e);
    }
  }

  // Remove from custom receivers list
  const current = await window.getRoostCustomReceivers();
  const updated = current.filter(x => x.toLowerCase() !== name.toLowerCase());
  await window.persistRoostCustomReceivers(updated);

  document.getElementById('deleteReceiverModal')?.remove();
  window._roostCustomReceiversCache = null;
  window._receiveHoldersCache = null;
  window.renderMyLedger();
};

window.removeInlineCustomReceiver = function (name) {
  window.openDeleteReceiverModal(name);
};

// ═══ EDIT PAYMENT RECEIVER & DETAILS MODAL ═══
window.openEditPaymentReceiverModal = async function (payId) {
  const existing = document.getElementById('editPaymentModal');
  if (existing) existing.remove();

  try {
    const { data: p } = await sb.from('payment_history').select('*').eq('id', payId).single();
    if (!p) {
      alert('Payment record not found.');
      return;
    }

    let guestInfo = '';
    if (p.booking_id) {
      try {
        const { data: g } = await sb.from('guest_register').select('guest_name, room_id, rooms(nickname, unit_no)').eq('booking_id', p.booking_id).maybeSingle();
        if (g) {
          const roomStr = g.rooms?.nickname ? `${g.rooms.nickname} (${g.rooms.unit_no})` : (g.room_id || '');
          guestInfo = `${g.guest_name || 'Guest'} · ${roomStr}`;
        }
      } catch (e) { }
    }

    const currentReceiver = window.resolvePaymentReceiver(p);
    const customReceivers = await window.getRoostCustomReceivers();
    const { data: emps } = await sb.from('employees').select('name').eq('status', 'Active');
    const staffNames = (emps || []).map(e => (e.name || '').trim()).filter(n => n && !/^(anwar|anwar-od|company|airbnb)$/i.test(n));

    const modal = document.createElement('div');
    modal.id = 'editPaymentModal';
    modal.className = 'modal-overlay';
    modal.style.cssText = 'position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.6); backdrop-filter:blur(3px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:16px;';

    modal.innerHTML = `
      <div style="background:#fff; border-radius:14px; max-width:480px; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); border:1px solid #cbd5e1; overflow:hidden;">
        <div style="background:linear-gradient(135deg, #1e293b, #0f172a); padding:16px 20px; color:#fff; display:flex; justify-content:space-between; align-items:center;">
          <h3 style="margin:0; font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px;">
            <span>💳</span> Modify Payment Receiver &amp; Mode
          </h3>
          <button onclick="document.getElementById('editPaymentModal').remove()" style="background:none; border:none; color:#cbd5e1; font-size:20px; cursor:pointer; line-height:1;">✕</button>
        </div>
        <div style="padding:20px;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:14px; font-size:12.5px; color:#475569;">
            <div><strong>Booking:</strong> ${p.booking_id || 'N/A'} ${guestInfo ? `(${guestInfo})` : ''}</div>
            <div style="margin-top:4px;"><strong>Date:</strong> ${p.payment_date || '-'}</div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Amount ₹ *</label>
            <input type="number" id="editPayAmount" value="${p.amount || 0}" step="0.01" 
                   style="width:100%; padding:9px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:14px; font-weight:700; color:#0f172a; box-sizing:border-box;" />
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Payment Receiver *</label>
            <select id="editPayReceiver" style="width:100%; padding:9px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13.5px; font-weight:600;">
              <optgroup label="🌐 Online / Company">
                <option value="Company / Airbnb" ${currentReceiver === 'Company / Airbnb' ? 'selected' : ''}>🌐 Company / Airbnb</option>
              </optgroup>
              <optgroup label="🏦 Default Account">
                <option value="Anwar-OD" ${currentReceiver === 'Anwar-OD' ? 'selected' : ''}>🏦 Anwar-OD (Default Account)</option>
              </optgroup>
              ${customReceivers.length > 0 ? `
                <optgroup label="👥 Custom Receivers / Caretakers">
                  ${customReceivers.map(n => `<option value="${n}" ${currentReceiver === n ? 'selected' : ''}>👤 ${n}</option>`).join('')}
                </optgroup>
              ` : ''}
              ${staffNames.length > 0 ? `
                <optgroup label="🧑‍💼 Staff Members">
                  ${staffNames.map(n => `<option value="${n}" ${currentReceiver === n ? 'selected' : ''}>🧑‍💼 ${n}</option>`).join('')}
                </optgroup>
              ` : ''}
              ${(!['Company / Airbnb', 'Anwar-OD'].includes(currentReceiver) && !customReceivers.includes(currentReceiver) && !staffNames.includes(currentReceiver)) ? `
                <optgroup label="👤 Current Receiver">
                  <option value="${currentReceiver}" selected>👤 ${currentReceiver}</option>
                </optgroup>
              ` : ''}
            </select>
          </div>

          <div style="margin-bottom:12px;">
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Payment Mode</label>
            <select id="editPayMode" style="width:100%; padding:9px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13.5px; font-weight:600;">
              <option value="UPI" ${p.payment_mode === 'UPI' ? 'selected' : ''}>UPI</option>
              <option value="Cash" ${p.payment_mode === 'Cash' ? 'selected' : ''}>Cash</option>
              <option value="Bank Transfer" ${p.payment_mode === 'Bank Transfer' ? 'selected' : ''}>Bank Transfer</option>
              <option value="Online-Airbnb" ${p.payment_mode === 'Online-Airbnb' ? 'selected' : ''}>Online-Airbnb</option>
            </select>
          </div>

          <div style="margin-bottom:18px;">
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Notes / Reference</label>
            <input type="text" id="editPayNotes" value="${(p.notes || '').replace(/\s*\([^\)]*Received by:[^\)]*\)/gi, '').replace(/\s*\[[^\]]*Received By:[^\]]*\]/gi, '').trim()}" placeholder="Optional notes..." 
                   style="width:100%; padding:9px 12px; border:1.5px solid #cbd5e1; border-radius:8px; font-size:13.5px; box-sizing:border-box;" />
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px;">
            <button type="button" onclick="document.getElementById('editPaymentModal').remove()" 
                    style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:8px 16px; border-radius:8px; font-weight:600; cursor:pointer;">
              Cancel
            </button>
            <button type="button" onclick="window.savePaymentReceiverEdit(${p.id})" 
                    style="background:#b45309; color:#fff; border:none; padding:8px 20px; border-radius:8px; font-weight:700; cursor:pointer;">
              💾 Save Payment
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } catch (err) {
    alert('Error loading payment details: ' + err.message);
  }
};

window.savePaymentReceiverEdit = async function (payId) {
  const newAmount = parseFloat(document.getElementById('editPayAmount')?.value) || 0;
  const newReceiver = document.getElementById('editPayReceiver')?.value || 'Anwar-OD';
  const newMode = document.getElementById('editPayMode')?.value || 'UPI';
  const baseNotes = (document.getElementById('editPayNotes')?.value || '').trim();

  const finalNotes = baseNotes
    ? `${baseNotes} (Received by: ${newReceiver})`
    : `(Received by: ${newReceiver})`;

  try {
    const { data: oldP } = await sb.from('payment_history').select('booking_id').eq('id', payId).single();

    const payPatch = {
      amount: newAmount,
      payment_mode: newMode,
      notes: finalNotes
    };

    const { error } = (typeof window.safeDbUpdate === 'function')
      ? await window.safeDbUpdate('payment_history', payPatch, 'id', payId)
      : await sb.from('payment_history').update(payPatch).eq('id', payId);

    if (error) throw error;

    // Recalculate booking status & sync paid_amount, advance_paid in guest_register
    if (oldP?.booking_id) {
      if (typeof window.recalcPaymentStatus === 'function') {
        await window.recalcPaymentStatus(oldP.booking_id);
      }
      if (window._sbkState) {
        if (window._sbkState.cachedPaidMap) delete window._sbkState.cachedPaidMap[oldP.booking_id];
        window._sbkState.cachedBookings = null;
      }
    }

    if (typeof window.notifyDataChanged === 'function') {
      window.notifyDataChanged();
    }

    document.getElementById('editPaymentModal')?.remove();
    window.renderMyLedger();
  } catch (err) {
    alert('Failed to update payment: ' + err.message);
  }
};

// ═══ Cash Handovers Data Layer (Uses app_settings + localStorage) ═══
window.getRoostHandovers = async function () {
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

window.persistRoostHandovers = async function (list) {
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

window.saveInlineHandover = async function () {
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

window.toggleHandoverBox = function (fromPerson, amount) {
  const box = document.getElementById('inlineHandoverFormBox');
  if (box) {
    const isOpening = box.style.display === 'none';
    box.style.display = isOpening ? 'block' : 'none';
    if (isOpening) {
      if (fromPerson) {
        const fromSel = document.getElementById('hoFromPerson');
        if (fromSel) fromSel.value = fromPerson;
      }
      if (amount) {
        const amtInp = document.getElementById('hoAmount');
        if (amtInp) amtInp.value = amount;
      }
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
};

// ═══ Main Ledger Render ═══
async function renderMyLedger() {
  if (typeof window._renderMyLedgerImpl === 'function') {
    return window._renderMyLedgerImpl();
  }
}
window.renderMyLedger = renderMyLedger;

window._renderMyLedgerImpl = async function() {
  renderShell('<div class="card"><h1>💼 Cash & Payment Receiver Ledger</h1><div class="loading">Loading real-time transactions & balances...</div></div>', 'my-ledger');

  try {
    const [
      customReceivers,
      handovers,
      { data: employees },
      { data: payments, error: payErr },
      { data: expenses },
      { data: guests }
    ] = await Promise.all([
      window.getRoostCustomReceivers(),
      window.getRoostHandovers(),
      sb.from('employees').select('name, role').eq('status', 'Active'),
      sb.from('payment_history')
        .select('id, amount, payment_date, payment_mode, payment_method, notes, recorded_by, verification_status, booking_id, created_at')
        .neq('verification_status', 'rejected')
        .order('payment_date', { ascending: false })
        .limit(1000),
      sb.from('expenses').select('amount, paid_by, payment_mode, expense_date, description').order('expense_date', { ascending: false }).limit(500),
      sb.from('guest_register').select('booking_id, guest_name, room_id, property_name, rooms(nickname, unit_no)')
    ]);

    if (payErr) {
      console.warn('[my-ledger] Error fetching payments:', payErr);
    }

    const guestMap = {};
    (guests || []).forEach(g => {
      if (g.booking_id) guestMap[g.booking_id] = g;
    });

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
      p.guest_register = guestMap[p.booking_id] || null;
      const rec = window.resolvePaymentReceiver(p);
      const s = initReceiver(rec, rec === 'Company / Airbnb' ? 'Online Channel' : rec === 'Anwar-OD' ? 'Default Account' : 'Receiver');
      const amt = Number(p.amount || 0);
      s.totalCollected += amt;
      s.paymentsList.push({ ...p, resolvedReceiver: rec });

      const mode = (p.payment_mode || '').trim();
      const isOnline = rec === 'Company / Airbnb' ||
        /airbnb/i.test(mode) ||
        /online/i.test(mode) ||
        /payout/i.test(mode) ||
        mode === 'UPI' ||
        mode === 'Bank' ||
        mode === 'Bank Transfer';

      if (isOnline) {
        s.upiOnline += amt;
      } else {
        // Cash payment
        s.cashInHand += amt;
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

    // Selected person stats for dedicated KPI card
    const selStat = allReceiversList.find(x => x.name === selectedPerson) || {
      name: selectedPerson,
      category: 'Receiver',
      cashInHand: 0,
      upiOnline: 0,
      cashHandedOver: 0,
      totalCollected: 0
    };
    const pctOfTotal = totalGrossCollectedAll > 0 ? ((selStat.totalCollected / totalGrossCollectedAll) * 100).toFixed(1) : '0.0';

    let html = `
      <style>
        .ledger-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .receiver-kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 12px;
        }
        .ledger-kpi-card {
          background: #fff;
          padding: 14px 16px;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .ledger-kpi-val {
          font-size: clamp(18px, 3.8vw, 24px);
          font-weight: 900;
          color: #0f172a;
          margin-top: 4px;
          word-break: break-word;
        }
        .ledger-kpi-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .ledger-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 8px;
        }
        .ledger-table-wrap table th,
        .ledger-table-wrap table td {
          white-space: nowrap;
        }

        /* Responsive Mobile Layouts */
        @media (max-width: 640px) {
          .ledger-header-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .ledger-header-actions {
            display: flex !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .ledger-header-actions button {
            flex: 1 !important;
            text-align: center !important;
            padding: 9px 10px !important;
          }
          .ledger-kpi-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .receiver-kpi-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
          .ledger-kpi-card {
            padding: 10px 12px !important;
          }
          .ledger-kpi-val {
            font-size: 17px !important;
          }
          .ledger-kpi-label {
            font-size: 9.5px !important;
            line-height: 1.2 !important;
          }
          .receiver-focus-card {
            padding: 14px 12px !important;
          }
          .receiver-focus-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .receiver-focus-actions {
            display: flex !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .receiver-focus-actions button {
            flex: 1 !important;
            justify-content: center !important;
            padding: 8px 10px !important;
          }
          .ledger-filter-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 8px !important;
          }
          .ledger-filter-select {
            width: 100% !important;
          }
          .custom-receiver-input-wrap {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .custom-receiver-input-wrap input {
            min-width: 0 !important;
            width: 100% !important;
          }
          .custom-receiver-input-wrap button {
            width: 100% !important;
            padding: 10px !important;
          }
        }
      </style>

      <div style="padding:10px 0;">
        <!-- Header & Action Bar -->
        <div class="ledger-header-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div>
            <h1 style="margin:0; font-size:22px; font-weight:800; color:#0f172a;">💼 Cash & Payment Receiver Ledger</h1>
            <p style="margin:4px 0 0; color:#64748b; font-size:13px;">Real-time tracking of money collected across Airbnb, Anwar-OD, caretakers & staff</p>
          </div>
          <div class="ledger-header-actions" style="display:flex; gap:8px;">
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
          <div class="custom-receiver-input-wrap" style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
            <input type="text" id="inlineNewReceiverName" placeholder="Enter Receiver Name (e.g. Caretaker Ramesh, Property Manager...)" 
                   style="flex:1; min-width:240px; padding:9px 14px; border:1px solid #cbd5e1; border-radius:8px; font-size:14px; outline:none;"
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
              <span style="display:inline-flex; align-items:center; gap:8px; background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:5px 12px; border-radius:20px; font-size:12.5px; font-weight:700;">
                <span>👤 ${name}</span>
                <button type="button" onclick="window.openEditReceiverModal('${name}')" title="Modify / Edit receiver name" style="background:#fff; border:1px solid #fcd34d; color:#b45309; padding:2px 8px; border-radius:6px; font-size:11px; cursor:pointer; font-weight:700;">
                  ✏️ Edit
                </button>
                <button type="button" onclick="window.openDeleteReceiverModal('${name}')" title="Delete receiver" style="background:#fee2e2; border:1px solid #fca5a5; color:#b91c1c; padding:2px 8px; border-radius:6px; font-size:11px; cursor:pointer; font-weight:700;">
                  🗑️ Delete
                </button>
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
          <div style="display:flex; gap:10px; margin-top:10px; align-items:center; flex-wrap:wrap;">
            <input type="text" id="hoNotes" placeholder="Optional notes (e.g. Cleared 22 Nov collections)" style="flex:1; min-width:180px; padding:8px 10px; border:1px solid #86efac; border-radius:6px;" />
            <button type="button" onclick="window.saveInlineHandover()" style="background:#166534; color:#fff; border:none; padding:8px 18px; border-radius:6px; font-weight:700; cursor:pointer;">
              ✅ Confirm Handover
            </button>
            <button type="button" onclick="window.toggleHandoverBox()" style="background:#e2e8f0; color:#334155; border:none; padding:8px 14px; border-radius:6px; font-weight:600; cursor:pointer;">
              Cancel
            </button>
          </div>
        </div>

        <!-- 3. KPI Summary Section (DYNAMIC: Shows Dedicated Receiver Focus Card When Filtered, or System Overview When ALL) -->
        ${selectedPerson !== 'ALL' ? `
          <!-- DEDICATED SELECTED RECEIVER FOCUS KPI HERO CARD -->
          <div class="card receiver-focus-card" style="margin-bottom:16px; background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#fff; border-radius:14px; padding:18px 20px; box-shadow:0 4px 16px rgba(15,23,42,0.15); border:1px solid #334155;">
            <div class="receiver-focus-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:12px;">
              <div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span style="font-size:22px;">${selStat.name === 'Company / Airbnb' ? '🌐' : selStat.name === 'Anwar-OD' ? '🏦' : '👤'}</span>
                  <h2 style="margin:0; font-size:20px; font-weight:800; color:#fff; letter-spacing:-0.2px;">${selStat.name}</h2>
                  <span style="background:rgba(255,255,255,0.15); color:#f8fafc; font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; text-transform:uppercase;">
                    ${selStat.category}
                  </span>
                  <span style="background:#b45309; color:#fef3c7; font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; display:inline-flex; align-items:center; gap:4px;">
                    🔍 Receiver Filter Active
                  </span>
                </div>
                <div style="font-size:12px; color:#94a3b8; margin-top:4px;">
                  Real-time collection audit, in-hand cash status & payout tracking for <strong>${selStat.name}</strong>
                </div>
              </div>
              <div class="receiver-focus-actions" style="display:flex; gap:8px; align-items:center;">
                <button type="button" onclick="window._myLedgerSelectedPerson='ALL'; window.renderMyLedger();" 
                        style="background:rgba(255,255,255,0.15); color:#fff; border:1px solid rgba(255,255,255,0.3); padding:7px 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                  <span>✕</span> Show All Receivers
                </button>
                ${selStat.cashInHand > 0 ? `
                  <button type="button" onclick="window.toggleHandoverBox('${selStat.name}', ${selStat.cashInHand})" 
                          style="background:#059669; color:#fff; border:none; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                    🤝 Handover ₹${selStat.cashInHand.toLocaleString('en-IN')}
                  </button>
                ` : ''}
              </div>
            </div>

            <!-- Receiver Sub-KPI Grid -->
            <div class="receiver-kpi-grid">
              <!-- Primary Metric: Total Collected -->
              <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:12px 14px; border-left:4px solid #f59e0b;">
                <div class="ledger-kpi-label" style="color:#fbbf24;">💰 Total Amount Collected</div>
                <div class="ledger-kpi-val" style="color:#fff;">
                  ₹${selStat.totalCollected.toLocaleString('en-IN')}
                </div>
                <div style="font-size:11px; color:#cbd5e1; margin-top:3px;">
                  ${pctOfTotal}% of total receipts (₹${totalGrossCollectedAll.toLocaleString('en-IN')})
                </div>
              </div>

              <!-- Cash In Hand -->
              <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:12px 14px; border-left:4px solid ${selStat.cashInHand > 0 ? '#ef4444' : '#10b981'};">
                <div class="ledger-kpi-label" style="color:${selStat.cashInHand > 0 ? '#f87171' : '#34d399'};">💵 Cash In Hand</div>
                <div class="ledger-kpi-val" style="color:${selStat.cashInHand > 0 ? '#fca5a5' : '#fff'};">
                  ₹${selStat.cashInHand.toLocaleString('en-IN')}
                </div>
                <div style="font-size:11px; color:#cbd5e1; margin-top:3px;">
                  ${selStat.cashInHand > 0 ? '⚠️ Pending Handover' : '✅ No Cash Pending'}
                </div>
              </div>

              <!-- UPI & Online -->
              <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:12px 14px; border-left:4px solid #38bdf8;">
                <div class="ledger-kpi-label" style="color:#38bdf8;">📱 UPI & Online Direct</div>
                <div class="ledger-kpi-val" style="color:#fff;">
                  ₹${selStat.upiOnline.toLocaleString('en-IN')}
                </div>
                <div style="font-size:11px; color:#cbd5e1; margin-top:3px;">
                  Direct digital receipts
                </div>
              </div>

              <!-- Cash Handed Over -->
              <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:10px; padding:12px 14px; border-left:4px solid #a78bfa;">
                <div class="ledger-kpi-label" style="color:#c084fc;">🤝 Cash Handed Over</div>
                <div class="ledger-kpi-val" style="color:#fff;">
                  ₹${selStat.cashHandedOver.toLocaleString('en-IN')}
                </div>
                <div style="font-size:11px; color:#cbd5e1; margin-top:3px;">
                  ${displayedPayments.length} booking receipts tracked
                </div>
              </div>
            </div>
          </div>
        ` : `
          <!-- ALL RECEIVERS OVERVIEW KPI CARDS -->
          <div class="ledger-kpi-grid">
            <div class="ledger-kpi-card" style="border-left:4px solid #ef4444;">
              <div class="ledger-kpi-label" style="color:#ef4444;">💵 Total Cash In Hand (Team)</div>
              <div class="ledger-kpi-val">₹${totalCashInHandAll.toLocaleString('en-IN')}</div>
              <div style="font-size:11px; color:#64748b; margin-top:2px;">Currently held across team</div>
            </div>
            <div class="ledger-kpi-card" style="border-left:4px solid #3b82f6;">
              <div class="ledger-kpi-label" style="color:#3b82f6;">📱 UPI & Online Total</div>
              <div class="ledger-kpi-val">₹${totalUPIAll.toLocaleString('en-IN')}</div>
              <div style="font-size:11px; color:#64748b; margin-top:2px;">Airbnb payouts & direct UPI receipts</div>
            </div>
            <div class="ledger-kpi-card" style="border-left:4px solid #10b981;">
              <div class="ledger-kpi-label" style="color:#10b981;">🤝 Cash Handed Over / Accounted</div>
              <div class="ledger-kpi-val">₹${totalHandedOverAll.toLocaleString('en-IN')}</div>
              <div style="font-size:11px; color:#64748b; margin-top:2px;">Safely deposited to Anwar-OD</div>
            </div>
            <div class="ledger-kpi-card" style="border-left:4px solid #b45309;">
              <div class="ledger-kpi-label" style="color:#b45309;">💰 Gross Revenue Collected</div>
              <div class="ledger-kpi-val">₹${totalGrossCollectedAll.toLocaleString('en-IN')}</div>
              <div style="font-size:11px; color:#64748b; margin-top:2px;">Total booking receipts tracked</div>
            </div>
          </div>
        `}

        <!-- 4. Receiver Balances Table -->
        <div class="card" style="background:#fff; border-radius:12px; padding:16px; margin-bottom:16px; border:1px solid #e2e8f0; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div class="ledger-filter-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
            <div>
              <strong style="color:#0f172a; font-size:15px;">👥 Live Balances by Receiver ("Kiske Paas Kitna Hai")</strong>
              <div style="font-size:12px; color:#64748b; margin-top:2px;">Click any row to filter by that receiver and view their individual KPI & payments</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:12px; font-weight:700; color:#64748b;">Filter View:</span>
              <select class="ledger-filter-select" onchange="window._myLedgerSelectedPerson=this.value; window.renderMyLedger();" 
                      style="padding:8px 12px; border-radius:8px; border:${selectedPerson !== 'ALL' ? '2px solid #b45309' : '1px solid #cbd5e1'}; background:${selectedPerson !== 'ALL' ? '#fffbeb' : '#fff'}; font-weight:700; font-size:13px; outline:none; cursor:pointer;">
                <option value="ALL" ${selectedPerson === 'ALL' ? 'selected' : ''}>👥 All Receivers (Overview) — ₹${totalGrossCollectedAll.toLocaleString('en-IN')}</option>
                <option value="Company / Airbnb" ${selectedPerson === 'Company / Airbnb' ? 'selected' : ''}>🌐 Company / Airbnb (₹${(stats['Company / Airbnb']?.totalCollected || 0).toLocaleString('en-IN')})</option>
                <option value="Anwar-OD" ${selectedPerson === 'Anwar-OD' ? 'selected' : ''}>🏦 Anwar-OD (₹${(stats['Anwar-OD']?.totalCollected || 0).toLocaleString('en-IN')})</option>
                ${customReceivers.map(r => `<option value="${r}" ${selectedPerson === r ? 'selected' : ''}>👤 ${r} (₹${(stats[r]?.totalCollected || 0).toLocaleString('en-IN')})</option>`).join('')}
                ${activeEmployees.map(e => `<option value="${e}" ${selectedPerson === e ? 'selected' : ''}>🧑‍💼 ${e} (₹${(stats[e]?.totalCollected || 0).toLocaleString('en-IN')})</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="ledger-table-wrap">
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; text-align:left;">
                  <th style="padding:10px 12px; font-weight:700; color:#475569;">Receiver / Account</th>
                  <th style="padding:10px 12px; font-weight:700; color:#475569;">Account Type</th>
                  <th style="padding:10px 12px; font-weight:700; color:#ef4444; text-align:right;">Cash In Hand</th>
                  <th style="padding:10px 12px; font-weight:700; color:#3b82f6; text-align:right;">UPI & Online</th>
                  <th style="padding:10px 12px; font-weight:700; color:#10b981; text-align:right;">Handed Over</th>
                  <th style="padding:10px 12px; font-weight:700; color:#0f172a; text-align:right;">Total Collected</th>
                  <th style="padding:10px 12px; font-weight:700; color:#475569; text-align:center;">Action</th>
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

      const isRowSelected = selectedPerson === r.name;
      const rowBg = isRowSelected ? '#eff6ff' : 'transparent';
      const rowBorderLeft = isRowSelected ? '4px solid #2563eb' : '4px solid transparent';

      return `
                    <tr style="border-bottom:1px solid #f1f5f9; background:${rowBg}; border-left:${rowBorderLeft}; cursor:pointer;" 
                        onclick="window._myLedgerSelectedPerson='${r.name}'; window.renderMyLedger();"
                        title="Click to view KPI & bookings for ${r.name}">
                      <td style="padding:10px 12px; font-weight:700; color:#0f172a;">
                        ${r.name === 'Company / Airbnb' ? '🌐' : r.name === 'Anwar-OD' ? '🏦' : '👤'} ${r.name}
                        ${isRowSelected ? '<span style="background:#2563eb; color:#fff; font-size:10px; font-weight:800; padding:2px 6px; border-radius:10px; margin-left:6px;">Active</span>' : ''}
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
                      <td style="padding:10px 12px; text-align:center; white-space:nowrap;">
                        ${(r.name === 'Company / Airbnb' || r.name === 'Anwar-OD') ? `
                          <span style="color:#64748b; font-size:11px; font-weight:600;">System Account</span>
                        ` : activeEmployees.includes(r.name) ? `
                          <span style="color:#64748b; font-size:11px;">Staff Roster</span>
                        ` : `
                          <button type="button" onclick="event.stopPropagation(); window.openEditReceiverModal('${r.name}')" style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer;" title="Edit receiver">
                            ✏️ Edit
                          </button>
                          <button type="button" onclick="event.stopPropagation(); window.openDeleteReceiverModal('${r.name}')" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:700; cursor:pointer; margin-left:4px;" title="Delete receiver">
                            🗑️ Delete
                          </button>
                        `}
                      </td>
                    </tr>
                  `;
    }).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. Recent Booking Payments Log -->
        <div class="card" style="background:#fff; border-radius:12px; padding:16px; border:1px solid #e2e8f0; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
            <div>
              <strong style="color:#0f172a; font-size:15px;">📋 Recent Booking Payments Log (${displayedPayments.length} Transactions${selectedPerson !== 'ALL' ? ` · ${selectedPerson}` : ''})</strong>
              <div style="font-size:12px; color:#64748b; margin-top:2px;">Audit trail of payments received and credited to accounts</div>
            </div>
            ${selectedPerson !== 'ALL' ? `
              <button onclick="window._myLedgerSelectedPerson='ALL'; window.renderMyLedger();" 
                      style="background:#0f172a; color:#fff; border:none; padding:6px 12px; border-radius:6px; font-size:11.5px; font-weight:700; cursor:pointer;">
                ✕ Clear Filter (Show All)
              </button>
            ` : ''}
          </div>

          <div class="ledger-table-wrap">
            <table style="width:100%; border-collapse:collapse; font-size:12px;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; text-align:left;">
                  <th style="padding:8px 10px; color:#475569;">Date</th>
                  <th style="padding:8px 10px; color:#475569;">Guest / Booking</th>
                  <th style="padding:8px 10px; color:#475569;">Mode</th>
                  <th style="padding:8px 10px; color:#475569;">Received By</th>
                  <th style="padding:8px 10px; color:#475569;">Notes</th>
                  <th style="padding:8px 10px; color:#475569; text-align:right;">Amount</th>
                  <th style="padding:8px 10px; color:#475569; text-align:center;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${displayedPayments.length === 0 ? '<tr><td colspan="7" style="padding:24px; text-align:center; color:#94a3b8; font-size:13px;">No payments recorded for this receiver.</td></tr>' : ''}
                ${displayedPayments.slice(0, 100).map(p => {
      const g = p.guest_register;
      const guestName = g?.guest_name || 'Guest';
      const r = g?.rooms;
      const roomStr = r ? (r.nickname ? `${r.nickname} (${r.unit_no || ''})` : (r.unit_no || '')) : (g?.room_id || '');
      const isAirbnb = p.resolvedReceiver === 'Company / Airbnb';

      return `
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      <td style="padding:8px 10px; white-space:nowrap; color:#64748b;">${p.payment_date || '-'}</td>
                      <td style="padding:8px 10px; font-weight:600; color:#0f172a;">
                        ${guestName} ${roomStr ? `<span style="color:#64748b; font-size:11px;">(${roomStr})</span>` : ''}
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
                      <td style="padding:8px 10px; text-align:center; white-space:nowrap;">
                        <button type="button" onclick="window.openEditPaymentReceiverModal(${p.id})" 
                                style="background:#f8fafc; border:1px solid #cbd5e1; color:#0f172a; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;"
                                title="Change payment receiver, mode or notes">
                          ✏️ Edit
                        </button>
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
