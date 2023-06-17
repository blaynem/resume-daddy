import { TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

export type IconType = React.ComponentType<React.ComponentProps<'svg'>>;
export const IconButton = ({
  onClick,
  iconType,
  iconSrText,
  padding = 'p-2',
  height = 'h-6',
  width = 'w-6',
}: {
  onClick: () => void;
  iconType: IconType;
  iconSrText: string;
  className?: string;
  padding?: string;
  height?: string;
  width?: string;
}) => (
  <button
    type="button"
    className={`rounded-md text-gray-700 ${padding} hover:bg-gray-100 hover:text-gray-900`}
    onClick={onClick}
  >
    <span className="sr-only">{iconSrText}</span>
    {React.createElement(iconType, {
      className: `${height} ${width}`,
      'aria-hidden': 'true',
    })}
  </button>
);

export const EditableInput = ({
  value,
  isTextarea,
  header,
  isEditMode,
  placeholder,
  disabled,
  onChange,
  onDeleteClick,
}: {
  isEditMode: boolean;
  value: string;
  header: string;
  isTextarea?: boolean;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onDeleteClick?: () => void;
}) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.stopPropagation();
    onChange(event.target.value);
  };

  const FieldComponent = isTextarea ? 'textarea' : 'input';
  const splitValue = value.split('\n') as string[];

  return (
    <div className="mb-4 w-full">
      <div className="mb-0 flex">
        <p className="text-md font-semibold">{header}</p>
        {isEditMode && onDeleteClick && (
          <IconButton
            padding="p-0 ml-2"
            iconSrText="Delete Job"
            iconType={TrashIcon as IconType}
            onClick={onDeleteClick}
          />
        )}
      </div>
      {isEditMode ? (
        <FieldComponent
          // Prevents the click from bubbling up to the parent button
          onClick={(e) => e.stopPropagation()}
          type="text"
          disabled={disabled}
          className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
        />
      ) : (
        <ul className="px-3 py-1.5 h-min-6">
          {!value && (
            <li className="text-start sm:text-sm sm:leading-6 text-gray-400">
              {placeholder}
            </li>
          )}
          {splitValue.map((line: string, index: number) => (
            <li key={index} className="text-start sm:text-sm sm:leading-6">
              {line}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
