function PageTitle({ title, description, children, className = "" }) {
  return (
    <div className={`mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 ${className}`}>
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm font-semibold text-slate-400">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}

export default PageTitle;
