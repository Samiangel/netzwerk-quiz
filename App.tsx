
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Quiz from './components/Quiz';
import { ViewMode, Topic, Question } from './types';
import { TOPICS } from './constants';
import { generateQuizForTopic, generateTopicContent } from './services/geminiService';

const Dashboard: React.FC<{ onSelect: (id: string, mode: ViewMode) => void }> = ({ onSelect }) => {
  const categories = Array.from(new Set(TOPICS.map(t => t.category)));

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Willkommen zurück, <span className="text-indigo-600">Entdecker!</span></h1>
        <p className="text-slate-500 text-lg">Wähle ein Modul aus, um dein IT-Wissen zu vertiefen oder direkt zu testen.</p>
      </header>

      {categories.map(category => (
        <section key={category} className="mb-10">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOPICS.filter(t => t.category === category).map(topic => (
              <div
                key={topic.id}
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-8 -mt-8 group-hover:bg-indigo-100 transition-colors" />
                
                <div className="p-6 flex-1 relative z-10">
                  <h3 className="font-bold text-slate-900 mb-2">{topic.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{topic.description}</p>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2 relative z-10">
                  <button 
                    onClick={() => onSelect(topic.id, ViewMode.LEARN)}
                    className="flex-1 bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    LESEN
                  </button>
                  <button 
                    onClick={() => onSelect(topic.id, ViewMode.QUIZ)}
                    className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    QUIZ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

const TopicDetail: React.FC<{ topic: Topic, content: string | null, onStartQuiz: () => void }> = ({ topic, content, onStartQuiz }) => {
  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Inhalte werden geladen...</p>
      </div>
    );
  }

  return (
    <article className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="prose prose-slate max-w-none">
        <div className="mb-10">
          <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            {topic.category}
          </span>
          <h1 className="text-4xl font-black text-slate-900 mb-6">{topic.title}</h1>
          <div className="h-1 w-20 bg-indigo-600 rounded-full mb-8"></div>
        </div>
        
        <div 
          className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap space-y-4 mb-16"
          dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
        />
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-indigo-900 mb-1">Bereit für den Test?</h3>
          <p className="text-indigo-700">Prüfe dein Wissen zum Thema {topic.title} mit einem KI-Quiz.</p>
        </div>
        <button 
          onClick={onStartQuiz}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-3 whitespace-nowrap active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Quiz jetzt starten
        </button>
      </div>
    </article>
  );
};

const App: React.FC = () => {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [content, setContent] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizError, setQuizError] = useState(false);

  const activeTopic = TOPICS.find(t => t.id === activeTopicId);

  const loadQuiz = async (topicTitle: string) => {
    setLoadingQuiz(true);
    setQuizError(false);
    try {
      const qs = await generateQuizForTopic(topicTitle);
      if (qs && qs.length > 0) {
        setQuizQuestions(qs);
      } else {
        setQuizError(true);
      }
    } catch (err) {
      setQuizError(true);
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleTopicSelect = (id: string, mode: ViewMode = ViewMode.LEARN) => {
    setActiveTopicId(id);
    setViewMode(mode);
    if (mode === ViewMode.LEARN) {
      setContent(null);
    }
  };

  useEffect(() => {
    if (activeTopicId && viewMode === ViewMode.LEARN && !content) {
      const topic = TOPICS.find(t => t.id === activeTopicId);
      if (topic) {
        generateTopicContent(topic.title).then(setContent);
      }
    }

    if (activeTopicId && viewMode === ViewMode.QUIZ) {
      const topic = TOPICS.find(t => t.id === activeTopicId);
      if (topic) {
        loadQuiz(topic.title);
      }
    }
  }, [activeTopicId, viewMode]);

  return (
    <Layout 
      activeTopicId={activeTopicId} 
      onTopicSelect={(id) => handleTopicSelect(id, ViewMode.LEARN)}
      viewMode={viewMode}
      setViewMode={setViewMode}
    >
      {viewMode === ViewMode.DASHBOARD && (
        <Dashboard onSelect={handleTopicSelect} />
      )}

      {viewMode === ViewMode.LEARN && activeTopic && (
        <TopicDetail 
          topic={activeTopic} 
          content={content} 
          onStartQuiz={() => setViewMode(ViewMode.QUIZ)} 
        />
      )}

      {viewMode === ViewMode.QUIZ && activeTopic && (
        loadingQuiz ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl animate-bounce flex items-center justify-center mb-6 shadow-xl shadow-indigo-100">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">KI-Experte wird konsultiert...</h3>
            <p className="text-slate-500 animate-pulse">Erstelle exklusive Fragen für "{activeTopic.title}"</p>
          </div>
        ) : quizError ? (
           <div className="bg-white p-12 rounded-3xl shadow-xl border border-slate-200 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Fehler beim Laden</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Die KI konnte keine Fragen generieren. Das passiert manchmal bei hoher Auslastung.</p>
            <button 
              onClick={() => loadQuiz(activeTopic.title)}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              Noch einmal versuchen
            </button>
          </div>
        ) : (
          <Quiz 
            topicTitle={activeTopic.title} 
            questions={quizQuestions} 
            onFinish={(score) => console.log('Quiz finished with score:', score)}
          />
        )
      )}
    </Layout>
  );
};

export default App;
