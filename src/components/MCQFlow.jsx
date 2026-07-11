import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MCQFlow({ onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    type: 'Vehicle Collision',
    location: 'City Road',
    weather: 'Clear',
    time: 'Evening (6PM - 12AM)',
    specify: 'Scooter skidded and hit a pole'
  });

  const steps = [
    {
      id: 1,
      question: 'What type of incident are we investigating?',
      key: 'type',
      options: [
        'Vehicle Collision',
        'Hit and Run',
        'Pedestrian Involved',
        'Multiple Vehicle Pile-up',
        'Property Damage',
        'Other'
      ]
    },
    {
      id: 2,
      question: 'Where did the incident occur?',
      key: 'location',
      options: [
        'City Road',
        'Highway',
        'Residential Area',
        'Parking Area',
        'Intersection',
        'Other'
      ]
    },
    {
      id: 3,
      question: 'What was the weather condition?',
      key: 'weather',
      options: [
        'Clear',
        'Rainy',
        'Foggy',
        'Cloudy',
        'Windy',
        'Other'
      ]
    },
    {
      id: 4,
      question: 'What time did the incident occur?',
      key: 'time',
      options: [
        'Morning (6AM - 12PM)',
        'Afternoon (12PM - 6PM)',
        'Evening (6PM - 12AM)',
        'Night (12AM - 6AM)',
        'Not Sure',
        'Other'
      ]
    }
  ];

  const currentStepData = steps[currentStep - 1];

  const handleOptionSelect = (option) => {
    setAnswers(prev => ({ ...prev, [currentStepData.key]: option }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(answers);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 md:p-6">
      {/* Questionnaire Wrapper */}
      <div className="bg-[#121222]/90 border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
        {/* Stepper Header */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-[#0b0b14] border border-transparent hover:border-gray-850 rounded-lg text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
            <Cpu className="w-3.5 h-3.5 text-accentTeal animate-pulse" />
            <span>AI Investigator MCQ</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-accentPurple/10 border border-accentPurple/30 flex items-center justify-center text-xs font-mono text-accentTeal font-bold">
            {currentStep}/4
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-[#0b0b14] rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-gradient-to-r from-accentPurple to-accentTeal transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>

        {/* Question Title */}
        <div className="mb-6">
          <span className="text-[10px] font-mono text-accentPurple uppercase tracking-widest block mb-1">Step {currentStep} of 4</span>
          <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
            {currentStepData.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3 mb-6">
          {currentStepData.options.map((option, idx) => {
            const isSelected = answers[currentStepData.key] === option;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(option)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition duration-300 ${
                  isSelected 
                    ? 'bg-accentPurple/10 border-accentPurple text-white shadow-glowPurple' 
                    : 'bg-[#0b0b14]/50 border-gray-850 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isSelected ? 'border-accentTeal bg-accentTeal/20' : 'border-gray-650'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-accentTeal" />}
                  </div>
                  <span className="text-sm font-medium">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Please Specify Input (Shows if "Other" is selected, or on Step 1 at the bottom to match the exact mockup "Scooter skidded and hit a pole") */}
        {(answers[currentStepData.key] === 'Other' || (currentStep === 1)) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-2 text-left"
          >
            <label className="text-xs font-mono text-gray-400 block">Please specify / Describe briefly</label>
            <textarea 
              value={answers.specify}
              onChange={(e) => setAnswers(prev => ({ ...prev, specify: e.target.value }))}
              placeholder="e.g. Scooter skidded and hit a pole"
              className="w-full bg-[#0b0b14] border border-gray-800 focus:border-accentPurple rounded-lg p-3 text-sm text-white placeholder-gray-600 outline-none resize-none h-20 transition"
            />
          </motion.div>
        )}

        {/* Next/Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-accentPurple hover:bg-accentPurple/90 text-white rounded-xl font-mono text-sm font-bold tracking-widest uppercase transition-all duration-300 border border-accentPurple/50 shadow-glowPurple flex items-center justify-center gap-2"
        >
          {currentStep === steps.length ? 'Generate Analysis' : 'Next'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
