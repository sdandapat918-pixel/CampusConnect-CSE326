/* CampusConnect - CSE326 CA1 project
   Front-end demonstration: HTML + CSS + JavaScript + browser localStorage.
   This is not a production authentication/payment backend. */
const STORAGE_KEY = "campusConnectEvents_v1";
const REG_KEY = "campusConnectRegistrations_v1";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const today = new Date();
today.setHours(0,0,0,0);
const datePlus = (days) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0,10);
};
const seedEvents = [
  {id:"evt-design",title:"Design Thinking Workshop",category:"Workshop",date:datePlus(2),time:"10:00",venue:"Innovation Lab · Block 32",capacity:40,description:"Turn everyday problems into thoughtful ideas through a fast, collaborative design sprint.",symbol:"✳"},
  {id:"evt-code",title:"CodeRush Challenge",category:"Competition",date:datePlus(4),time:"14:00",venue:"Computer Lab · Block  nueva",capacity:60,description:"Team up, solve coding puzzles and test your problem-solving skills in a friendly challenge.",symbol:"{ }"},
  {id:"evt-talk",title:"Future of AI: Open Talk",category:"Seminar",date:datePlus(6),time:"11:30",venue:"Auditorium · Block  LP",capacity:120,description:"Explore real-world AI applications, emerging questions and responsible innovation.",symbol:"◉"},
  {id:"evt-culture",title:"Campus Culture Night",category:"Cultural",date:datePlus(10),time:"17:00",venue:"Open Air Theatre",capacity:180,description:"An evening of music, performances and creative expression from across campus.",symbol:"♫"},
  {id:"evt-sport",title:"Inter-Block Badminton",category:"Sports",date:datePlus(13),time:"09:00",venue:"Indoor Sports Complex",capacity:48,description:"Bring your energy to a friendly campus tournament focused on fun and teamwork.",symbol:"↗"},
  {id:"evt-web",title:"Build Your First Website",category:"Workshop",date:datePlus(18),time:"12:00",venue:"Learning Studio · Block 25",capacity:35,description:"Practice the building blocks of the web and leave with a small page of your own.",symbol:"</>"}
];

function readStore(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) { return fallback; }
}
let events = readStore(STORAGE_KEY, seedEvents);
let registrations = readStore(REG_KEY, []);
if (!localStorage.getItem(STORAGE_KEY)) saveEvents();
function saveEvents(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(events)); }
function saveRegistrations(){ localStorage.setItem(REG_KEY, JSON.stringify(registrations)); }
function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function formatDate(dateStr, options={day:"numeric",month:"short",year:"numeric"}) {
  const d = new Date(`${dateStr}T12:00:00`);
  return Number.isNaN(d.getTime()) ? dateStr : new Intl.DateTimeFormat("en-IN",options).format(d);
}
function categoryClass(category){ return `cover-${String(category).toLowerCase()}`; }
function categorySymbol(category){
  return ({Workshop:"✳",Competition:"{ }",Seminar:"◉",Cultural:"♫",Sports:"↗"})[category] || "✦";
}
function availableSeats(event){ return Math.max(0, Number(event.capacity) - registrations.filter(r=>r.eventId===event.id).length); }
function seatsFilled(event){ return Number(event.capacity) ? (Number(event.capacity)-availableSeats(event))/Number(event.capacity)*100 : 0; }

