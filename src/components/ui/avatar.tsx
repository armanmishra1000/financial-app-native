import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: number;
  fallback?: string;
}

export function Avatar({ src, alt, size = 40, fallback }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Generate initials from fallback text
  const initials = fallback
    ? fallback
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  // Generate consistent color based on fallback text
  const getColorFromText = (text: string) => {
    const colors = [
      '#3b82f6', // blue-500
      '#10b981', // green-500
      '#a855f7', // purple-500
      '#ec4899', // pink-500
      '#6366f1', // indigo-500
      '#ef4444', // red-500
      '#eab308', // yellow-500
      '#14b8a6', // teal-500
    ];
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const backgroundColor = getColorFromText(fallback || alt || '');

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor,
        },
      ]}
    >
      {src && !imageError && imageLoaded ? (
        <Image
          source={{ uri: src }}
          alt={alt}
          style={{ width: size, height: size }}
          onError={() => setImageError(true)}
          onLoad={() => setImageLoaded(true)}
        />
      ) : (
        <Text
          style={[
            styles.fallback,
            { fontSize: size * 0.4 },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fallback: {
    color: '#ffffff',
    fontWeight: '500',
  },
});
