// DOM Elements
const body = document.body;
const langRadios = document.querySelectorAll('input[name="language"]');
const dirRadios = document.querySelectorAll('input[name="callDirection"]');
const outRespRadios = document.querySelectorAll(
  'input[name="outboundResponse"]',
);

const agentInput = document.getElementById("agent-name");
const customerInput = document.getElementById("customer-name");
const phoneInput = document.getElementById("customer-phone");

const sideAgent = document.getElementById("side-agent");
const sideCustomer = document.getElementById("side-customer");
const sidePhone = document.getElementById("side-phone");

const agentDisplays = document.querySelectorAll(".agent-name-display");
const customerDisplays = document.querySelectorAll(".customer-name-display");
const phoneDisplays = document.querySelectorAll(".phone-display");

const stepOutboundIntro = document.getElementById("step-outbound-intro");
const stepOutboundRejection = document.getElementById(
  "step-outbound-rejection",
);
const stepMainFlow = document.getElementById("step-main-flow");

const boxOutboundNo = document.getElementById("box-outbound-no");
const boxOutboundDnc = document.getElementById('box-outbound-dnc');

const callNotes = document.getElementById('call-notes');
const btnPushCopyNotes = document.getElementById('btn-push-copy-notes');
const btnRestart = document.getElementById('btn-restart');
const btnNewSession = document.getElementById('btn-new-session');

// New Interactive Elements for Step 1 & 2
const hhCountRadios = document.querySelectorAll('input[name="hhCount"]');
const memberFname = document.getElementById('member-fname');
const memberLname = document.getElementById('member-lname');
const memberDob = document.getElementById('member-dob');
const memberMedRadios = document.querySelectorAll('input[name="memberMedicaid"]');
const memberCin = document.getElementById('member-cin');
const memberPregRadios = document.querySelectorAll('input[name="memberPreg"]');
const pregResponseYes = document.getElementById('preg-response-yes');
const pregResponseNo = document.getElementById('preg-response-no');
const btnAddMember = document.getElementById('btn-add-member');
const sidebarMembersContainer = document.getElementById('sidebar-members-container');
const sidebarMembersList = document.getElementById('sidebar-members-list');
const btnCopyMembersTemplate = document.getElementById('btn-copy-members-template');
const memberTemplate = document.getElementById('member-template');

let addedMembersData = []; // Array to store raw object data for the copy template

// Dynamic Text Updaters
function updateDynamicText() {
  const agentName = agentInput.value.trim() || "[Agent]";
  const customerName = customerInput.value.trim() || "[Customer]";
  const phoneNum = phoneInput.value.trim() || "[Phone]";

  sideAgent.textContent = agentInput.value.trim() || "-";
  sideCustomer.textContent = customerInput.value.trim() || "-";
  sidePhone.textContent = phoneInput.value.trim() || "-";

  agentDisplays.forEach((el) => (el.textContent = agentName));
  customerDisplays.forEach((el) => (el.textContent = customerName));
  phoneDisplays.forEach((el) => (el.textContent = phoneNum));
}

// State Workflow Evaluation
function evaluateWorkflow() {
    if (typeof performSearch === 'function') performSearch(); // Update search language filter dynamically
  const lang =
    document.querySelector('input[name="language"]:checked')?.value || "en";
  const dir =
    document.querySelector('input[name="callDirection"]:checked')?.value ||
    "inbound";
  const outResp = document.querySelector(
    'input[name="outboundResponse"]:checked',
  )?.value;

  // Apply classes for CSS to handle visibility of spiels
  body.classList.remove("lang-en", "lang-es", "dir-inbound", "dir-outbound");
  body.classList.add(`lang-${lang}`);
  body.classList.add(`dir-${dir}`);

  // Manage Outbound Flow Visibility
  if (dir === "outbound") {
    stepOutboundIntro.classList.add("active");
    if (outResp === "yes") {
      stepMainFlow.classList.add("active");
      stepOutboundRejection.classList.remove("active");
      boxOutboundNo.style.display = "none";
      boxOutboundDnc.style.display = "none";
    } else if (outResp === "no") {
      stepMainFlow.classList.remove("active");
      stepOutboundRejection.classList.add("active");
      boxOutboundNo.style.display = "block";
      boxOutboundDnc.style.display = "none";
    } else if (outResp === "dnc") {
      stepMainFlow.classList.remove("active");
      stepOutboundRejection.classList.add("active");
      boxOutboundNo.style.display = "none";
      boxOutboundDnc.style.display = "block";
    } else {
      stepMainFlow.classList.remove("active");
      stepOutboundRejection.classList.remove("active");
    }
  } else {
    // Inbound Flow
    stepOutboundIntro.classList.remove("active");
    stepOutboundRejection.classList.remove("active");
    stepMainFlow.classList.add("active");

    // Reset outbound radios
    outRespRadios.forEach((radio) => (radio.checked = false));
  }
}

