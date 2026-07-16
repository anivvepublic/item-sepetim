import { User } from 'lucide-react';
import type { User as UserType } from '@/lib/shared/types';

interface AvatarProps {
  user: UserType | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-xl',
};

export default function Avatar({ user, size = 'md', className = '' }: AvatarProps) {
  if (!user) {
    return <div className={`${sizeClasses[size]} bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center ${className}`}><User className="w-1/2 h-1/2 text-neutral-500" /></div>;
  }
  if (user.avatar_url) {
    return <img src={user.avatar_url} alt={user.username || user.email} className={`${sizeClasses[size]} rounded-full object-cover ${className}`} />;
  }
  const initial = (user.username || user.email || 'U')[0].toUpperCase();
  const colors = ['from-primary-500 to-primary-700', 'from-accent-500 to-accent-700', 'from-success-500 to-success-700', 'from-blue-500 to-blue-700', 'from-purple-500 to-purple-700', 'from-pink-500 to-pink-700'];
  const colorIndex = initial.charCodeAt(0) % colors.length;
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br ${colors[colorIndex]} rounded-full flex items-center justify-center font-bold text-white ${className}`}>
      {initial}
    </div>
  );
}