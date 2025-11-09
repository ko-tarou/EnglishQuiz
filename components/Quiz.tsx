'use client';

import { useState, useEffect, useCallback } from 'react';
import { Word } from '@/data/words';
import styles from './Quiz.module.css';

interface QuizProps {
  words: Word[];
  isRetryMode: boolean;
  onComplete: (wrongWords: Word[]) => void;
  onBack: () => void;
}

export default function Quiz({ words, isRetryMode, onComplete, onBack }: QuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wrongWords, setWrongWords] = useState<Word[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);

  // wordsが変更された時（復習モードに移行した時など）に状態をリセット
  useEffect(() => {
    setCurrentIndex(0);
    setWrongWords([]);
    setShowAnswer(false);
    setAnswered(false);
  }, [words]);

  // インデックスが範囲外の場合は調整
  const safeIndex = words.length > 0 ? Math.min(currentIndex, Math.max(0, words.length - 1)) : 0;
  const currentWord = words.length > 0 && safeIndex < words.length ? words[safeIndex] : undefined;
  const progress = words.length > 0 && currentWord ? ((safeIndex + 1) / words.length) * 100 : 0;

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const moveToNext = useCallback((finalWrongWords: Word[]) => {
    if (currentIndex < words.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
        setAnswered(false);
      }, 300);
    } else {
      // 最後の単語
      setTimeout(() => {
        onComplete(finalWrongWords);
      }, 300);
    }
  }, [currentIndex, words.length, onComplete]);

  const handleKnow = () => {
    if (showAnswer && !answered && currentWord) {
      setAnswered(true);
      // わかった場合は何もしない（wrongWordsに追加しない）
      moveToNext(wrongWords);
    }
  };

  const handleDontKnow = () => {
    if (showAnswer && !answered && currentWord) {
      setAnswered(true);
      // わからない場合はwrongWordsに追加
      setWrongWords(prev => {
        const updated = !prev.find(w => w.english === currentWord.english)
          ? [...prev, currentWord]
          : prev;
        // 更新されたwrongWordsを使って次の単語へ移動
        moveToNext(updated);
        return updated;
      });
    }
  };

  // キーボード操作の処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 入力フィールドにフォーカスがある場合は無視
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (!showAnswer && !answered) {
        // 答えが表示されていない状態：OK（下矢印）で答えを表示
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setShowAnswer(true);
        }
      } else if (showAnswer && !answered) {
        // 答えが表示されている状態：わかる（左矢印）or わからない（右矢印）
        const safeIdx = words.length > 0 ? Math.min(currentIndex, Math.max(0, words.length - 1)) : 0;
        const word = words.length > 0 && safeIdx < words.length ? words[safeIdx] : undefined;
        if (!word) return;
        
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setAnswered(true);
          moveToNext(wrongWords);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setAnswered(true);
          setWrongWords(prev => {
            const updated = !prev.find(w => w.english === word.english)
              ? [...prev, word]
              : prev;
            moveToNext(updated);
            return updated;
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAnswer, answered, wrongWords, currentIndex, words, moveToNext]);

  const handleBack = () => {
    if (confirm('クイズを中断して選択画面に戻りますか？')) {
      onBack();
    }
  };

  // words配列が空の場合や、currentWordが存在しない場合
  if (words.length === 0 || !currentWord) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>単語がありません</p>
          <button onClick={onBack} className={styles.backButton}>
            ← 戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          ← 戻る
        </button>
        {isRetryMode && (
          <div className={styles.retryBadge}>
            復習モード（わからなかった単語のみ）
          </div>
        )}
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className={styles.progressText}>
        {safeIndex + 1} / {words.length}
      </div>

      <div className={styles.card}>
        <div className={styles.wordSection}>
          <div className={styles.wordLabel}>英単語</div>
          <div className={styles.englishWord}>{currentWord.english}</div>
        </div>

        {showAnswer && (
          <div className={styles.answerSection}>
            <div className={styles.answerLabel}>意味</div>
            <div className={styles.japaneseWord}>{currentWord.japanese}</div>
          </div>
        )}

        {!showAnswer && !answered && (
          <div className={styles.buttonGroup}>
            <button
              onClick={handleShowAnswer}
              className={`${styles.actionButton} ${styles.okButton}`}
            >
              OK (↓)
            </button>
          </div>
        )}

        {showAnswer && !answered && (
          <div className={styles.buttonGroup}>
            <button
              onClick={handleKnow}
              className={`${styles.actionButton} ${styles.knowButton}`}
            >
              わかる (←)
            </button>
            <button
              onClick={handleDontKnow}
              className={`${styles.actionButton} ${styles.dontKnowButton}`}
            >
              わからない (→)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

