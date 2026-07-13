import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShieldCheck, Edit2, Car, Calendar, Clock, 
  MapPin, Cloud, Map, Eye, Users, User, Flag, X, FileText 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { createCase } from '../services/firestore';

export default function CreateCase({ onCancel, onSuccess }) {
  // Generate a random case ID initially
  const [caseId, setCaseId] = useState(`INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    incidentType: 'Vehicle Collision',
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format for date input
    time: '10:30',
    location: '',
    weather: 'Clear',
    roadType: 'Urban',
    roadCondition: 'Dry',
    visibility: 'Good',
    vehiclesInvolved: '2',
    peopleInvolved: '2',
    officer: '',
    priority: 'High',
    description: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Set the default officer to logged in user
  useEffect(() => {
    if (auth.currentUser) {
      setFormData(prev => ({
        ...prev,
        officer: auth.currentUser.displayName || auth.currentUser.email || 'Inspector Arjun'
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caseId || !formData.title || !formData.location) {
      setError("Please fill in all required fields (marked with *).");
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      const newCaseData = {
        caseId,
        caseTitle:           formData.title,
        incidentType:        formData.incidentType,
        date:                formData.date,
        time:                formData.time,
        location:            formData.location,
        weather:             formData.weather,
        roadType:            formData.roadType,
        roadCondition:       formData.roadCondition,
        visibility:          formData.visibility,
        numberOfVehicles:    parseInt(formData.vehiclesInvolved, 10),
        numberOfPeople:      parseInt(formData.peopleInvolved, 10),
        investigatingOfficer: formData.officer,
        priority:            formData.priority,
        description:         formData.description,
        status:              'In Progress',
        createdBy:           auth.currentUser?.uid || 'unknown',
        // Legacy aliases kept for dashboard compatibility
        title:               formData.title,
        accidentType:        formData.incidentType,
      };

      await createCase(caseId, newCaseData);
      onSuccess(caseId);
    } catch (err) {
      console.error("Error creating case:", err);
      setError("Failed to create case. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <button 
            onClick={onCancel}
            className="mt-1 w-10 h-10 bg-[#121222] border border-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-xs font-mono font-bold text-accentTeal tracking-widest uppercase mb-1">New Case</p>
            <h1 className="text-3xl font-bold text-white mb-2">Create a New Case</h1>
            <p className="text-gray-400 text-sm">Enter case details to register a new investigation.</p>
          </div>
        </div>

        <div className="bg-[#121222]/80 border border-gray-800 rounded-xl p-4 flex items-center gap-3 max-w-sm">
          <ShieldCheck className="w-5 h-5 text-accentTeal flex-shrink-0" />
          <p className="text-xs text-gray-300">All cases are securely stored and can be used for multiple investigations.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-[#121222]/90 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-10 shadow-2xl">
        
        {/* CASE IDENTIFICATION */}
        <section>
          <h2 className="text-xs font-mono font-bold text-accentTeal tracking-widest uppercase mb-6">Case Identification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Case ID <span className="text-red-500">*</span>
              </label>
              <div className="text-xs text-gray-500 mb-2">Auto-generated ID. You can edit if needed.</div>
              <div className="relative">
                <input 
                  type="text" 
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-accentTeal outline-none transition"
                />
                <Edit2 className="absolute right-4 top-3.5 w-4 h-4 text-gray-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Case Title <span className="text-red-500">*</span>
              </label>
              <div className="text-xs text-transparent mb-2 select-none">Spacer</div>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Vehicle Collision - City Rd"
                className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-accentTeal outline-none transition"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-800/50" />

        {/* INCIDENT DETAILS */}
        <section>
          <h2 className="text-xs font-mono font-bold text-accentTeal tracking-widest uppercase mb-6">Incident Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Incident Type <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Car className="absolute left-4 w-4 h-4 text-gray-500" />
                <select 
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition appearance-none"
                >
                  <option value="Vehicle Collision">Vehicle Collision</option>
                  <option value="Pedestrian Incident">Pedestrian Incident</option>
                  <option value="Hit and Run">Hit and Run</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0"></div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Date of Incident <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-accentTeal outline-none transition [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                />
                <Calendar className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Time of Incident <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-accentTeal outline-none transition [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                />
                <Clock className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City Road, Mumbai, Maharashtra"
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-11 py-3 text-white focus:border-accentTeal outline-none transition"
                />
                <button type="button" className="absolute right-4 top-3.5 text-accentPurple hover:text-accentPurple/80 transition">
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Weather Condition</label>
              <div className="relative flex items-center">
                <Cloud className="absolute left-4 w-4 h-4 text-gray-500" />
                <select 
                  name="weather"
                  value={formData.weather}
                  onChange={handleChange}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition appearance-none"
                >
                  <option value="Clear">Clear</option>
                  <option value="Rain">Rain</option>
                  <option value="Fog">Fog</option>
                  <option value="Snow">Snow</option>
                </select>
                <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Road Type</label>
              <div className="relative flex items-center">
                <Map className="absolute left-4 w-4 h-4 text-gray-500" />
                <select 
                  name="roadType"
                  value={formData.roadType}
                  onChange={handleChange}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition appearance-none"
                >
                  <option value="Urban">Urban</option>
                  <option value="Highway">Highway</option>
                  <option value="Rural">Rural</option>
                  <option value="Dirt">Dirt</option>
                </select>
                <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0"></div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Road Condition</label>
              <div className="relative flex items-center">
                <Car className="absolute left-4 w-4 h-4 text-gray-500 opacity-50" />
                <select 
                  name="roadCondition"
                  value={formData.roadCondition}
                  onChange={handleChange}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition appearance-none"
                >
                  <option value="Dry">Dry</option>
                  <option value="Wet">Wet</option>
                  <option value="Icy">Icy</option>
                  <option value="Uneven">Uneven</option>
                </select>
                <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0"></div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Visibility</label>
              <div className="relative flex items-center">
                <Eye className="absolute left-4 w-4 h-4 text-gray-500" />
                <select 
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition appearance-none"
                >
                  <option value="Good">Good</option>
                  <option value="Poor">Poor</option>
                  <option value="Night">Night</option>
                </select>
                <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Number of Vehicles Involved</label>
              <div className="relative">
                <Car className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input 
                  type="number" 
                  name="vehiclesInvolved"
                  value={formData.vehiclesInvolved}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Number of People Involved</label>
              <div className="relative">
                <Users className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input 
                  type="number" 
                  name="peopleInvolved"
                  value={formData.peopleInvolved}
                  onChange={handleChange}
                  min="1"
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition"
                />
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-800/50" />

        {/* ASSIGNMENT & PRIORITY */}
        <section>
          <h2 className="text-xs font-mono font-bold text-accentTeal tracking-widest uppercase mb-6">Assignment & Priority</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Investigating Officer <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  name="officer"
                  value={formData.officer}
                  onChange={handleChange}
                  placeholder="Inspector Name"
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">Priority</label>
              <div className="relative flex items-center">
                <Flag className={`absolute left-4 w-4 h-4 ${formData.priority === 'High' ? 'text-accentPurple' : formData.priority === 'Medium' ? 'text-yellow-500' : 'text-green-500'}`} />
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl pl-11 pr-4 py-3 text-white focus:border-accentTeal outline-none transition appearance-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div className="absolute right-4 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-500 w-0 h-0"></div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-gray-800/50" />

        {/* DESCRIPTION */}
        <section>
          <h2 className="text-xs font-mono font-bold text-accentTeal tracking-widest uppercase mb-6">Description (Optional)</h2>
          <label className="block text-xs font-medium text-gray-300 mb-2">Case Description</label>
          <div className="relative">
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              placeholder="Two-wheeler collided with a sedan..."
              className="w-full bg-[#0b0b14] border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-accentTeal outline-none transition resize-none"
            />
            <div className="absolute bottom-3 right-4 text-xs text-gray-500 font-mono">
              {formData.description.length} / 500
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="flex-1 py-4 bg-[#0b0b14] border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white font-mono text-sm tracking-wider uppercase font-bold rounded-xl flex items-center justify-center gap-2 transition"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <button 
            type="submit"
            disabled={submitting}
            className={`flex-1 py-4 bg-accentPurple hover:bg-accentPurple/90 text-white font-mono text-sm tracking-wider uppercase font-bold rounded-xl shadow-glowPurple border border-accentPurple/50 flex items-center justify-center gap-2 transition ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Creating...' : (
              <>
                <FileText className="w-4 h-4" /> Create Case
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
