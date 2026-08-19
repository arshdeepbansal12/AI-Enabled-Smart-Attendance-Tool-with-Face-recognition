import { CheckCircle2, Clock, AlertTriangle, X } from 'lucide-react';

export function StatCard({ icon: Icon, title, value, trend, trendLabel, color = 'primary', delay = 0 }) {
  const colorMap = {
    primary: {
      bg: 'bg-gradient-to-br from-indigo-500/10 to-indigo-500/5',
      icon: 'text-indigo-600',
      trend: trend > 0 ? 'text-success-600' : 'text-danger-600',
      border: 'border-indigo-500',
    },
    success: {
      bg: 'bg-gradient-to-br from-success-500/10 to-success-500/5',
      icon: 'text-success-600',
      trend: trend > 0 ? 'text-success-600' : 'text-danger-600',
      border: 'border-success-500',
    },
    warning: {
      bg: 'bg-gradient-to-br from-warning-500/10 to-warning-500/5',
      icon: 'text-warning-600',
      trend: trend > 0 ? 'text-success-600' : 'text-danger-600',
      border: 'border-warning-500',
    },
    danger: {
      bg: 'bg-gradient-to-br from-danger-500/10 to-danger-500/5',
      icon: 'text-danger-600',
      trend: trend > 0 ? 'text-success-600' : 'text-danger-600',
      border: 'border-danger-500',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      className="card p-5 animate-slide-up relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${color}-500/50 to-transparent`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500 mb-1">{title}</p>
          <p className="text-3xl font-extrabold text-surface-900">{value}</p>
          {trendLabel && (
            <p className={`text-xs font-medium mt-1.5 ${c.trend}`}>
              {trend > 0 ? '↑' : '↓'} {trendLabel}
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center shadow-inner`}>
          {Icon && <Icon className={`w-6 h-6 ${c.icon}`} />}
        </div>
      </div>
    </div>
  );
}

export function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((_, i) => (
          <div key={i} className="card p-5">
            <div className="skeleton h-4 w-24 mb-3" />
            <div className="skeleton h-8 w-20 mb-2" />
            <div className="skeleton h-3 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3">
            <div className="skeleton h-10 w-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-48" />
              <div className="skeleton h-3 w-32" />
            </div>
            <div className="skeleton h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        {items.map((_, i) => (
          <div key={i} className="skeleton h-4 w-full" style={{ width: `${70 + Math.random() * 30}%` }} />
        ))}
      </div>
    );
  }

  return null;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in">
      {Icon && (
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-surface-100 to-surface-50 flex items-center justify-center mb-6 shadow-sm border border-surface-100">
          <Icon className="w-12 h-12 text-surface-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-surface-800 mb-3">{title}</h3>
      <p className="text-base text-surface-500 max-w-md text-center mb-8 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-lg shadow-md shadow-primary-500/20">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const config = {
    present: { bg: 'bg-success-100 text-success-700', icon: CheckCircle2, label: 'Present' },
    pending: { bg: 'bg-surface-100 text-surface-600', icon: Clock, label: 'Pending' },
    flagged: { bg: 'bg-danger-100 text-danger-700', icon: AlertTriangle, label: 'Flagged' },
    absent: { bg: 'bg-surface-100 text-surface-500', icon: X, label: 'Absent' },
    enrolled: { bg: 'bg-success-100 text-success-700', icon: CheckCircle2, label: 'Face Enrolled' },
    'not-enrolled': { bg: 'bg-warning-100 text-warning-700', icon: AlertTriangle, label: 'Not Enrolled' },
  };

  const c = config[status] || config.pending;
  const StatusIcon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${c.bg}`}>
      {StatusIcon && <StatusIcon className="w-3.5 h-3.5" />}
      {c.label}
    </span>
  );
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl w-full ${sizeClasses[size]} shadow-2xl animate-scale-in max-h-[85vh] flex flex-col`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100">
            <h2 className="text-xl font-bold text-surface-800">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-colors bg-surface-50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function Toggle({ enabled, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          enabled ? 'bg-primary-600' : 'bg-surface-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      {label && <span className="text-sm font-medium text-surface-700 group-hover:text-surface-900">{label}</span>}
    </label>
  );
}

export function Avatar({ name, size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const colors = [
    'from-indigo-400 to-indigo-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-amber-600',
    'from-rose-400 to-rose-600',
    'from-purple-400 to-purple-600',
    'from-fuchsia-400 to-fuchsia-600',
    'from-cyan-400 to-cyan-600',
    'from-blue-400 to-blue-600',
  ];

  // Deterministic color based on name
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div
      className={`rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-bold flex-shrink-0 ring-2 ring-white/20 shadow-sm ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}
