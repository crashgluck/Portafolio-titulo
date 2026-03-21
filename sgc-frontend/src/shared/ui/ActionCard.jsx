const ActionCard = ({ title, description, icon, onClick, isPrimary = false }) => {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-start p-6 rounded-xl border transition-all duration-300 text-left w-full ${
        isPrimary
          ? 'bg-stone-900 border-stone-900 shadow-md hover:shadow-xl hover:-translate-y-1'
          : 'bg-stone-50 border-stone-200 hover:border-amber-600 hover:shadow-md hover:-translate-y-1'
      }`}
    >
      <div
        className={`p-3 rounded-lg mb-4 transition-colors duration-300 ${
          isPrimary
            ? 'bg-stone-700 text-amber-300'
            : 'bg-stone-100 text-stone-700 group-hover:bg-amber-600 group-hover:text-amber-50'
        }`}
      >
        {icon}
      </div>

      <h3 className={`font-bold text-lg mb-1 transition-colors duration-300 ${isPrimary ? 'text-stone-50' : 'text-stone-900'}`}>
        {title}
      </h3>
      <p className={`text-sm leading-snug ${isPrimary ? 'text-stone-300' : 'text-stone-600'}`}>{description}</p>
    </button>
  )
}

export default ActionCard
