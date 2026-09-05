import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', style }) => {
  return React.createElement('iconify-icon', {
    icon: name,
    class: className,
    style: style
  });
};
