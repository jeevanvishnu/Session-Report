// Set initial display state when the page loads
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("audio-task").style.display = "grid";
    document.getElementById("session-report").style.display = "none";
    document.getElementById("toggle-btn").textContent = "📝 Switch to Session Report";
});

document.getElementById('session-image').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        const preview = document.createElement('img');
        preview.id = 'image-preview';
        
        // Clear any existing preview
        const container = document.getElementById('image-preview-container');
        container.innerHTML = '';
        container.appendChild(preview);
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        
        reader.readAsDataURL(file);
    }
});

function toggleSection() {
    const audioTask = document.getElementById("audio-task");
    const sessionReport = document.getElementById("session-report");
    const toggleBtn = document.getElementById("toggle-btn");

    if (audioTask.style.display === "none") {
      
        audioTask.style.display = "grid";
        sessionReport.style.display = "none";
        toggleBtn.textContent = "📝 Switch to Session Report";
    } else {
       
        audioTask.style.display = "none";
        sessionReport.style.display = "grid";
        toggleBtn.textContent = "🎤 Switch to Audio Task";
    }
}

function generateReport() {
    // Check which section is currently visible
    const isAudioTask = document.getElementById("audio-task").style.display !== "none";
    let reportText = "";

    if (isAudioTask) {
        // Generate Audio Task Report
        const batch = document.getElementById('audio-batch').value;
        const date = document.getElementById('audio-date').value;
        const trainer = document.getElementById('audio-trainer').value;
        const coordinator = document.getElementById('audio-coordinator').value.split(',').map((c) => c.trim());
        const topic = document.getElementById('audio-topic').value;
        const participant = document.getElementById('audio-participant').value.split(',').map(p => p.trim());
        const absentees = document.getElementById('audio-absentees').value.split(',').map((c) => c.trim());
        const report = document.getElementById('audio-report').value;
        const participantEmoji = document.getElementById('participant-emoji').value.trim() || '👤';
        const absenteeEmoji = document.getElementById('absentees-emoji').value.trim() || '❌';

        reportText = ` 

Batch: ${batch}
Date: ${date}

👩🏻‍💼 Trainer: ${trainer}

🧑🏻‍💻 Coordinators:
${coordinator.map((c, i) => `${i + 1}. ${c}`).join("\n")}

------------------

📝 Report:
🎤... Audio Task Report ...🎤

🔥 Topic: ${topic} 🔥

------------------------

📜 Participants (${participant.length}):\n
${participant.map((p) => `${participantEmoji} ${p}`).join("\n\n")}\n
------------------------

🚫 Absentees (${absentees.length}):\n
${absentees.map((a) => `${absenteeEmoji} ${a}`).join("\n\n")}


✍ Reported by: ${report}`;

    } else {
        // Generate Session Report
        const batch = document.getElementById('session-batch').value;
        const date = document.getElementById('session-date').value;
        const trainer = document.getElementById('session-trainer').value;
        const coordinator = document.getElementById('session-coordinator').value.split(',').map((c) => c.trim());
        const session = document.getElementById('session-link').value;
        const tldv = document.getElementById('session-tldv').value;
        const topicname = document.getElementById('session-topicname').value;
        const topic = document.getElementById('session-topic').value;
        const participant = document.getElementById('session-participant').value.split(',').map(p => p.trim());
        const absentees = document.getElementById('session-absentees').value.split(',').map((c) => c.trim());
        const report = document.getElementById('session-report-by').value;

        const imagePreview = document.getElementById('image-preview');
        let imageHtml = '';
        
        // Check if an image was uploaded and previewed
        if (imagePreview && imagePreview.style.display !== 'none') {
            // Add image note to the report text
            reportText += '\n\n[Image attached in the original report]\n';
            
            // For sharing purposes, we can also save the image data
            window.reportImageData = imagePreview.src;
        }
        
        document.getElementById('generate').value = reportText;

        reportText = ` Communication Session Report

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

📜 Participants (${'\n',participant.length})
${participant.map((p, i) => `${i + 1}. ${p}`).join("\n")}
------------------------
🚫 Absentees (${absentees.length}):
${absentees.map((a, i) => `${i + 1}. ${a}`).join("\n")}

✍ Reported by: ${report}`;
    }

    document.getElementById('generate').value = reportText;
}

function copyToClipboard() {
    const reportText = document.getElementById('generate');
    
    reportText.select();
    reportText.setSelectionRange(0, 99999); 
    
    navigator.clipboard.writeText(reportText.value)
        .then(() => {
            const copyBtn = document.getElementById('copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '✓ Copied!';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy text. Please try again.');
        });
}

function shareReport() {
    const reportText = document.getElementById('generate').value;
    
    if (navigator.share) {
        navigator.share({
            title: 'Session Report',
            text: reportText
        })
        .then(() => {
            console.log('Report shared successfully');
            
            const shareBtn = document.getElementById('share-btn');
            const originalText = shareBtn.innerHTML;
            shareBtn.innerHTML = '✓ Shared!';
            
            setTimeout(() => {
                shareBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(error => {
            console.error('Error sharing report:', error);
            fallbackShare(reportText);
        });
    } else {
        fallbackShare(reportText);
    }
}

function fallbackShare(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    
    try {
        document.execCommand('copy');
        alert('Report copied to clipboard. You can paste it to share.');
        
        const shareBtn = document.getElementById('share-btn');
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '✓ Copied for sharing!';
        
        setTimeout(() => {
            shareBtn.innerHTML = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy for sharing:', err);
        alert('Unable to share. Please copy the report manually.');
    }
    
    document.body.removeChild(input);
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], {type: mimeString});
}

function shareReport() {
    const reportText = document.getElementById('generate').value;
    
    // Check if we can use the Web Share API with files
    if (navigator.share && navigator.canShare && window.reportImageData) {
        // Try to share with image
        const imageBlob = dataURItoBlob(window.reportImageData);
        const file = new File([imageBlob], "report-image.jpg", {type: "image/jpeg"});
        
        const shareData = {
            title: 'Session Report',
            text: reportText,
            files: [file]
        };
        
        if (navigator.canShare(shareData)) {
            navigator.share(shareData)
                .then(() => {
                    updateButtonStatus('share-btn', '✓ Shared!');
                })
                .catch(error => {
                    console.error('Error sharing report with image:', error);
                    // Fall back to text-only sharing
                    shareTextOnly(reportText);
                });
        } else {
            // Fall back to text-only sharing
            shareTextOnly(reportText);
        }
    } else {
        // Fall back to text-only sharing
        shareTextOnly(reportText);
    }
}

// Helper function for sharing text only
function shareTextOnly(text) {
    if (navigator.share) {
        navigator.share({
            title: 'Session Report',
            text: text
        })
        .then(() => {
            updateButtonStatus('share-btn', '✓ Shared!');
        })
        .catch(error => {
            console.error('Error sharing report:', error);
            fallbackShare(text);
        });
    } else {
        fallbackShare(text);
    }
}

// Helper function to update button status
function updateButtonStatus(buttonId, message) {
    const button = document.getElementById(buttonId);
    const originalText = button.innerHTML;
    button.innerHTML = message;
    
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
}
