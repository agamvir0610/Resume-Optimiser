'use client';

import { useState, useEffect } from 'react';
import DropZone from './components/DropZone';
import ResultTabs from './components/ResultTabs';
import Paywall from './components/Paywall';
import AuthButton from './components/AuthButton';
import CreditPurchaseModal from './components/CreditPurchaseModal';
import { OptimizationResult } from '@/lib/schema';

export default function Page() {
  const [resumeText, setResumeText] = useState('');
  const [jobAdText, setJobAdText] = useState('');
  const [role, setRole] = useState('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveSession, setSaveSession] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{name: string, type: string, file: File} | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleOptimize = async () => {
    console.log('handleOptimize called');
    console.log('resumeText length:', resumeText.trim().length);
    console.log('jobAdText length:', jobAdText.trim().length);
    console.log('uploadedFile:', uploadedFile);
    
    if ((!resumeText.trim() && !uploadedFile) || !jobAdText.trim()) {
      setError('Please provide resume text or upload a file, and job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let finalResumeText = resumeText;

      // If there's an uploaded file, process it first
      if (uploadedFile) {
        try {
          const formData = new FormData();
          formData.append('file', uploadedFile.file);

          const fileResponse = await fetch('/api/process-file', {
            method: 'POST',
            body: formData,
          });

          if (!fileResponse.ok) {
            throw new Error('File processing failed');
          }

          const fileResult = await fileResponse.json();
          finalResumeText = fileResult.text;
        } catch (fileError) {
          console.error('File processing error:', fileError);
          setError('Failed to process uploaded file. Please try again.');
          return;
        }
      }

      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: finalResumeText,
          jobAdText,
          role: role || undefined,
          saveSession,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle insufficient credits
        if (response.status === 402 && errorData.needsPurchase) {
          setError(`Insufficient credits! You have ${errorData.credits} credits but need ${errorData.required}. Please purchase more credits to continue.`);
          setShowPurchaseModal(true);
          return;
        }
        
        // Handle authentication required
        if (response.status === 401) {
          setError('Please sign in to optimize your resume');
          return;
        }
        
        throw new Error(errorData.error || 'Failed to optimize resume');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    try {
      setError('');

      // Just store the file info, don't process yet
      const file = files[0];
      
      // Track the uploaded file
      setUploadedFile({
        name: file.name,
        type: file.type,
        file: file
      });
      
      // Show success message
      setError(`✅ File ready: ${file.name}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setError(''), 3000);
    } catch (error) {
      console.error('File upload error:', error);
      setError(`❌ Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleExport = async (format: 'docx' | 'pdf') => {
    if (!result) return;

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultJson: result,
          format,
          userData: {
            name: 'Your Name', // In real app, get from user input
            email: 'your@email.com',
          },
        }),
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 1 }),
      });

      const { url } = await response.json();
      if (url) window.location.href = url;
    } catch (err) {
      setError('Checkout failed');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-gray-800">
              Resume Optimizer
            </div>
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className={`relative overflow-hidden ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-sky-100 to-pink-100"></div>
        <div className="absolute inset-0 bg-white/30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 leading-tight">
              <span className="gradient-text bg-gradient-to-r from-sky-400 to-amber-400 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Resume Optimizer
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your resume into an ATS-ready masterpiece with personalized cover letters, 
              skill gap analysis, and professional formatting in under 60 seconds.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { icon: '✨', text: 'ATS-Ready Formatting' },
                { icon: '📝', text: 'Tailored Cover Letter' },
                { icon: '📊', text: 'Skill Gap Analysis' },
                { icon: '⚡', text: '60-Second Results' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-gray-800 font-medium border border-white/40 hover:border-sky-300 hover:bg-white/90 transition-all duration-300 hover:scale-105 shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="mr-2">{feature.icon}</span>
                  {feature.text}
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-gray-600 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                Trusted by 1,247+ job seekers
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-sky-400 rounded-full mr-2"></div>
                99.9% uptime
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                Enterprise security
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative -mt-20 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/40">
            {/* Input Section */}
            <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Resume Input */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-800">
                    Your Resume
                  </label>
                  <div className="relative">
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume text here... (or use our file upload below)"
                      className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {resumeText.length} characters
                    </div>
                  </div>
                </div>

                {/* Job Ad Input */}
                <div className="space-y-3">
                  <label className="block text-lg font-semibold text-gray-800">
                    Job Description
                  </label>
                  <div className="relative">
                    <textarea
                      value={jobAdText}
                      onChange={(e) => setJobAdText(e.target.value)}
                      placeholder="Paste the job posting here..."
                      className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {jobAdText.length} characters
                    </div>
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Or Upload Your Resume Files</h3>
                  <p className="text-gray-600 text-sm">Drag and drop your resume files for automatic text extraction</p>
                </div>
                
                {/* Uploaded File Display */}
                {uploadedFile && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">📄</div>
                      <div>
                        <p className="font-medium text-green-800">{uploadedFile.name}</p>
                        <p className="text-sm text-green-600">File ready for processing</p>
                      </div>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                        }}
                        className="ml-auto text-green-600 hover:text-green-800"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                
                
                <DropZone onFiles={handleFileUpload} />
              </div>

              {/* Controls */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <div className="grid md:grid-cols-3 gap-6 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role (Optional)
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g., Software Engineer, Marketing Manager, Nurse"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-sky-400 focus:ring-4 focus:ring-sky-100 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveSession}
                        onChange={(e) => setSaveSession(e.target.checked)}
                        className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                      />
                      <span>Save session (encrypted)</span>
                    </label>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleOptimize}
                      disabled={loading || (!resumeText.trim() && !uploadedFile) || !jobAdText.trim()}
                      className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed ${
                        loading || (!resumeText.trim() && !uploadedFile) || !jobAdText.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-sky-400 to-amber-400 text-white shadow-lg hover:shadow-xl hover:from-sky-500 hover:to-amber-500'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Optimizing...</span>
                        </div>
                      ) : (
                        '🚀 Get ATS-Ready Resume'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Error/Success Message */}
            {error && (
              <div className={`mb-6 p-4 border-l-4 rounded-lg animate-slide-in ${
                error.startsWith('✅') 
                  ? 'bg-green-50 border-green-400' 
                  : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center">
                  <div className={`mr-3 ${error.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>
                    {error.startsWith('✅') ? '✅' : '⚠️'}
                  </div>
                  <p className={`font-medium ${error.startsWith('✅') ? 'text-green-700' : 'text-red-700'}`}>
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Demo Mode Notice - Only show when API is not working */}
            {result && result.score === 0 && result.rewritten_bullets?.length === 0 && (
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-lg animate-slide-in">
                <div className="flex items-center">
                  <div className="text-blue-400 mr-3">💡</div>
                  <p className="text-blue-700 font-medium">
                    <strong>Demo Mode:</strong> Showing sample results. Add your OpenAI API key to get personalized AI optimization.
                  </p>
                </div>
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {/* Score and Export */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className={`px-6 py-4 rounded-2xl font-bold text-2xl ${
                      result.score >= 80 
                        ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                        : result.score >= 60 
                        ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-200'
                        : 'bg-red-100 text-red-800 border-2 border-red-200'
                    }`}>
                      {result.score}/100
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">ATS Score</h3>
                      <p className="text-gray-600">
                        {result.score >= 80 ? 'Excellent!' : result.score >= 60 ? 'Good' : 'Needs improvement'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleExport('docx')}
                      className="px-6 py-3 bg-sky-400 text-white rounded-xl font-semibold hover:bg-sky-500 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      📄 Export DOCX
                    </button>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="px-6 py-3 bg-amber-400 text-white rounded-xl font-semibold hover:bg-amber-500 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      📋 Export PDF
                    </button>
                  </div>
                </div>

                {/* Results Tabs */}
                <ResultTabs
                  tabs={[
                    {
                      key: 'gaps',
                      label: 'Skill Gaps',
                      content: (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Missing Keywords</h3>
                            <div className="flex flex-wrap gap-2">
                              {result.missing_keywords?.map((keyword, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200"
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Areas to Improve</h3>
                            <ul className="space-y-2">
                              {result.gaps.map((gap, i) => (
                                <li key={i} className="flex items-start space-x-2 text-gray-700">
                                  <span className="text-red-500 mt-1">•</span>
                                  <span>{gap}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: 'bullets',
                      label: 'Rewritten Bullets',
                      content: (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Optimized Bullet Points</h3>
                          <ul className="space-y-4">
                            {result.rewritten_bullets?.map((bullet, i) => (
                              <li key={i} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-400">
                                <span className="text-indigo-600 font-bold mt-1">{i + 1}.</span>
                                <span className="text-gray-700 leading-relaxed">{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ),
                    },
                    {
                      key: 'summary',
                      label: 'Professional Summary',
                      content: (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Optimized Summary</h3>
                          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {result.professional_summary}
                            </p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: 'cover',
                      label: 'Cover Letter',
                      content: (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Tailored Cover Letter</h3>
                          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {result.cover_letter || 'Cover letter not available'}
                            </p>
                          </div>
                        </div>
                      ),
                    },
                    {
                      key: 'keywords',
                      label: 'ATS Keywords',
                      content: (
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Key ATS Keywords</h3>
                          <div className="flex flex-wrap gap-2">
                            {result.ats_keywords?.map((keyword, i) => (
                              <span
                                key={i}
                                className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-200 transition-colors duration-200"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      ),
                    },
                  ]}
                />
              </div>
            )}

            {/* Privacy Section */}
            <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔒 Privacy & Trust</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>No data storage by default</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Enterprise-grade encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>7-day money-back guarantee</span>
                </div>
              </div>
            </div>

            {/* Paywall */}
            <div className="mt-8">
              <Paywall onCheckout={handleCheckout} />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Purchase Modal */}
      <CreditPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        currentCredits={0} // This will be updated with real credits from AuthButton
      />
    </div>
  );
}


