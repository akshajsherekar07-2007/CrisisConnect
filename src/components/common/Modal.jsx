import { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const widths = { sm: 420, md: 560, lg: 720, xl: 900 };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 'var(--z-modal-backdrop)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, animation: 'fadeIn 0.2s ease'
    }} onClick={onClose}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)'
      }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: widths[size] || widths.md,
        maxHeight: '90vh', overflow: 'auto',
        background: 'var(--color-bg-secondary)',
        border: 'var(--border-glass)',
        borderRadius: 'var(--border-radius-xl)',
        boxShadow: 'var(--shadow-xl)',
        animation: 'fadeInUp 0.3s ease'
      }} onClick={e => e.stopPropagation()}>
        {title && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '20px 24px', borderBottom: 'var(--border-glass)'
          }}>
            <h3 style={{ fontSize: '1.1rem' }}>{title}</h3>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8, background: 'var(--color-bg-glass)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-muted)', transition: 'all 0.2s'
            }}>
              <X size={16} />
            </button>
          </div>
        )}
        <div style={{ padding: 24 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
