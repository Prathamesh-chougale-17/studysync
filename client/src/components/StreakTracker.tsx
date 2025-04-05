import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userApi } from '@/services/api';
import { toast } from 'sonner';

const StreakTracker: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [lastActive, setLastActive] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStreak = async () => {
      try {
        setIsLoading(true);
        const data = await userApi.getStreak();
        setStreak(data.streak);
        setLastActive(new Date(data.lastActive));
      } catch (error) {
        console.error('Error fetching streak data:', error);
        toast.error(
            "Failed to load streak data. Please try again later.",
            {
                description: "There was an error fetching your streak data. Please check your connection and try again."
            }
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStreak();
  }, [toast]);

  // Update user's streak
  useEffect(() => {
    const updateStreak = async () => {
      try {
        await userApi.updateActivity();
      } catch (error) {
        console.error('Error updating activity streak:', error);
      }
    };

    updateStreak();
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card className="bg-white dark:bg-gray-900 shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Daily Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {streak} days
            </div>
            {lastActive && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last active: {formatDate(lastActive)}
              </div>
            )}
            
            <div className="mt-3 flex justify-center space-x-1">
              {Array.from({ length: 7 }).map((_, i) => {
                const dayOffset = i - 6; // -6 to 0, representing the last 7 days
                
                // Check if the date is before or equal to today and after or equal to (today - streak)
                const isActiveDay = dayOffset <= 0 && dayOffset >= -streak;
                
                return (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full ${
                      isActiveDay 
                        ? 'bg-blue-500 dark:bg-blue-600' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                    title={`Day ${i+1}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakTracker;