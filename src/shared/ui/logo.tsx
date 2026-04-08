import React from 'react';
import Image from 'next/image';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
    const sizeMap = {
        sm: { width: 80, height: 30 },
        md: { width: 120, height: 45 },
        lg: { width: 160, height: 60 },
        xl: { width: 200, height: 75 },
    };

    const dimensions = sizeMap[size];

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Image
                src="/logo.svg"
                alt="Logo"
                width={dimensions.width}
                height={dimensions.height}
                priority
            />
        </div>
    );
};