import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  animation = 'wave',
}: SkeletonProps) {
  const baseClasses = 'bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden relative';
  
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }[variant];

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{ width, height }}
    >
      {animation === 'wave' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
      {animation === 'pulse' && (
        <motion.div
          className="absolute inset-0 bg-neutral-300 dark:bg-neutral-700"
          animate={{
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </div>
  );
}

// Listing Card Skeleton
export function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      {/* Image */}
      <Skeleton height="13rem" animation="wave" />
      
      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton width="5rem" height="1.5rem" />
          <Skeleton width="4rem" height="1.5rem" />
        </div>
        
        {/* Title */}
        <Skeleton width="80%" height="1.5rem" />
        <Skeleton width="60%" height="1.5rem" />
        
        {/* Description */}
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="90%" height="1rem" />
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <Skeleton width="6rem" height="1rem" />
          <Skeleton width="5rem" height="2rem" />
        </div>
        
        {/* Button */}
        <Skeleton width="100%" height="3rem" className="rounded-xl" />
      </div>
    </div>
  );
}

// Listing Detail Skeleton
export function SkeletonListingDetail() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8">
      <div className="container-custom">
        {/* Back Button */}
        <Skeleton width="8rem" height="2rem" className="mb-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card overflow-hidden">
              <Skeleton height="24rem" animation="wave" />
            </div>
            
            {/* Description */}
            <div className="card p-6 lg:p-8 space-y-4">
              <Skeleton width="10rem" height="2rem" />
              <Skeleton width="100%" height="1rem" />
              <Skeleton width="95%" height="1rem" />
              <Skeleton width="80%" height="1rem" />
              <Skeleton width="90%" height="1rem" />
            </div>
            
            {/* Details */}
            <div className="card p-6 lg:p-8">
              <Skeleton width="8rem" height="2rem" className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl flex items-center gap-3">
                    <Skeleton width="3rem" height="3rem" variant="circular" />
                    <div className="flex-1 space-y-2">
                      <Skeleton width="4rem" height="0.75rem" />
                      <Skeleton width="6rem" height="1.25rem" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="card p-6 lg:p-8 space-y-6">
              <Skeleton width="100%" height="2rem" />
              <Skeleton width="60%" height="3rem" />
              <div className="flex items-center gap-3">
                <Skeleton width="3rem" height="3rem" variant="circular" />
                <div className="space-y-2">
                  <Skeleton width="3rem" height="0.75rem" />
                  <Skeleton width="5rem" height="1.25rem" />
                </div>
              </div>
              <Skeleton width="100%" height="3rem" className="rounded-xl" />
              <Skeleton width="100%" height="3rem" className="rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Skeleton
export function SkeletonProfile() {
  return (
    <div className="space-y-6">
      <Skeleton width="12rem" height="2.5rem" className="mb-2" />
      <Skeleton width="20rem" height="1.25rem" className="mb-8" />
      
      {/* Profile Card */}
      <div className="card p-6 lg:p-8 space-y-6">
        <div className="flex items-start gap-6">
          <Skeleton width="6rem" height="6rem" variant="circular" />
          <div className="flex-1 space-y-3">
            <Skeleton width="10rem" height="2rem" />
            <Skeleton width="15rem" height="1rem" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-start gap-4">
              <Skeleton width="3rem" height="3rem" />
              <div className="flex-1 space-y-2">
                <Skeleton width="5rem" height="0.875rem" />
                <Skeleton width="8rem" height="1.5rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-6 text-center space-y-4">
            <Skeleton width="4rem" height="4rem" className="mx-auto" />
            <Skeleton width="3rem" height="2.5rem" className="mx-auto" />
            <Skeleton width="8rem" height="1rem" className="mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Page Loader (genel sayfa yükleme)
export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
          <motion.div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-600 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 font-medium">Yükleniyor...</p>
      </motion.div>
    </div>
  );
}