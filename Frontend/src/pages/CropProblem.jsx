import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import { useAuth } from "../auth/AuthContext";
import { auth } from "../auth/firebase";
import loadingsvg from "../assets/dualring.png";

const CropProblem = () => {
  const { currentUser, loading: authLoading } = useAuth();
  
  // Debug: Log current user state
  useEffect(() => {
    console.log("CropProblem - authLoading:", authLoading);
    console.log("CropProblem - currentUser:", currentUser);
    console.log("CropProblem - currentUser?.uid:", currentUser?.uid);
    console.log("CropProblem - auth.currentUser:", auth.currentUser);
  }, [currentUser, authLoading]);
  const [crop, setCrop] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState("Upload Image of Disease");
  const [view, setView] = useState('form');
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fileInputRef = useRef(null);

  // Available crops from model
  const availableCrops = [
    "Apple", "Blueberry", "Cherry", "Corn", "Grape", "Orange", 
    "Peach", "Pepper", "Potato", "Raspberry", "Soybean", 
    "Squash", "Strawberry", "Tomato"
  ];

  // Fetch user's history from backend
  useEffect(() => {
    const fetchHistory = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        return;
      }

      // Check both currentUser from context and auth.currentUser as fallback
      const user = currentUser || auth.currentUser;
      
      if (!user) {
        // If not logged in, clear history
        console.log('No user found, clearing history');
        setHistory([]);
        setLoadingHistory(false);
        return;
      }

      try {
        setLoadingHistory(true);
        console.log('Fetching history for user:', user.uid);
        const response = await API.get('/crop/history');
        console.log('History response:', response.data);
        setHistory(response.data || []);
      } catch (error) {
        console.error('Error fetching history:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        // If error (e.g., not authenticated), just show empty history
        setHistory([]);
        if (error.response?.status === 401) {
          setError('Please log in to view your history');
        }
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [currentUser, authLoading]);

  // Refresh history after saving a new analysis
  const refreshHistory = async () => {
    const user = currentUser || auth.currentUser;
    if (!user) {
      console.log('No current user, skipping history refresh');
      return;
    }
    
    try {
      console.log('Refreshing history for user:', user.uid);
      const response = await API.get('/crop/history');
      console.log('Refreshed history:', response.data);
      setHistory(response.data || []);
    } catch (error) {
      console.error('Error refreshing history:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setFileName(file.name);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!crop) {
      setError("Please select a crop");
      return;
    }
    if (!image) {
      setError("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("crop", crop);
    formData.append("image", image);

    try {
      setLoading(true);
      setProgress(0);
      setError(null);
      
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const res = await API.post(
        "/crop/analyze",
        formData,
        { 
          timeout: 30000,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(async () => {
        setResult(res.data);
        // Refresh history from backend (analysis is automatically saved if user is authenticated)
        const user = currentUser || auth.currentUser;
        if (user) {
          console.log('Analysis complete, refreshing history...');
          await refreshHistory();
        } else {
          console.log('User not logged in, analysis not saved to history');
        }
        setLoading(false);
        setProgress(0);
      }, 500);
    } catch (err) {
      clearInterval();
      setError(err.response?.data?.message || "Analysis failed. Please try again.");
      setLoading(false);
      setProgress(0);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImage(null);
    setPreview(null);
    setCrop("");
    setFileName("Upload Image of Disease");
    setProgress(0);
  };

  const downloadResult = () => {
    if (!result) return;
    const text = `Crop Disease Analysis Report
Crop: ${result.crop}
Disease: ${result.disease}
Confidence: ${result.confidence}%

Symptoms:
${result.symptoms?.map(s => `- ${s}`).join('\n') || 'Not available'}

Treatment:
${result.treatment?.map(t => `- ${t}`).join('\n') || 'Not available'}

Prevention:
${result.prevention?.map(p => `- ${p}`).join('\n') || 'Not available'}`;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `crop_analysis_${result.crop}_${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50 p-4 md:p-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-center bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
           Crop Disease Diagnosis
        </h1>
        <p className="text-center text-gray-600">Upload a crop image to get AI-powered disease detection and treatment recommendations</p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
        {/* LEFT PANEL - Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col min-h-64">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {view === 'form' ? ' Analyze Crop' : ' History'}
            </h2>
            <button
              onClick={() => setView(view === 'form' ? 'history' : 'form')}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition text-sm font-medium"
            >
              {view === 'form' ? 'View History' : 'Back to Form'}
            </button>
          </div>

          {view === 'form' ? (
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-y-auto">
              <div className="flex-1 space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                     {error}
                  </div>
                )}

                {/* Crop Selection */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Select Crop Type
                  </label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg p-3 focus:border-teal-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="">Choose a crop...</option>
                    {availableCrops.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                     Upload Image
                  </label>
                  <div
                    className="border-3 border-dashed border-teal-300 rounded-xl p-8 text-center cursor-pointer hover:bg-teal-50 transition"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {preview ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Selected: <strong>{fileName}</strong></p>
                        <img src={preview} alt="preview" className="w-full h-48 object-contain rounded mx-auto" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        
                        <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
                        <p className="text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !crop || !image}
                className="w-full bg-gradient-to-r from-teal-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex-1 bg-white/30 rounded-full h-2">
                      <div
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{progress}%</span>
                  </div>
                ) : (
                  " Analyze Crop Health"
                )}
              </button>
            </form>
          ) : (
            // History View
            <div className="flex-1 overflow-y-auto min-h-0">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 sticky top-0 bg-white pb-2">
                {(currentUser || auth.currentUser) ? 'Your Analysis History' : 'Analysis History'}
              </h3>
              {!(currentUser || auth.currentUser) && !authLoading && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Please log in to save and view your analysis history.
                  </p>
                </div>
              )}
              {loadingHistory ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <p className="text-gray-500 mt-2">Loading history...</p>
                </div>
              ) : history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {(currentUser || auth.currentUser)
                    ? "No previous analyses yet. Start by uploading an image!" 
                    : "Log in to see your analysis history."}
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div key={item._id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition cursor-pointer"
                      onClick={() => {
                        setResult(item);
                        setView('form');
                      }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{item.crop}</p>
                          <p className="text-teal-600 font-medium">{item.disease || 'Not recognized'}</p>
                          <p className="text-sm text-gray-500">
                            {item.createdAt 
                              ? new Date(item.createdAt).toLocaleDateString() 
                              : new Date(item.date || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                          {item.confidence || '0'}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Results */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-start h-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6"> Analysis Result</h2>
          <div>

          {!result && !loading && (
            <div className="text-center py-12 flex justify-center">
              
              <p className="text-gray-500 text-lg mt-15">Upload an image to see results</p>
            </div>
          )}

          </div>
          {loading && (
            <div className="text-center py-12 space-y-4">
             <div className="w-full flex align-center justify-center">
               <img
      src={loadingsvg}
      className="animate-spin w-15 h-15"
      />
      </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-teal-600 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-gray-700 font-medium">Analyzing your crop... {progress}%</p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Disease Card */}
              <div className="bg-gradient-to-br from-teal-50 to-green-50 border-2 border-teal-200 rounded-xl p-5 sticky top-0">
                <p className="text-gray-600 text-sm mb-1">Disease Detected</p>
                <h3 className="text-3xl font-bold text-teal-700 mb-3">{result.disease || "Not recognized"}</h3>
                
                {/* Severity Badge */}
                {result.severity && (
                  <div className="inline-block px-4 py-2 rounded-full font-semibold text-sm" 
                    style={{
                      backgroundColor: result.severity === 'High' ? '#FEE2E2' : result.severity === 'Medium' ? '#FEF3C7' : '#DBEAFE',
                      color: result.severity === 'High' ? '#991B1B' : result.severity === 'Medium' ? '#92400E' : '#1E40AF'
                    }}>
                    Severity: {result.severity}
                  </div>
                )}
              </div>

              {/* Symptoms */}
              {result.symptoms?.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"> Symptoms</h4>
                  <ul className="space-y-1 text-sm">
                    {result.symptoms.map((symptom, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conditions Favoring Disease */}
              {result.conditions_favoring?.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"> Conditions Favoring Disease</h4>
                  <ul className="space-y-1 text-sm">
                    {result.conditions_favoring.map((condition, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-orange-500 mt-0.5"></span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Growth Stages Affected */}
              {result.affected_growth_stages?.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"> Growth Stages Affected</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {result.affected_growth_stages.map((stage, i) => (
                      <span key={i} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full">{stage}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatment Timing */}
              {result.treatment_timing && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2"> Best Treatment Timing</h4>
                  <p className="text-sm text-gray-700">{result.treatment_timing}</p>
                </div>
              )}

              {/* Estimated Yield Loss */}
              {result.estimated_yield_loss && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2"> Estimated Yield Loss (Untreated)</h4>
                  <p className="text-lg font-bold text-yellow-700">{result.estimated_yield_loss}</p>
                </div>
              )}

              {/* Chemical Fungicides */}
              {result.chemical_fungicides?.length > 0 && (
                <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"> Chemical Fungicides</h4>
                  <div className="space-y-3 text-sm">
                    {result.chemical_fungicides.map((fungicide, i) => (
                      <div key={i} className="bg-white p-3 rounded border border-red-100">
                        <p className="font-semibold text-gray-800">{fungicide.name}</p>
                        <p className="text-gray-700"><strong>Dosage:</strong> {fungicide.dosage}</p>
                        {fungicide.interval && <p className="text-gray-700"><strong>Interval:</strong> {fungicide.interval}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organic Methods */}
              {result.organic_methods?.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"> Organic Treatment Methods</h4>
                  <ul className="space-y-2 text-sm">
                    {result.organic_methods.map((method, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{method}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resistant Varieties */}
              {result.resistant_varieties?.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2"> Resistant Crop Varieties</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.resistant_varieties.map((variety, i) => (
                      <span key={i} className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm">{variety}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cure Duration */}
              {result.cure_duration && (
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2"> Expected Cure Duration</h4>
                  <p className="text-sm text-gray-700">{result.cure_duration}</p>
                </div>
              )}

              {/* Monitoring Tips */}
              {result.monitoring_tips?.length > 0 && (
                <div className="bg-lime-50 border border-lime-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"> Monitoring Tips</h4>
                  <ul className="space-y-2 text-sm">
                    {result.monitoring_tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-lime-600 mt-0.5">→</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* When to Call Expert */}
              {result.when_to_call_expert && (
                <div className="bg-rose-50 border-2 border-rose-300 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2"> When to Call an Expert</h4>
                  <p className="text-sm text-gray-700">{result.when_to_call_expert}</p>
                </div>
              )}

              {/* Generic Treatment */}
              {result.treatment?.length > 0 && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"> General Treatment Steps</h4>
                  <ul className="space-y-2 text-sm">
                    {result.treatment.map((treatment, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-teal-600 mt-0.5">→</span>
                        <span>{treatment}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prevention */}
              {result.prevention?.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"> Prevention Tips</h4>
                  <ul className="space-y-2 text-sm">
                    {result.prevention.map((prev, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700">
                        <span className="text-blue-600 mt-0.5">▸</span>
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
                <button
                  onClick={downloadResult}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                   Download Report
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition flex items-center justify-center gap-2"
                >
                   Analyze Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CropProblem;