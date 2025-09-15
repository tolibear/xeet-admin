'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  /** Current color value */
  value: string;
  /** Callback when color changes */
  onChange: (color: string) => void;
  /** Whether picker is disabled */
  disabled?: boolean;
  /** Label for the color picker */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e', '#64748b', '#475569', '#374151'
];

/**
 * ColorPicker Atom
 * Basic color selection component with preset colors and custom input
 * Supports hex color values with validation
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false,
  label,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomColor(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const isValidHex = (color: string): boolean => {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    if (isValidHex(color)) {
      onChange(color);
    }
  };

  const handlePresetColorSelect = (color: string) => {
    onChange(color);
    setIsOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      
      <div className="relative" ref={pickerRef}>
        {/* Color Preview Button */}
        <Button
          variant="outline"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-start gap-2 h-10"
          aria-label={`Current color: ${value}`}
          aria-expanded={isOpen}
        >
          <div
            className="w-6 h-6 rounded border border-border"
            style={{ backgroundColor: value }}
            aria-hidden="true"
          />
          <span className="font-mono text-sm">{value}</span>
        </Button>

        {/* Color Picker Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-2 p-4 bg-popover border border-border rounded-lg shadow-lg w-64">
            {/* Preset Colors */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Preset Colors</h4>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((color) => (
                  <Button
                    key={color}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "w-10 h-10 p-0 border-2",
                      color === value && "ring-2 ring-ring ring-offset-2"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handlePresetColorSelect(color)}
                    aria-label={`Select color ${color}`}
                  >
                    <span className="sr-only">{color}</span>
                  </Button>
                ))}
              </div>

              {/* Custom Color Input */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Custom Color</h4>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={customColor}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    placeholder="#000000"
                    className={cn(
                      "font-mono text-sm",
                      !isValidHex(customColor) && customColor && "border-destructive"
                    )}
                    maxLength={7}
                  />
                  <input
                    type="color"
                    value={isValidHex(customColor) ? customColor : '#000000'}
                    onChange={(e) => handleCustomColorChange(e.target.value)}
                    className="w-10 h-10 rounded border border-border cursor-pointer"
                    title="Color picker"
                  />
                </div>
                {customColor && !isValidHex(customColor) && (
                  <p className="text-xs text-destructive">
                    Please enter a valid hex color (e.g., #ff0000)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
