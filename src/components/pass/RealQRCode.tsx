import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface RealQRCodeProps {
  value: string;
  size?: number;
  className?: string;
  colorDark?: string;
  colorLight?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export const RealQRCode: React.FC<RealQRCodeProps> = ({
  value,
  size = 120,
  className = '',
  colorDark = '#0f172a',
  colorLight = '#ffffff',
  errorCorrectionLevel = 'M',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    QRCode.toCanvas(
      canvasRef.current,
      value,
      {
        width: size,
        margin: 1,
        color: {
          dark: colorDark,
          light: colorLight,
        },
        errorCorrectionLevel,
      },
      (err) => {
        if (err) {
          console.error('Error generating QR code:', err);
          setError('Failed to generate QR');
        } else {
          setError(null);
        }
      }
    );
  }, [value, size, colorDark, colorLight, errorCorrectionLevel]);

  if (error) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center bg-rose-50 border border-rose-200 text-rose-600 text-[10px] p-2 text-center rounded-xl"
      >
        QR Error
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={`rounded-xl block ${className}`}
    />
  );
};
