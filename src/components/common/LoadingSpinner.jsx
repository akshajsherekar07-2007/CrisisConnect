const LoadingSpinner = ({ size = 40, text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: 40, minHeight: 200
    }}>
      <div style={{
        width: size, height: size,
        border: '3px solid rgba(139, 92, 246, 0.15)',
        borderTopColor: 'var(--color-purple)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      {text && <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;
