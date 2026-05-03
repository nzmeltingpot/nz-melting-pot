import { useState, useEffect, useCallback } from 'react';
import { generateUnsubscribeLink, generateNewsletterEmail } from '../utils/emailTemplates';

// Format date as dd/mm/yyyy
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return '—';
  }
};

const SETTINGS_TABLE_ID = 79250;
const SUBMISSIONS_TABLE_ID = 78687;
const MEMBERS_TABLE_ID = 79993;

const SETTING_LABELS = {
  thankyou_heading: 'Thank-You Page — Heading',
  thankyou_message: 'Thank-You Page — Message',
  thankyou_important_text: 'Thank-You Page — Important Notice',
  thankyou_instructions: 'Thank-You Page — Instructions',
  thankyou_closing: 'Thank-You Page — Closing Line',
  email_from: 'Email — Sender Address (e.g., Name <you@yourdomain.com>)',
  email_subject_template: 'Email — Subject (use {code} for registration code)',
  email_body: 'Email — Body Text',
  email_important_text: 'Email — Important Notice',
  email_instructions: 'Email — Instructions',
  email_closing: 'Email — Closing Line'
};

const SETTING_ORDER = [
'thankyou_heading',
'thankyou_message',
'thankyou_important_text',
'thankyou_instructions',
'thankyou_closing',
'email_from',
'email_subject_template',
'email_body',
'email_important_text',
'email_instructions',
'email_closing'];


