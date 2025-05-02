"use client";

export const DateDisplay = () => {
  return (
    <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm">
      <span>Data atual: {new Date().toLocaleDateString('pt-BR')}</span>
    </div>
  );
};
