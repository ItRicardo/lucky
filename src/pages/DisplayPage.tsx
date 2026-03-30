import { useState, useEffect, useRef } from "react";
import { useLotteryStore } from "@/store/useStore";
import RollingBoard from "@/components/RollingBoard";
import { toast } from "sonner";

export default function DisplayPage() {
  const { 
    participants, currentPrizeId, prizes, isRolling, roundWinners, settings, setViewMode, viewMode, selectPrize, startRolling, stopRolling, initializeParticipants 
  } = useLotteryStore();

  // 初始化人员信息
  useEffect(() => {
    initializeParticipants();
  }, [initializeParticipants]);

  useEffect(() => {
    setViewMode('welcome');
  }, [setViewMode]);

  // 本地用于状态判断的 ref
  const prevRollingRef = useRef(isRolling);
  const isRollingRef = useRef(isRolling);

  // 强制轮询同步 localStorage (解决 file:// 协议下跨窗口不同步问题)
  useEffect(() => {
    const timer = setInterval(() => {
      useLotteryStore.persist.rehydrate();
    }, 500);
    return () => clearInterval(timer);
  }, []);

  // 当前奖项信息
  const currentPrize = prizes.find(p => p.id === currentPrizeId);
  const candidates = participants.filter(p => !p.banned); 

  // 监听 Store 变化 (仅保留状态更新，不再播放音效)
  useEffect(() => {
    prevRollingRef.current = isRolling;
    isRollingRef.current = isRolling;
  }, [isRolling, roundWinners]);

  // 全局标题同步
  useEffect(() => {
    document.title = settings.title;
  }, [settings.title]);

  // 快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 页面导航快捷键
      if (e.ctrlKey) {
        if (e.key === 'ArrowLeft') {
          // Ctrl+左箭头：上一个页面
          if (viewMode === 'lottery') {
            setViewMode('prize');
          } else if (viewMode === 'prize') {
            setViewMode('welcome');
          } else if (viewMode === 'result') {
            setViewMode('lottery');
          }
        } else if (e.key === 'ArrowRight') {
          // Ctrl+右箭头：下一个页面
          if (viewMode === 'welcome') {
            setViewMode('prize');
          } else if (viewMode === 'prize') {
            setViewMode('lottery');
          } else if (viewMode === 'lottery') {
            setViewMode('result');
          }
        }
      }

      // 抽奖页面快捷键
      if (viewMode === 'lottery') {
        if (e.key === ' ' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
          // 空格：开始/停止抽奖
          e.preventDefault();
          if (isRollingRef.current) {
            stopRolling();
          } else {
            startRolling();
          }
        } else if (e.key === 'Enter') {
          // 回车：进入下一个抽奖奖项
          if (e.shiftKey) {
            // Shift+Enter：回到上一个抽奖奖项
            const currentIndex = prizes.findIndex(p => p.id === currentPrizeId);
            if (currentIndex > 0) {
              selectPrize(prizes[currentIndex - 1].id);
            }
          } else {
            // Enter：进入下一个抽奖奖项
            const currentIndex = prizes.findIndex(p => p.id === currentPrizeId);
            if (currentIndex < prizes.length - 1) {
              selectPrize(prizes[currentIndex + 1].id);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, currentPrizeId, prizes, selectPrize, startRolling, stopRolling]);

  return (
    <div className="w-full h-screen overflow-hidden bg-black text-white font-sans">
      <RollingBoard 
        isRolling={isRolling} 
        candidates={candidates} 
        currentWinners={roundWinners} 
      />
    </div>
  );
}