function renderStats(){
  $("#stat-events").textContent = events.length;
  $("#stat-seats").textContent = events.reduce((sum,e)=>sum+availableSeats(e),0);
  $("#stat-registrations").textContent = registrations.length;
  $("#admin-event-count").textContent = events.length;
  $("#admin-reg-count").textContent = registrations.length;
  const capacity = events.reduce((sum,e)=>sum+Number(e.capacity||0),0);
  const booked = events.reduce((sum,e)=>sum+Number(e.capacity||0)-availableSeats(e),0);
  $("#admin-filled-count").textContent = capacity ? `${Math.round(booked/capacity*100)}%` : "0%";
}
function renderEvents(){
  const search = $("#search-input").value.trim().toLowerCase();
  const category = $("#category-filter").value;
  const dateRange = $("#date-filter").value;
  const now = new Date(); now.setHours(0,0,0,0);
  const filtered = events.filter(event=>{
    const haystack = `${event.title} ${event.category} ${event.venue} ${event.description}`.toLowerCase();
    if(search && !haystack.includes(search)) return false;
    if(category!=="All" && event.category!==category) return false;
    const eventDate = new Date(`${event.date}T00:00:00`);
    const diff = (eventDate-now)/86400000;
    if(dateRange==="soon" && (diff<0 || diff>7)) return false;
    if(dateRange==="month" && (diff<0 || diff>30)) return false;
    return true;
  }).sort((a,b)=>a.date.localeCompare(b.date));
  $("#event-grid").innerHTML = filtered.map(event=>{
    const available = availableSeats(event);
    const registered = registrations.some(r=>r.eventId===event.id);
    const disabled = available===0 || registered;
    const buttonText = available===0 ? "Fully booked" : registered ? "Registered ✓" : "Register ↗";
    return `<article class="event-card">
      <div class="event-cover ${categoryClass(event.category)}"><span class="category-pill">${escapeHTML(event.category.toUpperCase())}</span><span class="cover-symbol">${escapeHTML(event.symbol||categorySymbol(event.category))}</span></div>
      <div class="event-body">
        <div class="event-date">◷ ${escapeHTML(formatDate(event.date))} · ${escapeHTML(event.time)}</div>
        <h3>${escapeHTML(event.title)}</h3><p>${escapeHTML(event.description)}</p>
        <div class="event-meta"><span>⌖ ${escapeHTML(event.venue)}</span><span>${available}/${Number(event.capacity)} seats</span></div>
        <div class="seat-track"><span style="width:${Math.min(100,seatsFilled(event))}%"></span></div>
        <div class="event-actions"><span class="seats-label">${available===0?"No seats left":`${available} seats remaining`}</span><button class="button primary" data-register="${escapeHTML(event.id)}" ${disabled?"disabled":""}>${buttonText}</button></div>
      </div></article>`;
  }).join("");
  $("#empty-events").classList.toggle("hidden", filtered.length!==0);
  renderStats();
}
function renderRegistrations(){
  if(!registrations.length){
    $("#registration-list").innerHTML='<div class="no-registrations">No registrations yet. Choose an event above to reserve your first seat.</div>';
    return;
  }
  $("#registration-list").innerHTML = registrations.slice().sort((a,b)=>b.createdAt-a.createdAt).map(reg=>{
    const event=events.find(e=>e.id===reg.eventId);
    return `<article class="registration-item"><div class="reg-date-box"><b>${event?escapeHTML(formatDate(event.date,{day:"2-digit"})):"—"}</b><span>${event?escapeHTML(formatDate(event.date,{month:"short"}).toUpperCase()):"EVENT"}</span></div>
      <div class="reg-detail"><b>${escapeHTML(event?event.title:"Event no longer available")}</b><span>${escapeHTML(reg.name)} · ${escapeHTML(reg.code)}</span></div>
      <div class="reg-actions"><button class="text-button" data-view-ticket="${escapeHTML(reg.code)}">View slip</button><button class="text-button" data-cancel="${escapeHTML(reg.code)}">Cancel</button></div></article>`;
  }).join("");
}
function renderAdmin(){
  if(!events.length){$("#admin-event-list").innerHTML='<p class="form-hint">No events yet. Create one above.</p>';return;}
  $("#admin-event-list").innerHTML=events.slice().sort((a,b)=>a.date.localeCompare(b.date)).map(e=>`
    <div class="admin-row"><div><strong>${escapeHTML(e.title)}</strong><small>${escapeHTML(formatDate(e.date))} · ${availableSeats(e)} of ${e.capacity} seats available</small></div><button class="delete-btn" data-delete="${escapeHTML(e.id)}">Delete</button></div>`).join("");
}
function renderAll(){renderEvents();renderRegistrations();renderAdmin();}

