'use client';

import { useState } from 'react';
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

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  const handleKnow = () => {
    if (!answered) {
      setAnswered(true);
      // わかった場合は何もしない（wrongWordsに追加しない）
      if (currentIndex < words.length - 1) {
        setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
          setShowAnswer(false);
          setAnswered(false);
        }, 500);
      } else {
        // 最後の単語
        setTimeout(() => {
          onComplete(wrongWords);
        }, 500);
      }
    }
  };

  const handleDontKnow = () => {
    if (!answered) {
      setAnswered(true);
      // わからない場合はwrongWordsに追加
      if (!wrongWords.find(w => w.english === currentWord.english)) {
        setWrongWords(prev => [...prev, currentWord]);
      }
      setShowAnswer(true);
    }
  };

  const handleOk = () => {
    if (showAnswer) {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
        setAnswered(false);
      } else {
        // 最後の単語
        onComplete(wrongWords);
      }
    }
  };

  const handleBack = () => {
    if (confirm('クイズを中断して選択画面に戻りますか？')) {
      onBack();
    }
  };

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
        {currentIndex + 1} / {words.length}
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
              onClick={handleKnow}
              className={`${styles.actionButton} ${styles.knowButton}`}
            >
              わかる
            </button>
            <button
              onClick={handleDontKnow}
              className={`${styles.actionButton} ${styles.dontKnowButton}`}
            >
              わからない
            </button>
          </div>
        )}

        {showAnswer && (
          <div className={styles.buttonGroup}>
            <button
              onClick={handleOk}
              className={`${styles.actionButton} ${styles.okButton}`}
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

