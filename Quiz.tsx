
import React from 'react';
import { Question, QuizState } from '../types';

interface QuizProps {
  questions: Question[];
  onFinish: (score: number) => void;
  topicTitle: string;
}

const Quiz: React.FC<QuizProps> = ({ questions, onFinish, topicTitle }) => {
  const [state, setState] = React.useState<QuizState>({
    questions,
    currentQuestionIndex: 0,
    score: 0,
    isFinished: false,
    selectedOption: null,
    showExplanation: false,
  });

  // Re-sync state if questions change
  React.useEffect(() => {
    setState(prev => ({ ...prev, questions }));
  }, [questions]);

  if (!state.questions || state.questions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ups! Keine Fragen gefunden</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Es gab ein Problem beim Generieren der Fragen für dieses Thema. Bitte versuche es noch einmal.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mx-auto"
        >
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];
  
  if (!currentQuestion) return null;

  const progressPercentage = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;

  const handleOptionSelect = (index: number) => {
    if (state.selectedOption !== null) return;
    setState(prev => ({ ...prev, selectedOption: index, showExplanation: true }));
  };

  const handleNext = () => {
    const isCorrect = state.selectedOption === currentQuestion.correctAnswer;
    const nextScore = isCorrect ? state.score + 1 : state.score;

    if (state.currentQuestionIndex + 1 < state.questions.length) {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        score: nextScore,
        selectedOption: null,
        showExplanation: false,
      }));
    } else {
      setState(prev => ({ ...prev, isFinished: true, score: nextScore }));
      onFinish(nextScore);
    }
  };

  if (state.isFinished) {
    const percentage = Math.round((state.score / state.questions.length) * 100);
    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz abgeschlossen!</h2>
        <p className="text-slate-500 mb-8">Du hast das Thema <strong>{topicTitle}</strong> gemeistert.</p>
        
        <div className="flex justify-center gap-8 mb-8">
          <div>
            <div className="text-4xl font-bold text-indigo-600">{state.score}</div>
            <div className="text-sm text-slate-400 font-medium uppercase tracking-tighter">RICHTIG</div>
          </div>
          <div className="border-r border-slate-200"></div>
          <div>
            <div className="text-4xl font-bold text-slate-900">{percentage}%</div>
            <div className="text-sm text-slate-400 font-medium uppercase tracking-tighter">SCORE</div>
          </div>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mx-auto group"
        >
          <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Zurück zur Übersicht
        </button>
      </div>
    );
  }

  const isSelected = state.selectedOption !== null;
  const isCorrectChoice = state.selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{topicTitle}</h2>
          <p className="text-sm text-slate-400 font-medium">Frage {state.currentQuestionIndex + 1} von {state.questions.length}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <div className="w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="bg-indigo-600 h-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            {Math.round(progressPercentage)}% Fortgeschritten
          </span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-6 relative overflow-hidden">
        {isSelected && (
          <div className={`absolute top-0 left-0 right-0 h-2 ${isCorrectChoice ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        )}
        
        <h3 className="text-xl font-bold text-slate-900 mb-10 leading-relaxed">
          {currentQuestion.question}
        </h3>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, idx) => {
            let styleClasses = 'bg-white border-slate-200 text-slate-900 hover:border-indigo-400 hover:bg-indigo-50/30';
            let circleClasses = 'bg-slate-100 border-slate-200 text-slate-600';

            if (isSelected) {
              if (idx === currentQuestion.correctAnswer) {
                styleClasses = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-100';
                circleClasses = 'bg-emerald-500 border-emerald-500 text-white';
              } else if (idx === state.selectedOption) {
                styleClasses = 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-100';
                circleClasses = 'bg-rose-500 border-rose-500 text-white';
              } else {
                styleClasses = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60 cursor-default';
                circleClasses = 'bg-slate-200 border-slate-200 text-slate-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={isSelected}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group relative shadow-sm ${styleClasses} ${!isSelected ? 'active:scale-[0.99]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-black border-2 transition-colors ${circleClasses}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-base font-semibold leading-snug">{option}</span>
                </div>
                
                {isSelected && (
                  <div className="flex items-center ml-2">
                    {idx === currentQuestion.correctAnswer && (
                      <div className="flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Richtig</span>
                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {idx === state.selectedOption && idx !== currentQuestion.correctAnswer && (
                      <div className="flex items-center gap-2 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700">Falsch</span>
                        <svg className="w-4 h-4 text-rose-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {state.showExplanation && (
        <div className={`border-2 p-6 rounded-3xl mb-6 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md ${isCorrectChoice ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
          <div className="flex items-center gap-3 mb-3">
             <div className={`p-1.5 rounded-full ${isCorrectChoice ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                {isCorrectChoice ? (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
             </div>
             <h4 className={`font-black text-sm uppercase tracking-widest ${isCorrectChoice ? 'text-emerald-800' : 'text-rose-800'}`}>
               {isCorrectChoice ? 'Hervorragend!' : 'Lerneffekt!'}
             </h4>
          </div>
          <p className={`text-base font-medium leading-relaxed ${isCorrectChoice ? 'text-emerald-900' : 'text-rose-900'}`}>
            {currentQuestion.explanation}
          </p>
        </div>
      )}

      {isSelected && (
        <button
          onClick={handleNext}
          className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-indigo-100 active:scale-[0.98]"
        >
          {state.currentQuestionIndex + 1 === state.questions.length ? 'Ergebnis anzeigen' : 'Nächste Frage'}
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Quiz;
