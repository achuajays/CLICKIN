import React from 'react';
import { X } from 'lucide-react';
import useEditorStore from '../store/editorStore';

const STICKER_CATEGORIES = [
  {
    name: 'Emojis',
    stickers: [
      '😊', '😂', '❤️', '👍', '🎉', '✨', '🌟', '💫',
      '🔥', '💯', '🎨', '🎭', '🎪', '🎡', '🎢', '🎠'
    ]
  },
  {
    name: 'Flags',
    stickers: [
      '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏴‍☠️',
      '🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇯🇵', '🇰🇷', '🇨🇳', '🇧🇷'
    ]
  }
];

interface StickerPanelProps {
  onClose: () => void;
}

const StickerPanel: React.FC<StickerPanelProps> = ({ onClose }) => {
  const { addSticker } = useEditorStore();

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white shadow-lg p-6 transform transition-transform duration-300">
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onClose}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5 mr-2" />
          <span className="font-medium">Close</span>
        </button>
      </div>

      <div className="space-y-6">
        {STICKER_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-3">
            <h3 className="font-medium text-gray-700">{category.name}</h3>
            <div className="grid grid-cols-4 gap-3">
              {category.stickers.map((sticker) => (
                <button
                  key={sticker}
                  onClick={() => {
                    addSticker(sticker);
                    onClose();
                  }}
                  className="h-12 flex items-center justify-center text-2xl bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {sticker}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickerPanel;