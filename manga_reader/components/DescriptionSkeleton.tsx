import React from 'react';
import {View, ViewStyle} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DescriptionSkeleton = () => {
  return (
    <View style={AvatarStyle}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection={'column'}
          alignItems={'flex-start'}
          alignSelf={'flex-start'}>
          <SkeletonPlaceholder.Item
            marginTop={25}
            width={150}
            height={30}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            width={220}
            height={30}
            borderRadius={4}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={210}
            height={30}
            borderRadius={5}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={250}
            height={30}
            borderRadius={5}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={210}
            height={30}
            borderRadius={5}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={250}
            height={30}
            borderRadius={5}
            marginTop={25}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

const AvatarStyle: ViewStyle = {
  alignSelf: 'center',
};

export default DescriptionSkeleton;
