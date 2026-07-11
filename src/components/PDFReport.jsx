import React from 'react';
import { ArrowLeft, Printer, Download, Sparkles, FileText, CheckSquare } from 'lucide-react';

export default function PDFReport({ onBack }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Dev Navigation / Action bar */}
      <div className="flex justify-between items-center bg-[#121222]/80 border border-gray-800 p-3 rounded-xl no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="flex gap-2">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b0b14] border border-gray-800 text-[10px] text-accentTeal font-mono rounded hover:border-accentTeal transition"
          >
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
        </div>
      </div>

      {/* Official Light Themed Document */}
      <div className="bg-white text-gray-900 border border-gray-300 rounded-xl p-8 shadow-lg max-w-3xl mx-auto print:border-none print:shadow-none print:p-0 font-serif">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center font-sans font-extrabold text-sm">
                Q
              </div>
              <div>
                <h1 className="text-xl font-bold font-sans tracking-wide text-gray-900">CRIMESCENE GPT</h1>
                <p className="text-[9px] font-sans uppercase tracking-wider text-gray-500">AI-Powered Accident Reconstruction & Investigation</p>
              </div>
            </div>
          </div>
          <div className="text-right text-xs font-mono text-gray-600">
            <div>CONFIDENTIAL REPORT</div>
            <div>CASE: INV-2025-0715</div>
            <div>DATE: 15 May 2025, 10:20 AM</div>
          </div>
        </div>

        <h2 className="text-2xl font-bold font-sans border-b border-gray-300 pb-2 mb-6">Investigation Report</h2>

        {/* 1. Incident Details */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-1">1. Incident Details</h3>
          
          <table className="w-full text-xs text-left border-collapse">
            <tbody>
              <tr>
                <th className="py-2 border-b border-gray-200 text-gray-600 font-bold w-1/3">Type of Incident</th>
                <td className="py-2 border-b border-gray-200 font-sans font-semibold">Vehicle Collision</td>
              </tr>
              <tr>
                <th className="py-2 border-b border-gray-200 text-gray-600 font-bold">Location</th>
                <td className="py-2 border-b border-gray-200 font-sans font-semibold">City Road, MG Road</td>
              </tr>
              <tr>
                <th className="py-2 border-b border-gray-200 text-gray-600 font-bold">Date & Time</th>
                <td className="py-2 border-b border-gray-200 font-sans font-semibold">15 May 2025, 10:15 AM</td>
              </tr>
              <tr>
                <th className="py-2 border-b border-gray-200 text-gray-600 font-bold">Weather Conditions</th>
                <td className="py-2 border-b border-gray-200 font-sans font-semibold">Clear</td>
              </tr>
              <tr>
                <th className="py-2 border-b border-gray-200 text-gray-600 font-bold">Investigating Officer</th>
                <td className="py-2 border-b border-gray-200 font-sans font-semibold">Inspector Arjun</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 2. Evidence Summary */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-1">2. Evidence Summary</h3>
          
          <div className="grid grid-cols-6 gap-2 text-center">
            <div className="border border-gray-300 rounded p-2">
              <div className="text-[10px] font-sans text-gray-500 uppercase">Text</div>
              <div className="text-base font-bold font-sans mt-0.5">2</div>
            </div>
            <div className="border border-gray-300 rounded p-2">
              <div className="text-[10px] font-sans text-gray-500 uppercase">Photos</div>
              <div className="text-base font-bold font-sans mt-0.5">6</div>
            </div>
            <div className="border border-gray-300 rounded p-2">
              <div className="text-[10px] font-sans text-gray-500 uppercase">Videos</div>
              <div className="text-base font-bold font-sans mt-0.5">1</div>
            </div>
            <div className="border border-gray-300 rounded p-2">
              <div className="text-[10px] font-sans text-gray-500 uppercase">CCTV</div>
              <div className="text-base font-bold font-sans mt-0.5">2</div>
            </div>
            <div className="border border-gray-300 rounded p-2">
              <div className="text-[10px] font-sans text-gray-500 uppercase">Audio</div>
              <div className="text-base font-bold font-sans mt-0.5">1</div>
            </div>
            <div className="border border-gray-300 rounded p-2">
              <div className="text-[10px] font-sans text-gray-500 uppercase">Docs</div>
              <div className="text-base font-bold font-sans mt-0.5">2</div>
            </div>
          </div>
        </div>

        {/* 3. Scenario Analysis */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-gray-700 bg-gray-100 px-2 py-1">3. Scenario Analysis</h3>
          
          <div>
            <div className="flex justify-between items-center text-xs font-sans font-bold mb-1">
              <span>Scenario A (Most Likely)</span>
              <span className="text-green-600">82% Confidence</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: '82%' }} />
            </div>
          </div>

          <div className="text-xs space-y-2 mt-4 leading-relaxed font-serif">
            <p><strong>Primary Incident Logic:</strong> Car A entered MG Road intersection traveling west-bound, ignoring traffic signals. Point of impact confirmed on the rear-left quarter panel of Car B. Speed vectors verify Car A velocity exceeded speed limit at 43 km/h.</p>
            
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Car A run red light signal (confirmed with 85% CCTV confidence).</li>
              <li>Pedestrian crosswalk clearance was consistent with green walk phase (92% telemetry confidence).</li>
              <li>Impact deflection angles correspond to Car B attempt to brake and swerve.</li>
            </ul>
          </div>

          {/* Sketch thumbnail */}
          <div className="border border-gray-300 rounded p-2 mt-4 flex items-center justify-center bg-gray-55">
            <div className="text-center py-6 text-xs text-gray-550 font-sans">
              [Embedded 3D Vehicle Trajectory Mesh Reconstruction Map]
              <div className="text-[10px] text-gray-400 mt-1">Ref ID: OBJ-GRID-MESH-0715-A</div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-12 pt-8 border-t border-gray-300 flex justify-between text-xs font-sans">
          <div>
            <div className="border-b border-gray-500 w-40 h-8" />
            <div className="text-gray-500 mt-1">Inspector Arjun</div>
            <div className="text-[10px] text-gray-400">Investigating Officer Signature</div>
          </div>
          <div className="text-right">
            <div className="h-8" />
            <div className="text-gray-500">CrimeScene GPT Reconstruction Engine</div>
            <div className="text-[10px] text-gray-400">Verifiably signed via AI-Telemetry Auth</div>
          </div>
        </div>

      </div>
    </div>
  );
}
