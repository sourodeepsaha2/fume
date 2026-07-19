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
  Snackbar
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  AutoAwesome as AutoAwesomeIcon,
  InsertDriveFileOutlined as FileIcon,
  RotateLeft as ResetIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

// Configure a clean, minimalist black & white light theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
    },
    secondary: {
      main: '#1f2937',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#4b5563',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, sans-serif',
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
      lineHeight: 1.6,
      color: '#111827',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          boxShadow: 'none',
          borderRadius: 8,
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderColor: '#000000',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 6,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          backgroundColor: '#000000',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#1f2937',
          },
        },
        outlined: {
          borderColor: '#e5e7eb',
          color: '#000000',
          '&:hover': {
            borderColor: '#000000',
            backgroundColor: '#f9fafb',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        outlined: {
          borderColor: '#e5e7eb',
          color: '#374151',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: 8,
            '& fieldset': {
              borderColor: '#e5e7eb',
            },
            '&:hover fieldset': {
              borderColor: '#9ca3af',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#000000',
              borderWidth: 1.5,
            },
          },
        },
      },
    },
  },
});

function App() {
  const [conversationText, setConversationText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Human Review & Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummaries, setEditedSummaries] = useState({});

  // Snackbar States
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fileInputRef = useRef(null);
  const resultRef = useRef(null);

  const handleApprove = () => {
    if (!result) return;
    setResult(prev => ({
      ...prev,
      human_review: {
        ...prev.human_review,
        status: 'Approved'
      }
    }));
  };

  const handleReject = () => {
    if (!result) return;
    setResult(prev => ({
      ...prev,
      human_review: {
        ...prev.human_review,
        status: 'Rejected'
      }
    }));
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
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      setError('Please upload a plain text (.txt) file.');
      return;
    }

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      setConversationText(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setConversationText('');
    setFileName('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (loading) return; // Prevent duplicate requests

    if (!conversationText.trim()) {
      setError('Please paste a conversation or upload a .txt file first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation: conversationText }),
      });

      if (!response.ok) {
        let errMsg = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (e) {
          // Ignore json parsing error
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResult(data);
      
      // Smooth scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error(err);
      let errMsg = 'An unexpected error occurred.';
      if (err.message && err.message.includes('Failed to fetch')) {
        errMsg = 'Failed to connect to the server. Make sure the backend server is running on port 5001.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
      setSnackbarMessage(errMsg);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Maps the user classification strings to MUI chip theme colors
  const getBadgeColor = (classification) => {
    switch (classification) {
      case 'Confirmed Fact':
        return 'success'; // Green
      case 'Client Reported':
        return 'info';    // Blue
      case 'AI Inference':
        return 'warning'; // Orange
      case 'Missing Information':
      default:
        return 'default'; // Gray
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', pb: 10, bgcolor: '#ffffff' }}>
        
        {/* Header Section */}
        <Box 
          sx={{ 
            borderBottom: '1px solid #e5e7eb',
            bgcolor: '#ffffff',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            py: 2
          }}
        >
          <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#000000',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                GenAI Client Intelligence
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Coach Analytics
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="md" sx={{ mt: 6 }}>
          
          {/* Main Input Section */}
          <Card sx={{ mb: 6 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#000000', mb: 1 }}>
                Analyze Coaching Session
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Paste the coaching conversation transcript or upload a plain text file. 
                Generate structured insights including profile data, key challenges, action items, and sentiment shift.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              {/* Text Area Input */}
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="outlined"
                placeholder="Paste coaching transcript here..."
                value={conversationText}
                onChange={(e) => setConversationText(e.target.value)}
                sx={{ mb: 3 }}
              />

              {/* Toolbar Actions */}
              <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <Grid item xs={12} sm="auto" sx={{ flexGrow: 1 }}>
                  <Box display="flex" gap={1.5} alignItems="center">
                    <input
                      type="file"
                      accept=".txt"
                      style={{ display: 'none' }}
                      id="contained-button-file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="contained-button-file" style={{ width: '100%' }}>
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        fullWidth
                      >
                        Upload .txt
                      </Button>
                    </label>

                    {conversationText && (
                      <Tooltip title="Clear Input">
                        <IconButton onClick={handleClear} sx={{ border: '1px solid #e5e7eb', borderRadius: 1.5 }}>
                          <ResetIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Grid>

                {fileName && (
                  <Grid item xs={12} sm="auto">
                    <Chip
                      icon={<FileIcon fontSize="small" />}
                      label={fileName}
                      onDelete={handleClear}
                      variant="outlined"
                      sx={{ width: '100%', justifyContent: 'space-between' }}
                    />
                  </Grid>
                )}

                <Grid item xs={12} sm="auto" sx={{ ml: { sm: 'auto' } }}>
                  <Button
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon fontSize="small" />}
                    fullWidth
                  >
                    {loading ? 'Analyzing...' : 'Generate Intelligence'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
              <CircularProgress color="primary" size={32} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Analyzing conversation...
              </Typography>
            </Box>
          )}

          {/* Results Analysis Dashboard */}
          {result && (() => {
            const cardConfigs = [
              { key: 'nutrition', title: 'Nutrition' },
              { key: 'exercise', title: 'Exercise' },
              { key: 'steps', title: 'Steps' },
              { key: 'sleep', title: 'Sleep' },
              { key: 'water', title: 'Water' },
              { key: 'symptoms', title: 'Symptoms' },
              { key: 'stress', title: 'Stress' },
              { key: 'engagement_level', title: 'Engagement' },
              { key: 'key_barriers', title: 'Key Barriers' },
              { key: 'pending_actions', title: 'Pending Actions' },
              { key: 'risk_flags', title: 'Risk Flags' },
              { key: 'coach_recommendation', title: 'Coach Recommendation' }
            ];

            const summaryData = result.weekly_summary || {
              summary: 'No summary generated.',
              classification: 'Missing Information',
              confidence: null,
              evidence: null
            };

            const evidenceData = result.supporting_evidence || {
              summary: 'No supporting evidence listed.',
              classification: 'Missing Information',
              confidence: null,
              evidence: null
            };

            // Helper functions to calculate overall dashboard status
            const getOverallHealthStatus = () => {
              const hasRisk = result.risk_flags && result.risk_flags.summary && result.risk_flags.classification !== 'Missing Information';
              const hasSymptoms = result.symptoms && result.symptoms.summary && result.symptoms.classification !== 'Missing Information';
              
              if (hasRisk) {
                return { label: 'Needs Attention', color: 'error' }; // Red
              } else if (hasSymptoms) {
                return { label: 'Monitoring', color: 'warning' };     // Orange
              } else {
                return { label: 'Stable / Good', color: 'success' };  // Green
              }
            };

            const getOverallEngagementStatus = () => {
              const eng = result.engagement_level;
              if (!eng || !eng.summary || eng.classification === 'Missing Information') {
                return { label: 'Not Measured', color: 'default' };   // Gray
              }
              const sum = eng.summary.toLowerCase();
              if (sum.includes('high') || sum.includes('excellent') || sum.includes('good') || sum.includes('active') || sum.includes('enthusiastic')) {
                return { label: 'High Adherence', color: 'success' }; // Green
              } else if (sum.includes('low') || sum.includes('struggle') || sum.includes('poor')) {
                return { label: 'Low Adherence', color: 'error' };    // Red
              } else {
                return { label: 'Moderate', color: 'info' };          // Blue
              }
            };

            const getOverallRiskStatus = () => {
              const risk = result.risk_flags;
              const symptoms = result.symptoms;
              const barriers = result.key_barriers;
              
              const hasRisk = risk && risk.summary && risk.classification !== 'Missing Information';
              const hasBarriersOrSymptoms = (symptoms && symptoms.summary && symptoms.classification !== 'Missing Information') ||
                                           (barriers && barriers.summary && barriers.classification !== 'Missing Information');

              if (hasRisk) {
                return { label: 'High Risk', color: 'error' };        // Red
              } else if (hasBarriersOrSymptoms) {
                return { label: 'Medium Risk', color: 'warning' };    // Orange
              } else {
                return { label: 'Low Risk', color: 'success' };       // Green
              }
            };

            return (
              <Box ref={resultRef} sx={{ mt: 2 }}>
                
                {/* Header Metadata Section */}
                <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={2} mb={4}>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Session Analysis
                  </Typography>
                  {result.human_review && (
                    <Box display="flex" alignItems="center" gap={1.5} sx={{ mt: { xs: 1, sm: 0 } }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: '0.05em' }}>
                        REVIEW STATUS:
                      </Typography>
                      <Chip 
                        label={result.human_review.status} 
                        size="small" 
                        variant="outlined"
                        sx={{
                          fontWeight: 700,
                          borderColor: result.human_review.status === 'Approved' ? '#2e7d32' : result.human_review.status === 'Rejected' ? '#d32f2f' : '#000000',
                          color: result.human_review.status === 'Approved' ? '#2e7d32' : result.human_review.status === 'Rejected' ? '#d32f2f' : '#000000',
                          px: 0.5
                        }}
                      />
                    </Box>
                  )}
                </Box>

                {/* Dashboard Summary Cards */}
                <Grid container spacing={2} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                          Overall Health
                        </Typography>
                        <Chip 
                          label={getOverallHealthStatus().label} 
                          color={getOverallHealthStatus().color}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                          Overall Engagement
                        </Typography>
                        <Chip 
                          label={getOverallEngagementStatus().label} 
                          color={getOverallEngagementStatus().color}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Card sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 }, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', mb: 1 }}>
                          Overall Risk
                        </Typography>
                        <Chip 
                          label={getOverallRiskStatus().label} 
                          color={getOverallRiskStatus().color}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>

                  {/* Human Review Panel Card (Full Width) */}
                  <Grid item xs={12}>
                    <Card sx={{ border: '1px solid #000000', bgcolor: '#f9fafb' }}>
                      <CardContent sx={{ p: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, gap: 2 }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            Human Review Panel
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Audit findings, edit extracted text inline, and approve or reject the session report.
                          </Typography>
                        </Box>
                        <Box display="flex" gap={2} justifyContent="flex-end">
                          {isEditing ? (
                            <>
                              <Button 
                                variant="contained" 
                                size="small" 
                                onClick={handleSaveEdit}
                              >
                                Save Changes
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleCancelEdit}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleApprove}
                                sx={{ color: '#2e7d32', borderColor: '#2e7d32', '&:hover': { borderColor: '#1b5e20', bgcolor: 'rgba(46,125,50,0.04)' } }}
                              >
                                Approve
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                onClick={handleStartEdit}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outlined" 
                                color="error" 
                                size="small" 
                                onClick={handleReject}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* 1. Weekly Summary Card (Full Width) */}
                  <Grid item xs={12}>
                    <Card sx={{ border: '1px solid #000000' }}>
                      <CardContent sx={{ p: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={2}>
                          <Typography variant="h6" sx={{ fontSize: '1.05rem', fontWeight: 700 }}>
                            Weekly Summary
                          </Typography>
                          <Box display="flex" gap={1}>
                            <Chip 
                              label={summaryData.classification} 
                              size="small" 
                              color={getBadgeColor(summaryData.classification)}
                              variant={summaryData.classification === 'Missing Information' ? 'outlined' : 'filled'}
                            />
                            {summaryData.confidence && (
                              <Chip 
                                label={`Confidence: ${summaryData.confidence}`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
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
                            sx={{ mt: 1 }}
                          />
                        ) : (
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontSize: '0.925rem',
                              color: summaryData.summary ? 'text.primary' : 'text.secondary',
                              fontStyle: summaryData.summary ? 'normal' : 'italic'
                            }}
                          >
                            {summaryData.summary || 'No weekly summary mentioned in the conversation.'}
                          </Typography>
                        )}

                        {summaryData.evidence && (
                          <Box sx={{ p: 1.5, bgcolor: '#f9fafb', borderLeft: '2px solid #000000', mt: 2, borderRadius: '0 4px 4px 0' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', lineHeight: 1.4 }}>
                              "{summaryData.evidence}"
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* 2. Grid items for Metrics, Health, and Coaching */}
                  {cardConfigs.map(config => {
                    const data = result[config.key] || {
                      summary: null,
                      classification: 'Missing Information',
                      confidence: null,
                      evidence: null
                    };

                    const hasData = data.summary !== null && data.classification !== 'Missing Information';

                    return (
                      <Grid item xs={12} md={6} key={config.key}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                          <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            
                            {/* Card Header: Title & Info */}
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2} mb={2}>
                              <Typography variant="h6" sx={{ fontSize: '0.95rem', fontWeight: 700 }}>
                                {config.title}
                              </Typography>
                              <Chip 
                                label={data.classification} 
                                size="small"
                                color={getBadgeColor(data.classification)}
                                variant={data.classification === 'Missing Information' ? 'outlined' : 'filled'}
                              />
                            </Box>

                            {/* Summary Text */}
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
                              <Typography 
                                variant="body1" 
                                sx={{ 
                                  mb: 2.5, 
                                  flexGrow: 1, 
                                  fontSize: '0.9rem',
                                  color: hasData ? 'text.primary' : 'text.secondary',
                                  fontStyle: hasData ? 'normal' : 'italic'
                                }}
                              >
                                {data.summary || 'No details provided in this session.'}
                              </Typography>
                            )}

                            {/* Meta items */}
                            {hasData && (
                              <Box sx={{ mt: 'auto' }}>
                                {data.confidence && (
                                  <Box display="flex" gap={1} mb={1}>
                                    <Chip 
                                      label={`Confidence: ${data.confidence}`} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                  </Box>
                                )}

                                {data.evidence && (
                                  <Box sx={{ p: 1.5, bgcolor: '#f9fafb', borderLeft: '2px solid #000000', mt: 1, borderRadius: '0 4px 4px 0' }}>
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

                  {/* 3. Supporting Evidence Section (Accordion - Full Width) */}
                  <Grid item xs={12}>
                    <Accordion 
                      sx={{ 
                        border: '1px solid #e5e7eb', 
                        boxShadow: 'none', 
                        borderRadius: '8px !important',
                        '&:before': { display: 'none' },
                        mt: 1
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" sx={{ pr: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            Supporting Evidence
                          </Typography>
                          <Chip 
                            label={evidenceData.classification} 
                            size="small" 
                            color={getBadgeColor(evidenceData.classification)}
                            variant={evidenceData.classification === 'Missing Information' ? 'outlined' : 'filled'}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails sx={{ borderTop: '1px solid #e5e7eb', p: 3 }}>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={editedSummaries['supporting_evidence'] || ''}
                            onChange={(e) => handleSummaryChange('supporting_evidence', e.target.value)}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        ) : (
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontSize: '0.9rem',
                              color: evidenceData.summary && evidenceData.classification !== 'Missing Information' ? 'text.primary' : 'text.secondary',
                              fontStyle: evidenceData.summary && evidenceData.classification !== 'Missing Information' ? 'normal' : 'italic',
                              mb: 2
                            }}
                          >
                            {evidenceData.summary || 'No supporting evidence recorded in this session.'}
                          </Typography>
                        )}

                        {evidenceData.confidence && (
                          <Box display="flex" gap={1} mb={2}>
                            <Chip 
                              label={`Confidence: ${evidenceData.confidence}`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        )}

                        {evidenceData.evidence && (
                          <Box sx={{ p: 1.5, bgcolor: '#f9fafb', borderLeft: '2px solid #000000', borderRadius: '0 4px 4px 0' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', lineHeight: 1.4 }}>
                              "{evidenceData.evidence}"
                            </Typography>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  </Grid>

                </Grid>
              </Box>
            );
          })()}
 
        </Container>
      </Box>

      {/* Error Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="error" 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