function showToast(message){
  const toast=$("#toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(showToast.timeout); showToast.timeout=setTimeout(()=>toast.classList.remove("show"),2600);
}
function openRegister(eventId){
  const event=events.find(e=>e.id===eventId);
  if(!event) return;
  if(availableSeats(event)<=0){showToast("Sorry, this event is fully booked.");return;}
  if(registrations.some(r=>r.eventId===eventId)){showToast("You are already registered for this event.");return;}
  const form=$("#register-form");
  form.reset(); form.elements.eventId.value=eventId;
  $("#modal-event-summary").textContent=`${event.title} · ${formatDate(event.date)} at ${event.time} · ${event.venue}`;
  $("#register-dialog").showModal();
}
function makeCode(){return "CC-"+Math.random().toString(36).slice(2,6).toUpperCase()+"-"+Date.now().toString().slice(-4);}
function showTicket(reg){
  const event=events.find(e=>e.id===reg.eventId);
  $("#confirmation-content").innerHTML=`<div class="confirmation-icon">✓</div><span class="eyebrow">REGISTRATION CONFIRMED</span><h2>You’re on the <span>list.</span></h2><p>Keep this confirmation code for your records.</p><div class="ticket">
    <div class="ticket-row"><span>Confirmation code</span><strong>${escapeHTML(reg.code)}</strong></div>
    <div class="ticket-row"><span>Participant</span><strong>${escapeHTML(reg.name)}</strong></div>
    <div class="ticket-row"><span>Event</span><strong>${escapeHTML(event?event.title:"Event")}</strong></div>
    <div class="ticket-row"><span>Date & time</span><strong>${event?escapeHTML(formatDate(event.date)+" · "+event.time):"—"}</strong></div>
    <div class="ticket-row"><span>Venue</span><strong>${escapeHTML(event?event.venue:"—")}</strong></div>
    <div class="ticket-row"><span>Email</span><strong>${escapeHTML(reg.email)}</strong></div>
  </div><p>Demo confirmation only; no email has been sent.</p>`;
  $("#confirmation-dialog").showModal();
}
$("#event-grid").addEventListener("click",e=>{
  const button=e.target.closest("[data-register]");
  if(button) openRegister(button.dataset.register);
});
$("#search-input").addEventListener("input",renderEvents);
$("#category-filter").addEventListener("change",renderEvents);
$("#date-filter").addEventListener("change",renderEvents);
$("#register-form").addEventListener("submit",e=>{
  e.preventDefault();
  const form=e.currentTarget;
  if(!form.reportValidity())return;
  const eventId=form.elements.eventId.value;
  const event=events.find(ev=>ev.id===eventId);
  if(!event || availableSeats(event)<=0){$("#register-dialog").close();showToast("This event is no longer available.");renderAll();return;}
  if(registrations.some(r=>r.eventId===eventId)){showToast("Only one registration per event is allowed in this demo.");return;}
  const reg={eventId,name:form.elements.name.value.trim(),email:form.elements.email.value.trim(),regNo:form.elements.regNo.value.trim(),code:makeCode(),createdAt:Date.now()};
  registrations.push(reg);saveRegistrations();$("#register-dialog").close();renderAll();showTicket(reg);
});
$("#close-dialog").addEventListener("click",()=>$("#register-dialog").close());
$("#close-confirmation").addEventListener("click",()=>$("#confirmation-dialog").close());
$("#print-confirmation").addEventListener("click",()=>window.print());
$("#registration-list").addEventListener("click",e=>{
  const view=e.target.closest("[data-view-ticket]");
  const cancel=e.target.closest("[data-cancel]");
  if(view){const reg=registrations.find(r=>r.code===view.dataset.viewTicket);if(reg)showTicket(reg);}
  if(cancel){
    const reg=registrations.find(r=>r.code===cancel.dataset.cancel);
    if(reg && confirm(`Cancel your registration for ${reg.name}?`)){
      registrations=registrations.filter(r=>r.code!==reg.code);saveRegistrations();renderAll();showToast("Registration cancelled; the seat is available again.");
    }
  }
});
$("#event-form").addEventListener("submit",e=>{
  e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;
  const data=new FormData(form);
  if(data.get("date")<datePlus(0)){showToast("Choose today or a future date.");return;}
  const event={id:"evt-"+Date.now(),title:String(data.get("title")).trim(),category:String(data.get("category")),date:String(data.get("date")),time:String(data.get("time")),venue:String(data.get("venue")).trim(),capacity:Number(data.get("capacity")),description:String(data.get("description")).trim(),symbol:categorySymbol(String(data.get("category")))};
  if(!event.capacity||event.capacity<1){showToast("Seat capacity must be at least 1.");return;}
  events.push(event);saveEvents();form.reset();form.elements.time.value="10:00";form.elements.capacity.value=50;renderAll();showToast("Event created successfully.");
});
$("#admin-event-list").addEventListener("click",e=>{
  const button=e.target.closest("[data-delete]");if(!button)return;
  const event=events.find(ev=>ev.id===button.dataset.delete);if(!event)return;
  if(confirm(`Delete "${event.title}"? Existing registrations for this event will also be removed.`)){
    events=events.filter(ev=>ev.id!==event.id);registrations=registrations.filter(r=>r.eventId!==event.id);saveEvents();saveRegistrations();renderAll();showToast("Event deleted.");
  }
});
$("#theme-toggle").addEventListener("click",()=>{document.body.classList.toggle("dark");localStorage.setItem("campusConnectDark",document.body.classList.contains("dark")?"1":"0");});
if(localStorage.getItem("campusConnectDark")==="1")document.body.classList.add("dark");
renderAll();