export default function Admin() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [settings, setSettings] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState({});
  const [saveSuccess, setSaveSuccess] = useState({});
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [membersPage, setMembersPage] = useState(1);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersPageSize] = useState(50);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Dashboard state
  const [dashboardStats, setDashboardStats] = useState({
    totalSubmissions: 0,
    totalMembers: 0,
    activeSubscribers: 0,
    thisYearSubmissions: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [recentMembers, setRecentMembers] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  // DEV_PREVIEW: set to true to bypass login locally (remove before going live)
  const DEV_PREVIEW = import.meta.env.DEV;

  const checkAuth = useCallback(async () => {
    if (DEV_PREVIEW) {
      setUser({ Email: 'dev-preview@localhost' });
      setAuthLoading(false);
      return;
    }
    try {
      const { data, error } = await window.ezsite.apis.getUserInfo();
      if (!error && data) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setAuthLoading(false);
  }, [DEV_PREVIEW]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const { error } = await window.ezsite.apis.login({
        email: loginEmail,
        password: loginPassword
      });
      if (error) {
        setLoginError(error);
        setLoginLoading(false);
        return;
      }
      await checkAuth();
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    try {
      await window.ezsite.apis.logout();
    } catch {}
    setUser(null);
  };

  const loadSettings = useCallback(async () => {
    setLoadingSettings(true);
    try {
      const { data, error } = await window.ezsite.apis.tablePage(SETTINGS_TABLE_ID, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: 'id',
        IsAsc: true
      });
      if (!error && data?.List) {
        setSettings(data.List);
        const vals = {};
        data.List.forEach((s) => {
          vals[s.setting_key] = s.setting_value;
        });
        setEditValues(vals);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
    setLoadingSettings(false);
  }, []);

  useEffect(() => {
    if (user) loadSettings();
  }, [user, loadSettings]);

  const loadMembers = useCallback(async (page = 1) => {
    setLoadingMembers(true);
    try {
      const { data, error } = await window.ezsite.apis.tablePage(MEMBERS_TABLE_ID, {
        PageNo: page,
        PageSize: membersPageSize,
        OrderByField: 'email',
        IsAsc: true
      });
      if (!error && data?.List) {
        setMembers(data.List);
        setMembersTotal(data.VirtualCount || data.TotalCount || 0);
        setMembersPage(page);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
    }
    setLoadingMembers(false);
  }, [membersPageSize]);

  useEffect(() => {
    if (user && activeTab === 'members') {
      loadMembers(1);
    }
  }, [user, activeTab, loadMembers]);

  // Dashboard data loader
  const loadDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      // Fetch submissions (recent 5 + total count)
      const subRes = await window.ezsite.apis.tablePage(SUBMISSIONS_TABLE_ID, {
        PageNo: 1,
        PageSize: 5,
        OrderByField: 'id',
        IsAsc: false
      });

      // Fetch all members (recent 5 + counts)
      const memRes = await window.ezsite.apis.tablePage(MEMBERS_TABLE_ID, {
        PageNo: 1,
        PageSize: 500,
        OrderByField: 'id',
        IsAsc: false
      });

      if (!subRes.error && subRes.data?.List) {
        setRecentSubmissions(subRes.data.List.slice(0, 5));
        const totalSubs = subRes.data.VirtualCount || subRes.data.TotalCount || 0;
        const currentYear = new Date().getFullYear();
        const thisYearCount = subRes.data.List.filter((s) => {
          try {
            return new Date(s.submission_timestamp || s.CreatedAt).getFullYear() === currentYear;
          } catch { return false; }
        }).length;

        setDashboardStats((prev) => ({
          ...prev,
          totalSubmissions: totalSubs,
          thisYearSubmissions: thisYearCount
        }));
      }

      if (!memRes.error && memRes.data?.List) {
        setRecentMembers(memRes.data.List.slice(0, 5));
        const allMembers = memRes.data.List;
        const totalMems = memRes.data.VirtualCount || memRes.data.TotalCount || allMembers.length;
        const activeSubs = allMembers.filter((m) => m.status === 'active').length;

        setDashboardStats((prev) => ({
          ...prev,
          totalMembers: totalMems,
          activeSubscribers: activeSubs
        }));
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
    setLoadingDashboard(false);
  }, []);

  useEffect(() => {
    if (user && activeTab === 'dashboard') {
      loadDashboard();
    }
  }, [user, activeTab, loadDashboard]);

  const handleUnsubscribe = async (member) => {
    if (!confirm(`Unsubscribe ${member.email}?`)) return;
    try {
      const { error } = await window.ezsite.apis.tableUpdate(MEMBERS_TABLE_ID, {
        ID: member.id || member.ID,
        status: 'unsubscribed',
        unsubscribed_date: new Date().toISOString()
      });
      if (error) throw new Error(error);
      loadMembers(membersPage);
    } catch (err) {
      alert('Failed to update: ' + (err.message || 'Unknown error'));
    }
  };

  const handleResubscribe = async (member) => {
    try {
      const { error } = await window.ezsite.apis.tableUpdate(MEMBERS_TABLE_ID, {
        ID: member.id || member.ID,
        status: 'active',
        unsubscribed_date: ''
      });
      if (error) throw new Error(error);
      loadMembers(membersPage);
    } catch (err) {
      alert('Failed to update: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteMember = async (member) => {
    if (!confirm(`Permanently delete ${member.email}? This cannot be undone.`)) return;
    try {
      const { error } = await window.ezsite.apis.tableDelete(MEMBERS_TABLE_ID, {
        ID: member.id || member.ID
      });
      if (error) throw new Error(error);
      loadMembers(membersPage);
    } catch (err) {
      alert('Failed to delete: ' + (err.message || 'Unknown error'));
    }
  };

  const exportMembers = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(MEMBERS_TABLE_ID, {
        PageNo: 1,
        PageSize: 10000,
        OrderByField: 'subscribed_date',
        IsAsc: false
      });
      if (error || !data?.List) {
        alert('Failed to fetch members');
        return;
      }
      const columns = [
      { header: 'Full Name', key: 'full_name' },
      { header: 'Email', key: 'email' },
      { header: 'Status', key: 'status' },
      { header: 'Subscribed Date', key: 'subscribed_date' },
      { header: 'Unsubscribed Date', key: 'unsubscribed_date' }];

      const escapeCSV = (val, isDate = false) => {
        if (val === null || val === undefined) return '';
        if (isDate && val) {
          const formatted = formatDate(val);
          if (formatted !== '—') return formatted;
        }
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };
      const headerRow = columns.map((c) => escapeCSV(c.header)).join(',');
      const dataRows = data.List.map((row) => columns.map((c) => escapeCSV(row[c.key], c.key.includes('date'))).join(','));
      const csvContent = [headerRow, ...dataRows].join('\n');
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const dateStr = `${day}-${month}-${year}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `members_${dateStr}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Export failed: ' + (err.message || 'Unknown error'));
    }
  };

  const bulkUpdateAllNames = async () => {
    if (!window.confirm('This will update ALL member names to "Member". Continue?')) {
      return;
    }
    setBulkUpdating(true);
    try {
      const { data, error } = await window.ezsite.apis.sqlExecute({
        Sql: "UPDATE members SET full_name = @name",
        Parameters: [
        { name: 'name', value: 'Member', valueType: 'String' }]

      });
      if (error) {
        alert('Bulk update failed: ' + error);
      } else {
        alert(`Successfully updated ${data} records to "Member"`);
        // Refresh the members list
        loadMembers();
      }
    } catch (err) {
      alert('Bulk update error: ' + (err.message || 'Unknown error'));
    }
    setBulkUpdating(false);
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(memberId)) {
        newSet.delete(memberId);
      } else {
        newSet.add(memberId);
      }
      return newSet;
    });
  };

  const toggleAllMembers = async () => {
    // If some members are selected, deselect all
    if (selectedMembers.size > 0) {
      setSelectedMembers(new Set());
      return;
    }

    // Select all active members across all pages
    setLoadingMembers(true);
    try {
      let allActiveIds = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const { data, error } = await window.ezsite.apis.tablePage(MEMBERS_TABLE_ID, {
          PageNo: page,
          PageSize: 100,
          OrderByField: 'ID',
          IsAsc: true,
          Filters: [{ Name: 'status', Op: 'NotEqual', Value: 'unsubscribed' }]
        });

        if (error || !data?.List?.length) {
          hasMore = false;
        } else {
          allActiveIds = allActiveIds.concat(data.List.map((m) => m.id || m.ID));
          page++;
          hasMore = data.List.length === 100;
        }
      }

      setSelectedMembers(new Set(allActiveIds));
    } catch (err) {
      console.error('Failed to select all members:', err);
    }
    setLoadingMembers(false);
  };

  const getSelectedActiveMembers = () => {
    return members.filter((m) =>
    m.status !== 'unsubscribed' &&
    selectedMembers.has(m.id || m.ID) &&
    m.email
    );
  };

  const handleSendEmail = async () => {
    if (selectedMembers.size === 0) {
      setEmailResult({ success: false, message: 'No members selected' });
      return;
    }

    if (!emailSubject.trim()) {
      setEmailResult({ success: false, message: 'Please enter a subject' });
      return;
    }

    if (!emailBody.trim()) {
      setEmailResult({ success: false, message: 'Please enter a message' });
      return;
    }

    setSendingEmail(true);
    setEmailResult(null);

    // Fetch all selected members from database (not just current page)
    let recipients = [];
    try {
      const selectedIds = Array.from(selectedMembers);
      // Fetch members in batches of 50
      for (let i = 0; i < selectedIds.length; i += 50) {
        const batchIds = selectedIds.slice(i, i + 50);
        const { data, error } = await window.ezsite.apis.tablePage(MEMBERS_TABLE_ID, {
          PageNo: 1,
          PageSize: 50,
          Filters: [{ Name: 'ID', Op: 'InList', Value: batchIds.join(',') }]
        });
        if (!error && data?.List) {
          recipients = recipients.concat(data.List);
        }
      }
      // Filter to only active members with valid emails
      recipients = recipients.filter((m) => m.status !== 'unsubscribed' && m.email);
    } catch (err) {
      console.error('Failed to load selected members:', err);
      setSendingEmail(false);
      setEmailResult({ success: false, message: 'Failed to load member data' });
      return;
    }

    if (recipients.length === 0) {
      setSendingEmail(false);
      setEmailResult({ success: false, message: 'No active recipients with valid email addresses' });
      return;
    }

    // Get email from setting if available
    const fromSetting = settings.find((s) => s.setting_key === 'email_from');
    const fromAddress = fromSetting?.setting_value || 'Newsletter <noreply@nzmeltingpot.com>';

    let successCount = 0;
    let failCount = 0;
    let lastError = null;

    console.log(`Attempting to send email to ${recipients.length} recipients from: ${fromAddress}`);

    for (const member of recipients) {
      try {
        const unsubscribeLink = generateUnsubscribeLink(member.email);
        const personalizedBody = emailBody.
        replace(/\{name\}/gi, member.full_name || 'Member').
        replace(/\{email\}/gi, member.email);

        // Use the professional email template
        const { html, text } = generateNewsletterEmail({
          fullName: member.full_name || 'Member',
          newsletterContent: personalizedBody.split('\n').map((p) => p.trim() ? `<p>${p}</p>` : '').join(''),
          unsubscribeLink,
          newsletterName: 'NZ Melting Pot',
          siteName: 'NZ Melting Pot'
        });

        console.log(`Sending to: ${member.email}`);
        const result = await window.ezsite.apis.sendEmail({
          from: fromAddress,
          to: [member.email],
          subject: emailSubject,
          html,
          text
        });
        console.log(`sendEmail result for ${member.email}:`, result);
        const { error } = result || {};

        if (error) {
          console.error('Email send error for', member.email, ':', error);
          failCount++;
          if (!lastError) {
            // Handle error as object or string
            lastError = typeof error === 'string' ? error : error.message || error.Message || JSON.stringify(error);
          }
        } else {
          successCount++;
        }
      } catch (err) {
        console.error('Email send exception for', member.email, ':', err);
        failCount++;
        if (!lastError) lastError = err.message || 'Unknown error';
      }
    }

    setSendingEmail(false);

    if (successCount > 0 && failCount === 0) {
      setEmailResult({ success: true, message: `Email sent to ${successCount} member${successCount !== 1 ? 's' : ''}` });
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailSubject('');
        setEmailBody('');
        setSelectedMembers(new Set());
        setEmailResult(null);
      }, 2000);
    } else if (successCount > 0) {
      setEmailResult({ success: true, message: `Sent to ${successCount}, failed for ${failCount}` });
    } else {
      const errorMsg = lastError ? `Error: ${lastError}` : 'Failed to send emails. Please try again.';
      setEmailResult({ success: false, message: errorMsg });
    }
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((line) => line.trim());

      if (lines.length === 0) {
        setImportResult({ success: false, message: 'CSV file is empty' });
        setImporting(false);
        return;
      }

      // Parse CSV - handle both with and without headers
      const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      // Check if first row looks like a header
      const firstRow = parseCSVLine(lines[0]);
      const looksLikeHeader = firstRow.some((cell) =>
      /^(name|full_name|fullname|email|status)$/i.test(cell)
      );

      const dataStartIndex = looksLikeHeader ? 1 : 0;
      let headerMap = { name: 0, email: 1 }; // Default: name in col 0, email in col 1

      if (looksLikeHeader) {
        // Find column indices from header
        firstRow.forEach((header, idx) => {
          const h = header.toLowerCase().replace(/[_\s]/g, '');
          if (h === 'name' || h === 'fullname') headerMap.name = idx;
          if (h === 'email') headerMap.email = idx;
        });
      }

      const names = [];
      for (let i = dataStartIndex; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        const name = row[headerMap.name]?.trim();
        const email = row[headerMap.email]?.trim();
        if (name) {
          names.push({ full_name: name, email: email || '' });
        }
      }

      if (names.length === 0) {
        setImportResult({ success: false, message: 'No valid names found in CSV' });
        setImporting(false);
        return;
      }

      // Insert members into database
      let successCount = 0;
      let skipCount = 0;

      for (const member of names) {
        try {
          const { error } = await window.ezsite.apis.tableCreate(MEMBERS_TABLE_ID, {
            full_name: member.full_name,
            email: member.email,
            status: 'active',
            subscribed_date: new Date().toISOString()
          });
          if (error) {
            skipCount++;
          } else {
            successCount++;
          }
        } catch {
          skipCount++;
        }
      }

      setImportResult({
        success: true,
        message: `Imported ${successCount} member${successCount !== 1 ? 's' : ''}${skipCount > 0 ? ` (${skipCount} skipped)` : ''}`
      });

      // Refresh the members list
      loadMembers(1);

    } catch (err) {
      setImportResult({ success: false, message: 'Failed to parse CSV: ' + (err.message || 'Unknown error') });
    }

    setImporting(false);
    // Reset the file input
    e.target.value = '';
  };

  const exportToExcel = async () => {
    setExporting(true);
    try {
      // Fetch all submissions
      const { data, error } = await window.ezsite.apis.tablePage(SUBMISSIONS_TABLE_ID, {
        PageNo: 1,
        PageSize: 10000,
        OrderByField: 'id',
        IsAsc: false
      });

      if (error || !data?.List) {
        alert('Failed to fetch submissions: ' + (error || 'Unknown error'));
        setExporting(false);
        return;
      }

      const submissions = data.List;
      if (submissions.length === 0) {
        alert('No submissions to export.');
        setExporting(false);
        return;
      }

      // Define column headers and their corresponding data keys
      const columns = [
      { header: 'Registration Code', key: 'unique_code' },
      { header: 'Leader Name', key: 'participant_name' },
      { header: 'Date of Birth', key: 'date_of_birth' },
      { header: 'Email', key: 'email' },
      { header: 'Phone', key: 'phone' },
      { header: 'Category', key: 'category' },
      { header: 'Performance Type', key: 'performance_type' },
      { header: 'Song Title', key: 'song_title' },
      { header: 'Participant 2', key: 'participant_2_name' },
      { header: 'Participant 3', key: 'participant_3_name' },
      { header: 'Participant 4', key: 'participant_4_name' },
      { header: 'Num Performers', key: 'num_performers' },
      { header: 'Total Fee', key: 'total_fee' },
      { header: 'Heard About', key: 'heard_about' },
      { header: 'Submission Time', key: 'submission_timestamp' },
      { header: 'Year', key: 'year' }];


      // Helper to escape CSV values
      const escapeCSV = (val, isDate = false) => {
        if (val === null || val === undefined) return '';
        if (isDate && val) {
          const formatted = formatDate(val);
          if (formatted !== '—') return formatted;
        }
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
      };

      // Build CSV content
      const headerRow = columns.map((c) => escapeCSV(c.header)).join(',');
      const dataRows = submissions.map((row) =>
      columns.map((c) => escapeCSV(row[c.key], c.key.includes('date') || c.key.includes('timestamp'))).join(',')
      );
      const csvContent = [headerRow, ...dataRows].join('\n');

      // Add BOM for Excel UTF-8 compatibility
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });

      // Generate filename with date (dd-mm-yyyy)
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const dateStr = `${day}-${month}-${year}`;
      const filename = `form_submissions_${dateStr}.csv`;

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed: ' + (err.message || 'Unknown error'));
    }
    setExporting(false);
  };

  const handleSave = async (key) => {
    const record = settings.find((s) => s.setting_key === key);
    if (!record) return;

    setSaving((p) => ({ ...p, [key]: true }));
    setSaveSuccess((p) => ({ ...p, [key]: false }));

    try {
      const { error } = await window.ezsite.apis.tableUpdate(SETTINGS_TABLE_ID, {
        ID: record.id || record.ID,
        setting_value: editValues[key]
      });
      if (error) throw new Error(error);
      setSaveSuccess((p) => ({ ...p, [key]: true }));
      setTimeout(() => setSaveSuccess((p) => ({ ...p, [key]: false })), 2500);
      // Update local settings array
      setSettings((prev) =>
      prev.map((s) => s.setting_key === key ? { ...s, setting_value: editValues[key] } : s)
      );
    } catch (err) {
      alert('Failed to save: ' + (err.message || 'Unknown error'));
    }
    setSaving((p) => ({ ...p, [key]: false }));
  };

  const hasChanged = (key) => {
    const record = settings.find((s) => s.setting_key === key);
    return record && editValues[key] !== record.setting_value;
  };

  // --- Loading state ---
  if (authLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={{ textAlign: 'center', color: '#666' }}>Checking authentication...</p>
        </div>
      </div>);

  }

  // --- Login form ---
  if (!user) {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, maxWidth: 420 }}>
          <h2 style={styles.heading}>Admin Login</h2>
          <p style={{ color: '#666', marginBottom: 24, textAlign: 'center', fontSize: '0.9rem' }}>
            Sign in to manage form content and email notifications.
          </p>
          {loginError && <div style={styles.error}>{loginError}</div>}
          <form onSubmit={handleLogin}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="admin@example.com" />

            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="Enter password" />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>

                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              style={{
                ...styles.primaryBtn,
                opacity: loginLoading ? 0.6 : 1
              }} data-auth-id="a-a3gmqudpt">

              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>);

  }

  // --- Admin panel ---
  const totalMembersPages = Math.ceil(membersTotal / membersPageSize);

  return (
    <div style={styles.page}>
      <div style={{ ...styles.card, maxWidth: 900 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ ...styles.heading, marginBottom: 4 }}>Admin Panel</h2>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
              Logged in as {user.Email}
            </p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={activeTab === 'dashboard' ? styles.tabActive : styles.tab}>

            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('content')}
            style={activeTab === 'content' ? styles.tabActive : styles.tab}>

            📋 Content
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            style={activeTab === 'submissions' ? styles.tabActive : styles.tab}>

            📥 Submissions
          </button>
          <button
            onClick={() => setActiveTab('members')}
            style={activeTab === 'members' ? styles.tabActive : styles.tab}>

            👥 Members
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' &&
        <div>
          {loadingDashboard ? (
            <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>Loading dashboard...</p>
          ) : (
            <>
              {/* Stats Cards */}
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>📥</div>
                  <div style={styles.statNumber}>{dashboardStats.totalSubmissions}</div>
                  <div style={styles.statLabel}>Total Registrations</div>
                </div>
                <div style={{ ...styles.statCard, borderTopColor: '#16a34a' }}>
                  <div style={styles.statIcon}>👥</div>
                  <div style={styles.statNumber}>{dashboardStats.totalMembers}</div>
                  <div style={styles.statLabel}>Total Members</div>
                </div>
                <div style={{ ...styles.statCard, borderTopColor: '#2563eb' }}>
                  <div style={styles.statIcon}>✅</div>
                  <div style={styles.statNumber}>{dashboardStats.activeSubscribers}</div>
                  <div style={styles.statLabel}>Active Subscribers</div>
                </div>
                <div style={{ ...styles.statCard, borderTopColor: '#d97706' }}>
                  <div style={styles.statIcon}>🎵</div>
                  <div style={styles.statNumber}>{dashboardStats.thisYearSubmissions}</div>
                  <div style={styles.statLabel}>{new Date().getFullYear()} Registrations</div>
                </div>
              </div>

              {/* Recent Registrations */}
              <div style={styles.dashSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={styles.dashSectionTitle}>Recent Registrations</h3>
                  <button onClick={() => setActiveTab('submissions')} style={styles.dashLink}>View All →</button>
                </div>
                {recentSubmissions.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Category</th>
                          <th style={styles.th}>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentSubmissions.map((s, i) => (
                          <tr key={i}>
                            <td style={styles.td}>{s.participant_name || '—'}</td>
                            <td style={styles.td}>{s.email || '—'}</td>
                            <td style={styles.td}>
                              <span style={styles.badge}>{s.category || '—'}</span>
                            </td>
                            <td style={styles.td}>{formatDate(s.submission_timestamp || s.CreatedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>No registrations yet.</p>
                )}
              </div>

              {/* Recent Members */}
              <div style={styles.dashSection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={styles.dashSectionTitle}>Recent Members</h3>
                  <button onClick={() => setActiveTab('members')} style={styles.dashLink}>View All →</button>
                </div>
                {recentMembers.length > 0 ? (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Status</th>
                          <th style={styles.th}>Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentMembers.map((m, i) => (
                          <tr key={i}>
                            <td style={styles.td}>{m.full_name || '—'}</td>
                            <td style={styles.td}>{m.email || '—'}</td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.badge,
                                background: m.status === 'active' ? '#dcfce7' : '#fef2f2',
                                color: m.status === 'active' ? '#166534' : '#991b1b'
                              }}>
                                {m.status || '—'}
                              </span>
                            </td>
                            <td style={styles.td}>{formatDate(m.subscribed_date || m.CreatedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={{ color: '#999', fontSize: '0.85rem' }}>No members yet.</p>
                )}
              </div>

              {/* Quick Actions */}
              <div style={styles.dashSection}>
                <h3 style={styles.dashSectionTitle}>Quick Actions</h3>
                <div style={styles.quickActions}>
                  <button onClick={() => { setActiveTab('submissions'); setTimeout(() => exportToExcel(), 300); }} style={styles.quickActionBtn}>
                    <span style={{ fontSize: '1.3rem' }}>📥</span>
                    <span>Export Submissions</span>
                  </button>
                  <button onClick={() => setActiveTab('members')} style={styles.quickActionBtn}>
                    <span style={{ fontSize: '1.3rem' }}>✉️</span>
                    <span>Send Newsletter</span>
                  </button>
                  <a href="/" target="_blank" rel="noopener noreferrer" style={{ ...styles.quickActionBtn, textDecoration: 'none' }}>
                    <span style={{ fontSize: '1.3rem' }}>🌐</span>
                    <span>View Website</span>
                  </a>
                  <button onClick={() => loadDashboard()} style={styles.quickActionBtn}>
                    <span style={{ fontSize: '1.3rem' }}>🔄</span>
                    <span>Refresh Data</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        }

        {/* Submissions Tab */}
        {activeTab === 'submissions' &&
        <div style={{ padding: '20px 24px', background: '#f8f6f3', borderRadius: 12, border: '1px solid #e6ddd3' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '1.3rem' }}>📥</span>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1E1915' }}>Export Submissions</h3>
            </div>
            <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: 16 }}>
              Download all form submissions as a CSV file (opens in Excel, Google Sheets, etc.)
            </p>
            <button
            onClick={exportToExcel}
            disabled={exporting}
            style={{
              ...styles.primaryBtn,
              width: 'auto',
              padding: '10px 24px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              opacity: exporting ? 0.6 : 1,
              cursor: exporting ? 'not-allowed' : 'pointer'
            }}>

              {exporting ?
            <>Exporting...</> :

            <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Excel (CSV)
                </>
            }
            </button>
          </div>
        }

        {/* Members Tab */}
        {activeTab === 'members' &&
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1E1915' }}>
                  👥 Mailing List Members
                </h3>
                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '0.85rem' }}>
                  {membersTotal} total member{membersTotal !== 1 ? 's' : ''}
                  {' • '}<span style={{ color: '#166534' }}>{members.filter((m) => m.status !== 'unsubscribed').length} active</span>
                  {selectedMembers.size > 0 && ` • ${selectedMembers.size} selected`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                {selectedMembers.size > 0 &&
              <button
                onClick={() => setShowEmailModal(true)}
                style={{
                  ...styles.primaryBtn,
                  width: 'auto',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)'
                }}>

                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    Send Email ({selectedMembers.size})
                  </button>
              }
                <input
                type="file"
                accept=".csv"
                onChange={handleImportCSV}
                style={{ display: 'none' }}
                id="csv-import-input" />

                <button
                onClick={() => document.getElementById('csv-import-input').click()}
                disabled={importing}
                style={{
                  ...styles.primaryBtn,
                  width: 'auto',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: importing ? '#999' : 'linear-gradient(135deg, #2d5a27, #3d7a35)',
                  opacity: importing ? 0.7 : 1
                }}>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  {importing ? 'Importing...' : 'Import CSV'}
                </button>
                <button
                onClick={exportMembers}
                style={{
                  ...styles.primaryBtn,
                  width: 'auto',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Export CSV
                </button>
                <button
                onClick={bulkUpdateAllNames}
                disabled={bulkUpdating}
                style={{
                  ...styles.primaryBtn,
                  width: 'auto',
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: bulkUpdating ? '#999' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  opacity: bulkUpdating ? 0.7 : 1
                }}>

                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  {bulkUpdating ? 'Updating...' : 'Set All Names to "Member"'}
                </button>
              </div>
            </div>

            {importResult &&
          <div style={{
            padding: '12px 16px',
            marginBottom: 16,
            borderRadius: 8,
            background: importResult.success ? '#dcfce7' : '#fef2f2',
            border: `1px solid ${importResult.success ? '#86efac' : '#fecaca'}`,
            color: importResult.success ? '#166534' : '#991b1b',
            fontSize: '0.9rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
                <span>{importResult.message}</span>
                <button
              onClick={() => setImportResult(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>

                  x
                </button>
              </div>
          }

            {loadingMembers ?
          <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>Loading members...</p> :
          members.length === 0 ?
          <p style={{ textAlign: 'center', color: '#666', padding: 40, background: '#f8f6f3', borderRadius: 12 }}>
                No members yet. Members will appear here when they subscribe.
              </p> :

          <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ ...styles.th, width: 40 }}>
                          <input
                        type="checkbox"
                        checked={selectedMembers.size > 0}
                        onChange={toggleAllMembers}
                        style={{ cursor: 'pointer', width: 16, height: 16 }}
                        title={selectedMembers.size > 0 ? `Deselect all (${selectedMembers.size} selected)` : "Select all active members"} />

                        </th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Subscribed</th>
                        <th style={styles.th}>Unsubscribed</th>
                        <th style={styles.th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m) =>
                  <tr key={m.id || m.ID} style={{ background: selectedMembers.has(m.id || m.ID) ? '#f0f7ff' : 'transparent' }}>
                          <td style={styles.td}>
                            <input
                        type="checkbox"
                        checked={selectedMembers.has(m.id || m.ID)}
                        onChange={() => toggleMemberSelection(m.id || m.ID)}
                        disabled={m.status === 'unsubscribed'}
                        style={{ cursor: m.status !== 'unsubscribed' ? 'pointer' : 'not-allowed', width: 16, height: 16, opacity: m.status !== 'unsubscribed' ? 1 : 0.4 }} />

                          </td>
                          <td style={styles.td}>{m.full_name || '—'}</td>
                          <td style={styles.td}>{m.email || '—'}</td>
                          <td style={styles.td}>
                            <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: 12,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: m.status !== 'unsubscribed' ? '#dcfce7' : '#fef2f2',
                        color: m.status !== 'unsubscribed' ? '#166534' : '#991b1b'
                      }}>
                              {m.status !== 'unsubscribed' ? 'Active' : 'Unsubscribed'}
                            </span>
                          </td>
                          <td style={styles.td}>
                            {formatDate(m.subscribed_date)}
                          </td>
                          <td style={styles.td}>
                            {m.status === 'unsubscribed' && m.unsubscribed_date && m.unsubscribed_date !== '1970-01-01T00:00:00' ?
                      formatDate(m.unsubscribed_date) :
                      '—'}
                          </td>
                          <td style={styles.td}>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {m.status !== 'unsubscribed' ?
                        <button
                          onClick={() => handleUnsubscribe(m)}
                          style={styles.actionBtn}
                          title="Unsubscribe">

                                  ❌
                                </button> :

                        <button
                          onClick={() => handleResubscribe(m)}
                          style={styles.actionBtn}
                          title="Resubscribe">

                                  ✅
                                </button>
                        }
                              <button
                          onClick={() => handleDeleteMember(m)}
                          style={{ ...styles.actionBtn, color: '#991b1b' }}
                          title="Delete permanently">

                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                  )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalMembersPages > 1 &&
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <button
                  onClick={() => loadMembers(1)}
                  disabled={membersPage <= 1}
                  style={{
                    ...styles.paginationBtn,
                    opacity: membersPage <= 1 ? 0.4 : 1
                  }}>

                        ⏮ First
                      </button>
                      <button
                  onClick={() => loadMembers(membersPage - 1)}
                  disabled={membersPage <= 1}
                  style={{
                    ...styles.paginationBtn,
                    opacity: membersPage <= 1 ? 0.4 : 1
                  }}>

                        ← Prev
                      </button>

                      {/* Page numbers */}
                      {(() => {
                  const pages = [];
                  const maxVisible = 7;
                  let start = Math.max(1, membersPage - 3);
                  let end = Math.min(totalMembersPages, start + maxVisible - 1);
                  if (end - start < maxVisible - 1) {
                    start = Math.max(1, end - maxVisible + 1);
                  }

                  if (start > 1) {
                    pages.push(
                      <button key={1} onClick={() => loadMembers(1)} style={styles.pageNumBtn}>1</button>
                    );
                    if (start > 2) pages.push(<span key="dots1" style={{ color: '#666' }}>...</span>);
                  }

                  for (let i = start; i <= end; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => loadMembers(i)}
                        style={{
                          ...styles.pageNumBtn,
                          background: i === membersPage ? '#c9a227' : 'transparent',
                          color: i === membersPage ? '#fff' : '#666',
                          fontWeight: i === membersPage ? 700 : 400
                        }}>

                              {i}
                            </button>
                    );
                  }

                  if (end < totalMembersPages) {
                    if (end < totalMembersPages - 1) pages.push(<span key="dots2" style={{ color: '#666' }}>...</span>);
                    pages.push(
                      <button key={totalMembersPages} onClick={() => loadMembers(totalMembersPages)} style={styles.pageNumBtn}>{totalMembersPages}</button>
                    );
                  }

                  return pages;
                })()}

                      <button
                  onClick={() => loadMembers(membersPage + 1)}
                  disabled={membersPage >= totalMembersPages}
                  style={{
                    ...styles.paginationBtn,
                    opacity: membersPage >= totalMembersPages ? 0.4 : 1
                  }}>

                        Next →
                      </button>
                      <button
                  onClick={() => loadMembers(totalMembersPages)}
                  disabled={membersPage >= totalMembersPages}
                  style={{
                    ...styles.paginationBtn,
                    opacity: membersPage >= totalMembersPages ? 0.4 : 1
                  }}>

                        Last ⏭
                      </button>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#666' }}>
                      Page {membersPage} of {totalMembersPages} • {membersTotal} total members
                    </span>
                  </div>
            }
              </>
          }

            {/* Email Modal */}
            {showEmailModal &&
          <div style={styles.modalOverlay}>
                <div style={styles.modal}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1E1915' }}>
                      ✉️ Send Email to Members
                    </h3>
                    <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailResult(null);
                  }}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>

                      ×
                    </button>
                  </div>

                  {/* Resend Setup Info */}
                  <div style={{
                padding: '12px 14px',
                marginBottom: 16,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                border: '1px solid #bae6fd',
                fontSize: '0.8rem',
                color: '#0369a1'
              }}>
                    <strong style={{ display: 'block', marginBottom: 4 }}>📧 Email Service (Resend)</strong>
                    Emails are sent via Resend. Configure your API key in Project Settings.
                    Free tier: 100 emails/day — ideal for ~300 members.
                  </div>

                  <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: 16 }}>
                    <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: '#dcfce7',
                  color: '#166534',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  marginRight: 6
                }}>{selectedMembers.size} selected</span>
                    Will send to all selected active members across all pages (unsubscribed members are automatically excluded).
                    <br />
                    <span style={{ color: '#888', fontSize: '0.8rem' }}>Tip: Use {'{name}'} to personalize. Unsubscribe link is auto-added to all emails.</span>
                  </p>

                  {emailResult &&
              <div style={{
                padding: '12px 16px',
                marginBottom: 16,
                borderRadius: 8,
                background: emailResult.success ? '#dcfce7' : '#fef2f2',
                border: `1px solid ${emailResult.success ? '#86efac' : '#fecaca'}`,
                color: emailResult.success ? '#166534' : '#991b1b',
                fontSize: '0.9rem'
              }}>
                      {emailResult.message}
                    </div>
              }

                  <div style={{ marginBottom: 16 }}>
                    <label style={styles.label}>Subject</label>
                    <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  style={styles.input} />

                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label style={styles.label}>Message</label>
                    <textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Enter your message here...&#10;&#10;Use {name} to insert the member's name."
                  style={{ ...styles.input, minHeight: 180, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />

                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                    <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailResult(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'transparent',
                    border: '1.5px solid #E6DDD3',
                    borderRadius: 8,
                    color: '#666',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}>

                      Cancel
                    </button>
                    <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim()}
                  style={{
                    ...styles.primaryBtn,
                    width: 'auto',
                    padding: '10px 24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                    opacity: sendingEmail || !emailSubject.trim() || !emailBody.trim() ? 0.6 : 1
                  }}>

                      {sendingEmail ?
                  <>Sending...</> :

                  <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                          Send Email
                        </>
                  }
                    </button>
                  </div>
                </div>
              </div>
          }
          </div>
        }

        {/* Content Tab */}
        {activeTab === 'content' && (loadingSettings ?
        <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>Loading settings...</p> :

        <div>
            {/* Thank-you section header */}
            <div style={styles.sectionHeader}>
              <span style={styles.sectionIcon}>📋</span> Thank-You Page Content
            </div>

            {SETTING_ORDER.filter((k) => k.startsWith('thankyou_')).map((key) =>
          <SettingField
            key={key}
            settingKey={key}
            label={SETTING_LABELS[key]}
            value={editValues[key] || ''}
            onChange={(val) => setEditValues((p) => ({ ...p, [key]: val }))}
            onSave={() => handleSave(key)}
            saving={saving[key]}
            saved={saveSuccess[key]}
            changed={hasChanged(key)}
            isLong={key.includes('instructions') || key.includes('body')} />

          )}

            {/* Email section header */}
            <div style={{ ...styles.sectionHeader, marginTop: 32 }}>
              <span style={styles.sectionIcon}>✉️</span> Email Notification Content
            </div>

            {SETTING_ORDER.filter((k) => k.startsWith('email_')).map((key) =>
          <SettingField
            key={key}
            settingKey={key}
            label={SETTING_LABELS[key]}
            value={editValues[key] || ''}
            onChange={(val) => setEditValues((p) => ({ ...p, [key]: val }))}
            onSave={() => handleSave(key)}
            saving={saving[key]}
            saved={saveSuccess[key]}
            changed={hasChanged(key)}
            isLong={key.includes('instructions') || key.includes('body')} />

          )}
          </div>)
        }
      </div>
    </div>);

}