// Event Listeners
[agentInput, customerInput, phoneInput].forEach(input => {
    input.addEventListener('input', updateDynamicText);
});

langRadios.forEach(radio => radio.addEventListener('change', evaluateWorkflow));
dirRadios.forEach(radio => radio.addEventListener('change', evaluateWorkflow));
outRespRadios.forEach(radio => radio.addEventListener('change', evaluateWorkflow));

const cinContainer = document.getElementById('cin-container');

// Toggle Medicaid responses (CIN visibility)
memberMedRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'Yes') {
            cinContainer.style.display = 'block';
        } else {
            cinContainer.style.display = 'none';
            memberCin.value = ''; // Clear input if user switches to No
        }
    });
});

// Toggle pregnancy responses
memberPregRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (this.value === 'Yes') {
            pregResponseYes.style.display = 'block';
            pregResponseNo.style.display = 'none';
        } else {
            pregResponseYes.style.display = 'none';
            pregResponseNo.style.display = 'block';
        }
    });
});

function renderMembers() {
    sidebarMembersList.innerHTML = '';
    
    if (addedMembersData.length === 0) {
        sidebarMembersContainer.style.display = 'none';
        return;
    }
    
    sidebarMembersContainer.style.display = 'block';

    addedMembersData.forEach((member, index) => {
        const clone = memberTemplate.content.cloneNode(true);
        
        clone.querySelector('.member-name').textContent = `${member.fname} ${member.lname}`.trim();
        clone.querySelector('.member-dob').textContent = member.dob;
        clone.querySelector('.member-med').textContent = member.medicaid;
        clone.querySelector('.member-cin').textContent = member.cin;
        clone.querySelector('.member-preg').textContent = member.preg;

        const header = clone.querySelector('.member-header');
        const details = clone.querySelector('.member-details');
        const caret = clone.querySelector('.member-caret');
        const deleteBtn = clone.querySelector('.btn-delete-member');
        
        header.addEventListener('click', function() {
            if (details.style.display === 'none') {
                details.style.display = 'block';
                caret.style.transform = 'rotate(90deg)';
            } else {
                details.style.display = 'none';
                caret.style.transform = 'rotate(0deg)';
            }
        });

        // Delete Member Logic
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevents the accordion from toggling when clicking delete
            addedMembersData.splice(index, 1);
            renderMembers(); // Re-render the list to reset the indexes
        });

        sidebarMembersList.appendChild(clone);
    });
}

