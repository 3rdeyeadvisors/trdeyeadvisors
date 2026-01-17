import { useCallback, useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Pre-defined sound prompts for ElevenLabs
const SOUND_PROMPTS: Record<string, string> = {
  correctAnswer: 'short positive chime, success notification, bright and cheerful',
  wrongAnswer: 'soft buzzer, gentle error sound, not harsh',
  moduleComplete: 'ascending notes melody, achievement unlock, triumphant short',
  courseComplete: 'triumphant fanfare, celebration sound, victory jingle',
  quizPass: 'victory jingle, congratulations sound, upbeat success',
  badgeEarned: 'achievement unlock sound, magical sparkle, level up',
  pointsEarned: 'coin collection sound, gem pickup, reward chime',
  dailyLogin: 'welcome chime, friendly notification, warm greeting sound',
};

type SoundType = keyof typeof SOUND_PROMPTS;

// Check if sounds are enabled in localStorage
const getSoundEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem('achievement_sounds_enabled');
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
};

const setSoundEnabledStorage = (enabled: boolean) => {
  try {
    localStorage.setItem('achievement_sounds_enabled', String(enabled));
  } catch {
    // Ignore storage errors
  }
};

// Simple audio cache using data URIs
const audioCache: Record<string, string> = {};

export const useAchievementSounds = () => {
  const [soundEnabled, setSoundEnabled] = useState(getSoundEnabled);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    setSoundEnabledStorage(newValue);
  }, [soundEnabled]);

  // Generate and cache a sound
  const generateSound = useCallback(async (soundType: SoundType): Promise<string | null> => {
    // Check cache first
    if (audioCache[soundType]) {
      return audioCache[soundType];
    }

    const prompt = SOUND_PROMPTS[soundType];
    if (!prompt) {
      console.warn('Unknown sound type:', soundType);
      return null;
    }

    try {
      setIsLoading(true);
      
      // Use supabase client to invoke edge function
      const { data, error } = await supabase.functions.invoke('generate-achievement-sound', {
        body: { prompt, duration: 2 },
      });

      if (error) {
        console.error('Sound generation failed:', error.message);
        return null;
      }

      // The edge function returns audio data - create blob URL
      if (data instanceof Blob) {
        const audioUrl = URL.createObjectURL(data);
        audioCache[soundType] = audioUrl;
        return audioUrl;
      }
      
      return null;
    } catch (error) {
      console.error('Error generating sound:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Play a sound
  const playSound = useCallback(async (soundType: SoundType) => {
    if (!soundEnabled) return;

    try {
      // Try to get cached or generate new sound
      let audioUrl = audioCache[soundType];
      
      if (!audioUrl) {
        // For now, use fallback web audio instead of waiting for API
        playFallbackSound(soundType);
        
        // Generate in background for next time
        generateSound(soundType).catch(console.error);
        return;
      }

      // Stop current audio if playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      audio.volume = 0.5;
      audioRef.current = audio;
      
      await audio.play();
    } catch (error) {
      console.error('Error playing sound:', error);
      // Fallback to web audio
      playFallbackSound(soundType);
    }
  }, [soundEnabled, generateSound]);

  // Fallback sounds using Web Audio API
  const playFallbackSound = useCallback((soundType: SoundType) => {
    if (!soundEnabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different sound profiles based on type
      switch (soundType) {
        case 'correctAnswer':
        case 'pointsEarned':
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
          break;
        case 'wrongAnswer':
          oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
          break;
        case 'moduleComplete':
        case 'quizPass':
          oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.15); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.3); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.45); // G5
          break;
        case 'courseComplete':
        case 'badgeEarned':
          oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime); // C4
          oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.1); // E4
          oscillator.frequency.setValueAtTime(392, audioContext.currentTime + 0.2); // G4
          oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.3); // C5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.4); // E5
          oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.5); // G5
          break;
        case 'dailyLogin':
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
          oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.15); // C#5
          oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.3); // E5
          break;
        default:
          oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      }

      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
    } catch (error) {
      console.error('Fallback sound error:', error);
    }
  }, [soundEnabled]);

  // Preload common sounds on mount
  useEffect(() => {
    if (soundEnabled) {
      // Preload in background
      const preloadSounds = async () => {
        const commonSounds: SoundType[] = ['correctAnswer', 'wrongAnswer', 'pointsEarned'];
        for (const sound of commonSounds) {
          await generateSound(sound);
        }
      };
      preloadSounds().catch(console.error);
    }
  }, [soundEnabled, generateSound]);

  // Cleanup audio URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(audioCache).forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playSound,
    isLoading,
    // Convenience methods
    playCorrectAnswer: () => playSound('correctAnswer'),
    playWrongAnswer: () => playSound('wrongAnswer'),
    playModuleComplete: () => playSound('moduleComplete'),
    playCourseComplete: () => playSound('courseComplete'),
    playQuizPass: () => playSound('quizPass'),
    playBadgeEarned: () => playSound('badgeEarned'),
    playPointsEarned: () => playSound('pointsEarned'),
    playDailyLogin: () => playSound('dailyLogin'),
  };
};
