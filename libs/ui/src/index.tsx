import { PropsWithChildren } from 'react';

export function PrimaryButton({ children }: PropsWithChildren) {
  return (
    <button
      type="button"
      style={{
        background: '#1d4ed8',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        padding: '10px 16px',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  );
}
