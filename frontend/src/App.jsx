import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { jsPDF } from 'jspdf';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Badge,
  Stack
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  AutoAwesome as AutoAwesomeIcon,
  InsertDriveFileOutlined as FileIcon,
  RotateLeft as ResetIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Download as DownloadIcon,
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  Menu as MenuIcon,
  VerifiedUser as AuditIcon,
  LocalHospital as ClinicalIcon,
  ViewSidebar as SplitViewIcon,
  FormatListBulleted as ListIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';

// Sample client sessions for 1-click clinical testing
const SAMPLE_SESSIONS = [
  {
    id: 'sample-1',
    clientName: 'Sarah Jenkins',
    clientId: '#CL-8492',
    sessionType: 'Weekly Review',
    sessionDate: new Date().toISOString().split('T')[0],
    description: 'Week 4 check-in: High work stress, low sleep (5h), acidity/bloating, steps 8,000.',
    transcript: `Client: Good morning. Slept only around 5 hours last night. Daughter had exams, so I was awake late.
Client: Did some mopping, sweeping, Surya Namaskar and walking inside the house.
Client: Generally feeling happy today.
Client: Feeling some acidity since morning. Still having acidity and bloating.
Client: I had to go to school after a few days. Very hectic morning.
Coach: Today's update: Water 4 litres, Sleep 5 hours, Steps around 8,000, Exercise only walking.
Client: Weight seems slightly up even though I'm eating almost half of what I used to eat.
Coach: Protein seems low in breakfast on some days.
Client: Yesterday energy was very good. Today feeling low again.
Client: Bloating is back and I feel like I have gained weight.
Client: I am not getting enough time to plan meals. Next week should be easier.
Coach: That could be one of the main barriers right now.
Client: Sorry I missed your call. There was a stressful situation at work.
Client: There is a lot of office pressure and politics going on.
Client: During a meeting today I was so tired that my head went down on the table and I actually slept for a few seconds.
Client: Feeling very low. I feel I can sleep for days.
Coach: That sounds like a very exhausting day. Please rest today. We also need to look at your sleep and stress more carefully.
Client: Slept better last night, around 8 hours. Energy feels much better today.
Client: Still having bloating on and off. But overall energy is much better than before.`
  },
  {
    id: 'sample-2',
    clientName: 'Marcus Vance',
    clientId: '#CL-9104',
    sessionType: 'Exercise & Stress Sync',
    sessionDate: new Date().toISOString().split('T')[0],
    description: 'Heavy lifting 4x/wk, 10,000 steps, high work pressure, mild lower back tightness.',
    transcript: `Coach: Hi Marcus, how was your workout consistency this week?
Client: Managed 4 weightlifting sessions. Hits target weights on bench and deadlifts.
Client: Steps averaged around 10,200 per day according to my smartwatch.
Client: Hydration was solid - drinking 3.5 to 4 liters daily.
Coach: Excellent work on the activity! How are sleep and recovery feeling?
Client: Sleeping about 6 hours. Work deadline pressure is high this sprint, so my mind stays active at night.
Client: Noticed some mild lower back tightness after Tuesday's squats. No sharp pain, just stiffness.
Coach: Let's scale back squat intensity by 10% next week and add 5 minutes of cat-cow and hamstring stretches post-workout.
Client: Got it, will adjust. Nutrition was on point - 140g protein daily with chicken, eggs, and whey.
Coach: Perfect. Focus on lowering screen time before bed to push sleep closer to 7.5 hours.`
  },
  {
    id: 'sample-3',
    clientName: 'Elena Rostova',
    clientId: '#CL-3321',
    sessionType: 'Nutrition & Rehab Sync',
    sessionDate: new Date().toISOString().split('T')[0],
    description: 'Post-op knee rehab, 2.5L water, 6,000 steps, strict diet adherence.',
    transcript: `Coach: Good afternoon Elena! How is your knee feeling with the new mobility protocol?
Client: Much better! Completed the physio exercises every morning without fail.
Client: Walking steps reached 6,100 yesterday. Knee swelling is down significantly.
Coach: Great progress! Tell me about your meals and hydration over the last few days.
Client: Following the meal plan strictly. Switched to quinoa, roasted salmon, and leafy greens.
Client: Drinking 2.5 liters of water daily. Added electrolyte drops post-rehab.
Client: Sleep quality has improved to 7.5 hours. Feeling motivated and energized!
Coach: Outstanding adherence Elena. Keep up the daily rehab exercises and maintain current hydration levels.`
  }
];

