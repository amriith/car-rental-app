import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white hover:shadow-lg hover:shadow-[#0B132B]/25 focus:ring-[#0B132B]',
    secondary: 'bg-[#D4AF37] text-[#0B132B] hover:bg-[#B8941F] hover:shadow-lg hover:shadow-[#D4AF37]/25 focus:ring-[#D4AF37]',
    outline: 'border-2 border-[#0B132B] text-[#0B132B] hover:bg-[#0B132B] hover:text-white focus:ring-[#0B132B]',
    ghost: 'text-[#0B132B] hover:bg-[#E5E5E5] focus:ring-[#0B132B]'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
      ) : null}
      {children}
    </motion.button>
  );
};