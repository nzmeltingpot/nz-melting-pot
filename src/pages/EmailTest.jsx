import { useState } from 'react';
import { generateNewsletterEmail, sendNewsletterEmail, generateUnsubscribeLink } from '../utils/emailTemplates';

/**
 * DIAGNOSTIC PAGE - Test the email API in complete isolation
 * This removes ALL variables from the form submission flow
 */
export default function EmailTest() {
  const [status, setStatus] = useState('idle');
  const [logs, setLogs] = useState([]);
  const [testEmail, setTestEmail] = useState('');
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' or 'newsletter'
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [previewHtml, setPreviewHtml] = useState('');
  const [newsletterData, setNewsletterData] = useState({
    fullName: 'John Smith',
    content: '<p>We have some exciting news to share with you this month!</p><p>Our upcoming showcase event is just around the corner, featuring talented performers from across the community.</p><p>Stay tuned for more details coming soon.</p>'
  });

  const addLog = (msg) => {
    const timestamp = new Date().toISOString().substr(11, 12);
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`]);
    console.log(`[EmailTest] ${msg}`);
  };

  const runTest = async () => {
    setStatus('running');
    setLogs([]);

    addLog('=== EMAIL API TEST STARTED ===');

    // Step 1: Check if window.ezsite exists
    addLog(`Step 1: window.ezsite exists? ${!!window.ezsite}`);
    if (!window.ezsite) {
      addLog('FAILED: window.ezsite is undefined');
      setStatus('failed');
      return;
    }

    // Step 2: Check if apis exists
    addLog(`Step 2: window.ezsite.apis exists? ${!!window.ezsite.apis}`);
    if (!window.ezsite.apis) {
      addLog('FAILED: window.ezsite.apis is undefined');
      setStatus('failed');
      return;
    }

    // Step 3: Check if sendEmail exists
    addLog(`Step 3: sendEmail function exists? ${!!window.ezsite.apis.sendEmail}`);
    addLog(`Step 3: sendEmail type: ${typeof window.ezsite.apis.sendEmail}`);
    if (!window.ezsite.apis.sendEmail) {
      addLog('FAILED: sendEmail function does not exist');
      setStatus('failed');
      return;
    }

    // Step 4: List all available API methods
    const apiMethods = Object.keys(window.ezsite.apis);
    addLog(`Step 4: Available API methods: ${apiMethods.join(', ')}`);

    // Step 5: Prepare email payload
    const emailPayload = {
      from: 'Musical Talent Showcase <noreply@nzmeltingpot.com>',
      to: [testEmail || 'test@example.com'],
      subject: 'Email API Test - ' + new Date().toISOString(),
      html: '<h1>Test Email</h1><p>If you receive this, the email API is working!</p><p>Sent at: ' + new Date().toISOString() + '</p>',
      text: 'Test Email - If you receive this, the email API is working!'
    };

    addLog(`Step 5: Email payload prepared`);
    addLog(`  - from: ${emailPayload.from}`);
    addLog(`  - to: ${emailPayload.to.join(', ')}`);
    addLog(`  - subject: ${emailPayload.subject}`);

    // Step 6: Call sendEmail
    addLog('Step 6: Calling sendEmail API...');

    try {
      const startTime = Date.now();
      const result = await window.ezsite.apis.sendEmail(emailPayload);
      const duration = Date.now() - startTime;

      addLog(`Step 6: API returned in ${duration}ms`);
      addLog(`Step 6: Result type: ${typeof result}`);
      addLog(`Step 6: Result: ${JSON.stringify(result)}`);

      if (result && result.error) {
        addLog(`FAILED: API returned error: ${result.error}`);
        setStatus('failed');
      } else {
        addLog('SUCCESS: Email sent (no error returned)');
        setStatus('success');
      }
    } catch (err) {
      addLog(`EXCEPTION: ${err.name}: ${err.message}`);
      addLog(`Stack: ${err.stack}`);
      setStatus('failed');
    }

    addLog('=== EMAIL API TEST COMPLETED ===');
  };

  const previewNewsletter = () => {
    const previewEmail = testEmail || 'recipient@example.com';
    const { html } = generateNewsletterEmail({
      fullName: newsletterData.fullName,
      newsletterContent: newsletterData.content,
      unsubscribeLink: generateUnsubscribeLink(previewEmail),
      newsletterName: 'Musical Talent Showcase',
      siteName: 'Musical Talent Showcase'
    });
    setPreviewHtml(html);
  };

  const sendTestNewsletter = async () => {
    if (!testEmail) {
      alert('Please enter an email address');
      return;
    }

    setNewsletterStatus('sending');

    // unsubscribeLink is auto-generated from recipient email
    const result = await sendNewsletterEmail({
      to: testEmail,
      fullName: newsletterData.fullName,
      newsletterContent: newsletterData.content
    });

    if (result.success) {
      setNewsletterStatus('success');
    } else {
      setNewsletterStatus('failed');
      alert(`Failed to send: ${result.error}`);
    }

    setTimeout(() => setNewsletterStatus('idle'), 3000);
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ marginBottom: '10px' }}>Email API Diagnostic Test</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Test the email API and preview newsletter templates.
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          onClick={() => setActiveTab('basic')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: activeTab === 'basic' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'basic' ? '#2563eb' : '#e5e7eb',
            color: activeTab === 'basic' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
          Basic Email Test
        </button>
        <button
          onClick={() => setActiveTab('newsletter')}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            fontWeight: activeTab === 'newsletter' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'newsletter' ? '#c9a227' : '#e5e7eb',
            color: activeTab === 'newsletter' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
          Newsletter Template
        </button>
      </div>

      {/* Basic Email Test Tab */}
      {activeTab === 'basic' &&
      <>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Test Email Address (where to send):
        </label>
        <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your-email@example.com"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              marginBottom: '10px'
            }} />

      </div>

      <button
          onClick={runTest}
          disabled={status === 'running'}
          style={{
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: status === 'running' ? '#999' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: status === 'running' ? 'not-allowed' : 'pointer',
            marginBottom: '20px'
          }}>

        {status === 'running' ? 'Testing...' : 'Run Email Test'}
      </button>

      {status !== 'idle' &&
        <div style={{
          padding: '10px 14px',
          borderRadius: '6px',
          marginBottom: '20px',
          backgroundColor: status === 'success' ? '#d1fae5' :
          status === 'failed' ? '#fee2e2' : '#e0e7ff',
          color: status === 'success' ? '#065f46' :
          status === 'failed' ? '#991b1b' : '#3730a3',
          fontWeight: 'bold'
        }}>
          Status: {status.toUpperCase()}
        </div>
        }

      {logs.length > 0 &&
        <div style={{
          backgroundColor: '#1e1e1e',
          borderRadius: '8px',
          padding: '20px',
          fontFamily: 'Monaco, Consolas, monospace',
          fontSize: '13px',
          lineHeight: '1.6',
          maxHeight: '500px',
          overflow: 'auto'
        }}>
          {logs.map((log, i) =>
          <div
            key={i}
            style={{
              color: log.includes('FAILED') || log.includes('EXCEPTION') ? '#f87171' :
              log.includes('SUCCESS') ? '#4ade80' :
              log.includes('Step') ? '#60a5fa' : '#e5e5e5'
            }}>

              {log}
            </div>
          )}
        </div>
        }

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ marginTop: 0 }}>What this test checks:</h3>
        <ol style={{ marginBottom: 0, lineHeight: '1.8' }}>
          <li>window.ezsite object exists</li>
          <li>window.ezsite.apis object exists</li>
          <li>sendEmail function exists and is callable</li>
          <li>Lists all available API methods</li>
          <li>Sends actual test email</li>
          <li>Reports exact error or success</li>
        </ol>
      </div>
        </>
      }

      {/* Newsletter Template Tab */}
      {activeTab === 'newsletter' &&
      <div>
          <h2 style={{ marginBottom: '20px', color: '#333' }}>Newsletter Email Template</h2>

          {/* Recipient Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
              Recipient Name:
            </label>
            <input
            type="text"
            value={newsletterData.fullName}
            onChange={(e) => setNewsletterData((prev) => ({ ...prev, fullName: e.target.value }))}
            placeholder="John Smith"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box'
            }} />

          </div>

          {/* Test Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
              Send Test To:
            </label>
            <input
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="your-email@example.com"
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box'
            }} />

          </div>

          {/* Newsletter Content */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
              Newsletter Content (HTML):
            </label>
            <textarea
            value={newsletterData.content}
            onChange={(e) => setNewsletterData((prev) => ({ ...prev, content: e.target.value }))}
            rows={6}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              fontFamily: 'Monaco, Consolas, monospace',
              border: '2px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box',
              resize: 'vertical'
            }} />

          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
            <button
            onClick={previewNewsletter}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 'bold',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}>
              Preview Template
            </button>
            <button
            onClick={sendTestNewsletter}
            disabled={newsletterStatus === 'sending'}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 'bold',
              backgroundColor: newsletterStatus === 'sending' ? '#999' :
              newsletterStatus === 'success' ? '#16a34a' : '#c9a227',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: newsletterStatus === 'sending' ? 'not-allowed' : 'pointer'
            }}>
              {newsletterStatus === 'sending' ? 'Sending...' :
            newsletterStatus === 'success' ? 'Sent!' : 'Send Test Newsletter'}
            </button>
          </div>

          {/* Preview */}
          {previewHtml &&
        <div>
              <h3 style={{ marginBottom: '15px', color: '#374151' }}>Email Preview:</h3>
              <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
                <iframe
              srcDoc={previewHtml}
              title="Newsletter Preview"
              style={{
                width: '100%',
                height: '600px',
                border: 'none',
                backgroundColor: '#f5f5f5'
              }} />

              </div>
            </div>
        }

          {/* Template Info */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#fffbeb', borderRadius: '8px', borderLeft: '4px solid #c9a227' }}>
            <h3 style={{ marginTop: 0, color: '#92400e' }}>Template Placeholders:</h3>
            <ul style={{ marginBottom: 0, lineHeight: '1.8', color: '#78350f' }}>
              <li><code style={{ backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: '3px' }}>{'{fullName}'}</code> — Recipient's name</li>
              <li><code style={{ backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: '3px' }}>{'{newsletterContent}'}</code> — Your main content (HTML supported)</li>
              <li><code style={{ backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: '3px' }}>{'{unsubscribeLink}'}</code> — Auto-generated: <code style={{ backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: '3px' }}>/unsubscribe?email={'{email}'}</code></li>
            </ul>
          </div>
        </div>
      }
    </div>);

}