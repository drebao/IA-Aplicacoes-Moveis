import { SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';

export default function SplashScreenController() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
