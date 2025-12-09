import React, { useState, useEffect, useRef } from 'react';
import { Check, ChevronDown, ChevronUp, X, Building, MapPin, Users, FileText, UserPlus, Trash2, AlertTriangle, Calendar, Clock, Layers, List } from 'lucide-react';

// --- MOCK DATA CONFIGURATION ---

// 1. Define Team Members with Images
const ALL_TEAM_MEMBERS = [
  { id: 101, name: 'Sarah Miller', role: 'Inside Sales', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 102, name: 'Mike Ross', role: 'Outside Sales', image: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 103, name: 'Jessica Pearson', role: 'Inside Sales', image: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 104, name: 'Harvey Specter', role: 'Outside Sales', image: 'https://randomuser.me/api/portraits/men/86.jpg' },
  { id: 105, name: 'Louis Litt', role: 'Inside Sales', image: 'https://randomuser.me/api/portraits/men/67.jpg' },
  { id: 106, name: 'Rachel Zane', role: 'Inside Sales', image: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 107, name: 'Donna Paulsen', role: 'Inside Sales', image: 'https://randomuser.me/api/portraits/women/23.jpg' },
  { id: 108, name: 'Robert Zane', role: 'Outside Sales', image: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { id: 109, name: 'Katrina Bennett', role: 'Outside Sales', image: 'https://randomuser.me/api/portraits/women/90.jpg' }
];

// 2. Define Companies with Types
const COMPANIES = [
  // Owners
  { name: 'University of Minnesota', type: 'Owner' },
  { name: 'Boston Scientific', type: 'Owner' },
  { name: 'Mayo Clinic', type: 'Owner' },
  { name: 'Target Corporation', type: 'Owner' },
  { name: 'Medtronic', type: 'Owner' },
  { name: '3M', type: 'Owner' },
  // Contractors
  { name: 'Acme Corp', type: 'Contractor' },
  { name: 'Globex Construction', type: 'Contractor' },
  { name: 'BuildRight Inc.', type: 'Contractor' },
  { name: 'Turner Construction', type: 'Contractor' },
  // Engineers/Customers
  { name: 'Soylent Engineering', type: 'Engineer/Customer' },
  { name: 'AECOM', type: 'Engineer/Customer' },
  { name: 'Jacobs Engineering', type: 'Engineer/Customer' },
  { name: 'Tetra Tech', type: 'Engineer/Customer' }
];

// Helper to abbreviate type
const getTypeAbbr = (type) => {
  switch(type) {
    case 'Owner': return 'OWN';
    case 'Contractor': return 'CON';
    case 'Engineer/Customer': return 'ENG';
    default: return '';
  }
};

// 3. Define Default Teams (using Company Name as key)
const CUSTOMER_DEFAULT_TEAMS = {
  'University of Minnesota': [102, 104, 101],
  'Boston Scientific': [108, 103],
  'Mayo Clinic': [104, 109, 105],
  'Target Corporation': [102, 106],
  'Medtronic': [108, 104, 107],
  '3M': [109, 101],
  'Acme Corp': [102, 108, 103],
  'Globex Construction': [104, 105],
  'BuildRight Inc.': [109, 102, 106],
  'Turner Construction': [108, 107],
  'Soylent Engineering': [104, 109, 101],
  'AECOM': [102, 103],
  'Jacobs Engineering': [108, 104, 105],
  'Tetra Tech': [109, 106]
};

// Mock existing projects for uniqueness check and autosuggest
const EXISTING_PROJECTS = [
  'Skyline Plaza Renovation',
  'Skyline Heights',
  'Central Station HVAC',
  'Northside Hospital Expansion',
  'Tech Park Building A',
  'UMN Physics Lab Remodel',
  'UMN Tate Hall Renovation',
  'U of M New Residence Hall',
  'U of M Coffman Union HVAC',
  'UofM East Bank Office Expansion',
  'UofM Mayo Building Lab Remodel',
  'University of Minnesota Health Clinics',
  'University of Minnesota Field House',
  'University of Minnesota West Bank Arts Center',
  'Boston Sci Maple Grove Lab Remodel',
  'Boston Sci Weaver Lake Office Expansion',
  'Boston Sci Arden Hills Phase 2',
  'BSC Quincy Clean Room',
  'BSC Manufacturing Wing Addition',
  'BSC North Campus Lab Remodel',
  'Boston Scientific Spencer Building',
  'Boston Scientific Global Headquarters',
  'Boston Scientific Distribution Center'
];

// Generate Time Options (00 and 30 intervals, 8:00 AM - 5:00 PM)
const generateTimeOptions = () => {
  const options = [{ value: '', label: 'Select a time' }];
  // Loop from hour 8 (8 AM) to 17 (5 PM)
  for (let i = 8; i <= 17; i++) {
    const hour = i;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const hour24 = hour.toString().padStart(2, '0');

    // Add :00
    options.push({ value: `${hour24}:00`, label: `${hour12}:00 ${ampm}` });

    // Add :30 only if not the final hour (5 PM) to strictly end at 5:00
    if (i !== 17) {
        options.push({ value: `${hour24}:30`, label: `${hour12}:30 ${ampm}` });
    }
  }
  return options;
};

const DROPDOWN_OPTIONS = {
  projectStatus: [
    { value: 'Prelim', label: 'Prelim' },
    { value: 'Design', label: 'Design' },
    { value: 'Budget', label: 'Budget' },
    { value: 'Bid', label: 'Bid' },
    { value: 'Awaiting Award', label: 'Awaiting Award' },
    { value: 'Awaiting Award - T', label: 'Awaiting Award - T' },
    { value: 'Chase', label: 'Chase' },
    { value: 'Chase - T', label: 'Chase - T' },
    { value: 'Redesign', label: 'Redesign' },
    { value: 'Overbudget', label: 'Overbudget' },
    { value: 'Sold - Submitted', label: 'Sold - Submitted' },
    { value: 'Sold - Released', label: 'Sold - Released' },
    { value: 'Sold', label: 'Sold' },
    { value: 'Completed', label: 'Completed' },
    { value: 'No Bid', label: 'No Bid' },
    { value: 'Lost', label: 'Lost' },
    { value: 'Dead', label: 'Dead' },
    { value: 'Order Book', label: 'Order Book' }
  ],
  owners: [
    { value: '', label: 'Make a selection' },
    ...COMPANIES
      .filter(c => c.type === 'Owner')
      .map(c => ({ value: c.name, label: c.name }))
  ],
  customers: [
    { value: '', label: 'Make a selection' },
    { value: 'Out of State', label: 'Out of State' },
    { value: 'TBD', label: 'TBD' },
    { value: 'None', label: 'None' },
    ...COMPANIES.map(c => ({
      value: c.name,
      label: `${c.name} (${getTypeAbbr(c.type)})`
    }))
  ],
  bidTimes: generateTimeOptions(),
  influence: [
    { value: 'Unknown', label: 'Unknown' },
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ],
  visibility: [
    { value: 'Public', label: 'Public' },
    { value: 'Private', label: 'Private' },
    { value: 'Team Only', label: 'Team Only' }
  ],
  countries: [
    { value: 'USA', label: 'USA' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Mexico', label: 'Mexico' }
  ],
  states: [
    { value: '', label: 'Make a selection' },
    { value: 'AL', label: 'Alabama' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' }
  ]
};

// --- HELPER FUNCTIONS ---

const validateProjectName = (name) => {
  if (!name) return "Mandatory";
  if (name.length > 75) return "Invalid";

  const regex = /^[a-zA-Z0-9\u00C0-\u024F\s\-_.,'& #]+$/;
  if (!regex.test(name)) return "Invalid";

  const isDuplicate = EXISTING_PROJECTS.some(p => p.toLowerCase() === name.toLowerCase());
  if (isDuplicate) return "Requires a unique value";

  return null;
};

// --- SUB-COMPONENTS ---

const Modal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Yes", cancelText = "No", type = "warning" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${type === 'warning' ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`}>
               <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {message}
          </p>
          <div className="flex gap-3 justify-end">
             <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
             >
                {cancelText}
             </button>
             <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
             >
                {confirmText}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ stepNumber, label, isActive, isCompleted, summaryData, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`transition-all duration-300 ${isActive ? 'bg-blue-50/50 -mx-6 px-6 py-2 rounded-lg' : 'py-2'}`}>
        <div
            className={`flex items-center justify-between py-2 cursor-pointer select-none`}
            onClick={() => isCompleted && setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-3">
                <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors border
                ${isActive || isCompleted ? 'bg-[#0071D0] text-white border-[#0071D0]' : 'border-gray-300 text-gray-500 bg-white'}
                `}>
                {stepNumber}
                </div>
                <span className={`font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-600'}`}>
                {label}
                </span>
            </div>

            {isCompleted && (
                <div className="flex items-center text-[#0071D0] text-[10px] font-bold tracking-wide">
                    COMPLETED
                    {isExpanded ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
                </div>
            )}
        </div>

        {/* Expanded Summary View */}
        {isCompleted && isExpanded && summaryData && (
            <div className="pl-11 pr-2 pb-4 animate-fadeIn">
                <div className="space-y-3 pt-2">
                    {summaryData.map((item, idx) => (
                        <div key={idx}>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{item.label}</div>
                            <div className="text-sm text-gray-800 font-medium leading-tight">{item.value || '—'}</div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="text-[#0071D0] text-xs font-semibold hover:underline mt-4 inline-block"
                >
                    Make edits
                </button>
            </div>
        )}
    </div>
  );
};

const InputField = ({ label, name, type = "text", placeholder, value, onChange, onBlur, error, required = false, suggestions = [], step, autoFocus = false }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.length > 0 && value && type === 'text'
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()))
    : [];

  return (
    <div className="flex flex-col gap-1.5 mb-5 w-full relative">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          {label}{required && '*'}
        </label>
        {error && (
            <span className="text-[11px] font-bold text-red-600 animate-fadeIn">{error}</span>
        )}
      </div>
      <div className="relative">
        <input
            type={type}
            name={name}
            value={value}
            autoFocus={autoFocus}
            onChange={(e) => {
                onChange(e);
                if (suggestions.length > 0 && type === 'text') setShowSuggestions(true);
            }}
            onFocus={() => suggestions.length > 0 && type === 'text' && setShowSuggestions(true)}
            onBlur={(e) => {
                setTimeout(() => setShowSuggestions(false), 200);
                if (onBlur) onBlur(e);
            }}
            placeholder={placeholder}
            step={step}
            className={`w-full p-3 bg-white border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1
                ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}
                placeholder:text-gray-400 transition-colors ${type === 'date' || type === 'time' ? 'cursor-pointer' : ''}`}
        />
        {/* Removed duplicate custom icons to allow browser native icons to show properly */}
      </div>

      {showSuggestions && value && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-50 max-h-48 overflow-y-auto">
            {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, index) => (
                    <div
                        key={index}
                        className="p-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                        onClick={() => {
                            onChange({ target: { name, value: suggestion } });
                            setShowSuggestions(false);
                        }}
                    >
                        {suggestion}
                    </div>
                ))
            ) : (
                <div className="p-2 text-sm text-gray-400 italic">There are no results</div>
            )}
        </div>
      )}
    </div>
  );
};

