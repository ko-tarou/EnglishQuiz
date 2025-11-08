'use client';

import { useState } from 'react';
import { wordSets, Word } from '@/data/words';
import SetSelection from '@/components/SetSelection';
import Quiz from '@/components/Quiz';
import styles from './page.module.css';

type AppState = 'selection' | 'quiz' | 'completed';

export default function Home() {
  const [state, setState] = useState<AppState>('selection');
  const [selectedSets, setSelectedSets] = useState<number[]>([]);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [isRetryMode, setIsRetryMode] = useState(false);

  const handleStart = (sets: number[]) => {
    const words: Word[] = [];
    sets.forEach(setIndex => {
      words.push(...wordSets[setIndex]);
    });
    setSelectedSets(sets);
    setCurrentWords(words);
    setWrongWords([]);
    setIsRetryMode(false);
    setState('quiz');
  };

  const handleQuizComplete = (wrong: Word[]) => {
    setWrongWords(wrong);
    if (wrong.length === 0) {
      // 全てわかった場合は選択画面に戻る
      setState('selection');
      setSelectedSets([]);
      setCurrentWords([]);
    } else {
      // わからなかった単語だけで再クイズ
      setCurrentWords(wrong);
      setIsRetryMode(true);
      setState('quiz');
    }
  };

  const handleBackToSelection = () => {
    setState('selection');
    setSelectedSets([]);
    setCurrentWords([]);
    setWrongWords([]);
    setIsRetryMode(false);
  };

  return (
    <main className={styles.container}>
      {state === 'selection' && (
        <SetSelection
          totalSets={wordSets.length}
          onStart={handleStart}
        />
      )}
      {state === 'quiz' && (
        <Quiz
          words={currentWords}
          isRetryMode={isRetryMode}
          onComplete={handleQuizComplete}
          onBack={handleBackToSelection}
        />
      )}
    </main>
  );
}

