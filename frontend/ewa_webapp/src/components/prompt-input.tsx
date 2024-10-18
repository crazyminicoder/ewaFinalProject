import React from 'react';
import { Textarea } from '@nextui-org/react';

type PromptInputProps = {
  classNames?: {
    inputWrapper?: string;
    innerWrapper?: string;
    input?: string;
  };
  endContent?: React.ReactNode;
  minRows?: number;
  radius?: 'sm' | 'md' | 'lg';
  variant?: 'bordered' | 'flat';
  value?: string;
  onValueChange?: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler; // Use the generic type
  placeholder?: string;
};

const PromptInput = React.forwardRef<HTMLTextAreaElement, PromptInputProps>(
  ({ classNames = {}, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        aria-label="Prompt"
        className="min-h-[40px]"
        classNames={{
          ...classNames,
          label: 'hidden',
          input: 'py-0',
        }}
        {...props}
      />
    );
  }
);

PromptInput.displayName = 'PromptInput';

export default PromptInput;
