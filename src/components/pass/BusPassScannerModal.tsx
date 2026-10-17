import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { useBus } from '../../context/BusContext';
import { verifyScannedQR, QRVerificationResult, generatePassQRPayload } from '../../utils/qrHelper';
import {
  X,
  Camera,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Sparkles,
  UserCheck,
  Bus as BusIcon,
  Search,
  Volume2,
  VolumeX,
  History,
} from 'lucide-react';

interface BusPassScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultBusNumber?: string;
}

export const BusPassScannerModal: React.FC<BusPassScannerModalProps> = ({
  isOpen,
  onClose,
  defaultBusNumber,
}) => {
  const { busPasses, students, buses } = useBus();

  const [activeTab, setActiveTab] = useState<'camera' | 'simulate' | 'manual'>('simulate');
  const [targetBus, setTargetBus] = useState<string>(defaultBusNumber || buses[0]?.busNumber || 'BUS-12');
  const [scanResult, setScanResult] = useState<QRVerificationResult | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanHistory, setScanHistory] = useState<QRVerificationResult[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningActive, setIsScanningActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Sound synthesis helper (beep on scan)
  const playBeep = (isSuccess: boolean) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isSuccess) {
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch pleasant beep
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
      } else {
        osc.frequency.setValueAtTime(320, audioCtx.currentTime); // Low buzz
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      }
    } catch {
      // AudioContext may be restricted in some browsers
    }
  };

  const processScanText = (scannedText: string) => {
    const result = verifyScannedQR(scannedText, busPasses, students, targetBus);
    setScanResult(result);
    setScanHistory((prev) => [result, ...prev.slice(0, 9)]);
    playBeep(result.isValid);
  };

  // Camera handling
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera') {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    setIsScanningActive(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        scanVideoFrame();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access denied or unavailable on this device. You can use Quick Test Simulator below!');
      setIsScanningActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanningActive(false);
  };

  const scanVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(scanVideoFrame);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      processScanText(code.data);
      // Pause slightly so it doesn't repeatedly scan every millisecond
      setTimeout(() => {
        if (streamRef.current) {
          animationFrameId.current = requestAnimationFrame(scanVideoFrame);
        }
      }, 1500);
      return;
    }

    animationFrameId.current = requestAnimationFrame(scanVideoFrame);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-200 max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Gate QR Pass Scanner &amp; Verifier</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Live Gate
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Driver &amp; Conductor Verification System · तुरंत छात्र पहचान सत्यापन
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl text-slate-500 hover:text-purple-700 hover:bg-white transition-colors"
              title={soundEnabled ? 'Mute scanner sound' : 'Enable scanner beep'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-purple-600" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gate Settings Strip */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-purple-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <BusIcon className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-slate-700">Verifying Boarding for Gate/Bus:</span>
            <select
              value={targetBus}
              onChange={(e) => setTargetBus(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-purple-200 bg-white font-mono font-bold text-purple-900 text-xs focus:outline-none"
            >
              {buses.map((b) => (
                <option key={b.id} value={b.busNumber}>
                  {b.busNumber} ({b.registrationNumber})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
            <span>Passes in DB: </span>
            <strong className="text-purple-900">{busPasses.length} Active</strong>
          </div>
        </div>

        {/* Scanner Tabs */}
        <div className="px-6 pt-3 flex items-center gap-2 border-b border-purple-100 pb-2">
          <button
            onClick={() => setActiveTab('simulate')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'simulate'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Test Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'camera'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'manual'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-purple-50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Manual Verification / Roll No</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {/* TAB 1: 1-Click Test Simulator (Perfect for all environments) */}
          {activeTab === 'simulate' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-[11px] text-purple-900">
                <strong>💡 Quick Simulator:</strong> नीचे दिए गए किसी भी छात्र पर क्लिक करें। सिस्टम तुरंत उनके QR कोड को स्कैन करके वास्तविक पहचान, अधिकृत बस, फीस और सत्यापन परिणाम दिखाएगा।
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {busPasses.slice(0, 6).map((pass) => (
                  <button
                    key={pass.id}
                    onClick={() => processScanText(generatePassQRPayload(pass))}
                    className="p-3 rounded-2xl border border-purple-100 hover:border-purple-300 bg-white hover:bg-purple-50/50 text-left transition-all flex items-center justify-between gap-3 shadow-2xs group cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-purple-900">
                        {pass.studentName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {pass.enrollmentNumber} · {pass.busNumber}
                      </div>
                      <div className="text-[10px] text-purple-600 mt-0.5">
                        {pass.pickupStopName}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                        pass.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pass.status === 'Expired'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {pass.status}
                    </span>
                  </button>
                ))}

                {/* Edge Case: Wrong Bus Test Button */}
                <button
                  onClick={() => {
                    const testPayload = JSON.stringify({
                      name: 'Aman Mathur',
                      enrollment: '0827CS231099',
                      busNumber: targetBus === 'BUS-12' ? 'BUS-07' : 'BUS-12',
                      route: 'Vijay Nagar Express',
                      pickupStop: 'Bhawarkua',
                      validUntil: '31 Dec 2026',
                      feeStatus: 'Paid',
                      status: 'Active',
                    });
                    processScanText(testPayload);
                  }}
                  className="p-3 rounded-2xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/60 text-left transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-amber-950">Test Case: Wrong Bus Passenger</div>
                    <div className="text-[10px] text-amber-800">
                      Authorized for {targetBus === 'BUS-12' ? 'BUS-07' : 'BUS-12'}, trying to board {targetBus}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200 text-amber-900 shrink-0">
                    Test Wrong Bus
                  </span>
                </button>

                {/* Edge Case: Unknown / Forged QR Button */}
                <button
                  onClick={() => {
                    processScanText('FAKE-TICKET-INVALID-CREDENTIAL-999');
                  }}
                  className="p-3 rounded-2xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-left transition-all flex items-center justify-between gap-3 shadow-2xs cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-rose-950">Test Case: Invalid / Unknown QR</div>
                    <div className="text-[10px] text-rose-800">Simulate fake or unverified barcode</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-200 text-rose-900 shrink-0">
                    Test Fake
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Live Camera View */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center border-2 border-purple-300/40 shadow-inner">
                {cameraError ? (
                  <div className="p-6 text-center space-y-3">
                    <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-slate-300 text-xs max-w-sm">{cameraError}</p>
                    <button
                      onClick={() => setActiveTab('simulate')}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700"
                    >
                      Switch to Quick Test Simulator
                    </button>
                  </div>
                ) : (
                  <>
                    <video ref={videoRef} className="w-full h-full object-cover" />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Camera Viewfinder Reticle Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-purple-400/80 rounded-2xl relative animate-pulse shadow-lg">
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-purple-400 -mt-1 -ml-1 rounded-tl-sm" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-purple-400 -mt-1 -mr-1 rounded-tr-sm" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-purple-400 -mb-1 -ml-1 rounded-bl-sm" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-purple-400 -mb-1 -mr-1 rounded-br-sm" />
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-center bg-slate-900/80 backdrop-blur-xs py-1.5 px-3 rounded-xl text-purple-200 text-[11px]">
                      Point phone camera at student's bus pass QR code
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Manual Search & Verification */}
          {activeTab === 'manual' && (
            <div className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (manualInput.trim()) {
                    processScanText(manualInput.trim());
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Enter Student Roll Number or Paste QR Payload
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. 0827CS231042 or PASS-2026-1042"
                      required
                      className="flex-1 p-2.5 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono text-xs"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 cursor-pointer shadow-xs"
                    >
                      Verify Now
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* LIVE VERIFICATION RESULT CARD */}
          {scanResult && (
            <div
              className={`rounded-3xl p-5 border-2 shadow-lg transition-all animate-in zoom-in-95 duration-200 ${
                scanResult.isValid
                  ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-400 text-emerald-950'
                  : 'bg-gradient-to-br from-rose-50 via-pink-50 to-white border-rose-400 text-rose-950'
              }`}
            >
              <div className="flex items-start justify-between gap-3 border-b pb-3 mb-3 border-current/15">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${
                      scanResult.isValid ? 'bg-emerald-600' : 'bg-rose-600'
                    }`}
                  >
                    {scanResult.isValid ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <XCircle className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        scanResult.isValid
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-rose-200 text-rose-900'
                      }`}
                    >
                      {scanResult.verificationCode}
                    </span>
                    <h4 className="text-base font-black text-slate-900 mt-0.5">
                      {scanResult.studentName}
                    </h4>
                    <div className="text-[11px] font-mono text-slate-500">
                      Enrollment: <strong>{scanResult.enrollmentNumber}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] font-mono text-slate-500">
                  <span>Scanned at: </span>
                  <strong>{scanResult.scannedAt}</strong>
                </div>
              </div>

              {/* Status Message */}
              <div
                className={`p-3 rounded-xl font-medium text-xs mb-3 ${
                  scanResult.isValid
                    ? 'bg-emerald-100/70 text-emerald-900'
                    : 'bg-rose-100/70 text-rose-900'
                }`}
              >
                {scanResult.verificationMessage}
              </div>

              {/* Grid of Verified Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                  <div className="text-[10px] text-slate-400">Authorized Bus</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">
                    {scanResult.busNumber}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                  <div className="text-[10px] text-slate-400">Pickup Stop</div>
                  <div className="font-semibold text-slate-900 mt-0.5 truncate">
                    {scanResult.pickupStopName}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                  <div className="text-[10px] text-slate-400">Validity Until</div>
                  <div className="font-mono text-slate-900 mt-0.5">
                    {scanResult.validUntil}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 border border-slate-200">
                  <div className="text-[10px] text-slate-400">Fee Status</div>
                  <div className="font-bold text-emerald-700 mt-0.5">
                    {scanResult.feeStatus}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Scans Session Log */}
          {scanHistory.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-purple-100">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="font-semibold flex items-center gap-1">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent Gate Scans ({scanHistory.length} Total Verified)</span>
                </span>
                <button
                  onClick={() => setScanHistory([])}
                  className="text-purple-600 hover:underline cursor-pointer"
                >
                  Clear Log
                </button>
              </div>

              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
                {scanHistory.map((h, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          h.isValid ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span className="font-bold text-slate-900">{h.studentName}</span>
                      <span className="font-mono text-[10px] text-slate-400">({h.enrollmentNumber})</span>
                      <span className="font-mono text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                        {h.busNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                      <span>{h.scannedAt}</span>
                      <span
                        className={`font-bold ${
                          h.isValid ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {h.verificationCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
