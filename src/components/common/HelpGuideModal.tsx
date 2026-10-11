import React from 'react';
import {
  X,
  User,
  Navigation,
  Shield,
  RefreshCw,
  AlertTriangle,
  Play,
  Users,
  Bell,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'student' | 'driver' | 'admin') => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-purple-200 max-w-2xl w-full max-h-[88vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                User Guide · सिस्टम को कैसे इस्तेमाल करें
              </h2>
              <p className="text-xs text-slate-500">
                Student, Driver और Admin तीनों मॉड्यूल्स का सरल गाइड
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Quick Concept */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-1.5">
            <div className="font-bold text-purple-950 text-sm flex items-center gap-2">
              <span>🌟 मुख्य विशेषता (Unified Real-Time System)</span>
            </div>
            <p className="text-purple-900 leading-relaxed">
              आप ऊपर हेडर में मौजूद <strong>Role Switcher</strong> (Student / Driver / Admin) से किसी भी समय रोल बदल सकते हैं। जब Admin या Driver कोई बदलाव करता है (जैसे बस बदलना या ब्रेकडाउन रिपोर्ट करना), तो वह तुरंत Student के फोन/डैशबोर्ड पर दिखता है!
            </p>
          </div>

          {/* Section 1: Student Module */}
          <div className="border border-purple-100 rounded-2xl p-4 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
                  <User className="w-4 h-4" />
                </span>
                <span>1. Student (विद्यार्थी) के रूप में इस्तेमाल करना</span>
              </div>
              <button
                onClick={() => {
                  onSelectRole('student');
                  onClose();
                }}
                className="text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200"
              >
                Open Student View →
              </button>
            </div>

            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li>
                <strong>आज की बस देखना:</strong> डैशबोर्ड पर आपकी आज की निर्धारित बस (उदा. <em>BUS-12</em>), ड्राइवर का नाम, मोबाइल नंबर व कॉल बटन दिखेगा।
              </li>
              <li>
                <strong>आपका पिकअप स्टॉप:</strong> आपका खुद का स्टॉप (उदा. <em>Rajendra Nagar - Stop #3</em>) गुलाबी बैज में हाइलाइट रहता है और उसका समय (07:25 AM) दिखाई देता है।
              </li>
              <li>
                <strong>लाइव बस ट्रैकिंग:</strong> नक्शे में बस की लाइव लोकेशन, स्पीड और आगे के स्टॉप्स देख सकते हैं। आप <em>"Simulate Next Stop"</em> दबाकर बस को अगले स्टॉप पर ले जा सकते हैं।
              </li>
              <li>
                <strong>सीट क्षमता (Capacity):</strong> बस में कितनी सीटें हैं, कितने छात्र सवार हैं और कितनी सीटें खाली हैं (उदा. 49/52) देख सकते हैं।
              </li>
              <li>
                <strong>डिजिटल बस पास (Bus Pass Facility):</strong> <em>"Digital Bus Pass"</em> टैब पर क्लिक करके अपना आधिकारिक डिजिटल बस पास देखें, जिसमें वेरिफाइड QR कोड, होलोग्राम सील, फीस स्टेटस और प्रिंट/डाउनलोड सुविधा उपलब्ध है।
              </li>
              <li>
                <strong>शिकायत (Complaint):</strong> अगर बस लेट हो या भीड़ ज्यादा हो, तो <em>"Report Issue / Feedback"</em> बटन दबाकर शिकायत दर्ज करें।
              </li>
            </ul>
          </div>

          {/* Section 2: Driver Module */}
          <div className="border border-purple-100 rounded-2xl p-4 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Navigation className="w-4 h-4" />
                </span>
                <span>2. Driver (चालक) के रूप में इस्तेमाल करना</span>
              </div>
              <button
                onClick={() => {
                  onSelectRole('driver');
                  onClose();
                }}
                className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg border border-indigo-200"
              >
                Open Driver View →
              </button>
            </div>

            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li>
                <strong>ट्रिप शुरू करना:</strong> सुबह बस स्टार्ट करने पर <em>"Start Morning Route Trip"</em> दबाएं।
              </li>
              <li>
                <strong>स्टॉप पर पहुँचना:</strong> जैसे ही बस किसी स्टॉप पर पहुँचे, <em>"Mark Arrived at Stop"</em> दबाएं। इससे स्टूडेंट्स को लाइव अपडेट मिल जाता है।
              </li>
              <li>
                <strong>देरी रिपोर्ट करना (Report Delay):</strong> अगर ट्रैफिक या पंचर के कारण देरी हो, तो <em>"Report Delay"</em> दबाएं।
              </li>
              <li>
                <strong>बस खराब होना (Breakdown):</strong> अगर बस में खराबी आ जाए, तो <em>"Report Bus Breakdown"</em> दबाएं।
              </li>
              <li>
                <strong>आपातकालीन SOS:</strong> किसी इमरजेंसी में लाल <em>"EMERGENCY SOS"</em> बटन दबाएं।
              </li>
            </ul>
          </div>

          {/* Section 3: Admin Module */}
          <div className="border border-purple-100 rounded-2xl p-4 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <Shield className="w-4 h-4" />
                </span>
                <span>3. Admin (रूट, टाइमिंग, ट्रिप डिलीट, बस पास व डेटा मैनेजमेंट)</span>
              </div>
              <button
                onClick={() => {
                  onSelectRole('admin');
                  onClose();
                }}
                className="text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-300"
              >
                Open Admin View →
              </button>
            </div>

            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li>
                <strong>रूट व टाइमिंग बदलना (Edit Bus Timings &amp; Stops):</strong> <em>"Route &amp; Schedule Manager"</em> टैब खोलें। जिस स्टॉप का टाइम बदलना हो, उसके टाइम पर सीधे क्लिक करें या <em>"Edit Stop"</em> दबाकर नाम, लैंडमार्क व टाइम बदलें।
              </li>
              <li>
                <strong>शेड्यूल से ट्रिप एंट्री डिलीट करना (Delete Specific Trip Entry):</strong> रूट पैनल के नीचे <em>"Route Trip Schedule &amp; Shift Timetable"</em> सेक्शन में हर शिफ्ट (Morning Inbound, Afternoon Outbound, आदि) के कार्ड पर लाल <em>"Delete Trip"</em> बटन है। उस पर क्लिक करके आप किसी भी शिफ्ट को शेड्यूल से हटा सकते हैं। नया शिफ्ट जोड़ने के लिए <em>"+ Add Trip Entry"</em> दबाएं।
              </li>
              <li>
                <strong>बस पास सुविधा (Bus Pass Facility):</strong> <em>"Bus Pass Facility"</em> टैब में जाकर किसी भी छात्र का डिजिटल पास देखें, फीस वेरिफाई करें, नया पास जारी करें (<em>"+ Issue New Bus Pass"</em>), या पास सस्पेंड/डिलीट करें।
              </li>
              <li>
                <strong>बस, रूट या ड्राइवर डिलीट करना:</strong> <em>"Fleet &amp; Drivers"</em> में हर बस और ड्राइवर के आगे लाल डिलीट आइकॉन से डिलीट कर सकते हैं। रूट मैनेजर में भी <em>"Delete Route"</em> बटन मौजूद है।
              </li>
              <li>
                <strong>छात्रों की संख्या ज्यादा होने पर (Scalability &amp; Data Storage):</strong>
                <p className="mt-1 pl-4 text-slate-500 leading-normal">
                  • <strong>डाटा कहाँ सेव होता है:</strong> इस वेब ऐप में आपका सारा डेटा (बदलाव, नई बसें, टाइमिंग, पास) ब्राउज़र के सुरक्षित <em>Local Storage</em> में लाइव सेव होता है। रिफ्रेश करने पर भी डेटा नहीं मिटता।<br />
                  • <strong>बड़ी संख्या में छात्र (10,000+ Students):</strong> सिस्टम में पेजिनेशन (Pagination), सर्च फिल्टर और रूट वाइज इंडेक्सिंग लगी है। प्रोडक्शन डिप्लॉयमेंट में यह आर्किटेक्चर PostgreSQL डेटाबेस और REST API के साथ लाखों छात्रों का डेटा बिना लैग के हैंडल करता है।
                </p>
              </li>
            </ul>
          </div>

          {/* Testing Steps */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="font-bold text-emerald-950 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>आसान टेस्टिंग का उदाहरण (Step-by-Step Test):</span>
            </div>
            <ol className="space-y-1 text-emerald-900 list-decimal list-inside pl-1 text-[11px] leading-relaxed">
              <li>ऊपर <strong>Student</strong> टैब खोलें और <strong>"Digital Bus Pass"</strong> पर क्लिक करके अपना QR पास देखें या प्रिंट करें।</li>
              <li>ऊपर <strong>Admin</strong> पर स्विच करें → <strong>"Route &amp; Schedule Manager"</strong> में जाएं → किसी स्टॉप के टाइम पर क्लिक करके समय बदलें, या किसी ट्रिप के <em>"Delete Trip"</em> बटन पर क्लिक करके शिफ्ट डिलीट करें।</li>
              <li>Admin के <strong>"Bus Pass Facility"</strong> टैब में जाकर <em>"+ Issue New Bus Pass"</em> या <em>"View Pass"</em> टेस्ट करें!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">Smart College Bus Tracking System</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors"
          >
            समझ गया (Close Guide)
          </button>
        </div>
      </div>
    </div>
  );
};
