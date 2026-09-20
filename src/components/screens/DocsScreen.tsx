import React, { useState } from 'react';
import { 
  FileBadge2, 
  ShieldCheck, 
  QrCode, 
  CheckCircle2, 
  Calendar, 
  User, 
  Download, 
  X,
  Lock,
  AlertCircle,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VehicleDocument } from '../../types/hud';
import { VEHICLE_DOCUMENTS } from '../../data/initialData';

export const DocsScreen: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<VehicleDocument | null>(VEHICLE_DOCUMENTS[0]);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const getStatusBadge = (status: VehicleDocument['status']) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#a8c7fa] bg-[#0842a0]/40 border border-[#a8c7fa]/30 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            DIGILOCKER VERIFIED
          </span>
        );
      case 'VALID':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#c3c6cf] bg-[#272a2f] border border-[#43474e]/30 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            VALID
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#ffdad6] bg-[#93000a]/50 border border-[#ffb4ab]/40 px-2.5 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            RENEW SOON
          </span>
        );
    }
  };

  return (
    <div 
      id="hud-docs-screen" 
      className="w-full h-full p-3 sm:p-5 bg-[#111318] flex flex-col overflow-hidden select-none text-[#e1e2e8]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#43474e]/25">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#0842a0] text-[#d3e3fd] flex items-center justify-center">
            <FileBadge2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#e1e2e8] flex items-center gap-2">
              Offline Vehicle Wallet & DigiLocker
              <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#0842a0]/40 text-[#a8c7fa] font-medium border border-[#a8c7fa]/30">
                Encrypted Offline Storage
              </span>
            </h2>
            <p className="text-xs text-[#c3c6cf]">
              Legally recognized digital documents for traffic inspection and roadside assistance
            </p>
          </div>
        </div>

        {/* Universal Two-Wheeler Number Plate */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#1d2024] border border-[#43474e]/40 text-[#e1e2e8] font-mono-num font-bold text-sm tracking-widest shadow-inner">
          <span className="text-xs text-[#8d9199] font-normal border-r border-[#43474e]/40 pr-1.5">IND</span>
          <span>KA 01 TR 2026</span>
        </div>
      </div>

      {/* Main Grid: Document List + Details Viewer */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 mt-3 min-h-0 overflow-hidden">
        {/* Left Side: Document Cards (Span 5 cols) */}
        <div className="md:col-span-5 flex flex-col gap-2.5 overflow-y-auto pr-1">
          {VEHICLE_DOCUMENTS.map((doc) => {
            const isSelected = selectedDoc?.id === doc.id;
            return (
              <button
                key={doc.id}
                type="button"
                id={`hud-doc-item-${doc.id}`}
                onClick={() => setSelectedDoc(doc)}
                className={`p-3.5 rounded-[22px] border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#1d2024] border-[#a8c7fa]/60 shadow-md ring-1 ring-[#a8c7fa]/30'
                    : 'bg-[#191c20] border-[#43474e]/20 hover:bg-[#1d2024] text-[#c3c6cf]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#e1e2e8] truncate">
                    {doc.title}
                  </span>
                  {getStatusBadge(doc.status)}
                </div>

                <div className="mt-1.5 flex items-center justify-between text-xs text-[#8d9199] font-mono-num">
                  <span>{doc.documentNumber}</span>
                  <span className="text-[11px]">{doc.validity}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Side: Selected Document Detail (Span 7 cols) */}
        <div className="md:col-span-7 bg-[#1d2024] rounded-[28px] border border-[#43474e]/25 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto">
          {selectedDoc ? (
            <>
              {/* Document Header */}
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-[#43474e]/20">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#e1e2e8]">
                      {selectedDoc.title}
                    </h3>
                    <p className="text-xs text-[#c3c6cf] mt-0.5">
                      {selectedDoc.subtitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#272a2f] border border-[#43474e]/30 text-xs font-mono-num font-bold text-[#a8c7fa]">
                        {selectedDoc.documentNumber}
                      </span>
                      <span className="text-xs text-[#8d9199]">
                        Issued by {selectedDoc.issuer}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsQrModalOpen(true)}
                    className="p-2.5 rounded-full bg-[#0842a0] text-[#d3e3fd] hover:bg-[#0b57d0] transition-colors cursor-pointer shrink-0 shadow-sm"
                    title="Show Official Verification QR Code"
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>

                {/* Document Detail Fields */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-4">
                  <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                    <span className="text-[10px] text-[#8d9199] uppercase font-medium block">HOLDER / OWNER</span>
                    <span className="text-xs sm:text-sm font-bold text-[#e1e2e8]">{selectedDoc.holderName}</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#272a2f] border border-[#43474e]/20">
                    <span className="text-[10px] text-[#8d9199] uppercase font-medium block">VALIDITY PERIOD</span>
                    <span className="text-xs sm:text-sm font-bold text-[#a8c7fa]">{selectedDoc.validity}</span>
                  </div>

                  {selectedDoc.details.map((item, idx) => (
                    <div key={idx} className="p-2.5 rounded-2xl bg-[#191c20] border border-[#43474e]/15">
                      <span className="text-[10px] text-[#8d9199] block font-medium">{item.label}</span>
                      <span className="text-xs font-semibold text-[#e1e2e8] font-mono-num">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-[#43474e]/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[#8d9199]">
                  <Lock className="w-3.5 h-3.5 text-[#a8c7fa]" />
                  <span>Stored on hardware flash (accessible with no cellular reception)</span>
                </div>

                <button
                  type="button"
                  id="hud-doc-show-qr-btn"
                  onClick={() => setIsQrModalOpen(true)}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#a8c7fa] text-[#062e6f] hover:bg-[#d3e3fd] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Show Police / RTO QR</span>
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-[#8d9199] text-sm">
              Select a document to inspect
            </div>
          )}
        </div>
      </div>

      {/* QR Inspection Modal */}
      <AnimatePresence>
        {isQrModalOpen && selectedDoc && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-[#1d2024] rounded-[28px] border border-[#43474e]/30 p-6 flex flex-col items-center text-center shadow-2xl text-[#e1e2e8]"
            >
              <div className="w-full flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-[#a8c7fa] uppercase">
                  DigiLocker QR Verification
                </span>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#272a2f] text-[#c3c6cf] hover:text-[#e1e2e8] flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white rounded-2xl shadow-md border-4 border-white mb-4">
                <div className="w-44 h-44 bg-black p-2 flex flex-col items-center justify-center text-white text-center font-mono">
                  <QrCode className="w-36 h-36 text-black bg-white p-2" />
                </div>
              </div>

              <h4 className="text-sm font-bold text-[#e1e2e8]">
                {selectedDoc.title}
              </h4>
              <p className="text-xs text-[#8d9199] mt-0.5 font-mono-num">
                {selectedDoc.documentNumber}
              </p>

              <span className="mt-3 text-[11px] text-[#c3c6cf] bg-[#272a2f] px-3 py-1 rounded-full border border-[#43474e]/30">
                Official MoRTH / DigiLocker Cryptographic Signature
              </span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
