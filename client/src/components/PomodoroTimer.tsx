import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PomodoroTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes
  const longBreakTime = 15 * 60; // 15 minutes

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer completed
      const audio = new Audio('/notification.mp3');
      audio.play();
      
      if (isBreak) {
        // Break finished, start work session
        setIsBreak(false);
        setTimeLeft(workTime);
      } else {
        // Work session finished, start break
        setSessionsCompleted(prev => prev + 1);
        setIsBreak(true);
        
        if (sessionsCompleted % 4 === 3) {
          // Every 4th session gets a long break
          setTimeLeft(longBreakTime);
        } else {
          setTimeLeft(breakTime);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, sessionsCompleted]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(workTime);
  };

  const skipToNext = () => {
    setIsActive(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(workTime);
    } else {
      setIsBreak(true);
      setSessionsCompleted(prev => prev + 1);
      setTimeLeft(sessionsCompleted % 4 === 3 ? longBreakTime : breakTime);
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak 
    ? ((isBreak && sessionsCompleted % 4 === 0 ? longBreakTime : breakTime) - timeLeft) / (isBreak && sessionsCompleted % 4 === 0 ? longBreakTime : breakTime) * 100
    : (workTime - timeLeft) / workTime * 100;

  return (
    <Card className="bg-white dark:bg-gray-900 shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
          {isBreak ? (sessionsCompleted % 4 === 0 ? 'Long Break' : 'Short Break') : 'Focus Time'}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center pb-2">
        <div className="text-5xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {formatTime(timeLeft)}
        </div>
        <Progress value={progress} className="h-2 mb-4" />
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {sessionsCompleted} pomodoros completed
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-2 pt-0">
        <Button onClick={toggleTimer} variant={isActive ? "destructive" : "default"}>
          {isActive ? 'Pause' : 'Start'}
        </Button>
        <Button onClick={resetTimer} variant="outline">Reset</Button>
        <Button onClick={skipToNext} variant="secondary">Skip</Button>
      </CardFooter>
    </Card>
  );
};

export default PomodoroTimer;