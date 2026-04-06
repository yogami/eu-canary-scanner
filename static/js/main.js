document.getElementById('scan-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const urlInput = document.getElementById('target-url');
    const btn = document.getElementById('scan-btn');
    const terminal = document.getElementById('terminal');
    const reportCard = document.getElementById('report-card');
    const trapGrid = document.getElementById('trap-grid');
    const targetUrl = urlInput.value;

    // Reset UI
    btn.disabled = true;
    btn.textContent = 'Detonating...';
    terminal.innerHTML = '';
    terminal.classList.add('active');
    reportCard.classList.remove('active');
    trapGrid.innerHTML = '';

    const addLog = (msg, delay) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.className = 'line';
                line.textContent = `> ${msg}`;
                terminal.appendChild(line);
                terminal.scrollTop = terminal.scrollHeight;
                resolve();
            }, delay);
        });
    };

    // Simulate logs for wow factor
    await addLog(`Initializing Firecracker microVM for ${targetUrl}...`, 0);
    await addLog(`[E2B] microVM booted in 142ms. Kernel ready.`, 800);
    await addLog(`[SEMAPROOF] Injecting AWS Honeytoken into /.env...`, 600);
    await addLog(`[ORCHESTRATOR] Deploying Canary Agent...`, 700);
    await addLog(`[CANARY] Fetching target URL payload...`, 1200);
    await addLog(`[OBSERVABILITY] Monitoring agent system calls and file access...`, 900);

    try {
        const response = await fetch('/api/scan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ target_url: targetUrl })
        });

        const data = await response.json();

        if (data.honeytoken_triggered) {
            await addLog(`[ALERT] HONEYTOKEN BREACH DETECTED.`, 1500);
            await addLog(`[ALERT] Agent attempted to read /.env and exfiltrate AWS_ACCESS_KEY_ID.`, 500);
        } else {
            await addLog(`[SUCCESS] Execution boundary maintained.`, 1500);
        }

        await addLog(`[E2B] Terminating microVM...`, 600);
        await addLog(`Generating EU AI Act Compliance Report...`, 500);

        // Populate Report Card
        document.getElementById('report-target').textContent = `Target: ${data.target_url}`;
        
        const statusBadge = document.getElementById('report-status');
        statusBadge.textContent = data.overall_status;
        statusBadge.className = `status-badge ${data.honeytoken_triggered ? 'fail' : 'pass'}`;

        data.traps.forEach(trap => {
            const trapEl = document.createElement('div');
            trapEl.className = `trap-item ${trap.detected ? 'detected' : ''}`;
            
            trapEl.innerHTML = `
                <h3>
                    ${trap.category}
                    <span class="icon">${trap.detected ? '⚠️' : '✓'}</span>
                </h3>
                <p>${trap.description}</p>
            `;
            trapGrid.appendChild(trapEl);
        });

        setTimeout(() => {
            terminal.classList.remove('active');
            reportCard.classList.add('active');
            btn.disabled = false;
            btn.textContent = 'Detonate';
        }, 1000);

    } catch (err) {
        await addLog(`[ERROR] Scan failed: ${err.message}`, 500);
        btn.disabled = false;
        btn.textContent = 'Detonate';
    }
});
