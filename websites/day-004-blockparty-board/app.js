(() => {
  "use strict";
  const STORAGE_KEY = "blockparty-board-events-v1";
  const form = document.querySelector("#event-form");
  const createSection = document.querySelector("#create-section");
  const eventView = document.querySelector("#event-view");
  const status = document.querySelector("#status");
  let events = loadEvents();
  let activeId = null;
  let editingId = null;

  function loadEvents() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); }
  function announce(message) {
    status.textContent = message;
    window.setTimeout(() => { if (status.textContent === message) status.textContent = ""; }, 3500);
  }
  function publicEvent(event) {
    const { id, title, location, date, time, limit, description } = event;
    return { id, title, location, date, time, limit, description };
  }
  function encodeEvent(event) {
    const bytes = new TextEncoder().encode(JSON.stringify(publicEvent(event)));
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
  }
  function decodeEvent(value) {
    try {
      const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
      const bytes = Uint8Array.from(atob(padded), character => character.charCodeAt(0));
      const event = JSON.parse(new TextDecoder().decode(bytes));
      return event && event.id && event.title ? event : null;
    } catch { return null; }
  }
  function eventFromHash() {
    const match = location.hash.match(/^#event=(.+)$/);
    return match ? decodeEvent(match[1]) : null;
  }
  function shareUrl(event) { return `${location.origin}${location.pathname}#event=${encodeEvent(event)}`; }
  function showCreate() {
    activeId = null;
    editingId = null;
    form.reset();
    document.querySelector("#save-event").textContent = "Create event";
    document.querySelector("#cancel-edit").classList.add("hidden");
    createSection.classList.remove("hidden");
    eventView.classList.add("hidden");
    history.replaceState(null, "", location.pathname);
  }
  function render(event) {
    activeId = event.id;
    const saved = events[event.id];
    const current = saved ? { ...event, ...saved } : { ...event, attendees: [], owned: false };
    if (!saved) { events[event.id] = current; persist(); }
    createSection.classList.add("hidden");
    eventView.classList.remove("hidden");
    document.querySelector("#event-title").textContent = current.title;
    document.querySelector("#event-location").textContent = current.location;
    document.querySelector("#event-description").textContent = current.description || "No description supplied.";
    const when = new Date(`${current.date}T${current.time || "00:00"}`);
    document.querySelector("#event-datetime").textContent = when.toLocaleString([], { dateStyle: "full", timeStyle: "short" });
    document.querySelector("#event-date-badge").textContent = when.toLocaleDateString([], { month: "short", day: "numeric" });
    const attendees = current.attendees || [];
    const list = document.querySelector("#attendee-list");
    list.replaceChildren();
    if (!attendees.length) {
      const empty = document.createElement("li");
      empty.textContent = "No RSVPs saved in this browser yet.";
      list.append(empty);
    } else {
      attendees.forEach(attendee => {
        const item = document.createElement("li");
        item.textContent = attendee.note ? `${attendee.name} — ${attendee.note}` : attendee.name;
        list.append(item);
      });
    }
    document.querySelector("#attendee-count").textContent = String(attendees.length);
    document.querySelector("#edit-event").classList.toggle("hidden", !current.owned);
    document.querySelector("#delete-event").classList.toggle("hidden", !current.owned);
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const previous = editingId ? events[editingId] : null;
    const id = previous?.id || crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const record = {
      id,
      title: document.querySelector("#title").value.trim(),
      location: document.querySelector("#location").value.trim(),
      date: document.querySelector("#date").value,
      time: document.querySelector("#time").value,
      limit: Number(document.querySelector("#limit").value) || null,
      description: document.querySelector("#description").value.trim(),
      attendees: previous?.attendees || [],
      owned: true
    };
    events[id] = record;
    persist();
    history.replaceState(null, "", `#event=${encodeEvent(record)}`);
    render(record);
    announce(previous ? "Event updated." : "Event created. Copy the link to share its details.");
  });

  document.querySelector("#rsvp-form").addEventListener("submit", event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity() || !activeId) return;
    const record = events[activeId];
    record.attendees ||= [];
    if (record.limit && record.attendees.length >= record.limit) {
      announce("This event has reached its attendee limit on this device.");
      return;
    }
    record.attendees.push({ name: document.querySelector("#rsvp-name").value.trim(), note: document.querySelector("#rsvp-note").value.trim() });
    persist();
    event.currentTarget.reset();
    render(record);
    announce("RSVP saved in this browser.");
  });
  document.querySelector("#share-event").addEventListener("click", async () => {
    const url = shareUrl(events[activeId]);
    try { await navigator.clipboard.writeText(url); announce("Share link copied."); }
    catch { window.prompt("Copy this event link:", url); }
  });
  document.querySelector("#edit-event").addEventListener("click", () => {
    const record = events[activeId];
    editingId = record.id;
    for (const field of ["title", "location", "date", "time", "limit", "description"]) document.querySelector(`#${field}`).value = record[field] ?? "";
    document.querySelector("#save-event").textContent = "Save changes";
    document.querySelector("#cancel-edit").classList.remove("hidden");
    createSection.classList.remove("hidden");
    eventView.classList.add("hidden");
    document.querySelector("#title").focus();
  });
  document.querySelector("#delete-event").addEventListener("click", () => {
    if (!confirm("Delete this local event and its RSVPs?")) return;
    delete events[activeId];
    persist();
    showCreate();
    announce("Event deleted from this browser.");
  });
  document.querySelector("#new-event").addEventListener("click", showCreate);
  document.querySelector("#cancel-edit").addEventListener("click", () => render(events[editingId]));
  window.addEventListener("hashchange", () => { const shared = eventFromHash(); if (shared) render(shared); else showCreate(); });
  const shared = eventFromHash();
  if (shared) render(shared); else showCreate();
})();
