export default function SkillBadge({ skill, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary-900/50 text-primary-300 border border-primary-700/40 transition-colors hover:bg-primary-800/50">
      {skill}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="ml-0.5 hover:text-red-400 transition-colors leading-none"
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
