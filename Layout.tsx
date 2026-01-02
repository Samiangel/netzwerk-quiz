
import React from 'react';
import { TOPICS } from '../constants';
import { ViewMode, Topic } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTopicId: string | null;
  onTopicSelect: (topicId: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTopicId, onTopicSelect, viewMode, setViewMode }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTopics = TOPICS.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-100 bg-indigo-600">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="bg-white text-indigo-600 p-1 rounded-md">NA</span>
            NetAcademy
          </h1>
          <p className="text-indigo-100 text-xs mt-1">IT & Networking Mastery</p>
        </div>
        
        <div className="p-4">
          <input
            type="text"
            placeholder="Themen suchen..."
            className="w-full px-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <nav className="flex-1 overflow-y-auto custom-scroll px-4 pb-4">
          {filteredTopics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => onTopicSelect(topic.id)}
              className={`w-full text-left p-3 rounded-xl mb-1 transition-all group ${
                activeTopicId === topic.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-0.5">
                  {topic.category}
                </span>
                <span className={`text-sm font-medium ${activeTopicId === topic.id ? 'text-indigo-900' : ''}`}>
                  {topic.title}
                </span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setViewMode(ViewMode.DASHBOARD)}
              className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium text-sm px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all"
            >
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Dashboard</span>
            </button>
            {activeTopicId && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-slate-900 font-semibold text-sm">
                  {TOPICS.find(t => t.id === activeTopicId)?.title}
                </span>
              </>
            )}
          </div>
          
          {activeTopicId && (
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode(ViewMode.LEARN)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === ViewMode.LEARN 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Lernen
              </button>
              <button
                onClick={() => setViewMode(ViewMode.QUIZ)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  viewMode === ViewMode.QUIZ 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Quiz
              </button>
            </div>
          )}
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto custom-scroll p-8">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
