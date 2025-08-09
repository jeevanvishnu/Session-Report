    // Initialize the application when the DOM is fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Add event listeners for action buttons
            document.getElementById('generate-btn').addEventListener('click', generateReport);
            document.getElementById('copy-btn').addEventListener('click', copyToClipboard);
            document.getElementById('share-btn').addEventListener('click', shareReport);

            // Set today's date as default
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('session-date').value = today;

            // Setup input listeners for dynamic dropdown updates
            setupInputListeners();
        });

        // Handle image upload and preview
        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                const preview = document.getElementById('image-preview');
                
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                    // Store image data for sharing
                    window.reportImageData = e.target.result;
                };
                
                reader.readAsDataURL(file);
            }
        }

        // Generate session report
        function generateReport() {
            // Add loading effect
            const generateBtn = document.getElementById('generate-btn');
            const originalText = generateBtn.innerHTML;
            generateBtn.innerHTML = '⚡ Generating...';
            generateBtn.classList.add('loading');

            setTimeout(() => {
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

                const reportText = `Communication Session Report

Batch: ${batch}
Date: ${date}

👩🏻‍💼 Trainer: ${trainer}

🧑🏻‍💻 Coordinators:
${coordinator.length > 0 ? coordinator.map((c, i) => `${i + 1}. ${c}`).join("\n") : 'No coordinators listed'}

📌 Session Link: ${session}

🔗 TLdv link: ${tldv}

---
📝 Report:

🎤 Today's Activity – ${topicname} 🎤

📝 Topic: ${topic} 

------------------------
📜 Participants (${participant.length})

${participant.length > 0 ? participant.map((p, i) => `${i + 1}. ${p}`).join("\n") : 'No participants listed'}

------------------------
🚫 Absentees (${absentees.length}):

${absentees.length > 0 ? absentees.map((a, i) => `${i + 1}. ${a}`).join("\n") : 'No absentees'}

✍ Reported by: ${report}`;

                document.getElementById('generate').value = reportText;
                
                // Remove loading effect and add success animation
                generateBtn.innerHTML = originalText;
                generateBtn.classList.remove('loading');
                document.getElementById('generate').classList.add('success-flash');
                
                setTimeout(() => {
                    document.getElementById('generate').classList.remove('success-flash');
                }, 500);
            }, 1000);
        }

        // Copy the generated report to clipboard
        function copyToClipboard() {
            const reportText = document.getElementById('generate');
            
            reportText.select();
            reportText.setSelectionRange(0, 99999); 
            
            navigator.clipboard.writeText(reportText.value)
                .then(() => {
                    updateButtonStatus('copy-btn', '✅ Copied!', '#10b981');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    // Fallback for older browsers
                    try {
                        document.execCommand('copy');
                        updateButtonStatus('copy-btn', '✅ Copied!', '#10b981');
                    } catch (fallbackErr) {
                        updateButtonStatus('copy-btn', '❌ Failed', '#ef4444');
                    }
                });
        }

        // Share the report using Web Share API if available
        function shareReport() {
            const reportText = document.getElementById('generate').value;
            
            if (!reportText.trim()) {
                alert('Please generate a report first!');
                return;
            }
            
            // Use Web Share API if available
            if (navigator.share) {
                navigator.share({
                    title: 'Session Report',
                    text: reportText
                })
                .then(() => {
                    updateButtonStatus('share-btn', '✅ Shared!', '#10b981');
                })
                .catch(error => {
                    console.error('Error sharing report:', error);
                    fallbackShare(reportText);
                });
            } else {
                // Fall back to copying to clipboard
                fallbackShare(reportText);
            }
        }

        // Fallback method for sharing (copy to clipboard)
        function fallbackShare(text) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    updateButtonStatus('share-btn', '📋 Copied for sharing!', '#8b5cf6');
                })
                .catch(err => {
                    console.error('Failed to copy for sharing:', err);
                    updateButtonStatus('share-btn', '❌ Share failed', '#ef4444');
                });
        }

        // Helper function to update button status
        function updateButtonStatus(buttonId, message, color) {
            const button = document.getElementById(buttonId);
            const originalText = button.innerHTML;
            const originalBackground = button.style.background;
            
            button.innerHTML = message;
            if (color) {
                button.style.background = color;
            }
            
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = originalBackground;
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

        // Store all available names
        const allNames = [
            "Collins Roy", "Samual Raju", "Hibah Mohammed K", "Muhammed Suhail TS",
            "Sidharth J", "Emin Siyad Mothi", "Ajnas Ahammed V S", "Sidharth RS",
            "Aswanth K T", "Jeevan Vishnu", "Mubeena Parvin", "Fidha Fathima M",
            "Deneesh K", "Jissmon P Joseph", "Shafeeh", "Aswin MS",
            "Ancy Faizal", "Muhammed Shan", "Abin C S", "Ashmil"
        ];

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
                
                // Add visual feedback
                input.style.borderColor = '#10b981';
                setTimeout(() => {
                    input.style.borderColor = '#374151';
                }, 1000);
            }
        }

        // Remove selected option from all dropdowns
        function removeOptionFromAllDropdowns(name) {
            const allDropdowns = ['participant-dropdown', 'absentee-dropdown'];
            
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

        // Get all currently used names from both input fields
        function getCurrentlyUsedNames() {
            const participantNames = document.getElementById('session-participant').value
                .split(',').map(name => name.trim()).filter(name => name !== '');
            const absenteeNames = document.getElementById('session-absentees').value
                .split(',').map(name => name.trim()).filter(name => name !== '');
            
            return [...participantNames, ...absenteeNames];
        }

        // Refresh dropdowns to show available names
        function refreshDropdowns() {
            const usedNames = getCurrentlyUsedNames();
            const availableNames = allNames.filter(name => !usedNames.includes(name));
            
            const dropdowns = ['participant-dropdown', 'absentee-dropdown'];
            
            dropdowns.forEach(dropdownId => {
                const dropdown = document.getElementById(dropdownId);
                const currentValue = dropdown.value;
                
                // Clear dropdown except first option
                dropdown.innerHTML = '<option value="">-- Select ' + (dropdownId.includes('participant') ? 'Participant' : 'Absentee') + ' --</option>';
                
                // Add available names back
                availableNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    dropdown.appendChild(option);
                });
                
                // Restore previous selection if it's still available
                if (availableNames.includes(currentValue)) {
                    dropdown.value = currentValue;
                }
            });
        }

        // Add event listeners to input fields to detect changes
        function setupInputListeners() {
            const participantInput = document.getElementById('session-participant');
            const absenteeInput = document.getElementById('session-absentees');
            
            [participantInput, absenteeInput].forEach(input => {
                let previousValue = input.value;
                
                // Listen for any changes to the input
                input.addEventListener('input', function() {
                    // Small delay to allow for typing
                    setTimeout(() => {
                        if (input.value !== previousValue) {
                            refreshDropdowns();
                            previousValue = input.value;
                        }
                    }, 300);
                });
                
                // Also listen for paste and cut events
                input.addEventListener('paste', () => setTimeout(refreshDropdowns, 100));
                input.addEventListener('cut', () => setTimeout(refreshDropdowns, 100));
            });
        }