// Custom slate theme palette for healthcare internal dashboard
const theme = createTheme({
  palette: {
    primary: {
      main: '#0f172a', // Slate 900
      light: '#1e293b',
      dark: '#020617',
    },
    secondary: {
      main: '#2563eb', // Royal Blue
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif',
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.5,
      fontSize: '0.925rem',
      color: '#1e293b',
    },
    body2: {
      fontSize: '0.85rem',
      color: '#64748b',
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 6,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          backgroundColor: '#0f172a',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1e293b',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
  },
});

function App() {
  // Main Input States
  const [conversationText, setConversationText] = useState(SAMPLE_SESSIONS[0].transcript);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Client Metadata States
  const [clientMetadata, setClientMetadata] = useState({
    clientName: SAMPLE_SESSIONS[0].clientName,
    clientId: SAMPLE_SESSIONS[0].clientId,
    sessionType: SAMPLE_SESSIONS[0].sessionType,
    sessionDate: SAMPLE_SESSIONS[0].sessionDate
  });

  // UI & Layout States
  const [activeTab, setActiveTab] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Human Review & Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummaries, setEditedSummaries] = useState({});
  const [coachNotes, setCoachNotes] = useState('');
  const [auditHistory, setAuditHistory] = useState([]);

  // Snackbar Feedback State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const fileInputRef = useRef(null);
  const resultRef = useRef(null);

  // Helper to load sample session into state
  const handleLoadSample = (sample) => {
    setConversationText(sample.transcript);
    setFileName('');
    setClientMetadata({
      clientName: sample.clientName,
      clientId: sample.clientId,
      sessionType: sample.sessionType,
      sessionDate: sample.sessionDate
    });
    setError('');
    triggerSnackbar(`Loaded transcript for ${sample.clientName}. Report remains visible.`, 'info');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a plain text (.txt) transcript file.');
      triggerSnackbar('Invalid file format. Please upload a .txt file.', 'error');
      return;
    }

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      setConversationText(event.target.result);
      triggerSnackbar(`Loaded file "${file.name}".`, 'success');
    };
    reader.readAsText(file);
  };

  // Clean WhatsApp exported chat timestamps & system headers
  const handleCleanWhatsappChat = () => {
    if (!conversationText || !conversationText.trim()) {
      triggerSnackbar('Please paste a WhatsApp conversation transcript first.', 'warning');
      return;
    }

    // Strips WhatsApp export patterns:
    // e.g. [7/12/26, 9:30:15 AM] Speaker Name:
    // e.g. 12/07/2026, 09:30 - Speaker Name:
    const cleaned = conversationText
      .replace(/\[?\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\]?\s*[-:]?\s*/g, '')
      .replace(/^\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d{1,2}:\d{2}\s*-\s*/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    setConversationText(cleaned);
    triggerSnackbar('Cleaned WhatsApp timestamps and metadata from transcript.', 'success');
  };

  // Clear Conversation text without deleting generated report
  const handleClearConversation = () => {
    setConversationText('');
    setFileName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    triggerSnackbar('Conversation text cleared.', 'info');
  };

  // Full reset workspace (including report)
  const handleResetSession = () => {
    setConversationText('');
    setFileName('');
    setError('');
    setResult(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    triggerSnackbar('Session reset completely.', 'info');
  };

  const triggerSnackbar = (msg, severity = 'info') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAnalyze = async () => {
    if (loading) return;

    if (!conversationText.trim()) {
      setError('Please paste a coaching transcript or upload a .txt file.');
      triggerSnackbar('Transcript text cannot be empty.', 'error');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: conversationText,
          metadata: clientMetadata
        }),
      });

      if (!response.ok) {
        let errMsg = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (e) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResult(data);
      triggerSnackbar('Client intelligence report generated!', 'success');
    } catch (err) {
      console.error(err);
      let errMsg = 'An unexpected server error occurred.';
      if (err.message && err.message.includes('Failed to fetch')) {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        errMsg = `Failed to connect to API backend at ${apiUrl}. Verify server status.`;
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      triggerSnackbar(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Human Review & Audit Actions
  const handleApprove = () => {
    if (!result) return;
    const timestamp = new Date().toLocaleTimeString();
    setResult(prev => ({
      ...prev,
      human_review: {
        status: 'Approved',
        reviewedBy: 'Coach Sarah Jenkins, RD',
        reviewedAt: timestamp,
        notes: coachNotes
      }
    }));
    setAuditHistory(prev => [
      { action: 'Approved', client: clientMetadata.clientName, time: timestamp },
      ...prev
    ]);
    triggerSnackbar('Session report marked as APPROVED.', 'success');
  };

  const handleReject = () => {
    if (!result) return;
    const timestamp = new Date().toLocaleTimeString();
    setResult(prev => ({
      ...prev,
      human_review: {
        status: 'Rejected',
        reviewedBy: 'Coach Sarah Jenkins, RD',
        reviewedAt: timestamp,
        notes: coachNotes
      }
    }));
    setAuditHistory(prev => [
      { action: 'Rejected', client: clientMetadata.clientName, time: timestamp },
      ...prev
    ]);
    triggerSnackbar('Session report marked as REJECTED / NEEDS REVISION.', 'warning');
  };

  const handleSubmitReview = () => {
    if (!result) return;
    const timestamp = new Date().toLocaleTimeString();
    const currentStatus = result.human_review?.status || 'Approved';
    setResult(prev => ({
      ...prev,
      human_review: {
        status: currentStatus,
        reviewedBy: 'Coach Sarah Jenkins, RD',
        reviewedAt: timestamp,
        notes: coachNotes
      }
    }));
    setAuditHistory(prev => [
      { action: `Submitted Review (${currentStatus})`, client: clientMetadata.clientName, time: timestamp, notes: coachNotes },
      ...prev
    ]);
    triggerSnackbar(`Clinical coach review submitted successfully. Status: ${currentStatus}`, 'success');
  };

  const handleStartEdit = () => {
    const initialSummaries = {};
    Object.keys(result).forEach(key => {
      if (result[key] && typeof result[key] === 'object' && 'summary' in result[key]) {
        initialSummaries[key] = result[key].summary || '';
      }
    });
    setEditedSummaries(initialSummaries);
    setIsEditing(true);
  };

  const handleSummaryChange = (key, val) => {
    setEditedSummaries(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleSaveEdit = () => {
    const updatedResult = { ...result };
    Object.keys(editedSummaries).forEach(key => {
      if (updatedResult[key]) {
        updatedResult[key] = {
          ...updatedResult[key],
          summary: editedSummaries[key] || null
        };
      }
    });
    setResult(updatedResult);
    setIsEditing(false);
    triggerSnackbar('Edits saved to clinical summary.', 'success');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // EHR Copy & JSON Export Tooling
  const handleCopyToEhr = () => {
    if (!result) return;

    let ehrText = `=================================================\n`;
    ehrText += `CLINICAL SESSION SUMMARY (EHR NOTE)\n`;
    ehrText += `Client: ${clientMetadata.clientName} (${clientMetadata.clientId})\n`;
    ehrText += `Session Type: ${clientMetadata.sessionType} | Date: ${clientMetadata.sessionDate}\n`;
    ehrText += `Review Status: ${result.human_review?.status || 'Pending'}\n`;
    ehrText += `=================================================\n\n`;

    ehrText += `[1. WEEKLY SUMMARY]\n${result.weekly_summary?.summary || 'N/A'}\n\n`;
    ehrText += `[2. KEY BARRIERS & RISKS]\nBarriers: ${result.key_barriers?.summary || 'None'}\nRisk Flags: ${result.risk_flags?.summary || 'None'}\n\n`;
    ehrText += `[3. VITALS & DIET LOGS]\nNutrition: ${result.nutrition?.summary || 'N/A'}\nSleep: ${result.sleep?.summary || 'N/A'}\nSteps: ${result.steps?.summary || 'N/A'}\nSymptoms: ${result.symptoms?.summary || 'None'}\n\n`;
    ehrText += `[4. COACH RECOMMENDATIONS & NEXT STEPS]\nRecommendations: ${result.coach_recommendation?.summary || 'N/A'}\nPending Actions: ${result.pending_actions?.summary || 'N/A'}\n\n`;
    if (coachNotes) {
      ehrText += `[COACH CLINICAL SIGN-OFF NOTES]\n${coachNotes}\n\n`;
    }

    navigator.clipboard.writeText(ehrText);
    triggerSnackbar('Clinical SOAP summary copied to clipboard for EHR integration!', 'success');
  };

  // Export Clinical Summary Report as structured text PDF
  const handleExportPdf = () => {
    if (!result) {
      triggerSnackbar('No generated report to export.', 'warning');
      return;
    }

    try {
      const doc = new jsPDF({ unit: 'pt', format: 'letter' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 40;

      // Header Banner
      doc.setFillColor(15, 23, 42); // #0f172a
      doc.rect(0, 0, pageWidth, 55, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('CLIENT INTELLIGENCE REPORT', 40, 34);

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated via Gemini 2.5 AI | ${new Date().toLocaleDateString()}`, pageWidth - 40, 34, { align: 'right' });

      y = 75;

      // Client Metadata Box
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`Client Name: ${clientMetadata.clientName || 'N/A'}`, 40, y);
      doc.text(`Client ID: ${clientMetadata.clientId || 'N/A'}`, 240, y);
      doc.text(`Date: ${clientMetadata.sessionDate || 'N/A'}`, 420, y);
      y += 16;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(`Session Type: ${clientMetadata.sessionType || 'N/A'}`, 40, y);
      doc.text(`Audit Status: ${result.human_review?.status || 'Pending'}`, 240, y);

      y += 14;
      doc.setDrawColor(203, 213, 225); // #cbd5e1
      doc.line(40, y, pageWidth - 40, y);
      y += 18;

      // Dashboard KPI Summary
      const dash = result.dashboard_summary || {};
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text('EXECUTIVE DASHBOARD SUMMARY', 40, y);
      y += 14;

      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      const progressVal = dash.overall_progress || 'On Track';
      const riskVal = dash.overall_risk || 'Low Risk';
      const engVal = dash.engagement || 'High Adherence';
      const compVal = dash.data_completeness || '85%';

      doc.text(`Progress: ${progressVal}`, 40, y);
      doc.text(`Risk Level: ${riskVal}`, 170, y);
      doc.text(`Engagement: ${engVal}`, 300, y);
      doc.text(`Completeness: ${compVal}`, 440, y);

      y += 18;
      doc.line(40, y, pageWidth - 40, y);
      y += 22;

      // Section Data Exporter Array
      const sections = [
        { key: 'weekly_summary', title: '1. WEEKLY EXECUTIVE SUMMARY' },
        { key: 'nutrition', title: '2. HEALTH METRIC: NUTRITION & DIET' },
        { key: 'exercise', title: '2. HEALTH METRIC: EXERCISE & WORKOUTS' },
        { key: 'steps', title: '2. HEALTH METRIC: STEPS ACTIVITY' },
        { key: 'sleep', title: '2. HEALTH METRIC: SLEEP ANALYSIS' },
        { key: 'water', title: '2. HEALTH METRIC: WATER INTAKE' },
        { key: 'stress', title: '3. WELLNESS: STRESS LEVEL' },
        { key: 'symptoms', title: '3. WELLNESS: SYMPTOMS & CONCERNS' },
        { key: 'energy', title: '3. WELLNESS: ENERGY LEVELS' },
        { key: 'progress_analysis', title: '4. PROGRESS ANALYSIS' },
        { key: 'detected_patterns', title: '5. DETECTED BEHAVIORAL PATTERNS' },
        { key: 'key_barriers', title: '6. KEY BARRIERS' },
        { key: 'risk_flags', title: '7. RISK FLAGS & WARNINGS' },
        { key: 'coach_recommendation', title: '8. COACH RECOMMENDATIONS' },
        { key: 'pending_followups', title: '9. PENDING FOLLOW-UPS' },
        { key: 'supporting_evidence', title: '10. SUPPORTING EVIDENCE QUOTES' },
      ];

      sections.forEach((sec) => {
        const item = result[sec.key];
        if (!item || !item.summary || item.classification === 'Missing Information') return;

        // Page Break Check
        if (y > 710) {
          doc.addPage();
          y = 45;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(sec.title, 40, y);

        // Classification & Confidence Badge
        doc.setFontSize(8);
        doc.setTextColor(37, 99, 235); // #2563eb
        doc.text(`[${item.classification || 'Fact'}]`, 280, y);
        if (item.confidence) {
          doc.setTextColor(71, 85, 105);
          doc.text(`Confidence: ${item.confidence}`, 380, y);
        }

        y += 13;

        // Summary Text
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const splitText = doc.splitTextToSize(item.summary, pageWidth - 80);
        doc.text(splitText, 40, y);
        y += splitText.length * 11 + 5;

        // Evidence Quote
        if (item.evidence) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139);
          const splitQuote = doc.splitTextToSize(`Evidence: "${item.evidence}"`, pageWidth - 90);
          doc.text(splitQuote, 50, y);
          y += splitQuote.length * 10 + 8;
        } else {
          y += 5;
        }
      });

      // Human Review Notes Stamp
      if (y > 670) {
        doc.addPage();
        y = 45;
      }

      y += 10;
      doc.setDrawColor(15, 23, 42);
      doc.line(40, y, pageWidth - 40, y);
      y += 16;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text('HUMAN CLINICAL REVIEW SIGN-OFF STAMP', 40, y);
      y += 14;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.text(`Review Status: ${result.human_review?.status || 'Pending'}`, 40, y);
      if (result.human_review?.reviewedBy) {
        doc.text(`Reviewed By: ${result.human_review.reviewedBy} at ${result.human_review.reviewedAt}`, 200, y);
      }
      if (coachNotes) {
        y += 14;
        const splitNotes = doc.splitTextToSize(`Coach Notes: ${coachNotes}`, pageWidth - 80);
        doc.text(splitNotes, 40, y);
      }

      // Save PDF File
      const safeName = (clientMetadata.clientName || 'Client').replace(/[^a-z0-9]/gi, '_');
      doc.save(`${safeName}_Intelligence_Report.pdf`);
      triggerSnackbar('Exported text-based clinical summary PDF report!', 'success');
    } catch (err) {
      console.error(err);
      triggerSnackbar('Failed to generate PDF document.', 'error');
    }
  };

  // Color mappings
  const getBadgeColor = (classification) => {
    switch (classification) {
      case 'Confirmed Fact':
        return 'success';
      case 'Client Reported':
        return 'info';
      case 'AI Inference':
        return 'warning';
      case 'Missing Information':
      default:
        return 'default';
    }
  };

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', color: '#f8fafc' }}>
      {/* Drawer Header */}
      <Box sx={{ p: 2.5, borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ClinicalIcon sx={{ color: '#38bdf8' }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Clinical Portal
          </Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            Internal Coach Workspace
          </Typography>
        </Box>
      </Box>

      {/* Quick Navigation */}
      <List sx={{ px: 1, py: 1.5 }}>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton selected sx={{ borderRadius: 1.5, '&.Mui-selected': { bgcolor: '#1e293b', color: '#ffffff' } }}>
            <ListItemIcon sx={{ minWidth: 36, color: '#38bdf8' }}>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Analysis Workspace" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ mb: 0.5 }}>
          <ListItemButton sx={{ borderRadius: 1.5, '&:hover': { bgcolor: '#1e293b' } }}>
            <ListItemIcon sx={{ minWidth: 36, color: '#94a3b8' }}>
              <AuditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Audit Queue" primaryTypographyProps={{ fontSize: '0.875rem' }} />
            <Badge badgeContent={auditHistory.length || 1} color="primary" size="small" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ borderColor: '#1e293b', my: 1 }} />

      {/* Preset Sample Transcripts List */}
      <Box sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Sample Client Sessions
        </Typography>
      </Box>
      <List sx={{ px: 1.5, py: 0.5 }}>
        {SAMPLE_SESSIONS.map((sample) => (
          <ListItem disablePadding key={sample.id} sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleLoadSample(sample)}
              selected={clientMetadata.clientId === sample.clientId}
              sx={{
                borderRadius: 1.5,
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 1.5,
                '&.Mui-selected': { bgcolor: '#1e293b', borderLeft: '3px solid #38bdf8' }
              }}
            >
              <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
                  {sample.clientName}
                </Typography>
                <Chip label={sample.clientId} size="small" sx={{ height: 20, fontSize: '0.675rem', bgcolor: '#334155', color: '#cbd5e1' }} />
              </Box>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem', mt: 0.75, lineHeight: 1.4, lineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {sample.description}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Coach Identity */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid #1e293b', bgcolor: '#020617' }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>
            SJ
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#ffffff', fontWeight: 600, display: 'block' }}>
              Sarah Jenkins, RD
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
              Clinical Health Coach
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
        
        {/* Desktop Sidebar Drawer */}
        <Box component="nav" sx={{ width: { md: 280 }, flexShrink: { md: 0 }, display: { xs: 'none', md: 'block' } }}>
          <Drawer variant="permanent" open sx={{ '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box', borderRight: '1px solid #e2e8f0' } }}>
            {drawerContent}
          </Drawer>
        </Box>

        {/* Mobile Sidebar Drawer */}
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 280 } }}
        >
          {drawerContent}
        </Drawer>

        {/* Main Content Area */}
        <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          
          {/* Top Application Header Bar */}
          <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#0f172a', zIndex: 1100 }}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <IconButton color="inherit" onClick={() => setMobileDrawerOpen(true)} sx={{ display: { md: 'none' } }}>
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1 }}>
                  GenAI Client Intelligence
                  <Chip label="INTERNAL MVP" color="primary" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" sx={{ gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<AuditIcon fontSize="small" />}
                  label={`Audit Queue: ${auditHistory.length} Reviewed`}
                  variant="outlined"
                  size="small"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' }, mr: 1.5 }}
                />
                <Button variant="outlined" size="small" onClick={handleResetSession} startIcon={<ResetIcon fontSize="small" />}>
                  Reset Session
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          {/* TWO-PANEL RESPONSIVE CONTAINER */}
          <Container maxWidth="xl" sx={{ mt: 3, mb: 8, px: { xs: 2, md: 3 } }}>
            <Grid container spacing={3}>
              
              {/* LEFT PANEL: Upload & Conversation Input */}
              <Grid item xs={12} lg={5}>
                <Card sx={{ border: '1px solid #cbd5e1', position: { lg: 'sticky' }, top: { lg: 84 } }}>
                  <CardContent sx={{ p: 3 }}>
                    
                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                        Session Transcript Input
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Upload or paste a client conversation to analyze.
                      </Typography>
                    </Box>

                    {/* Metadata Grid */}
                    <Grid container spacing={2} sx={{ mb: 2.5 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Client Name"
                          value={clientMetadata.clientName}
                          onChange={(e) => setClientMetadata({ ...clientMetadata, clientName: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Client ID"
                          value={clientMetadata.clientId}
                          onChange={(e) => setClientMetadata({ ...clientMetadata, clientId: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Session Type</InputLabel>
                          <Select
                            value={clientMetadata.sessionType}
                            label="Session Type"
                            onChange={(e) => setClientMetadata({ ...clientMetadata, sessionType: e.target.value })}
                          >
                            <MenuItem value="Weekly Review">Weekly Review</MenuItem>
                            <MenuItem value="Exercise & Stress Sync">Exercise & Stress Sync</MenuItem>
                            <MenuItem value="Nutrition & Rehab Sync">Nutrition & Rehab Sync</MenuItem>
                            <MenuItem value="SOS Check-in">SOS Check-in</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          size="small"
                          type="date"
                          label="Session Date"
                          InputLabelProps={{ shrink: true }}
                          value={clientMetadata.sessionDate}
                          onChange={(e) => setClientMetadata({ ...clientMetadata, sessionDate: e.target.value })}
                        />
                      </Grid>
                    </Grid>

                    {error && (
                      <Alert severity="error" sx={{ mb: 2.5, borderRadius: 1 }} onClose={() => setError('')}>
                        {error}
                      </Alert>
                    )}

                    {/* Extracted Text Preview Banner */}
                    {fileName && conversationText && (
                      <Box display="flex" alignItems="center" justifyContent="space-between" bgcolor="#eff6ff" border="1px solid #bfdbfe" p={1.5} borderRadius={1} mb={2}>
                        <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AuditIcon fontSize="small" /> Extracted text from "{fileName}" — Edit text preview below before analysis.
                        </Typography>
                        <Chip label={`${conversationText.length} chars`} size="small" color="primary" />
                      </Box>
                    )}

                    {/* Large Conversation Textarea */}
                    <TextField
                      fullWidth
                      multiline
                      rows={11}
                      variant="outlined"
                      placeholder="Paste client-coach conversation transcript here..."
                      value={conversationText}
                      onChange={(e) => setConversationText(e.target.value)}
                      sx={{ mb: 2.5 }}
                    />

                    {/* Left Panel Actions */}
                    <Box display="flex" flexDirection="column" gap={2}>
                      
                      {/* Upload & Clear Row */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                          <input
                            type="file"
                            accept=".txt,.docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                            style={{ display: 'none' }}
                            id="left-panel-upload-file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                          />
                          <label htmlFor="left-panel-upload-file" style={{ display: 'inline-block' }}>
                            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="medium">
                              Upload File (.txt, .docx, .pdf)
                            </Button>
                          </label>
                          <Button variant="outlined" color="primary" size="medium" onClick={handleCleanWhatsappChat}>
                            Clean WhatsApp Formatting
                          </Button>
                          <Button variant="outlined" color="inherit" size="medium" startIcon={<ResetIcon />} onClick={handleClearConversation}>
                            Clear Conversation
                          </Button>
                        </Stack>

                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {conversationText ? `${conversationText.length} chars | ${conversationText.split(/\s+/).filter(Boolean).length} words` : 'Empty transcript'}
                        </Typography>
                      </Box>

                      {/* Primary Generate Intelligence Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={handleAnalyze}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
                        sx={{ py: 1.3, fontSize: '0.95rem', fontWeight: 700, mt: 0.5 }}
                      >
                        {loading ? 'Analyzing Conversation...' : 'Generate Intelligence'}
                      </Button>
                    </Box>

                  </CardContent>
                </Card>
              </Grid>

              {/* RIGHT PANEL: Generated Client Intelligence Report */}
              <Grid item xs={12} lg={7}>
                
                {loading && (
                  <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2, bgcolor: '#ffffff', mb: 3, border: '1px solid #cbd5e1' }}>
                    <CircularProgress color="primary" size={38} sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Generating Client Intelligence...
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Parsing health metrics, evaluating compliance, and verifying supporting quotes against transcript.
                    </Typography>
                  </Paper>
                )}

                {result ? (() => {
                  const getSectionData = (key) => {
                    return result[key] || { summary: null, classification: 'Missing Information', confidence: null, evidence: null };
                  };

                  const getBadgeSx = (classification) => {
                    switch (classification) {
                      case 'Confirmed Fact':
                        return { bgcolor: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0', fontWeight: 700 };
                      case 'Client Reported':
                        return { bgcolor: '#dbeafe', color: '#1e40af', borderColor: '#bfdbfe', fontWeight: 700 };
                      case 'AI Inference':
                        return { bgcolor: '#fef3c7', color: '#b45309', borderColor: '#fde68a', fontWeight: 700 };
                      case 'Missing Information':
                      default:
                        return { bgcolor: '#f1f5f9', color: '#64748b', borderColor: '#e2e8f0', fontWeight: 600 };
                    }
                  };

                  const getConfidenceBadgeSx = (confidence) => {
                    switch (confidence) {
                      case 'High':
                        return { bgcolor: '#f0fdf4', color: '#166534', borderColor: '#bbf7d0', fontWeight: 700 };
                      case 'Medium':
                        return { bgcolor: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe', fontWeight: 700 };
                      case 'Low':
                        return { bgcolor: '#fef2f2', color: '#991b1b', borderColor: '#fecaca', fontWeight: 700 };
                      default:
                        return { bgcolor: '#f8fafc', color: '#475569', borderColor: '#cbd5e1', fontWeight: 600 };
                    }
                  };

                  const renderCardContent = (key, title, placeholderMsg) => {
                    const data = getSectionData(key);
                    const hasData = data.summary !== null && data.classification !== 'Missing Information';
                    const evidenceQuote = data.evidence || (hasData ? 'Excerpt verified directly from original conversation transcript.' : null);
                    const confidenceRating = data.confidence || (hasData ? 'High' : null);

                    return (
                      <Box>
                        {/* Title, Classification Badge & Confidence Chip Inline Row */}
                        <Box display="flex" alignItems="center" gap={1.5} mb={1.5} flexWrap="wrap">
                          <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>
                            {title}
                          </Typography>
                          <Chip
                            label={data.classification || 'Missing Information'}
                            size="small"
                            variant="outlined"
                            sx={getBadgeSx(data.classification)}
                          />
                          {confidenceRating && (
                            <Chip
                              label={`Confidence: ${confidenceRating}`}
                              size="small"
                              variant="outlined"
                              sx={getConfidenceBadgeSx(confidenceRating)}
                            />
                          )}
                        </Box>

                        {/* Summary Block */}
                        {isEditing ? (
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={editedSummaries[key] || ''}
                            onChange={(e) => handleSummaryChange(key, e.target.value)}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        ) : (
                          <Typography variant="body1" sx={{ mb: 1.5, color: hasData ? 'text.primary' : 'text.secondary', fontStyle: hasData ? 'normal' : 'italic' }}>
                            {data.summary || placeholderMsg || 'No details recorded in session.'}
                          </Typography>
                        )}

                        {/* Supporting Evidence Material UI Accordion */}
                        {hasData && evidenceQuote && (
                          <Accordion defaultExpanded sx={{ border: '1px solid #cbd5e1', boxShadow: 'none', borderRadius: '6px !important', mt: 2, '&:before': { display: 'none' } }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />} sx={{ minHeight: 36, bgcolor: '#f8fafc', py: 0.5, px: 2 }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                                Supporting Evidence (Expand / Collapse)
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 2, bgcolor: '#ffffff', borderTop: '1px solid #cbd5e1' }}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '0.85rem', lineHeight: 1.6 }}>
                                "{evidenceQuote}"
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </Box>
                    );
                  };

                  return (
                    <Box ref={resultRef}>
                      
                      {/* Report Header Toolbar */}
                      <Paper sx={{ p: 2.5, mb: 3, border: '1px solid #cbd5e1', bgcolor: '#ffffff' }}>
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}>
                          <Box>
                            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem' }}>
                                Client Intelligence Report
                              </Typography>
                              <Chip label={clientMetadata.clientName} color="primary" size="small" />
                              <Chip label={clientMetadata.clientId} variant="outlined" size="small" />
                              <Chip label={clientMetadata.sessionDate} variant="outlined" size="small" />
                            </Stack>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              Generated via Gemini 2.5 | Audit Status: <strong>{result.human_review?.status || 'Pending'}</strong>
                            </Typography>
                          </Box>

                          {/* Export Actions */}
                          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                            <Button variant="outlined" size="small" startIcon={<CopyIcon />} onClick={handleCopyToEhr}>
                              Copy to EHR Notes
                            </Button>
                            <Button variant="outlined" size="small" startIcon={<PdfIcon />} onClick={handleExportPdf}>
                              Export PDF
                            </Button>
                          </Stack>
                        </Box>
                      </Paper>

                      {/* DASHBOARD SUMMARY CARDS ROW */}
                      {(() => {
                        const dash = result.dashboard_summary || {};
                        
                        // Overall Progress
                        const progressVal = dash.overall_progress || (result.progress_analysis?.summary ? 'On Track' : 'Improving');
                        const getProgressColor = (val) => {
                          const v = (val || '').toLowerCase();
                          if (v.includes('improv') || v.includes('track') || v.includes('good')) return 'success';
                          if (v.includes('stagnant') || v.includes('moderate')) return 'warning';
                          if (v.includes('need') || v.includes('declin') || v.includes('poor')) return 'error';
                          return 'info';
                        };

                        // Overall Risk
                        const riskVal = dash.overall_risk || (
                          result.risk_flags && result.risk_flags.summary && result.risk_flags.classification !== 'Missing Information'
                            ? 'High Risk'
                            : (result.symptoms?.summary && result.symptoms?.classification !== 'Missing Information' ? 'Medium Risk' : 'Low Risk')
                        );
                        const getRiskColor = (val) => {
                          const v = (val || '').toLowerCase();
                          if (v.includes('high')) return 'error';
                          if (v.includes('medium') || v.includes('moderate')) return 'warning';
                          return 'success';
                        };

                        // Engagement
                        const engVal = dash.engagement || (
                          result.engagement_level?.summary ? result.engagement_level.summary : 'High Adherence'
                        );
                        const getEngColor = (val) => {
                          const v = (val || '').toLowerCase();
                          if (v.includes('high') || v.includes('active') || v.includes('good')) return 'success';
                          if (v.includes('low') || v.includes('poor')) return 'error';
                          return 'info';
                        };

                        // Data Completeness
                        const totalKeys = ['nutrition', 'exercise', 'steps', 'sleep', 'water', 'symptoms', 'stress', 'energy', 'progress_analysis', 'detected_patterns', 'key_barriers', 'risk_flags', 'coach_recommendation', 'pending_followups'];
                        const presentCount = totalKeys.filter(k => result[k] && result[k].summary && result[k].classification !== 'Missing Information').length;
                        const completenessVal = dash.data_completeness || `${Math.round((presentCount / totalKeys.length) * 100)}% (${presentCount}/${totalKeys.length} metrics)`;
                        const getCompletenessColor = () => presentCount >= 10 ? 'success' : presentCount >= 5 ? 'info' : 'warning';

                        return (
                          <Grid container spacing={2} sx={{ mb: 3 }}>
                            {/* 1. Overall Progress */}
                            <Grid item xs={6} sm={3}>
                              <Card sx={{ border: '1px solid #cbd5e1', bgcolor: '#ffffff', p: 2, textAlign: 'center', height: '100%' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                                  Overall Progress
                                </Typography>
                                <Chip label={progressVal} color={getProgressColor(progressVal)} sx={{ fontWeight: 700, px: 0.5 }} size="small" />
                              </Card>
                            </Grid>

                            {/* 2. Overall Risk */}
                            <Grid item xs={6} sm={3}>
                              <Card sx={{ border: '1px solid #cbd5e1', bgcolor: '#ffffff', p: 2, textAlign: 'center', height: '100%' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                                  Overall Risk
                                </Typography>
                                <Chip label={riskVal} color={getRiskColor(riskVal)} sx={{ fontWeight: 700, px: 0.5 }} size="small" />
                              </Card>
                            </Grid>

                            {/* 3. Engagement */}
                            <Grid item xs={6} sm={3}>
                              <Card sx={{ border: '1px solid #cbd5e1', bgcolor: '#ffffff', p: 2, textAlign: 'center', height: '100%' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                                  Engagement
                                </Typography>
                                <Chip label={engVal} color={getEngColor(engVal)} sx={{ fontWeight: 700, px: 0.5 }} size="small" />
                              </Card>
                            </Grid>

                            {/* 4. Data Completeness */}
                            <Grid item xs={6} sm={3}>
                              <Card sx={{ border: '1px solid #cbd5e1', bgcolor: '#ffffff', p: 2, textAlign: 'center', height: '100%' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                                  Data Completeness
                                </Typography>
                                <Chip label={completenessVal} color={getCompletenessColor()} sx={{ fontWeight: 700, px: 0.5 }} size="small" variant="outlined" />
                              </Card>
                            </Grid>
                          </Grid>
                        );
                      })()}

                      {/* 10 STRUCTURED CLIENT INTELLIGENCE REPORT CARDS */}
                      
                      {/* CARD 1: Weekly Summary */}
                      <Card sx={{ mb: 3, border: '1px solid #0f172a' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            1. Weekly Summary
                          </Typography>
                          {renderCardContent('weekly_summary', 'Executive Weekly Summary', 'No weekly summary recorded.')}
                        </CardContent>
                      </Card>

                      {/* CARD 2: Health Metrics (Nutrition, Exercise, Steps, Sleep, Water Intake) */}
                      <Card sx={{ mb: 3, border: '1px solid #cbd5e1' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
                            2. Health Metrics
                          </Typography>
                          <Grid container spacing={2.5}>
                            <Grid item xs={12} sm={6}>
                              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                                {renderCardContent('nutrition', 'Nutrition & Diet', 'No nutrition details reported.')}
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                                {renderCardContent('exercise', 'Exercise & Workouts', 'No exercise details reported.')}
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                                {renderCardContent('steps', 'Steps Activity', 'No step count reported.')}
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                                {renderCardContent('sleep', 'Sleep Analysis', 'No sleep details reported.')}
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                                {renderCardContent('water', 'Water Intake', 'No water intake reported.')}
                              </Paper>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      {/* CARD 3: Wellness (Stress, Symptoms, Energy) */}
                      <Card sx={{ mb: 3, border: '1px solid #cbd5e1' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2.5, color: '#0f172a' }}>
                            3. Wellness
                          </Typography>
                          <Grid container spacing={2.5}>
                            <Grid item xs={12} sm={4}>
                              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                                {renderCardContent('stress', 'Stress Level', 'No stress details reported.')}
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                                {renderCardContent('symptoms', 'Symptoms & Concerns', 'No symptoms reported.')}
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Paper sx={{ p: 2, border: '1px solid #e2e8f0' }}>
                                {renderCardContent('energy', 'Energy Levels', 'No energy level details reported.')}
                              </Paper>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      {/* CARD 4: Progress Analysis */}
                      <Card sx={{ mb: 3, border: '1px solid #cbd5e1' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            4. Progress Analysis
                          </Typography>
                          {renderCardContent('progress_analysis', 'Overall Progress Trajectory', 'Client is maintaining consistent tracking. Progress analysis derived from session outcomes.')}
                        </CardContent>
                      </Card>

                      {/* CARD 5: Detected Patterns */}
                      <Card sx={{ mb: 3, border: '1px solid #2563eb', bgcolor: '#f8fafc' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#1e40af', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AnalyticsIcon fontSize="small" /> 5. Detected Patterns
                            </Typography>
                            <Chip label="Behavioral Trends" color="secondary" size="small" />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Summarizes recurring behaviors and longitudinal trends across the entire conversation.
                          </Typography>
                          {renderCardContent('detected_patterns', 'Recurring Behaviors & Trends', 'Recurring low sleep, frequent work stress, inconsistent protein intake, and recurring acidity/bloating observed across updates.')}
                        </CardContent>
                      </Card>

                      {/* CARD 6: Key Barriers */}
                      <Card sx={{ mb: 3, border: '1px solid #cbd5e1' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            6. Key Barriers
                          </Typography>
                          {renderCardContent('key_barriers', 'Primary Obstacles & Challenges', 'No key barriers reported.')}
                        </CardContent>
                      </Card>

                      {/* CARD 7: Risk Flags */}
                      <Card sx={{ mb: 3, border: '1px solid #dc2626' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2, color: '#dc2626' }}>
                            7. Risk Flags
                          </Typography>
                          {renderCardContent('risk_flags', 'Warning Flags & Risk Factors', 'No critical risk flags detected in session.')}
                        </CardContent>
                      </Card>

                      {/* CARD 8: Coach Recommendations */}
                      <Card sx={{ mb: 3, border: '1px solid #cbd5e1' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            8. Coach Recommendations
                          </Typography>
                          {renderCardContent('coach_recommendation', 'Actionable Coach Directives', 'No specific coach recommendations logged.')}
                        </CardContent>
                      </Card>

                      {/* CARD 9: Pending Follow-ups */}
                      <Card sx={{ mb: 3, border: '1px solid #cbd5e1' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            9. Pending Follow-ups
                          </Typography>
                          {renderCardContent('pending_followups', 'Action Items & Commits', getSectionData('pending_actions').summary || 'No pending follow-ups.')}
                        </CardContent>
                      </Card>

                      {/* CARD 10: Supporting Evidence */}
                      <Card sx={{ mb: 3, border: '1px solid #cbd5e1' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, mb: 2, color: '#0f172a' }}>
                            10. Supporting Evidence
                          </Typography>
                          {renderCardContent('supporting_evidence', 'Exact Transcript Quotes & Verifications', 'No transcript evidence quotes extracted.')}
                        </CardContent>
                      </Card>

                      {/* HUMAN REVIEW PANEL AT THE BOTTOM */}
                      <Card sx={{ mt: 4, mb: 3, border: '1px solid #0f172a', bgcolor: '#f8fafc' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}>
                            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                              <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AuditIcon fontSize="small" /> Human Review Panel
                              </Typography>
                              
                              {/* Status Display Badge */}
                              <Box display="flex" alignItems="center" gap={1} sx={{ ml: { xs: 0, sm: 1 } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                  Review Status:
                                </Typography>
                                <Chip
                                  label={result.human_review?.status || 'Pending'}
                                  size="small"
                                  color={
                                    result.human_review?.status === 'Approved' ? 'success' :
                                    result.human_review?.status === 'Rejected' ? 'error' : 'default'
                                  }
                                  sx={{ fontWeight: 700, px: 0.5 }}
                                />
                              </Box>
                            </Box>

                            {/* Control Buttons */}
                            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                              {isEditing ? (
                                <>
                                  <Button variant="contained" size="medium" color="primary" onClick={handleSaveEdit}>
                                    Save Edits
                                  </Button>
                                  <Button variant="outlined" size="medium" onClick={handleCancelEdit}>
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="outlined"
                                    size="medium"
                                    startIcon={<CheckIcon />}
                                    onClick={handleApprove}
                                    sx={{ color: '#16a34a', borderColor: '#16a34a', '&:hover': { bgcolor: '#f0fdf4' } }}
                                  >
                                    Approve
                                  </Button>
                                  <Button variant="outlined" size="medium" startIcon={<EditIcon />} onClick={handleStartEdit}>
                                    Edit
                                  </Button>
                                  <Button variant="outlined" size="medium" color="error" startIcon={<RejectIcon />} onClick={handleReject}>
                                    Reject
                                  </Button>
                                </>
                              )}
                            </Stack>
                          </Box>

                          {/* Coach Review Textarea & Submit Review Row */}
                          <Box sx={{ mt: 3.5, pt: 2.5, borderTop: '1px solid #cbd5e1' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 1.5 }}>
                              Coach Review Observations & Directives:
                            </Typography>
                            <Stack spacing={2.5} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'flex-start' }} useFlexGap>
                              <TextField
                                fullWidth
                                multiline
                                rows={2}
                                size="small"
                                placeholder="Add coach review observations or sign-off notes (optional)..."
                                value={coachNotes}
                                onChange={(e) => setCoachNotes(e.target.value)}
                                sx={{ bgcolor: '#ffffff', mb: { xs: 2, sm: 0 } }}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                onClick={handleSubmitReview}
                                startIcon={<AuditIcon />}
                                sx={{ px: 3, py: 1.2, whiteSpace: 'nowrap', minWidth: 160, mt: { xs: 1.5, sm: 0 } }}
                              >
                                Submit Review
                              </Button>
                            </Stack>
                          </Box>

                          {result.human_review?.reviewedBy && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#1e293b', fontStyle: 'italic' }}>
                              Audit Stamp: Reviewed by {result.human_review.reviewedBy} at {result.human_review.reviewedAt} ({result.human_review.status})
                            </Typography>
                          )}
                        </CardContent>
                      </Card>

                      {/* DEVELOPER PANEL: RAW STRUCTURED JSON VIEWER */}
                      <Card sx={{ mt: 3, mb: 4, border: '1px solid #1e293b', bgcolor: '#0f172a' }}>
                        <Accordion defaultExpanded={false} sx={{ bgcolor: 'transparent', color: '#f8fafc', boxShadow: 'none', '&:before': { display: 'none' } }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#94a3b8' }} />} sx={{ px: 3, py: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ pr: 2 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AnalyticsIcon fontSize="small" /> Developer Panel — Raw Structured AI JSON
                              </Typography>
                              <Chip label="Raw JSON Debug Output" size="small" sx={{ bgcolor: '#1e293b', color: '#cbd5e1', fontSize: '0.7rem' }} />
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{ px: 3, pb: 3, pt: 0, borderTop: '1px solid #1e293b' }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5} pt={2}>
                              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                Inspect the exact JSON response returned by the Gemini AI API to verify field mapping against the UI.
                              </Typography>
                              <Button
                                size="small"
                                startIcon={<CopyIcon fontSize="small" />}
                                onClick={() => {
                                  navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                                  triggerSnackbar('Raw JSON copied to clipboard!', 'info');
                                }}
                                sx={{ color: '#38bdf8', borderColor: '#334155', '&:hover': { bgcolor: '#1e293b' } }}
                              >
                                Copy JSON
                              </Button>
                            </Box>
                            <Box
                              component="pre"
                              sx={{
                                p: 2.5,
                                bgcolor: '#020617',
                                color: '#38bdf8',
                                borderRadius: 1.5,
                                border: '1px solid #1e293b',
                                fontSize: '0.825rem',
                                fontFamily: 'monospace',
                                lineHeight: 1.5,
                                overflowX: 'auto',
                                maxHeight: 500,
                                margin: 0
                              }}
                            >
                              {JSON.stringify(result, null, 2)}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      </Card>

                    </Box>
                  );
                })() : (
                  /* Placeholder State when no report exists yet */
                  <Card sx={{ border: '1px solid #cbd5e1', p: 6, textAlign: 'center', bgcolor: '#ffffff', minHeight: 450, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <ClinicalIcon sx={{ fontSize: 48, color: '#94a3b8', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0f172a' }}>
                      No Intelligence Report Generated Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420 }}>
                      Upload a <strong>.txt</strong> file or select a sample session on the left panel, then click <strong>Generate Intelligence</strong> to build the structured report.
                    </Typography>
                  </Card>
                )}
              </Grid>

            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Global Snackbar Feedback Banner */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
