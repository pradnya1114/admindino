import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Settings, Image, Palette, Save, ArrowLeft, RefreshCw, Upload } from 'lucide-react';
import { AppSettings } from '../types';

interface AdminPanelProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, onUpdateSettings, onExit }) => {
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    alert('Settings saved successfully!');
  };

  const resetToDefault = () => {
    const defaults = {
      logoUrl: '/logo.png',
      backgroundColor: '#f7f7f7',
      backgroundImageUrl: ''
    };
    setLocalSettings(defaults);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      // 1MB limit check to prevent localStorage quota issues
      if (file.size > 1024 * 1024) {
        alert('File too large! Please select an image under 1MB for smooth performance.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'logo') {
          setLocalSettings(prev => ({ ...prev, logoUrl: base64 }));
        } else {
          setLocalSettings(prev => ({ ...prev, backgroundImageUrl: base64 }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-game-text max-w-lg w-full max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-8 overflow-hidden">
        <h2 className="text-xl font-black uppercase flex items-center gap-3">
          <Settings className="text-game-accent" size={24} />
          Admin Panel
        </h2>
        <button 
          onClick={onExit}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Logo Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image size={14} />
              Logo Image
            </div>
          </label>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={localSettings.logoUrl}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
              className="flex-1 border-2 border-game-text/20 p-3 text-[10px] font-sans focus:border-game-accent outline-none rounded-lg"
              placeholder="Image URL or local file"
            />
            <button 
              onClick={() => logoInputRef.current?.click()}
              className="px-4 bg-game-text text-white rounded-lg hover:bg-game-text/90 transition-colors flex items-center gap-2 text-[10px] uppercase font-bold"
            >
              <Upload size={14} />
              PNG
            </button>
            <input 
              ref={logoInputRef}
              type="file" 
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'logo')}
            />
          </div>
          
          {localSettings.logoUrl && (
            <div className="p-2 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50">
              <img src={localSettings.logoUrl} alt="Preview" className="h-12 object-contain" />
            </div>
          )}
        </div>

        {/* Background Color Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Palette size={14} />
            Background Color
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={localSettings.backgroundColor}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
              className="w-12 h-12 border-2 border-game-text rounded-lg cursor-pointer flex-shrink-0"
            />
            <input
              type="text"
              value={localSettings.backgroundColor}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, backgroundColor: e.target.value }))}
              className="flex-1 border-2 border-game-text/20 p-3 text-[10px] font-mono focus:border-game-accent outline-none rounded-lg"
            />
          </div>
        </div>

        {/* Background Image Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Image size={14} />
            Background Image (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={localSettings.backgroundImageUrl}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, backgroundImageUrl: e.target.value }))}
              className="flex-1 border-2 border-game-text/20 p-3 text-[10px] font-sans focus:border-game-accent outline-none rounded-lg"
              placeholder="Image URL or local file"
            />
            <button 
              onClick={() => bgInputRef.current?.click()}
              className="px-4 bg-game-text text-white rounded-lg hover:bg-game-text/90 transition-colors flex items-center gap-2 text-[10px] uppercase font-bold"
            >
              <Upload size={14} />
              PNG
            </button>
            <input 
              ref={bgInputRef}
              type="file" 
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'background')}
            />
          </div>
          {localSettings.backgroundImageUrl && (
            <div className="p-2 border-2 border-dashed border-gray-100 rounded-lg flex items-center justify-center bg-gray-50 relative overflow-hidden h-20">
              <img src={localSettings.backgroundImageUrl} alt="BG Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                 <button 
                   onClick={() => setLocalSettings(p => ({...p, backgroundImageUrl: ''}))}
                   className="bg-white text-game-accent p-1 rounded font-bold text-[8px] uppercase"
                 >
                   Remove
                 </button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-6 flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={resetToDefault}
            className="flex-1 border-2 border-game-text p-4 rounded-xl font-press-start text-[10px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-all shadow-[0_4px_0_0_#333] active:shadow-none active:translate-y-[2px]"
          >
            <RefreshCw size={14} />
            RESET
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-[2] bg-game-accent text-white p-4 rounded-xl font-press-start text-[10px] flex items-center justify-center gap-2 shadow-[0_4px_0_0_#cc4141] active:shadow-none active:translate-y-[2px] transition-all"
          >
            <Save size={14} />
            SAVE CHANGES
          </motion.button>
        </div>
      </div>

      <p className="mt-8 text-center text-[8px] text-gray-400 font-sans">
        Settings are saved to the browser's local storage.
      </p>
    </motion.div>
  );
};

export default AdminPanel;
