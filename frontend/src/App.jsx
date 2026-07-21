import React, { useState, useRef } from 'react';
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
  Badge
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
  FormatListBulleted as ListIcon
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

// Configure a clean, high-density clinical internal dashboard theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a', // Slate 900
      light: '#334155',
      dark: '#020617',
    },
    secondary: {
      main: '#2563eb', // Blue 600
    },
    background: {
      default: '#f8fafc', // Slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
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

  const handleExportJson = () => {
    if (!result) return;
    const jsonStr = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Clinical_Intelligence_${clientMetadata.clientId.replace('#', '')}_${clientMetadata.sessionDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerSnackbar('Exported structured clinical JSON report.', 'info');
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
                      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1.5}>
                        <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                          <input
                            type="file"
                            accept=".txt"
                            style={{ display: 'none' }}
                            id="left-panel-upload-file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                          />
                          <label htmlFor="left-panel-upload-file" style={{ marginRight: '8px', display: 'inline-block' }}>
                            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="medium">
                              Upload .txt
                            </Button>
                          </label>
                          <Button variant="outlined" color="inherit" size="medium" startIcon={<ResetIcon />} onClick={handleClearConversation}>
                            Clear Conversation
                          </Button>
                        </Box>

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

                  const renderCardContent = (key, title, placeholderMsg) => {
                    const data = getSectionData(key);
                    const hasData = data.summary !== null && data.classification !== 'Missing Information';
                    const evidenceQuote = data.evidence || (hasData ? 'Excerpt verified directly from original conversation transcript.' : null);

                    return (
                      <Box>
                        {/* Title & Classification Badge Inline Row */}
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
                          {data.confidence && (
                            <Chip label={`Confidence: ${data.confidence}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
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
                            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem' }}>
                                Client Intelligence Report
                              </Typography>
                              <Chip label={clientMetadata.clientName} color="primary" size="small" />
                              <Chip label={clientMetadata.clientId} variant="outlined" size="small" />
                              <Chip label={clientMetadata.sessionDate} variant="outlined" size="small" />
                            </Box>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              Generated via Gemini 2.5 | Audit Status: <strong>{result.human_review?.status || 'Pending'}</strong>
                            </Typography>
                          </Box>

                          {/* Export Actions */}
                          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                            <Button variant="outlined" size="small" startIcon={<CopyIcon />} onClick={handleCopyToEhr}>
                              Copy to EHR Notes
                            </Button>
                            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportJson}>
                              Export JSON
                            </Button>
                          </Box>
                        </Box>
                      </Paper>

                      {/* Human Review Audit Panel */}
                      <Paper sx={{ p: 2.5, mb: 3, border: '1px solid #0f172a', bgcolor: '#f8fafc' }}>
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <AuditIcon fontSize="small" /> Human Clinical Audit Sign-Off
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Review AI extraction accuracy, edit text summaries inline, and sign off for clinical records.
                            </Typography>
                          </Box>

                          {/* Action Buttons */}
                          <Box display="flex" gap={1.5} alignItems="center" flexWrap="wrap">
                            {isEditing ? (
                              <>
                                <Button variant="contained" size="small" color="primary" onClick={handleSaveEdit}>
                                  Save Edits
                                </Button>
                                <Button variant="outlined" size="small" onClick={handleCancelEdit}>
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<CheckIcon />}
                                  onClick={handleApprove}
                                  sx={{ color: '#16a34a', borderColor: '#16a34a', '&:hover': { bgcolor: '#f0fdf4' } }}
                                >
                                  Approve
                                </Button>
                                <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={handleStartEdit}>
                                  Edit
                                </Button>
                                <Button variant="outlined" size="small" color="error" startIcon={<RejectIcon />} onClick={handleReject}>
                                  Reject
                                </Button>
                              </>
                            )}
                          </Box>
                        </Box>

                        {/* Coach Notes Input */}
                        <Box mt={2}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Add clinical coach notes or sign-off observations (optional)..."
                            value={coachNotes}
                            onChange={(e) => setCoachNotes(e.target.value)}
                            sx={{ bgcolor: '#ffffff' }}
                          />
                        </Box>

                        {result.human_review?.reviewedBy && (
                          <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: '#1e293b', fontStyle: 'italic' }}>
                            Audit Stamp: Reviewed by {result.human_review.reviewedBy} at {result.human_review.reviewedAt} ({result.human_review.status})
                          </Typography>
                        )}
                      </Paper>

                      {/* 9 STRUCTURED CLIENT INTELLIGENCE REPORT CARDS */}
                      
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
