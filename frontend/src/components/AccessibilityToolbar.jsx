import { useEffect, useState } from 'react';

export default function AccessibilityToolbar({ settings, onToggle, onReset }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  function lerConteudoDaPagina() {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não possui suporte para leitura em voz alta.');
      return;
    }

    window.speechSynthesis.cancel();

    const conteudoPrincipal =
      document.querySelector('main')?.innerText || document.body.innerText;

    const fala = new SpeechSynthesisUtterance(conteudoPrincipal);
    fala.lang = 'pt-BR';
    fala.rate = 0.95;
    fala.pitch = 1;

    fala.onend = () => setIsSpeaking(false);
    fala.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(fala);
  }

  function pararLeitura() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <section
      className="accessibility-toolbar"
      aria-labelledby="accessibility-title"
    >
      <h2 id="accessibility-title">Recursos de acessibilidade</h2>

      <div className="accessibility-actions">
        <button
          type="button"
          className="a11y-button"
          aria-pressed={settings.highContrast}
          onClick={() => onToggle('highContrast')}
        >
          Alto contraste
        </button>

        <button
          type="button"
          className="a11y-button"
          aria-pressed={settings.grayscale}
          onClick={() => onToggle('grayscale')}
        >
          Preto e branco
        </button>

        <button
          type="button"
          className="a11y-button"
          aria-pressed={settings.largeText}
          onClick={() => onToggle('largeText')}
        >
          Fonte maior
        </button>

        <button
          type="button"
          className="a11y-button"
          onClick={lerConteudoDaPagina}
          disabled={isSpeaking}
        >
          {isSpeaking ? 'Lendo...' : 'Ler página'}
        </button>

        <button
          type="button"
          className="a11y-button"
          onClick={pararLeitura}
          disabled={!isSpeaking}
        >
          Parar leitura
        </button>

        <button type="button" className="a11y-button secondary-a11y" onClick={onReset}>
          Limpar ajustes
        </button>
      </div>
    </section>
  );
}