// Add Member Logic (Using Template to avoid HTML strings)
btnAddMember.addEventListener('click', function() {
    const fname = memberFname.value.trim();
    const lname = memberLname.value.trim();
    
    if (!fname) {
        alert("Please enter at least the First Name to add a member.");
        return;
    }

    const dob = memberDob.value || 'N/A';
    const medVal = document.querySelector('input[name="memberMedicaid"]:checked')?.value || 'N/A';
    const cin = medVal === 'No' ? 'N/A' : (memberCin.value.trim() || 'N/A');
    const pregVal = document.querySelector('input[name="memberPreg"]:checked')?.value || 'N/A';

    // Format date string gracefully if present
    let formattedDob = dob;
    if (dob !== 'N/A' && dob.includes('-')) {
        const parts = dob.split('-');
        if (parts.length === 3) formattedDob = `${parts[1]}/${parts[2]}/${parts[0]}`;
    }

    // Save to the raw data array
    addedMembersData.push({
        fname: fname,
        lname: lname,
        dob: formattedDob,
        medicaid: medVal,
        cin: cin,
        preg: pregVal
    });

    renderMembers();

    // Clear Step 2 fields to make way for new additions
    memberFname.value = '';
    memberLname.value = '';
    memberDob.value = '';
    memberCin.value = '';
    memberMedRadios.forEach(r => r.checked = false);
    memberPregRadios.forEach(r => r.checked = false);
    if (cinContainer) cinContainer.style.display = 'none';
    pregResponseYes.style.display = 'none';
    pregResponseNo.style.display = 'none';
});

