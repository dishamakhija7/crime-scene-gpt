import React, { useState } from 'react';
import { 
  FileText, Camera, Video, Film, Mic, Map, Car, Files, 
  Upload, X, Check, Eye
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function EvidenceUpload({ onContinue, onBack }) {
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 1, name: 'CCTV_Intersection_West.mp4', type: 'CCTV Footage', thumbnail: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=80&h=80&q=80', size: '24.5 MB' },
    { id: 2, name: 'Dashcam_Car_A.mp4', type: 'Dashcam', thumbnail: 'https://images.unsplash.com/photo-1617469167446-8027ff207515?auto=format&fit=crop&w=80&h=80&q=80', size: '18.2 MB' },
    { id: 3, name: 'Statement_Witness_1.txt', type: 'Text Statement', thumbnail: '', size: '12 KB' },
    { id: 4, name: 'Scene_Photo_01.jpg', type: 'Photos', thumbnail: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=80&h=80&q=80', size: '4.8 MB' },
    { id: 5, name: 'Sketch_Road_Layout.pdf', type: 'Sketch/Map', thumbnail: '', size: '1.5 MB' }
  ]);

  const categories = [
    { name: 'Text Statement', icon: <FileText className="w-6 h-6 text-accentTeal" />, count: 1 },
    { name: 'Photos', icon: <Camera className="w-6 h-6 text-accentPurple" />, count: 1 },
    { name: 'Videos', icon: <Video className="w-6 h-6 text-yellow-500" />, count: 0 },
    { name: 'CCTV Footage', icon: <Film className="w-6 h-6 text-red-500" />, count: 1 },
    { name: 'Audio', icon: <Mic className="w-6 h-6 text-green-500" />, count: 0 },
    { name: 'Sketch/Map', icon: <Map className="w-6 h-6 text-blue-400" />, count: 1 },
    { name: 'Dashcam', icon: <Car className="w-6 h-6 text-accentTeal" />, count: 1 },
    { name: 'Documents', icon: <Files className="w-6 h-6 text-gray-400" />, count: 0 },
  ];

  const handleUploadSimulate = (category) => {
    // Generate a simulated file
    const id = Date.now();
    const newFile = {
      id,
      name: `${category.replace(' ', '_')}_New_Upload_${Math.floor(Math.random() * 100)}.file`,
      type: category,
      thumbnail: category.includes('Photo') || category.includes('CCTV') || category.includes('Dashcam') 
        ? 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=80&h=80&q=80'
        : '',
      size: '3.1 MB'
    };
    setUploadedFiles(prev => [...prev, newFile]);
  };

  const handleRemoveFile = (id, e) => {
    e.stopPropagation();
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      {/* Container */}
      <div className="bg-[#121222]/90 border border-gray-800 rounded-2xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-wide">Add Evidence</h2>
          <p className="text-gray-400 text-xs mt-1">Upload any type of evidence. We'll analyze everything.</p>
        </div>

        {/* Upload categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {categories.map((cat, idx) => {
            const hasUploads = uploadedFiles.some(f => f.type === cat.name);
            return (
              <button
                key={idx}
                onClick={() => handleUploadSimulate(cat.name)}
                className="group relative flex flex-col items-center justify-center p-5 bg-[#0b0b14]/50 border border-gray-850 hover:border-accentPurple rounded-xl text-center transition duration-300 glass-card-hover"
              >
                {/* Plus icon on top-right */}
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#121222] border border-gray-850 flex items-center justify-center text-gray-500 group-hover:text-accentTeal group-hover:border-accentTeal transition">
                  <Upload className="w-2.5 h-2.5" />
                </div>

                <div className="mb-3 p-2 bg-[#121222] border border-gray-800 group-hover:border-accentPurple/40 rounded-lg group-hover:scale-105 transition">
                  {cat.icon}
                </div>

                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition">{cat.name}</span>
                
                {hasUploads && (
                  <span className="absolute bottom-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accentTeal opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accentTeal"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Uploaded Strip */}
        <div className="border-t border-gray-850 pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
              Uploaded ({uploadedFiles.length})
            </span>
            {uploadedFiles.length > 0 && (
              <button onClick={() => setUploadedFiles([])} className="text-[10px] text-red-400 hover:underline font-mono">
                Clear All
              </button>
            )}
          </div>

          {/* Horizontal scroll for uploaded previews */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {uploadedFiles.length === 0 ? (
              <div className="w-full text-center py-6 border border-dashed border-gray-850 rounded-xl text-gray-500 text-xs font-mono">
                No files uploaded. Click any category box above to upload.
              </div>
            ) : (
              uploadedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="flex-shrink-0 w-24 bg-[#0b0b14] border border-gray-800 rounded-lg p-2 flex flex-col items-center justify-between text-center relative group"
                >
                  <button 
                    onClick={(e) => handleRemoveFile(file.id, e)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-950/80 border border-red-500/50 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition z-10"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>

                  <div className="w-10 h-10 rounded bg-[#121222] border border-gray-800 flex items-center justify-center overflow-hidden mb-1">
                    {file.thumbnail ? (
                      <img src={file.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <FileText className="w-5 h-5 text-accentTeal" />
                    )}
                  </div>

                  <div className="w-full">
                    <p className="text-[9px] font-medium text-gray-300 truncate w-full" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[7px] text-gray-500 font-mono mt-0.5">{file.size}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button 
            onClick={onBack}
            className="flex-1 py-3 bg-[#0b0b14] hover:bg-[#0f0f20] border border-gray-800 text-gray-400 hover:text-white font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition"
          >
            Back
          </button>
          <button 
            onClick={onContinue}
            disabled={uploadedFiles.length === 0}
            className={`flex-1 py-3 font-mono text-xs uppercase tracking-wider font-bold rounded-lg transition ${
              uploadedFiles.length > 0
                ? 'bg-accentPurple hover:bg-accentPurple/90 text-white shadow-glowPurple border border-accentPurple/50'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-850'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