const SelectField = ({ label, name, value, options, onChange, required = false, autoFocus = false }) => (
  <div className="flex flex-col gap-1.5 mb-5 w-full">
    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
      {label}{required && '*'}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        className="w-full p-3 bg-white border border-gray-200 rounded-md text-gray-700 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

const ReadOnlyField = ({ label, value }) => (
    <div className="mb-4">
      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-gray-900 text-sm font-medium">{value || '—'}</div>
      <div className="h-px bg-gray-100 mt-3 w-full" />
    </div>
);

const TeamMemberRow = ({ member, isPrimary, onSetPrimary, onRemove }) => (
  <div className="flex items-center justify-between py-3 px-4 bg-blue-50/30 border-b border-blue-100 last:border-0 hover:bg-blue-50/60 transition-colors">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
         {member.image ? (
            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
         ) : (
            <span className="text-xs font-bold text-gray-500">{member.name.charAt(0)}</span>
         )}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-900">{member.name}</div>
        <div className="text-xs text-gray-500">{member.role}</div>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2" onClick={() => onSetPrimary(member.id)}>
         <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${isPrimary ? 'border-[#0071D0]' : 'border-gray-300'}`}>
            {isPrimary && <div className="w-2.5 h-2.5 rounded-full bg-[#0071D0]" />}
         </div>
      </div>
      <button onClick={() => onRemove(member.id)} className="text-blue-400 hover:text-red-500 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// --- DENSE COMPONENTS FOR FLAT VIEW ---

const DenseInput = ({ label, name, type = "text", placeholder, value, onChange, onBlur, error, required = false, suggestions = [], autoFocus = false }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.length > 0 && value && type === 'text'
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()))
    : [];

  return (
    <div className="relative">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
        {label}{required && '*'}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => {
          onChange(e);
          if (suggestions.length > 0 && type === 'text') setShowSuggestions(true);
        }}
        onFocus={() => suggestions.length > 0 && type === 'text' && setShowSuggestions(true)}
        onBlur={(e) => {
          setTimeout(() => setShowSuggestions(false), 200);
          if (onBlur) onBlur(e);
        }}
        placeholder={placeholder}
        className={`w-full px-2 py-1.5 bg-white border rounded text-gray-700 text-sm focus:outline-none focus:ring-1
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'}
          placeholder:text-gray-400 transition-colors`}
      />
      {error && <span className="text-[10px] text-red-600 absolute -bottom-4 left-0">{error}</span>}

      {showSuggestions && value && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded shadow-lg mt-1 z-50 max-h-32 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-2 py-1 hover:bg-gray-50 cursor-pointer text-xs text-gray-700"
              onClick={() => {
                onChange({ target: { name, value: suggestion } });
                setShowSuggestions(false);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DenseSelect = ({ label, name, value, options, onChange, required = false }) => (
  <div>
    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
      {label}{required && '*'}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-gray-700 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

// --- FLAT VIEW COMPONENT ---

const FlatView = ({ formData, handleChange, handleBlur, errors, handleSetPrimary, handleRemoveTeamMember, handleAddTeamMember, availableMembersToAdd, handleSubmit, handleResetClick, handleExitClick }) => (
  <div className="flex-1 overflow-y-auto p-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Create New Project</h1>
        <div className="flex gap-2">
          <button
            onClick={handleResetClick}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium text-white bg-[#0071D0] rounded hover:bg-blue-700 transition"
          >
            Create Project
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">

        {/* Column 1: Project Details */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <FileText className="w-4 h-4 text-[#0071D0]" />
            <h2 className="font-semibold text-gray-900 text-sm">Project Details</h2>
          </div>
          <div className="space-y-3">
            <DenseInput
              label="Project Name"
              name="projectName"
              placeholder="Enter project name"
              value={formData.projectName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.projectName}
              required
              suggestions={EXISTING_PROJECTS}
              autoFocus
            />
            <DenseInput
              label="Project Alias"
              name="projectAlias"
              placeholder="Enter alias"
              value={formData.projectAlias}
              onChange={handleChange}
            />
            <DenseSelect
              label="Project Status"
              name="projectStatus"
              value={formData.projectStatus}
              options={DROPDOWN_OPTIONS.projectStatus}
              onChange={handleChange}
            />
            <DenseInput
              label="Description"
              name="projectDescription"
              placeholder="Description"
              value={formData.projectDescription}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-2">
              <DenseInput
                label="Bid Date"
                name="bidDate"
                type="date"
                value={formData.bidDate}
                onChange={handleChange}
              />
              <DenseSelect
                label="Bid Time"
                name="bidTime"
                value={formData.bidTime}
                options={DROPDOWN_OPTIONS.bidTimes}
                onChange={handleChange}
              />
            </div>
            <DenseSelect
              label="Visibility"
              name="visibility"
              value={formData.visibility}
              options={[{value:'', label: 'Select'}, ...DROPDOWN_OPTIONS.visibility]}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Column 2: Customer/Owner + Location */}
        <div className="space-y-4">
          {/* Customer/Owner Section */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <Building className="w-4 h-4 text-[#0071D0]" />
              <h2 className="font-semibold text-gray-900 text-sm">Customer & Owner</h2>
            </div>
            <div className="space-y-3">
              <DenseSelect label="Engineer/Customer" name="customer" value={formData.customer} options={DROPDOWN_OPTIONS.customers} onChange={handleChange} />
              <DenseSelect label="Owner" name="owner" value={formData.owner} options={DROPDOWN_OPTIONS.owners} onChange={handleChange} />
              <DenseSelect label="Owner Influence" name="ownerInfluence" value={formData.ownerInfluence} options={DROPDOWN_OPTIONS.influence} onChange={handleChange} />
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
              <MapPin className="w-4 h-4 text-[#0071D0]" />
              <h2 className="font-semibold text-gray-900 text-sm">Jobsite Location</h2>
            </div>
            <div className="space-y-3">
              <DenseInput label="Address 1" name="address1" placeholder="Address" value={formData.address1} onChange={handleChange} />
              <DenseInput label="Address 2" name="address2" placeholder="Address" value={formData.address2} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-2">
                <DenseInput label="City" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                <DenseSelect label="State" name="state" value={formData.state} options={DROPDOWN_OPTIONS.states} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <DenseInput label="Zip" name="zip" placeholder="Zip" value={formData.zip} onChange={handleChange} />
                <DenseSelect label="Country" name="country" value={formData.country} options={DROPDOWN_OPTIONS.countries} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Team Assignment */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <Users className="w-4 h-4 text-[#0071D0]" />
            <h2 className="font-semibold text-gray-900 text-sm">Quote Team</h2>
          </div>

          {/* Add Team Member */}
          <div className="mb-3">
            <DenseSelect
              label="Add Team Member"
              name="addMember"
              value=""
              options={[
                { value: '', label: 'Select to add' },
                ...availableMembersToAdd.map(m => ({ value: m.id, label: `${m.name} - ${m.role}` }))
              ]}
              onChange={handleAddTeamMember}
            />
          </div>

          {/* Team List */}
          <div className="border border-gray-100 rounded max-h-[280px] overflow-y-auto">
            {formData.assignedTeam.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {formData.assignedTeam.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                        {member.image ? (
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-gray-500">{member.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-900">{member.name}</div>
                        <div className="text-[10px] text-gray-500">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer ${member.isPrimary ? 'border-[#0071D0]' : 'border-gray-300'}`}
                        onClick={() => handleSetPrimary(member.id)}
                        title="Set as primary"
                      >
                        {member.isPrimary && <div className="w-2 h-2 rounded-full bg-[#0071D0]" />}
                      </div>
                      <button
                        onClick={() => handleRemoveTeamMember(member.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-400 text-xs">
                {formData.customer ? 'No team members assigned' : 'Select a customer first'}
              </div>
            )}
          </div>

          {formData.assignedTeam.length > 0 && (
            <div className="mt-2 text-[10px] text-gray-500">
              Primary: {formData.assignedTeam.find(m => m.isPrimary)?.name || 'None selected'}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [viewMode, setViewMode] = useState('wizard'); // 'wizard' or 'flat'
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    projectName: '',
    projectAlias: '',
    projectStatus: 'Bid',
    projectDescription: '',
    bidDate: '',
    bidTime: '',
    owner: '',
    ownerInfluence: 'Unknown',
    visibility: '',
    address1: '',
    address2: '',
    address3: '',
    country: 'USA',
    city: '',
    state: '',
    zip: '',
    customer: '',
    assignedTeam: []
  });

  const isDirty = Object.values(formData).some(val =>
    Array.isArray(val) ? val.length > 0 : val !== '' && val !== 'Bid' && val !== 'Unknown' && val !== 'USA'
  );

  // Browser level unload protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty && !isSubmitted) {
        const message = "Are you sure you want to leave this page as entered data will not be saved?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, isSubmitted]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'customer') {
      const defaultTeamIds = CUSTOMER_DEFAULT_TEAMS[value] || [];
      const defaultTeam = ALL_TEAM_MEMBERS
        .filter(m => defaultTeamIds.includes(m.id))
        .map((m, index) => ({ ...m, isPrimary: index === 0 }));

      // Check if selected customer is an Owner type
      const selectedCompany = COMPANIES.find(c => c.name === value);
      const isOwnerType = selectedCompany?.type === 'Owner';

      setFormData(prev => ({
        ...prev,
        [name]: value,
        assignedTeam: defaultTeam,
        // Auto-fill owner if customer is Owner type
        owner: isOwnerType ? value : prev.owner,
        // Auto-set influence to Yes if customer is Owner type
        ownerInfluence: isOwnerType ? 'Yes' : prev.ownerInfluence
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    let processedValue = value;
    if (name === 'projectName') {
        processedValue = value.replace(/\s+/g, ' ').trim();
        if (processedValue !== value) {
            setFormData(prev => ({ ...prev, [name]: processedValue }));
        }
    }

    let errorMsg = null;
    if (name === 'projectName') {
        errorMsg = validateProjectName(processedValue);
    } else if (!processedValue && e.target.required) {
        errorMsg = "Mandatory";
    }

    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSetPrimary = (id) => {
    setFormData(prev => ({
      ...prev,
      assignedTeam: prev.assignedTeam.map(member => ({
        ...member,
        isPrimary: member.id === id
      }))
    }));
  };

  const handleRemoveTeamMember = (id) => {
    setFormData(prev => ({
      ...prev,
      assignedTeam: prev.assignedTeam.filter(member => member.id !== id)
    }));
  };

  const handleAddTeamMember = (e) => {
    const memberId = parseInt(e.target.value);
    if (!memberId) return;

    const memberToAdd = ALL_TEAM_MEMBERS.find(m => m.id === memberId);
    if (memberToAdd && !formData.assignedTeam.find(m => m.id === memberId)) {
        setFormData(prev => ({
            ...prev,
            assignedTeam: [...prev.assignedTeam, { ...memberToAdd, isPrimary: prev.assignedTeam.length === 0 }]
        }));
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
        if (!formData.projectName) {
            setErrors(prev => ({...prev, projectName: "Mandatory"}));
            setTouched(prev => ({...prev, projectName: true}));
            return;
        }
        if (errors.projectName) return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step) => setCurrentStep(step);

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  // --- CONFIRMATION HANDLERS ---
  const handleResetClick = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setFormData({
        projectName: '',
        projectAlias: '',
        projectStatus: 'Bid',
        projectDescription: '',
        bidDate: '',
        bidTime: '',
        owner: '',
        ownerInfluence: 'Unknown',
        visibility: '',
        address1: '',
        address2: '',
        address3: '',
        country: 'USA',
        city: '',
        state: '',
        zip: '',
        customer: '',
        assignedTeam: []
    });
    setErrors({});
    setTouched({});
    setCurrentStep(1);
    setIsSubmitted(false);
    setShowResetModal(false);
  };

  const handleExitClick = () => {
    if (isDirty && !isSubmitted) {
        setShowExitModal(true);
    } else {
        // Safe to exit (In a real app, this would navigate away)
        console.log("Safe to exit - Navigating to Dashboard");
    }
  };

  const confirmExit = () => {
      // In a real app, execute navigation here
      console.log("Confirmed Exit - Navigating to Dashboard");
      setShowExitModal(false);
      // For demo purposes, we can maybe reset to simulate leaving?
      // Or just close modal since we can't actually leave the iframe.
      window.location.reload(); // Hard reset to simulate leaving
  };

  const availableMembersToAdd = ALL_TEAM_MEMBERS.filter(
    m => !formData.assignedTeam.some(existing => existing.id === m.id)
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Created!</h2>
            <p className="text-gray-600 mb-6">Your project "{formData.projectName}" has been successfully added to the dashboard.</p>
            <button
                onClick={() => {setIsSubmitted(false); setCurrentStep(1);}}
                className="w-full py-3 bg-[#0071D0] text-white font-medium rounded hover:bg-blue-700 transition"
            >
                Create Another Project
            </button>
        </div>
      </div>
    );
  }

  // --- Summary Data Generators ---
  const step1Summary = [
    { label: 'Project Name', value: formData.projectName },
    { label: 'Project Alias', value: formData.projectAlias },
    { label: 'Project Status', value: formData.projectStatus },
    { label: 'Bid Date', value: formData.bidDate },
    { label: 'Bid Time', value: formData.bidTime },
    { label: 'Description', value: formData.projectDescription },
    { label: 'Engineer/Customer', value: formData.customer },
    { label: 'Visibility', value: formData.visibility },
    { label: 'Owner', value: formData.owner },
    { label: 'Owner Influence', value: formData.ownerInfluence }
  ];

  const step2Summary = [
    { label: 'Address 1', value: formData.address1 },
    { label: 'Address 2', value: formData.address2 },
    { label: 'Address 3', value: formData.address3 },
    { label: 'City', value: formData.city },
    { label: 'State', value: formData.state },
    { label: 'Zip', value: formData.zip },
    { label: 'Country', value: formData.country },
  ];

  const step3Summary = [
    { label: 'Engineer/Customer', value: formData.customer },
    { label: 'Assigned Team', value: formData.assignedTeam.length > 0
        ? formData.assignedTeam.map(m => m.name).join(', ')
        : 'None Assigned'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans flex flex-col relative">
      {/* MODALS */}
      <Modal
        isOpen={showResetModal}
        title="Reset Form"
        message="Are you sure you want to clear all entered data?"
        onConfirm={confirmReset}
        onCancel={() => setShowResetModal(false)}
        type="warning"
      />

      <Modal
        isOpen={showExitModal}
        title="Discard Changes"
        message="Are you sure you want to leave this page as entered data will not be saved?"
        onConfirm={confirmExit}
        onCancel={() => setShowExitModal(false)}
        type="warning"
      />

      {/* HEADER */}
      <header className="px-8 py-4 bg-transparent flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="text-2xl font-black tracking-tighter text-[#0071D0] flex items-center">
                    <span className="text-orange-500 mr-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    SVL<span className="text-[#00AEEF]">ONE</span>
                    <span className="text-[10px] text-gray-400 align-top -mt-2 ml-0.5">®</span>
                </div>
                <div className="border border-orange-400 text-orange-500 px-2 py-0.5 rounded text-xs font-medium">
                    SVL, Inc.
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode('wizard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'wizard'
                  ? 'bg-[#0071D0] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Step-by-step wizard view"
            >
              <Layers className="w-4 h-4" />
              Steps
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'flat'
                  ? 'bg-[#0071D0] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Single page flat view"
            >
              <List className="w-4 h-4" />
              Flat
            </button>
          </div>

          <button
            onClick={handleExitClick}
            className="flex items-center gap-2 text-gray-900 font-medium text-sm hover:text-gray-600"
          >
            <X className="w-5 h-5" />
            Return to Dashboard
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      {viewMode === 'flat' ? (
        <FlatView
          formData={formData}
          handleChange={handleChange}
          handleBlur={handleBlur}
          errors={errors}
          handleSetPrimary={handleSetPrimary}
          handleRemoveTeamMember={handleRemoveTeamMember}
          handleAddTeamMember={handleAddTeamMember}
          availableMembersToAdd={availableMembersToAdd}
          handleSubmit={handleSubmit}
          handleResetClick={handleResetClick}
          handleExitClick={handleExitClick}
        />
      ) : (
      <div className="flex-1 flex px-8 pb-8 gap-6 max-w-[1600px] mx-auto w-full h-[calc(100vh-80px)]">

        <div className="flex-1 flex flex-col min-h-full">
          <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              <div className="sticky top-0 bg-[#F4F7FB] z-10 py-4 mb-6 border-b border-[#F4F7FB]">
                  <h1 className="text-xl font-bold text-gray-900 leading-tight">
                    {currentStep === 1 && "Step 1: Project Details"}
                    {currentStep === 2 && "Step 2: Jobsite Location"}
                    {currentStep === 3 && "Step 3: Assign SVL Quote Team"}
                    {currentStep === 4 && "Step 4: Review Project"}
                  </h1>
                  {currentStep > 1 && formData.projectName && (
                    <div className="text-base font-semibold text-[#0071D0] mt-2 flex items-center gap-2 animate-fadeIn">
                        <FileText className="w-4 h-4" />
                        Project: {formData.projectName}
                    </div>
                  )}
              </div>

              {/* STEP 1: PROJECT DETAILS */}
              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-x-8 max-w-4xl animate-fadeIn pb-10">
                  <InputField
                    label="Project Name"
                    name="projectName"
                    placeholder="Enter a project name"
                    value={formData.projectName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.projectName}
                    required={true}
                    suggestions={EXISTING_PROJECTS}
                    autoFocus={true}
                  />
                  <InputField
                    label="Project Alias"
                    name="projectAlias"
                    placeholder="Enter a project alias"
                    value={formData.projectAlias}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <SelectField label="Project Status" name="projectStatus" value={formData.projectStatus} options={DROPDOWN_OPTIONS.projectStatus} onChange={handleChange} />
                  <InputField label="Project Description" name="projectDescription" placeholder="Enter a project status description" value={formData.projectDescription} onChange={handleChange} onBlur={handleBlur} />

                  {/* New Date/Time Row */}
                  <InputField label="Bid Date" name="bidDate" type="date" value={formData.bidDate} onChange={handleChange} />
                  <SelectField label="Bid Time" name="bidTime" value={formData.bidTime} options={DROPDOWN_OPTIONS.bidTimes} onChange={handleChange} />

                  <SelectField label="Engineer/Customer" name="customer" value={formData.customer} options={DROPDOWN_OPTIONS.customers} onChange={handleChange} />
                  <SelectField label="Visibility" name="visibility" value={formData.visibility} options={[{value:'', label: 'Make a selection'}, ...DROPDOWN_OPTIONS.visibility]} onChange={handleChange} />

                  <SelectField label="Owner" name="owner" value={formData.owner} options={DROPDOWN_OPTIONS.owners} onChange={handleChange} />
                  <SelectField label="Owner Influence" name="ownerInfluence" value={formData.ownerInfluence} options={DROPDOWN_OPTIONS.influence} onChange={handleChange} />
                </div>
              )}

              {/* STEP 2: JOBSITE LOCATION */}
              {currentStep === 2 && (
                <div className="max-w-4xl animate-fadeIn pb-10">
                  <InputField label="Job Site Address 1" name="address1" placeholder="Enter an address" value={formData.address1} onChange={handleChange} onBlur={handleBlur} autoFocus={true} />
                  <InputField label="Job Site Address 2" name="address2" placeholder="Enter an address" value={formData.address2} onChange={handleChange} onBlur={handleBlur} />
                  <InputField label="Job Site Address 3" name="address3" placeholder="Enter an address" value={formData.address3} onChange={handleChange} onBlur={handleBlur} />

                  <div className="grid grid-cols-2 gap-x-8">
                    <SelectField label="Country" name="country" value={formData.country} options={DROPDOWN_OPTIONS.countries} onChange={handleChange} />
                    <InputField label="City" name="city" placeholder="Enter a city" value={formData.city} onChange={handleChange} onBlur={handleBlur} />
                    <SelectField label="State" name="state" value={formData.state} options={DROPDOWN_OPTIONS.states} onChange={handleChange} />
                    <InputField label="Zip" name="zip" placeholder="Enter a ZIP" value={formData.zip} onChange={handleChange} onBlur={handleBlur} />
                  </div>
                </div>
              )}

              {/* STEP 3: ASSIGN TEAM */}
              {currentStep === 3 && (
                <div className="max-w-3xl animate-fadeIn pb-10">
                  <SelectField label="Engineer/Customer" name="customer" value={formData.customer} options={DROPDOWN_OPTIONS.customers} onChange={handleChange} autoFocus={true} />

                  {formData.customer && (
                    <div className="mt-8 animate-fadeIn">
                        <div className="flex justify-between items-end mb-2 px-1">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Assigned Quote Team</label>
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mr-12">Primary</label>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
                            {formData.assignedTeam.length > 0 ? (
                                formData.assignedTeam.map(member => (
                                    <TeamMemberRow
                                        key={member.id}
                                        member={member}
                                        isPrimary={member.isPrimary}
                                        onSetPrimary={handleSetPrimary}
                                        onRemove={handleRemoveTeamMember}
                                    />
                                ))
                            ) : (
                                <div className="p-4 text-center text-gray-400 text-sm">No team members assigned</div>
                            )}
                        </div>

                        <div className="max-w-xs">
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Add Team Members</label>
                            <div className="relative">
                                <select
                                    onChange={handleAddTeamMember}
                                    value=""
                                    className="w-full p-3 bg-white border border-gray-200 rounded-md text-gray-700 text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Make a selection</option>
                                    {availableMembersToAdd.map(m => (
                                        <option key={m.id} value={m.id}>{m.name} - {m.role}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {currentStep === 4 && (
                <div className="max-w-4xl animate-fadeIn pb-10">
                  {/* Review Section 1 */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Company Information</h3>
                        <button onClick={() => goToStep(1)} className="text-[#0071D0] font-medium text-sm hover:underline">Make edits</button>
                    </div>
                    <div className="bg-white/50 p-6 rounded-lg border border-gray-100">
                        <ReadOnlyField label="Project Name" value={formData.projectName} />
                        <ReadOnlyField label="Project Alias" value={formData.projectAlias} />
                        <ReadOnlyField label="Project Status" value={formData.projectStatus} />
                        <ReadOnlyField label="Project Status Description" value={formData.projectDescription} />
                        <ReadOnlyField label="Bid Date" value={formData.bidDate} />
                        <ReadOnlyField label="Bid Time" value={formData.bidTime} />
                        <ReadOnlyField label="Owner" value={formData.owner} />
                        <ReadOnlyField label="Owner Influence" value={formData.ownerInfluence} />
                        <ReadOnlyField label="Visibility" value={formData.visibility} />
                    </div>
                  </div>

                  {/* Review Section 2 */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Jobsite Location</h3>
                        <button onClick={() => goToStep(2)} className="text-[#0071D0] font-medium text-sm hover:underline">Make edits</button>
                    </div>
                    <div className="bg-white/50 p-6 rounded-lg border border-gray-100">
                        <ReadOnlyField label="Address 1" value={formData.address1} />
                        <ReadOnlyField label="Address 2" value={formData.address2} />
                        <ReadOnlyField label="City" value={formData.city} />
                        <ReadOnlyField label="State" value={formData.state} />
                        <ReadOnlyField label="Zip" value={formData.zip} />
                    </div>
                  </div>

                  {/* Review Section 3 */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Assigned Team</h3>
                        <button onClick={() => goToStep(3)} className="text-[#0071D0] font-medium text-sm hover:underline">Make edits</button>
                    </div>
                    <div className="bg-white/50 p-6 rounded-lg border border-gray-100">
                        <ReadOnlyField label="Engineer/Customer" value={formData.customer} />
                        <div className="mt-4">
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Team Members</div>
                            <div className="flex flex-wrap gap-2">
                                {formData.assignedTeam.map(m => (
                                    <span key={m.id} className={`text-sm px-3 py-1 rounded-full border ${m.isPrimary ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                                        {m.name} {m.isPrimary && '(Primary)'}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* FOOTER ACTIONS - Now sticky at bottom of this container */}
          {/* Note: DOM order is Next then Back for correct tab order, CSS order-1/order-2 controls visual order */}
          <div className="mt-auto py-6 border-t border-gray-200 flex items-center gap-4 bg-[#F4F7FB]">
            {currentStep < 4 ? (
                <button onClick={nextStep} className="order-2 px-12 py-3 bg-[#0071D0] text-white font-bold rounded shadow-sm hover:bg-blue-700 transition">
                    Next
                </button>
            ) : (
                <button onClick={handleSubmit} className="order-2 px-12 py-3 bg-[#084B8A] text-white font-bold rounded shadow-sm hover:bg-[#063a6b] transition flex items-center gap-2">
                    Create Project
                    <span className="text-xs">▶</span>
                </button>
            )}

            {currentStep === 1 ? (
                <button
                  onClick={handleExitClick}
                  className="order-1 px-12 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded shadow-sm hover:bg-gray-50 transition"
                >
                    Exit
                </button>
            ) : (
                <button onClick={prevStep} className="order-1 px-12 py-3 bg-white border border-gray-200 text-gray-900 font-bold rounded shadow-sm hover:bg-gray-50 transition">
                    Go Back
                </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="w-[380px] shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-0">
            {formData.projectName && currentStep > 1 ? (
                <h2 className="text-lg font-bold text-gray-900 mb-6">{formData.projectName}</h2>
            ) : (
                <h2 className="text-lg font-bold text-gray-900 mb-6">Create New Project</h2>
            )}

            <div className="flex flex-col gap-1">
              <SidebarItem
                stepNumber={1}
                label="Project Details"
                isActive={currentStep === 1}
                isCompleted={currentStep > 1}
                summaryData={step1Summary}
                onEdit={() => goToStep(1)}
              />
              <SidebarItem
                stepNumber={2}
                label="Jobsite Location"
                isActive={currentStep === 2}
                isCompleted={currentStep > 2}
                summaryData={step2Summary}
                onEdit={() => goToStep(2)}
              />
              <SidebarItem
                stepNumber={3}
                label="Assign SVL Team"
                isActive={currentStep === 3}
                isCompleted={currentStep > 3}
                summaryData={step3Summary}
                onEdit={() => goToStep(3)}
              />

              <div className={`transition-all duration-300 ${currentStep === 4 ? 'bg-blue-50/50 -mx-6 px-6 py-2 rounded-lg' : 'py-2'}`}>
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border
                    ${currentStep === 4 ? 'border-gray-900 text-gray-900 bg-white' : 'border-gray-300 text-gray-500 bg-white'}
                  `}>
                    4
                  </div>
                  <span className={`font-medium ${currentStep === 4 ? 'text-gray-900' : 'text-gray-600'}`}>
                    Review Project
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-gray-100">
                <button
                    onClick={handleResetClick}
                    className="flex items-center gap-2 text-gray-900 font-medium text-sm hover:text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded shadow-sm w-full justify-center hover:bg-gray-50 transition"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-600">
                        <path d="M3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M12 8L16 12L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Reset Form
                </button>
            </div>
          </div>
        </div>

      </div>
      )}
    </div>
  );
}
