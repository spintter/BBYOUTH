import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Create a styled button component that uses the theme
const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '4px',
  padding: '10px 24px',
  textTransform: 'none',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
  '&.MuiButton-containedPrimary': {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  },
  '&.MuiButton-containedSecondary': {
    background: `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
  },
}));

interface MuiButtonProps {
  children: React.ReactNode;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

/**
 * Custom MUI Button component styled to match our theme
 */
export const MuiButton: React.FC<MuiButtonProps> = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  href,
  className,
  startIcon,
  endIcon,
}) => {
  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={onClick}
      href={href}
      className={className}
      startIcon={startIcon}
      endIcon={endIcon}
    >
      {children}
    </StyledButton>
  );
};

export default MuiButton; 