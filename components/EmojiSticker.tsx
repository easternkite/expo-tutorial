import { View } from 'react-native'
import { type ImageSource } from 'expo-image'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

type Props = {
    imageSize: number;
    stickerSource: ImageSource;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
    /**
     * useSharedValue helps to mutate data and runs animations based on the current value.
     * Compose의 animatedFloatAsState 와 비슷한 역할을 하는 것처럼 보인다.
     */
    const scaleImage = useSharedValue(imageSize);
    
    /**
     * 드래그 이벤트 발생시 이미지의 위치를 변경할 수 있도록 하는 값
     */
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const drag = Gesture.Pan().onChange(event => {
        translateX.value += event.changeX;
        translateY.value += event.changeY;
      });

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ]
        }
    });

    const onDoubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            if (scaleImage.value !== imageSize * 2) {
                scaleImage.value = scaleImage.value * 2;
            } else {
                scaleImage.value = Math.round(scaleImage.value / 2);
            }
        });

        /**
         * useAnimatedStyle helps us to update styles using shared values when the animation happens
         */
        const imageStyle = useAnimatedStyle(() => {
            return {
              width: withSpring(scaleImage.value),
              height: withSpring(scaleImage.value),
            };
          });

    return (
        <GestureDetector gesture={drag}>
            <Animated.View style={[containerStyle, { top: -350 }]}>
                <GestureDetector gesture={onDoubleTap}>
                    <Animated.Image
                        source={stickerSource}
                        resizeMode="contain"
                        style={[imageStyle, { width: imageSize, height: imageSize }]}
                    />
                </GestureDetector>
            </Animated.View>
        </GestureDetector>
    );
}
