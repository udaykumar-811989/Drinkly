'use client';

import React, { useState } from 'react';

const uploadHistory = [
  { id: 1, name: 'Licence_Renewal_2024.pdf', type: 'Renewal', date: '2024-01-15', status: 'approved', size: '2.4 MB' },
  { id: 2, name: 'Insurance_Certificate.pdf', type: 'Insurance', date: '2024-01-10', status: 'approved', size: '1.8 MB' },
  { id: 3, name: 'Fire_Safety_Report.pdf', type: 'Safety', date: '2024-01-05', status: 'pending', size: '3.1 MB' },
  { id: 4, name: 'Premises_Licence.pdf', type: 'Licence', date: '2023-12-20', status: 'approved', size: '4.2 MB' },
];

export default function RetailerLicence() {
  const [licenceExpiry] = useState(28);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadType, setUploadType] = useState('Renewal');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setShowUploadModal(false);
      setUploadedFile(null);
    }, 2000);
  };

  const getExpiryColor = (days: number) => {
    if (days <= 7) return 'text-red-600 bg-red-50 border-red-200';
    if (days <= 30) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Licence Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your alcohol retail licence and documents</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
          Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Alcohol Retail Licence</h2>
                  <p className="text-sm text-gray-500">Premises Licence under the Licensing Act 2003</p>
                </div>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${licenceExpiry <= 7 ? 'bg-red-100 text-red-700 border-red-200' : licenceExpiry <= 30 ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                Active
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium">Licence Number</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">LIC-2024-0847</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium">Licence Type</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Off-Licence (Retail)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium">Issuing Authority</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">Westminster Council</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium">Licence Holder</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">The Whiskey Warehouse Ltd</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium">Issue Date</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">15 March 2023</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium">Expiry Date</p>
                <p className="text-sm font-semibold text-gray-900 mt-1">14 March 2026</p>
              </div>
              <div className="col-span-2 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 font-medium">Permitted Activities</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg">Off-Sales of Alcohol</span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg">Late Night Refreshment</span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-lg">Delivery Service</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Upload History</h2>
            <div className="space-y-3">
              {uploadHistory.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} &middot; {doc.size} &middot; {doc.date}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${doc.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className={`rounded-2xl border p-6 ${getExpiryColor(licenceExpiry)}`}>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full border-4 border-current flex items-center justify-center mb-4">
                <span className="text-3xl font-bold">{licenceExpiry}</span>
              </div>
              <p className="font-semibold">Days Until Expiry</p>
              <p className="text-sm mt-1 opacity-80">Renew before 14 March 2026</p>
            </div>
            <div className="mt-4 w-full bg-white/30 rounded-full h-2">
              <div className="h-full bg-current rounded-full transition-all" style={{ width: `${((365 - licenceExpiry) / 365) * 100}%` }} />
            </div>
            <p className="text-xs mt-2 text-center opacity-70">{Math.round(((365 - licenceExpiry) / 365) * 100)}% of licence period elapsed</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Verification Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Identity Verified', status: true },
                { label: 'Address Verified', status: true },
                { label: 'Licence Document', status: true },
                { label: 'Insurance Certificate', status: true },
                { label: 'Fire Safety Report', status: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  {item.status ? (
                    <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  ) : (
                    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-2">Need to Renew?</h3>
            <p className="text-sm text-white/80 mb-4">Start your licence renewal process early to avoid any disruption to your business.</p>
            <button className="w-full py-2.5 bg-white text-purple-600 text-sm font-medium rounded-xl hover:bg-white/90 transition-colors">
              Start Renewal Process
            </button>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Upload Document</h2>
              <button onClick={() => { setShowUploadModal(false); setUploadedFile(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select value={uploadType} onChange={(e) => setUploadType(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option>Renewal</option>
                  <option>Insurance</option>
                  <option>Safety</option>
                  <option>Licence</option>
                  <option>Other</option>
                </select>
              </div>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragOver ? 'border-purple-400 bg-purple-50' : uploadedFile ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-purple-300'}`}
              >
                {uploadedFile ? (
                  <div>
                    <svg className="w-10 h-10 text-emerald-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                    <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
                    <p className="text-sm text-gray-600">Drop your file here or <label className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium">browse</label></p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileSelect} />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowUploadModal(false); setUploadedFile(null); }} className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={handleUpload} disabled={!uploadedFile || uploading} className="flex-1 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
