// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set initial active tab
    document.getElementById("audio-task").classList.add("active");
    document.getElementById("session-report").classList.remove("active");
    
    // Set up tab navigation
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active state for tabs
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
            
            // Update active state for buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
        });
    });
    
    // Add event listeners for action buttons
    document.getElementById('generate-btn').addEventListener('click', generateReport);
    document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
    document.getElementById('share-btn').addEventListener('click', shareReport);
    
    // Initialize image upload preview
    const sessionImage = document.getElementById('session-image');
    if (sessionImage) {
        sessionImage.addEventListener('change', handleImageUpload);
    }
});

// Handle image upload and preview
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        const preview = document.createElement('img');
        preview.id = 'image-preview';
        
        // Clear any existing preview
        const container = document.getElementById('image-preview-container');
        if (container) {
            container.innerHTML = '';
            container.appendChild(preview);
            
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
                // Store image data for sharing
                window.reportImageData = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    }
}

// Generate report based on active tab
function generateReport() {
    // Check which tab is currently active
    const isAudioTask = document.getElementById("audio-task").classList.contains("active");
    let reportText = "";

    if (isAudioTask) {
        // Generate Audio Task Report
        const batch = document.getElementById('audio-batch').value;
        const date = document.getElementById('audio-date').value;
        const trainer = document.getElementById('audio-trainer').value;
        const coordinator = document.getElementById('audio-coordinator').value.split(',').map((c) => c.trim());
        const topic = document.getElementById('audio-topic').value;
        const participant = document.getElementById('audio-participant').value.split(',').map(p => p.trim()).filter(p => p !== "");
        const absentees = document.getElementById('audio-absentees').value.split(',').map((c) => c.trim()).filter(c => c !== "");
        const report = document.getElementById('audio-report').value;
        const participantEmoji = document.getElementById('participant-emoji').value.trim() || '✅';
        const absenteeEmoji = document.getElementById('absentees-emoji').value.trim() || '❌';

        reportText = ` 
Audio Task Submission Report
======================

Batch: ${batch}
Date: ${date}

👩🏻‍💼 Trainer: ${trainer}

🧑🏻‍💻 Coordinators:
${coordinator.map((c, i) => `${i + 1}. ${c}`).join("\n")}

 Topic: ${topic} 

------------------------

🔊 Audio Submitted: (${participant.length}):\n
${participant.map((p) => `${participantEmoji} ${p}`).join("\n")}
------------------------

🔇 Not Submitted (${absentees.length}):\n
${absentees.map((a) => `${absenteeEmoji} ${a}`).join("\n")}


✍ Reported by: ${report}`;

    } else {
        // Generate Session Report
        const batch = document.getElementById('session-batch').value;
        const date = document.getElementById('session-date').value;
        const trainer = document.getElementById('session-trainer').value;
        const coordinator = document.getElementById('session-coordinator').value.split(',').map((c) => c.trim()).filter(c => c !== "");
        const session = document.getElementById('session-link').value;
        const tldv = document.getElementById('session-tldv').value;
        const topicname = document.getElementById('session-topicname').value;
        const topic = document.getElementById('session-topic').value;
        const participant = document.getElementById('session-participant').value.split(',').map(p => p.trim()).filter(p => p !== "");
        const absentees = document.getElementById('session-absentees').value.split(',').map((c) => c.trim()).filter(c => c !== "");
        const report = document.getElementById('session-report-by').value;
        const meetList = document.getElementById('session-meet').value
        // Check if an image was uploaded
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview && imagePreview.style.display !== 'none') {
            // Add image note to the report text
            reportText += '\n\n[Image attached in the original report]\n';
        }

        reportText = ` Communication Session Report

Batch: ${batch}
Date: ${date}

👩🏻‍💼 Trainer: ${trainer}

🧑🏻‍💻 Coordinators:
${coordinator.map((c, i) => `${i + 1}. ${c}`).join("\n")}

📌 Session Link: ${session}

🔗 TLdv link: ${tldv}

🔗 Meet list :${meetList}

---
📝 Report:

🎤 Today's Activity – ${topicname} 🎤

  Topic: ${topic} 

------------------------
📜 Participants (${participant.length})

${participant.map((p, i) => `${i + 1}. ${p}`).join("\n")}

------------------------
🚫 Absentees (${absentees.length}):

${absentees.map((a, i) => `${i + 1}. ${a}`).join("\n")}

✍ Reported by: ${report}`;
    }

    document.getElementById('generate').value = reportText;
}

// Copy the generated report to clipboard
function copyToClipboard() {
    const reportText = document.getElementById('generate');
    
    reportText.select();
    reportText.setSelectionRange(0, 99999); 
    
    navigator.clipboard.writeText(reportText.value)
        .then(() => {
            updateButtonStatus('copy-btn', '✓ Copied!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy text. Please try again.');
        });
}

// Share the report using Web Share API if available
function shareReport() {
    const reportText = document.getElementById('generate').value;
    
    // Check if we can use the Web Share API with files
    if (navigator.share && navigator.canShare && window.reportImageData) {
        try {
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
        } catch (error) {
            console.error('Error preparing share:', error);
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

// Fallback method for sharing (copy to clipboard)
function fallbackShare(text) {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    
    try {
        document.execCommand('copy');
        alert('Report copied to clipboard. You can paste it to share.');
        updateButtonStatus('share-btn', '✓ Copied for sharing!');
    } catch (err) {
        console.error('Failed to copy for sharing:', err);
        alert('Unable to share. Please copy the report manually.');
    }
    
    document.body.removeChild(input);
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

// Convert Data URI to Blob for file sharing
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

// Add name from dropdown to input field
function addName(dropdownId, inputId) {
    const dropdown = document.getElementById(dropdownId);
    const input = document.getElementById(inputId);
    const selectedName = dropdown.value;
    
    if (selectedName) {
        if (input.value.trim() !== '') {
            input.value += ', ' + selectedName;
        } else {
            input.value = selectedName;
        }
        
        removeOptionFromAllDropdowns(selectedName);
        dropdown.selectedIndex = 0;
    }
}

// Remove selected option from all dropdowns
function removeOptionFromAllDropdowns(name) {
    const allDropdowns = [
        'audio-participant-dropdown', 
        'audio-absentee-dropdown',
        'participant-dropdown', 
        'absentee-dropdown'
    ];
    
    allDropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown) {
            for (let i = 0; i < dropdown.options.length; i++) {
                if (dropdown.options[i].value === name) {
                    dropdown.remove(i);
                    break;
                }
            }
        }
    });
}