
function generateReport (){

const batch = document.getElementById('batch').value
const date = document.getElementById('date').value
const trainer = document.getElementById('trainer').value
const coordinator = document.getElementById('coordinator').value.split(',').map((c)=>c.trim())
const session = document.getElementById('session').value
const tldv = document.getElementById('tldv').value
const topic = document.getElementById('topic').value
const participant = document.getElementById('participant').value.split(',').map(p => p.trim());
const absinties = document.getElementById('absentees').value.split(',').map((c)=>c.trim())
const report = document.getElementById('report').value
const topicname = document.getElementById('topicname').value
const Report = ` Communication Session Report

Batch: ${batch}
Date: ${date}

👩🏻‍💼 Trainer: ${trainer}

🧑🏻‍💻 Coordinators:
${coordinator.map((c, i) => `${i + 1}. ${c}`).join("\n")}

📌 Session Link: ${session}

TLdv link: ${tldv}

---

📝 Report:
🎤 Today's Activity – ${topicname} 🎤

🔥 Topic: ${topic} 🔥

------------------------

📜 Participants (${participant.length})
${participant.map((p, i) => `${i + 1}. ${p}`).join("\n")}
------------------------
🚫 Absentees (${absinties.length}):
${absinties.map((a, i) => `${i + 1}. ${a}`).join("\n")}

✍ Reported by: ${report}`;

 document.getElementById('generate').value = Report;
 }


