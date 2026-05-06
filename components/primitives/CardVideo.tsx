import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect } from "react";
import { View } from "react-native";

type CardVideoProps = {
  source: string;
  opacity?: number;
  tint?: number;
};

export const CardVideo = ({ source, opacity = 1, tint = 0.25 }: CardVideoProps) => {
  const player = useVideoPlayer(source, (instance) => {
    instance.loop = true;
    instance.muted = true;
    instance.play();
  });

  useEffect(() => {
    return () => {
      player.pause();
      player.release();
    };
  }, [player]);

  return (
    <View className="absolute inset-0" style={{ opacity }}>
      <VideoView
        player={player}
        style={{ width: "100%", height: "100%" }}
        contentFit="cover"
        nativeControls={false}
      />
      {tint > 0 ? (
        <View
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(0,0,0,${tint})` }}
        />
      ) : null}
    </View>
  );
};
