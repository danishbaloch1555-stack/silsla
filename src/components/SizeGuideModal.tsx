import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CollectionType } from '../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: CollectionType;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, collection }) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#18181D] border border-[#2D2D35] rounded-xl p-6 md:p-8 text-[#F5F2EB] shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#2D2D35]">
          <div>
            <h3 className="text-xl font-bold font-display tracking-tight">RIVA Fit & Size Guide</h3>
            <p className="text-xs text-[#8B8A94] mt-0.5">
              Engineered with signature oversized streetwear proportions. For a true-to-size boxy drape, take your normal size.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8B8A94] hover:text-[#F5F2EB] hover:bg-[#222227] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit switch */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs font-mono">
          <span className="text-[#8B8A94]">Measurement unit:</span>
          <div className="inline-flex p-0.5 bg-[#121214] border border-[#2D2D35] rounded-lg">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-md transition-colors ${
                unit === 'cm' ? 'bg-[#2D2D35] text-[#F5F2EB]' : 'text-[#8B8A94] hover:text-[#F5F2EB]'
              }`}
            >
              CM
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded-md transition-colors ${
                unit === 'in' ? 'bg-[#2D2D35] text-[#F5F2EB]' : 'text-[#8B8A94] hover:text-[#F5F2EB]'
              }`}
            >
              INCHES
            </button>
          </div>
        </div>

        {/* Tables */}
        <div className="mt-4 overflow-x-auto">
          {collection === 'men' && (
            <table className="w-full text-left text-xs font-mono-nums border-collapse">
              <thead>
                <tr className="border-b border-[#2D2D35] text-[#8B8A94] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Chest Width</th>
                  <th className="py-2.5 px-3">Body Length</th>
                  <th className="py-2.5 px-3">Shoulder Width</th>
                  <th className="py-2.5 px-3">Sleeve Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222227]">
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">S</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '58 cm' : '22.8 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '72 cm' : '28.3 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '56 cm' : '22.0 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '60 cm' : '23.6 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">M</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '61 cm' : '24.0 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '74 cm' : '29.1 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '58 cm' : '22.8 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '61 cm' : '24.0 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">L</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '64 cm' : '25.2 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '76 cm' : '29.9 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '60 cm' : '23.6 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '62 cm' : '24.4 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">XL</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '67 cm' : '26.4 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '78 cm' : '30.7 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '62 cm' : '24.4 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '63 cm' : '24.8 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">XXL</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '70 cm' : '27.6 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '80 cm' : '31.5 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '64 cm' : '25.2 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '64 cm' : '25.2 in'}</td>
                </tr>
              </tbody>
            </table>
          )}

          {collection === 'women' && (
            <table className="w-full text-left text-xs font-mono-nums border-collapse">
              <thead>
                <tr className="border-b border-[#2D2D35] text-[#8B8A94] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Size</th>
                  <th className="py-2.5 px-3">Bust Width</th>
                  <th className="py-2.5 px-3">Body Length</th>
                  <th className="py-2.5 px-3">Waist (Bottoms)</th>
                  <th className="py-2.5 px-3">Hip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222227]">
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">XS</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '52 cm' : '20.5 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '64 cm' : '25.2 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '64-68 cm' : '25-27 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '92 cm' : '36.2 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">S</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '55 cm' : '21.7 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '66 cm' : '26.0 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '68-72 cm' : '27-28 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '96 cm' : '37.8 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">M</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '58 cm' : '22.8 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '68 cm' : '26.8 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '72-76 cm' : '28-30 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '100 cm' : '39.4 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">L</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '61 cm' : '24.0 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '70 cm' : '27.6 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '76-82 cm' : '30-32 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '106 cm' : '41.7 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">XL</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '64 cm' : '25.2 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '72 cm' : '28.3 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '82-88 cm' : '32-35 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '112 cm' : '44.1 in'}</td>
                </tr>
              </tbody>
            </table>
          )}

          {collection === 'kids' && (
            <table className="w-full text-left text-xs font-mono-nums border-collapse">
              <thead>
                <tr className="border-b border-[#2D2D35] text-[#8B8A94] uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Age Sizing</th>
                  <th className="py-2.5 px-3">Child Height</th>
                  <th className="py-2.5 px-3">Chest Width</th>
                  <th className="py-2.5 px-3">Jogger Length</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222227]">
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">4-5Y</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '104-110 cm' : '41-43 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '40 cm' : '15.7 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '64 cm' : '25.2 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">6-7Y</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '116-122 cm' : '45-48 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '43 cm' : '16.9 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '72 cm' : '28.3 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">8-9Y</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '128-134 cm' : '50-53 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '46 cm' : '18.1 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '80 cm' : '31.5 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">10-11Y</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '140-146 cm' : '55-57 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '49 cm' : '19.3 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '88 cm' : '34.6 in'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-[#F5F2EB]">12-14Y</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '152-164 cm' : '60-64 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '53 cm' : '20.9 in'}</td>
                  <td className="py-3 px-3">{unit === 'cm' ? '96 cm' : '37.8 in'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 p-4 bg-[#121214] rounded-lg border border-[#222227] text-xs text-[#8B8A94] space-y-1">
          <p className="font-semibold text-[#F5F2EB]">How to Measure:</p>
          <p>• Chest: Measure across the fullest part of the chest, keeping the tape horizontal under the arms.</p>
          <p>• Length: Measured from the highest point of the shoulder seam straight down to the bottom hem.</p>
          <p>• Questions? Contact our WhatsApp concierge at +92 300 1234567 for personalized sizing assistance.</p>
        </div>
      </div>
    </div>
  );
};