function SettingField({ label, value, onChange, onSave, saving, saved, changed, isLong }) {
  return (
    <div style={styles.settingRow}>
      <label style={styles.settingLabel}>{label}</label>
      {isLong ?
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...styles.input, minHeight: 120, resize: 'vertical', fontFamily: 'inherit' }} /> :


      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input} />

      }
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
        <button
          onClick={onSave}
          disabled={saving || !changed}
          style={{
            ...styles.saveBtn,
            opacity: saving || !changed ? 0.5 : 1,
            cursor: saving || !changed ? 'default' : 'pointer'
          }}>

          {saving ? 'Saving...' : 'Save'}
        </button>
        {saved && <span style={{ color: '#16a34a', fontSize: '0.85rem' }}>Saved!</span>}
      </div>
    </div>);

}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '60px 16px 80px',
    background: 'linear-gradient(135deg, #FBF5ED 0%, #F5EDDF 100%)'
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '36px 32px',
    width: '100%',
    maxWidth: 800,
    boxShadow: '0 4px 30px rgba(30, 25, 21, 0.08)'
  },
  heading: {
    fontFamily: "'Cormorant', Georgia, serif",
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#1E1915',
    margin: '0 0 16px',
    textAlign: 'center'
  },
  field: {
    marginBottom: 18
  },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#3D342E',
    marginBottom: 6
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #E6DDD3',
    borderRadius: 8,
    fontSize: '0.95rem',
    color: '#1E1915',
    background: '#FFFCF8',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  eyeBtn: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: 4
  },
  primaryBtn: {
    width: '100%',
    padding: '12px',
    background: 'linear-gradient(135deg, #7B1E2D, #A83832)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8
  },
  error: {
    padding: '10px 14px',
    marginBottom: 16,
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 8,
    color: '#991b1b',
    fontSize: '0.9rem'
  },
  logoutBtn: {
    padding: '8px 20px',
    background: 'transparent',
    border: '1.5px solid #E6DDD3',
    borderRadius: 8,
    color: '#7B1E2D',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer'
  },
  sectionHeader: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#7B1E2D',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottom: '2px solid #F0D0C8',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  sectionIcon: {
    fontSize: '1.2rem'
  },
  settingRow: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1px solid #f3ede6'
  },
  settingLabel: {
    display: 'block',
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#3D342E',
    marginBottom: 6
  },
  saveBtn: {
    padding: '6px 18px',
    background: '#7B1E2D',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    fontSize: '0.82rem',
    fontWeight: 600
  },
  tabContainer: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
    borderBottom: '2px solid #E6DDD3',
    paddingBottom: 0
  },
  tab: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    color: '#666',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: -2,
    transition: 'color 0.2s, border-color 0.2s'
  },
  tabActive: {
    padding: '10px 20px',
    background: 'transparent',
    border: 'none',
    borderBottom: '3px solid #7B1E2D',
    color: '#7B1E2D',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: -2
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.85rem'
  },
  th: {
    textAlign: 'left',
    padding: '12px 10px',
    borderBottom: '2px solid #E6DDD3',
    fontWeight: 700,
    color: '#3D342E',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  td: {
    padding: '12px 10px',
    borderBottom: '1px solid #f3ede6',
    color: '#1E1915'
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: 4
  },
  paginationBtn: {
    padding: '6px 14px',
    background: '#f8f6f3',
    border: '1px solid #E6DDD3',
    borderRadius: 6,
    fontSize: '0.82rem',
    fontWeight: 600,
    color: '#3D342E',
    cursor: 'pointer'
  },
  pageNumBtn: {
    padding: '6px 12px',
    background: 'transparent',
    border: '1px solid #E6DDD3',
    borderRadius: 6,
    fontSize: '0.82rem',
    color: '#666',
    cursor: 'pointer',
    minWidth: 36,
    textAlign: 'center'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    padding: '28px 32px',
    width: '100%',
    maxWidth: 560,
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
  },
  // Dashboard styles
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 16,
    marginBottom: 32
  },
  statCard: {
    background: '#FFFCF8',
    borderRadius: 12,
    padding: '20px 16px',
    textAlign: 'center',
    border: '1px solid #E6DDD3',
    borderTop: '4px solid #7B1E2D',
    transition: 'box-shadow 0.2s'
  },
  statIcon: {
    fontSize: '1.5rem',
    marginBottom: 8
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1E1915',
    fontFamily: "'Cormorant', Georgia, serif",
    lineHeight: 1
  },
  statLabel: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: '#888',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  dashSection: {
    background: '#f8f6f3',
    borderRadius: 12,
    padding: '20px 24px',
    border: '1px solid #e6ddd3',
    marginBottom: 20
  },
  dashSectionTitle: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#1E1915'
  },
  dashLink: {
    background: 'none',
    border: 'none',
    color: '#7B1E2D',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    padding: 0
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: 20,
    fontSize: '0.78rem',
    fontWeight: 600,
    background: '#FBF5ED',
    color: '#7B1E2D'
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
    marginTop: 12
  },
  quickActionBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    padding: '16px 12px',
    background: '#fff',
    border: '1.5px solid #E6DDD3',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#3D342E',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  }
};