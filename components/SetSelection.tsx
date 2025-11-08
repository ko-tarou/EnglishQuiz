'use client';

import { useState } from 'react';
import styles from './SetSelection.module.css';

interface SetSelectionProps {
  totalSets: number;
  onStart: (selectedSets: number[]) => void;
}

export default function SetSelection({ totalSets, onStart }: SetSelectionProps) {
  const [selectedSets, setSelectedSets] = useState<number[]>([]);

  const handleToggleSet = (setIndex: number) => {
    setSelectedSets(prev => {
      if (prev.includes(setIndex)) {
        return prev.filter(i => i !== setIndex);
      } else {
        return [...prev, setIndex].sort((a, b) => a - b);
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedSets.length === totalSets) {
      setSelectedSets([]);
    } else {
      setSelectedSets(Array.from({ length: totalSets }, (_, i) => i));
    }
  };

  const handleStart = () => {
    if (selectedSets.length > 0) {
      onStart(selectedSets);
    }
  };

  const totalWords = selectedSets.length * 50;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>英単語暗記アプリ</h1>
      <p className={styles.subtitle}>学習する単語セットを選択してください</p>
      
      <div className={styles.selectAllContainer}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={selectedSets.length === totalSets}
            onChange={handleSelectAll}
            className={styles.checkbox}
          />
          <span>全て選択</span>
        </label>
      </div>

      <div className={styles.setsGrid}>
        {Array.from({ length: totalSets }, (_, i) => (
          <label key={i} className={styles.setItem}>
            <input
              type="checkbox"
              checked={selectedSets.includes(i)}
              onChange={() => handleToggleSet(i)}
              className={styles.checkbox}
            />
            <span className={styles.setLabel}>
              セット {i + 1} (単語 {i * 50 + 1}-{(i + 1) * 50})
            </span>
          </label>
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.wordCount}>
          選択中: {totalWords} 単語 ({selectedSets.length} セット)
        </p>
        <button
          onClick={handleStart}
          disabled={selectedSets.length === 0}
          className={styles.startButton}
        >
          開始
        </button>
      </div>
    </div>
  );
}

