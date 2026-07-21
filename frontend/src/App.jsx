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
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
          borderRadius: 6,
          transition: 'border-color 0.15s ease',
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
  const [dualPaneView, setDualPaneView] = useState(false);
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
    setResult(null);
    setIsEditing(false);
    triggerSnackbar(`Loaded session preset for ${sample.clientName}`, 'info');
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
      triggerSnackbar(`File "${file.name}" uploaded successfully`, 'success');
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setConversationText('');
    setFileName('');
    setError('');
    setResult(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerSnackbar = (msg, severity = 'info') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleAnalyze = async () => {
    if (loading) return; // Prevent duplicate requests

    if (!conversationText.trim()) {
      setError('Please paste a coaching transcript or select a sample session.');
      triggerSnackbar('Transcript text cannot be empty.', 'error');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setIsEditing(false);

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
        } catch (e) {
          // Ignore json parse error
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResult(data);
      triggerSnackbar('Client intelligence generated successfully!', 'success');
      
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
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
          <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#0f172a' }}>
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

              <Box display="flex" alignItems="center" sx={{ gap: 2.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={<AuditIcon fontSize="small" />}
                  label={`Audit Queue: ${auditHistory.length} Reviewed`}
                  variant="outlined"
                  size="small"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' }, mr: 2 }}
                />
                <Button variant="outlined" size="small" onClick={handleClear} startIcon={<ResetIcon fontSize="small" />}>
                  Reset Session
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl" sx={{ mt: 3, mb: 8, px: { xs: 2, md: 4 } }}>
            
            {/* Session Metadata & Input Card */}
            <Card sx={{ mb: 4, border: '1px solid #cbd5e1' }}>
              <CardContent sx={{ p: 4 }}>
                
                {/* Header & Subtitle */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                    Client Session Configuration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Attach client metadata and paste coaching conversation transcript below.
                  </Typography>
                </Box>

                {/* Metadata Fields Row */}
                <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Client Name"
                      value={clientMetadata.clientName}
                      onChange={(e) => setClientMetadata({ ...clientMetadata, clientName: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Client ID"
                      value={clientMetadata.clientId}
                      onChange={(e) => setClientMetadata({ ...clientMetadata, clientId: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
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
                  <Grid item xs={12} sm={3}>
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
                  <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }} onClose={() => setError('')}>
                    {error}
                  </Alert>
                )}

                {/* Transcript Input Area */}
                <TextField
                  fullWidth
                  multiline
                  rows={7}
                  variant="outlined"
                  placeholder="Paste client-coach conversation transcript here..."
                  value={conversationText}
                  onChange={(e) => setConversationText(e.target.value)}
                  sx={{ mb: 3 }}
                />

                {/* Toolbar Controls */}
                <Box
                  display="flex"
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  sx={{ gap: 3, pt: 1, mt: 1 }}
                >
                  <Box display="flex" alignItems="center" flexWrap="wrap" sx={{ gap: 2.5, rowGap: 2 }}>
                    <input
                      type="file"
                      accept=".txt"
                      style={{ display: 'none' }}
                      id="contained-button-file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="contained-button-file" style={{ marginRight: '16px', marginBottom: '8px', display: 'inline-block' }}>
                      <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} size="medium" sx={{ px: 2.5, py: 0.85 }}>
                        Upload .txt
                      </Button>
                    </label>
                    {fileName && <Chip icon={<FileIcon fontSize="small" />} label={fileName} onDelete={handleClear} size="small" variant="outlined" sx={{ mr: 2, mb: 1 }} />}
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.825rem', whiteSpace: 'nowrap', mb: 1 }}>
                      {conversationText ? `${conversationText.length} characters | ${conversationText.split(/\s+/).filter(Boolean).length} words` : 'Empty transcript'}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon fontSize="small" />}
                    sx={{ px: 3.5, py: 1.1, fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', mt: { xs: 1.5, sm: 0 } }}
                  >
                    {loading ? 'Analyzing...' : 'Generate AI Intelligence'}
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Loading Indicator */}
            {loading && (
              <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 2, bgcolor: '#ffffff', mb: 4 }}>
                <CircularProgress color="primary" size={36} sx={{ mb: 2 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Analyzing conversation...
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Parsing health metrics, evaluating compliance, and verifying supporting quotes against transcript.
                </Typography>
              </Paper>
            )}

            {/* Structured Clinical Intelligence Results Workspace */}
            {result && (() => {
              const cardConfigs = [
                { key: 'nutrition', title: 'Nutrition & Diet', category: 'vitals' },
                { key: 'exercise', title: 'Exercise & Workouts', category: 'vitals' },
                { key: 'steps', title: 'Steps Activity', category: 'vitals' },
                { key: 'sleep', title: 'Sleep Analysis', category: 'vitals' },
                { key: 'water', title: 'Hydration & Water', category: 'vitals' },
                { key: 'symptoms', title: 'Symptoms & Concerns', category: 'vitals' },
                { key: 'stress', title: 'Stress & Well-being', category: 'vitals' },
                { key: 'engagement_level', title: 'Engagement Level', category: 'overview' },
                { key: 'key_barriers', title: 'Key Barriers', category: 'overview' },
                { key: 'pending_actions', title: 'Pending Actions', category: 'action' },
                { key: 'risk_flags', title: 'Risk Flags & Warnings', category: 'overview' },
                { key: 'coach_recommendation', title: 'Coach Recommendations', category: 'action' }
              ];

              const summaryData = result.weekly_summary || { summary: null, classification: 'Missing Information', confidence: null, evidence: null };
              const evidenceData = result.supporting_evidence || { summary: null, classification: 'Missing Information', confidence: null, evidence: null };

              // Helper calculations for overall triage status
              const getOverallHealthStatus = () => {
                const hasRisk = result.risk_flags && result.risk_flags.summary && result.risk_flags.classification !== 'Missing Information';
                const hasSymptoms = result.symptoms && result.symptoms.summary && result.symptoms.classification !== 'Missing Information';
                if (hasRisk) return { label: 'Needs Attention', color: 'error' };
                if (hasSymptoms) return { label: 'Monitoring', color: 'warning' };
                return { label: 'Stable / Good', color: 'success' };
              };

              const getOverallEngagementStatus = () => {
                const eng = result.engagement_level;
                if (!eng || !eng.summary || eng.classification === 'Missing Information') return { label: 'Not Measured', color: 'default' };
                const sum = eng.summary.toLowerCase();
                if (sum.includes('high') || sum.includes('excellent') || sum.includes('good') || sum.includes('active') || sum.includes('enthusiastic')) {
                  return { label: 'High Adherence', color: 'success' };
                }
                if (sum.includes('low') || sum.includes('struggle') || sum.includes('poor')) return { label: 'Low Adherence', color: 'error' };
                return { label: 'Moderate', color: 'info' };
              };

              const getOverallRiskStatus = () => {
                const risk = result.risk_flags;
                const symptoms = result.symptoms;
                const barriers = result.key_barriers;
                const hasRisk = risk && risk.summary && risk.classification !== 'Missing Information';
                const hasBarriersOrSymptoms = (symptoms && symptoms.summary && symptoms.classification !== 'Missing Information') ||
                                             (barriers && barriers.summary && barriers.classification !== 'Missing Information');
                if (hasRisk) return { label: 'High Risk', color: 'error' };
                if (hasBarriersOrSymptoms) return { label: 'Medium Risk', color: 'warning' };
                return { label: 'Low Risk', color: 'success' };
              };

              return (
                <Box ref={resultRef}>
                  
                  {/* Results Header Toolbar */}
                  <Paper sx={{ p: 2.5, mb: 3, border: '1px solid #cbd5e1', bgcolor: '#ffffff' }}>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} gap={2}>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.15rem' }}>
                            Clinical Intelligence Report
                          </Typography>
                          <Chip label={clientMetadata.clientName} color="primary" size="small" />
                          <Chip label={clientMetadata.clientId} variant="outlined" size="small" />
                          <Chip label={clientMetadata.sessionDate} variant="outlined" size="small" />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Generated via Gemini 2.5 | Audit Status: <strong>{result.human_review?.status || 'Pending'}</strong>
                        </Typography>
                      </Box>

                      {/* Header Actions & Dual Pane Switch */}
                      <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                        <FormControlLabel
                          control={
                            <Switch
                              checked={dualPaneView}
                              onChange={(e) => setDualPaneView(e.target.checked)}
                              color="primary"
                              size="small"
                            />
                          }
                          label={<Typography variant="body2" sx={{ fontWeight: 600 }}>Split View (Side-by-Side)</Typography>}
                        />
                        <Button variant="outlined" size="small" startIcon={<CopyIcon />} onClick={handleCopyToEhr}>
                          Copy to EHR Notes
                        </Button>
                        <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={handleExportJson}>
                          Export JSON
                        </Button>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Summary Triage Row */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          Overall Health Status
                        </Typography>
                        <Box mt={1}>
                          <Chip label={getOverallHealthStatus().label} color={getOverallHealthStatus().color} sx={{ fontWeight: 700, px: 1 }} />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          Client Engagement Level
                        </Typography>
                        <Box mt={1}>
                          <Chip label={getOverallEngagementStatus().label} color={getOverallEngagementStatus().color} sx={{ fontWeight: 700, px: 1 }} />
                        </Box>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                          Risk Rating
                        </Typography>
                        <Box mt={1}>
                          <Chip label={getOverallRiskStatus().label} color={getOverallRiskStatus().color} sx={{ fontWeight: 700, px: 1 }} />
                        </Box>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Human Review Audit Panel */}
                  <Paper sx={{ p: 2.5, mb: 4, border: '1px solid #0f172a', bgcolor: '#f8fafc' }}>
                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} gap={2}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AuditIcon fontSize="small" /> Human Clinical Audit Sign-Off
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Review AI extraction accuracy, edit text summaries inline, and sign off for clinical records.
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
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
                              Edit Summaries
                            </Button>
                            <Button variant="outlined" size="small" color="error" startIcon={<RejectIcon />} onClick={handleReject}>
                              Reject / Revise
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

                  {/* Dual Pane Layout (Side-by-Side Split View) OR Standard Tabs View */}
                  <Grid container spacing={3}>
                    
                    {/* Left Split Pane: Raw Transcript text (Only when Dual Pane View is ON) */}
                    {dualPaneView && (
                      <Grid item xs={12} lg={5}>
                        <Paper sx={{ p: 2.5, height: '100%', border: '1px solid #cbd5e1', bgcolor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AssignmentIcon fontSize="small" /> Raw Conversation Transcript
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                            Compare AI evidence quotes against the source transcript side-by-side.
                          </Typography>
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: '#f1f5f9',
                              borderRadius: 1,
                              border: '1px solid #e2e8f0',
                              fontFamily: 'monospace',
                              fontSize: '0.825rem',
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                              overflowY: 'auto',
                              maxHeight: 700,
                              flexGrow: 1
                            }}
                          >
                            {conversationText}
                          </Box>
                        </Paper>
                      </Grid>
                    )}

                    {/* Right Split Pane: Categorized Intelligence Cards */}
                    <Grid item xs={12} lg={dualPaneView ? 7 : 12}>
                      
                      {/* Workspace Navigation Tabs */}
                      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} indicatorColor="primary" textColor="primary">
                          <Tab label="Executive & Risk" />
                          <Tab label="Vitals & Lifestyle" />
                          <Tab label="Action Plan & Evidence" />
                          <Tab label="All 14 Metrics" />
                        </Tabs>
                      </Box>

                      {/* Tab 0: Executive & Risk */}
                      {(activeTab === 0 || activeTab === 3) && (
                        <Grid container spacing={3} sx={{ mb: 3 }}>
                          {/* Weekly Summary Card */}
                          <Grid item xs={12}>
                            <Card sx={{ border: '1px solid #0f172a' }}>
                              <CardContent sx={{ p: 3 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={1.5}>
                                  <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700 }}>
                                    Weekly Summary
                                  </Typography>
                                  <Box display="flex" gap={1}>
                                    <Chip label={summaryData.classification} size="small" color={getBadgeColor(summaryData.classification)} />
                                    {summaryData.confidence && <Chip label={`Confidence: ${summaryData.confidence}`} size="small" variant="outlined" />}
                                  </Box>
                                </Box>

                                {isEditing ? (
                                  <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={editedSummaries['weekly_summary'] || ''}
                                    onChange={(e) => handleSummaryChange('weekly_summary', e.target.value)}
                                    size="small"
                                  />
                                ) : (
                                  <Typography variant="body1">
                                    {summaryData.summary || 'No weekly summary recorded.'}
                                  </Typography>
                                )}

                                {summaryData.evidence && (
                                  <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderLeft: '3px solid #0f172a', mt: 2, borderRadius: '0 4px 4px 0' }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block' }}>
                                      "{summaryData.evidence}"
                                    </Typography>
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      )}

                      {/* Filtered Metric Cards based on Tab Selection */}
                      <Grid container spacing={3}>
                        {cardConfigs
                          .filter(cfg => {
                            if (activeTab === 3) return true;
                            if (activeTab === 0 && cfg.category === 'overview') return true;
                            if (activeTab === 1 && cfg.category === 'vitals') return true;
                            if (activeTab === 2 && cfg.category === 'action') return true;
                            return false;
                          })
                          .map(config => {
                            const data = result[config.key] || { summary: null, classification: 'Missing Information', confidence: null, evidence: null };
                            const hasData = data.summary !== null && data.classification !== 'Missing Information';

                            return (
                              <Grid item xs={12} md={dualPaneView ? 12 : 6} key={config.key}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                  <CardContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} mb={1.5}>
                                      <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 700 }}>
                                        {config.title}
                                      </Typography>
                                      <Chip label={data.classification} size="small" color={getBadgeColor(data.classification)} />
                                    </Box>

                                    {isEditing ? (
                                      <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        value={editedSummaries[config.key] || ''}
                                        onChange={(e) => handleSummaryChange(config.key, e.target.value)}
                                        size="small"
                                        sx={{ mb: 2 }}
                                      />
                                    ) : (
                                      <Typography variant="body1" sx={{ mb: 2, flexGrow: 1, color: hasData ? 'text.primary' : 'text.secondary', fontStyle: hasData ? 'normal' : 'italic' }}>
                                        {data.summary || 'No details mentioned in session.'}
                                      </Typography>
                                    )}

                                    {hasData && (
                                      <Box sx={{ mt: 'auto' }}>
                                        {data.confidence && (
                                          <Box mb={1}>
                                            <Chip label={`Confidence: ${data.confidence}`} size="small" variant="outlined" />
                                          </Box>
                                        )}
                                        {data.evidence && (
                                          <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderLeft: '2px solid #0f172a', borderRadius: '0 4px 4px 0' }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', lineHeight: 1.4 }}>
                                              "{data.evidence}"
                                            </Typography>
                                          </Box>
                                        )}
                                      </Box>
                                    )}
                                  </CardContent>
                                </Card>
                              </Grid>
                            );
                          })}
                      </Grid>

                      {/* Supporting Evidence Accordion (Tab 2 or Tab 3) */}
                      {(activeTab === 2 || activeTab === 3) && (
                        <Box mt={3}>
                          <Accordion sx={{ border: '1px solid #e2e8f0', boxShadow: 'none', borderRadius: '6px !important' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ pr: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  Supporting Evidence Meta-Observations
                                </Typography>
                                <Chip label={evidenceData.classification} size="small" color={getBadgeColor(evidenceData.classification)} />
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ borderTop: '1px solid #e2e8f0', p: 3 }}>
                              {isEditing ? (
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={3}
                                  value={editedSummaries['supporting_evidence'] || ''}
                                  onChange={(e) => handleSummaryChange('supporting_evidence', e.target.value)}
                                  size="small"
                                />
                              ) : (
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                  {evidenceData.summary || 'No overall supporting evidence observations logged.'}
                                </Typography>
                              )}

                              {evidenceData.evidence && (
                                <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderLeft: '3px solid #0f172a', borderRadius: '0 4px 4px 0' }}>
                                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block' }}>
                                    "{evidenceData.evidence}"
                                  </Typography>
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        </Box>
                      )}

                    </Grid>
                  </Grid>

                </Box>
              );
            })()}

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
