'use client';

import React, { useState, useRef, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface KeywordInputProps {
  /** Current keywords array */
  keywords: string[];
  /** Callback when keywords change */
  onChange: (keywords: string[]) => void;
  /** Placeholder text for input */
  placeholder?: string;
  /** Whether input is disabled */
  disabled?: boolean;
  /** Maximum number of keywords allowed */
  maxKeywords?: number;
  /** Label for the keyword section */
  label: string;
  /** Additional CSS classes */
  className?: string;
}

interface KeywordChipProps {
  /** Keyword text */
  keyword: string;
  /** Callback when keyword is removed */
  onRemove: () => void;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Color scheme for the chip */
  variant?: "default" | "secondary" | "destructive";
}

/**
 * KeywordChip Atom
 * Basic building block for displaying removable keywords
 */
export const KeywordChip: React.FC<KeywordChipProps> = ({
  keyword,
  onRemove,
  disabled = false,
  variant = "default"
}) => {
  return (
    <Badge 
      variant={variant}
      className={cn(
        "flex items-center gap-1 px-2 py-1 text-xs",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      {keyword}
      <Button
        variant="ghost"
        size="sm"
        className="h-3 w-3 p-0 hover:bg-destructive hover:text-destructive-foreground"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove keyword: ${keyword}`}
      >
        <X className="h-2 w-2" />
      </Button>
    </Badge>
  );
};

/**
 * KeywordInput Molecule
 * Composition of Input + Keywords for managing keyword lists
 * Supports adding/removing keywords with keyboard navigation
 */
export const KeywordInput: React.FC<KeywordInputProps> = ({
  keywords,
  onChange,
  placeholder = "Type and press Enter to add keywords...",
  disabled = false,
  maxKeywords = 20,
  label,
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    
    if (
      trimmedKeyword &&
      !keywords.includes(trimmedKeyword) &&
      keywords.length < maxKeywords
    ) {
      onChange([...keywords, trimmedKeyword]);
      setInputValue('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    onChange(keywords.filter(keyword => keyword !== keywordToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && keywords.length > 0) {
      // Remove last keyword when backspacing on empty input
      removeKeyword(keywords[keywords.length - 1]);
    } else if (e.key === ',' || e.key === ';') {
      e.preventDefault();
      addKeyword(inputValue);
    }
  };

  const isMaxReached = keywords.length >= maxKeywords;

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {maxKeywords && (
          <span className="ml-2 text-xs text-muted-foreground">
            ({keywords.length}/{maxKeywords})
          </span>
        )}
      </label>
      
      {/* Keywords Display */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {keywords.map((keyword) => (
            <KeywordChip
              key={keyword}
              keyword={keyword}
              onRemove={() => removeKeyword(keyword)}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Input Field */}
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isMaxReached ? `Maximum ${maxKeywords} keywords reached` : placeholder}
        disabled={disabled || isMaxReached}
        className="w-full"
        aria-describedby={`${label.toLowerCase().replace(/\s+/g, '-')}-help`}
      />
      
      <p 
        id={`${label.toLowerCase().replace(/\s+/g, '-')}-help`}
        className="text-xs text-muted-foreground"
      >
        Press Enter, comma, or semicolon to add keywords. Backspace to remove the last keyword.
      </p>
    </div>
  );
};

export default KeywordInput;
