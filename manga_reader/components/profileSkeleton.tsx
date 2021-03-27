import React from 'react';
import {View, ViewStyle} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const ProfileSkeleton = () => {
  return (
    <View style={AvatarStyle}>
      <SkeletonPlaceholder>
        <SkeletonPlaceholder.Item
          flexDirection={'column'}
          alignItems={'center'}
          alignSelf={'center'}>
          <SkeletonPlaceholder.Item
            width={150}
            height={150}
            borderRadius={100}
          />
          <SkeletonPlaceholder.Item
            width={220}
            height={30}
            borderRadius={4}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={380}
            height={200}
            borderRadius={5}
            marginTop={25}
          />
          <SkeletonPlaceholder.Item
            width={380}
            height={200}
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

export default ProfileSkeleton;