function resetSession() {
    agentInput.value = "";
    customerInput.value = "";
    phoneInput.value = "";
    callNotes.value = "";
    document.getElementById("global-search").value = "";

    document.getElementById('lang-en').checked = true;
    document.getElementById('dir-inbound').checked = true;
    outRespRadios.forEach(radio => radio.checked = false);

    // Reset Member inputs and clear profiles
    hhCountRadios.forEach(radio => radio.checked = false);
    memberFname.value = '';
    memberLname.value = '';
    memberDob.value = '';
    memberCin.value = '';
    memberMedRadios.forEach(r => r.checked = false);
    memberPregRadios.forEach(r => r.checked = false);
    if (cinContainer) cinContainer.style.display = 'none';
    pregResponseYes.style.display = 'none';
    pregResponseNo.style.display = 'none';
    
    // Remove all cloned members & reset array
    addedMembersData = [];
    renderMembers();

    updateDynamicText();
    evaluateWorkflow();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

btnRestart.addEventListener("click", resetSession);
if (btnNewSession) btnNewSession.addEventListener("click", resetSession);

btnPushCopyNotes.addEventListener('click', function() {
    if (!callNotes.value) return;
    navigator.clipboard.writeText(callNotes.value).then(function() {
        const originalText = btnPushCopyNotes.textContent;
        btnPushCopyNotes.textContent = '✅ Copied!';
        setTimeout(function() { btnPushCopyNotes.textContent = originalText; }, 2000);
    });
});

if (btnCopyMembersTemplate) {
    btnCopyMembersTemplate.addEventListener('click', function() {
        const hhCountVal = document.querySelector('input[name="hhCount"]:checked')?.value || 'Not specified';
        const ordinals = ["First", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth"];
        
        let text = "Para comenzar con su solicitud, ¿cuántos miembros del hogar en total tienen Medicaid?\n";
        text += "To get started on your application, how many household members total are on Medicaid?\n";
        text += `How many household members are on medicaid: ${hhCountVal}\n`;

        addedMembersData.forEach((member, index) => {
            const ordinal = ordinals[index] || (index + 1) + "th";
            text += `Legal Name Of ${ordinal} house Hold Member\n`;
            text += `first name: ${member.fname}\n`;
            text += `last name: ${member.lname}\n`;
            text += `Date Of Birth: ${member.dob}\n`;
            text += `do you have medicaid: ${member.medicaid}\n`;

            if (index === 0) {
                text += `Medicaid Cin umber( the medicaid number has 2 letters and then 5 numbers and then 1 letter for example wd12344y)( this is optional but it makes it easier for us to find you in the system: ${member.cin}\n`;
                text += `Are you currently pregnant or postpartum (baby under 12 months old)? * (You will not be asked to provide proof of pregnancy.) If you are pregnant, you will definitely qualify to receive the food boxes. If you are not currently pregnant or postpartum, you may still qualify, but eligibility is not guaranteed and will depend on other program requirements.: ${member.preg}\n`;
            } else {
                // index 1 is 2nd member, index 6 is 7th member
                if (index === 1 || index === 6) {
                    text += `Medicaid Cin umber: ${member.cin}\n`;
                } else {
                    text += `Medicaid Cin Number: ${member.cin}\n`;
                }
                text += `Currently pregnant: ${member.preg}\n`;
            }
        });

        navigator.clipboard.writeText(text).then(() => {
            const originalText = btnCopyMembersTemplate.textContent;
            btnCopyMembersTemplate.textContent = '✅ Copied!';
            setTimeout(() => { btnCopyMembersTemplate.textContent = originalText; }, 2000);
        });
    });
}

// --- Knowledge Base & Global Search ---
const globalSearchInput = document.getElementById('global-search');
const searchResultsContainer = document.getElementById('search-results');

const kbData = [
    {
        category: 'Program Info / Links',
        keywords: 'website url status check link online portal',
        text: 'Customers can check their application status anytime at foodieonus.com.'
    },
    {
        category: 'Medicaid / CIN',
        keywords: 'cin format letters numbers medicaid id identifier proof',
        text: 'Medicaid CIN Format: 2 letters, 5 numbers, and 1 letter (e.g. WD12344Y).\n\nThis is optional, but it makes it much easier to find the customer in the system.'
    },
    {
        category: 'Eligibility / Requirements',
        keywords: 'pregnant postpartum baby proof guarantee qualify requirements',
        text: 'Pregnant or Postpartum (baby under 12 months old): 100% guarantee to qualify if yes, and NO proof of pregnancy is required.\n\nNon-pregnant applicants may still qualify based on overall program requirements.'
    },
    {
        category: 'Meals / Delivery',
        keywords: 'delivery food ready-to-eat cooked groceries raw prep',
        text: 'Our main program sends a box of delicious, fresh, ready-to-eat meals right to your door every week—pre-cooked with zero prep time. We can also request raw groceries instead if the customer prefers.'
    },
    {
        category: 'Application Next Steps',
        keywords: 'timeline screening review confirmation process next step days',
        text: '1. Screening Call: Brief call in a few days for a quick 2-minute questionnaire.\n2. Review: Process takes 2 business days.\n3. Confirmation: Call and email to confirm once approved.\n4. Deliveries: Weekly food boxes start shortly after.'
    },
    {
        category: 'Ready Spiel - ¿Para qué? ¿Quién habla? (What are you?)',
        keywords: 'quien habla para que what are you foodie',
        text: 'Servicio al Cliente de Foodie. Somos un programa de asistencia alimentaria diseñado para ayudar a personas y familias elegibles. Podemos verificar su información para ver si puede precalificar.\n[EN]Foodie Customer Service. We are a food assistance program designed to help eligible individuals and families. We can check your information to see if you may pre-qualify.'
    },
    {
        category: 'Ready Spiel - ¿De qué? ¿De dónde? (Where are you located?)',
        keywords: 'de donde ubicacion office location walk-in remote',
        text: 'Trabajamos de forma remota. Aunque no tenemos una oficina pública para visitas en persona, siempre puede contactarnos aquí o por correo electrónico en foodieonus.com.\n[EN]We are located remotely. While we don\'t have a public office address for walk-ins, you can always reach us here on email at foodieonus.com.'
    },
    {
        category: 'Ready Spiel - ¿Elegibilidad? ¿Qué hago para calificar? (Eligibility? How to qualify?)',
        keywords: 'elegibilidad calificar qualify medicaid requirements eligibility',
        text: 'Comenzaremos haciendo una verificación de precalificación, pero uno de los requisitos clave es tener cobertura activa de Medicaid.\n[EN]We\'ll start by doing a pre-qualification check, but one of the key requirements is having active Medicaid coverage.'
    },
    {
        category: 'Ready Spiel - Mensaje de Voz (Voicemail)',
        keywords: 'voicemail buzon mensaje de voz message machine',
        text: 'Hola, le llamamos del Servicio al Cliente de Foodie. Nos comunicamos para ayudarle con el programa de asistencia alimentaria y ver si puede precalificar. Por favor, devuélvanos la llamada al [Phone] cuando le sea posible. ¡Gracias y que tenga un excelente día!\n[EN]Hello, this is calling from Foodie Customer Service. We are reaching out to help you with the food assistance program and see if you may pre-qualify. Please give us a call back at [Phone] at your earliest convenience. Thank you, and have a wonderful day!'
    },
    {
        category: 'Ready Spiel - Llamadas Fantasma (Ghost Spiels)',
        keywords: 'ghost spiel mute hear disconnected no response',
        text: 'I. Primera verificación: Hola, le habla el Servicio al Cliente de Foodie. Tengo problemas para escucharle. ¿Sigue en la línea? (Espere 5-7 segundos)\n[EN]I. First Check: Hello, this is Foodie Customer Service. I am having trouble hearing you. Are you still on the line? (Wait 5-7 seconds)\n\nII. Segunda verificación: Hola, sigo sin poder escucharle. Si está hablando, es posible que su teléfono esté en silencio. (Espere 5-7 segundos)\n[EN]II. Second Check: Hello, I am still unable to hear you. If you are speaking, your phone might be on mute. (Wait 5-7 seconds)\n\nIII. Desconexión: Como no puedo escucharle, tendré que desconectar esta llamada. Por favor, devuélvanos la llamada para que podamos ayudarle con su solicitud de comidas, o visite foodieonus.com. ¡Gracias y que tenga un excelente día!\n[EN]III. Call Disconnect: Since I cannot hear you, I will need to disconnect this call. Please call us back so we can help you with your meal application, or visit foodieonus.com. Thank you, and have a great day!'
    },
    {
        category: 'Ready Spiel - Seguimiento de solicitud incompleta (Callback / Incomplete)',
        keywords: 'seguimiento callback incomplete followup',
        text: 'Hola, le devuelvo la llamada del Servicio al Cliente de Foodie. Nos comunicamos para ayudarle con el programa de asistencia alimentaria y ver si puede precalificar. ¿Está disponible para hablar en este momento?\n[EN]Hello, I\'m calling back from Foodie Customer Service. We are reaching out to help you with the food assistance program and see if you may pre-qualify. Are you available to speak right now?'
    },
    {
        category: 'Ready Spiel - Devolución de llamada perdida/desconectada (Missed / Disconnected Call)',
        keywords: 'llamada perdida disconnected missed call return',
        text: 'Hola, soy [Agent] y le devuelvo la llamada del Servicio al Cliente de Foodie. Parece que perdimos su llamada. Me encantaría ayudarle con el programa de asistencia alimentaria y ver si puede precalificar. ¿Está disponible para hablar en este momento?\n[EN]Hello, this is [Agent] calling back from Foodie Customer Service. It looks like we missed your call. I’d love to help you with the food assistance program and see if you may pre-qualify. Are you available to speak right now?'
    },
    {
        category: 'Ready Spiel - ¿Cómo se escribe su nombre? (How do you spell your name?)',
        keywords: 'spell name escribir nombre',
        text: '¿Cómo se escribe su nombre?\n[EN]How do you spell your name?'
    },
    {
        category: 'Ready Spiel - ¿Cuál es el nombre de otro miembro con Medicaid? (What\'s the name of another Medicaid member?)',
        keywords: 'another member name otro miembro medicaid',
        text: '¿Cuál es el nombre de otro miembro con Medicaid?\n[EN]What\'s the name of another Medicaid member?'
    },
    {
        category: 'Ready Spiel - ¿Cuál es su número de teléfono? (What is your telephone number?)',
        keywords: 'telephone phone number numero de telefono celular',
        text: '¿Cuál es su número de teléfono?\n[EN]What is your telephone number?'
    },
    {
        category: 'Ready Spiel - ¿Cuál es su correo electrónico? (What is your email address?)',
        keywords: 'email address correo electronico',
        text: '¿Cuál es su correo electrónico?\n[EN]What is your email address?'
    },
    {
        category: 'Ready Spiel - ¿Qué solicitud? (What application?) Esto es en relación a su solicitud... (This is regarding your application...)',
        keywords: 'regarding application relacion solicitud food assistance asistencia alimentaria scn',
        text: 'Esto es en relación a su solicitud de asistencia alimentaria a través de SCN.\n[EN]This is regarding your application for food assistance through SCN.'
    }
];

function performSearch() {
    const query = globalSearchInput.value.toLowerCase().trim();

    searchResultsContainer.innerHTML = '';
    
    if (!query) return;

    const filtered = kbData.filter(function(item) {
        const cleanText = item.text.replace(/\[EN\]/g, ''); // Ignore marker in search
        const textMatch = cleanText.toLowerCase().includes(query);
        const keywordMatch = item.keywords.toLowerCase().includes(query);
        const categoryMatch = item.category.toLowerCase().includes(query);
        
        return textMatch || keywordMatch || categoryMatch;
    });

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    filtered.sort(function(a, b) {
        const regex = new RegExp('\\b' + escapeRegExp(query), 'i');
        const getScore = function(item) {
            let score = 0;
            const cleanText = item.text.replace(/\[EN\]/g, ''); // Ignore marker in score
            if (regex.test(cleanText)) score = Math.max(score, 5);
            if (regex.test(item.keywords)) score = Math.max(score, 4);
            if (item.category.toLowerCase().includes(query)) score = Math.max(score, 3);
            if (cleanText.toLowerCase().includes(query)) score = Math.max(score, 2);
            if (item.keywords.toLowerCase().includes(query)) score = Math.max(score, 1);
            return score;
        };
        return getScore(b) - getScore(a);
    });

    if (filtered.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.style.color = '#6c757d';
        emptyState.style.fontStyle = 'italic';
        emptyState.style.padding = '10px';
        emptyState.textContent = 'No results found.';
        searchResultsContainer.appendChild(emptyState);
        return;
    }

    function appendHighlighted(element, text, queryStr) {
        const regex = new RegExp('(' + escapeRegExp(queryStr) + ')', 'gi');
        const parts = text.split(regex);

        parts.forEach(function(part) {
            if (part.toLowerCase() === queryStr) {
                const mark = document.createElement('mark');
                mark.className = 'highlight-text';
                mark.textContent = part;
                element.appendChild(mark);
            } else if (part) {
                element.appendChild(document.createTextNode(part));
            }
        });
    }

    filtered.forEach(function(item) {
        const container = document.createElement('div');
        container.className = 'search-result-item';

        const categoryElem = document.createElement('div');
        categoryElem.className = 'search-category';
        
        const categoryPrefix = document.createTextNode('Category: ');
        categoryElem.appendChild(categoryPrefix);
        appendHighlighted(categoryElem, item.category, query);

        const textElem = document.createElement('div');
        
        // Dynamically replace variables from the inputs
        const currentAgent = document.getElementById('agent-name').value.trim() || '[Agent]';
        const currentPhone = document.getElementById('customer-phone').value.trim() || '[Phone]';
        
        let textToHighlight = item.text.replace(/\[Agent\]/g, currentAgent).replace(/\[Phone\]/g, currentPhone);
        
        // Render lines, applying translation CSS if marked with [EN]
        const hasSpanish = item.text.includes('[EN]');
        const lines = textToHighlight.split('\n');
        lines.forEach(function(line) {
            if (line === '') {
                textElem.appendChild(document.createElement('br'));
                return;
            }
            const lineElem = document.createElement('div');
            if (line.startsWith('[EN]')) {
                lineElem.className = 'en-translation';
                line = line.substring(4);
            } else {
                lineElem.style.marginBottom = '6px';
                if (hasSpanish) {
                    lineElem.classList.add('lang-es');
                }
            }
            appendHighlighted(lineElem, line, query);
            textElem.appendChild(lineElem);
        });

        container.appendChild(categoryElem);
        container.appendChild(textElem);

        searchResultsContainer.appendChild(container);
    });

    if (typeof initTTSButtons === 'function') {
        initTTSButtons();
    }
}

globalSearchInput.addEventListener('input', performSearch);


// Mobile Drawers
const btnToggleInfo = document.getElementById('btn-toggle-info');
const btnToggleSearch = document.getElementById("btn-toggle-search");
const drawerOverlay = document.getElementById("drawer-overlay");
const sidebar = document.getElementById("sidebar");
const rightSidebar = document.getElementById("right-sidebar");

function closeAllDrawers() {
  sidebar.classList.remove("open");
  rightSidebar.classList.remove("open");
  drawerOverlay.classList.remove("show");
}

btnToggleInfo.addEventListener("click", function () {
  closeAllDrawers();
  sidebar.classList.add("open");
  drawerOverlay.classList.add("show");
});

btnToggleSearch.addEventListener('click', function() {
    closeAllDrawers();
    rightSidebar.classList.add('open');
    drawerOverlay.classList.add('show');
});

drawerOverlay.addEventListener('click', closeAllDrawers);

// Accordion for Ready Spiels
document.querySelectorAll('.spiel-item strong').forEach(function(title) {
    title.addEventListener('click', function() {
        const parentItem = this.closest('.spiel-item');
        parentItem.classList.toggle('open');
    });
});

// --- Text-to-Speech (TTS) Feature ---
let voices = [];
const voiceSelect = document.getElementById('tts-voice');
const pitchInput = document.getElementById('tts-pitch');
const rateInput = document.getElementById('tts-rate');
const pitchVal = document.getElementById('pitch-val');
const rateVal = document.getElementById('rate-val');
const ttsModal = document.getElementById('tts-modal');
const btnTtsSettings = document.getElementById('btn-tts-settings');
const btnCloseTts = document.getElementById('btn-close-tts');

function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
    voiceSelect.innerHTML = '';
    
    const spanishVoices = voices.filter(voice => voice.lang.startsWith('es'));
    
    if (spanishVoices.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No Spanish voices found - using default';
        voiceSelect.appendChild(option);
        return;
    }

    spanishVoices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = i;
        voiceSelect.appendChild(option);
    });
}

