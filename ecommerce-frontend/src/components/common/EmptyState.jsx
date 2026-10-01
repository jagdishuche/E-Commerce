import React from 'react';
import { Link } from 'react-router-dom';
import { PackageOpen, ArrowRight } from 'lucide-react';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Looks like there is nothing to show here yet.',
  actionText = 'Start Shopping',
  actionLink = '/products',
  onAction = null,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mb-5 shadow-inner">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6 text-sm">{description}</p>
      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-md transition-colors"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