if ('speechSynthesis' in window) {
    populateVoiceList();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }
}

pitchInput.addEventListener('input', () => {
    pitchVal.textContent = pitchInput.value;
});

rateInput.addEventListener('input', () => {
    rateVal.textContent = rateInput.value;
});

btnTtsSettings.addEventListener('click', () => {
    ttsModal.classList.add('show');
});

btnCloseTts.addEventListener('click', () => {
    ttsModal.classList.remove('show');
});

function playTTS(text, lang = 'es-US') {
    if (!('speechSynthesis' in window)) {
        alert('Sorry, your browser does not support text-to-speech.');
        return;
    }
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.pitch = parseFloat(pitchInput.value);
    utterance.rate = parseFloat(rateInput.value);
    
    const selectedVoiceIndex = voiceSelect.value;
    const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
    
    if (spanishVoices.length > 0 && selectedVoiceIndex !== '') {
        utterance.voice = spanishVoices[selectedVoiceIndex];
    }
    
    window.speechSynthesis.speak(utterance);
}

function initTTSButtons() {
    const spanishElements = document.querySelectorAll('.lang-es, .spiel-content p:not(.en-translation)');
    
    spanishElements.forEach(el => {
        if (el.querySelector('.tts-btn')) return;

        const ttsBtn = document.createElement('span');
        ttsBtn.className = 'tts-btn';
        ttsBtn.title = 'Listen to pronunciation';
        ttsBtn.innerHTML = '🔊';
        
        ttsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const clone = el.cloneNode(true);
            const btnToRemove = clone.querySelector('.tts-btn');
            if (btnToRemove) clone.removeChild(btnToRemove);
            
            const textToRead = clone.textContent.trim();
            playTTS(textToRead, 'es-US');
            
            ttsBtn.style.transform = 'scale(1.3)';
            setTimeout(() => {
                ttsBtn.style.transform = 'scale(1)';
            }, 200);
        });

        el.appendChild(ttsBtn);
    });
}

// Initialize
updateDynamicText();
evaluateWorkflow();
initTTSButtons();