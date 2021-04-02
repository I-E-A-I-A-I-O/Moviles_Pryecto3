import React from 'react';
import {View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {FlatList} from 'react-native-gesture-handler';

const USELESS_DATA = [1];

const NotificationsSkeleton = () => {
  const _skeleton = () => (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        display={'flex'}
        marginTop={15}
        flexDirection={'row'}>
        <SkeletonPlaceholder.Item width={70} height={70} borderRadius={100} />
        <SkeletonPlaceholder.Item
          width={170}
          height={45}
          borderRadius={5}
          marginTop={15}
          marginLeft={5}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );

  return (
    <View>
      <FlatList
        data={USELESS_DATA}
        renderItem={_skeleton}
        keyExtractor={(item, index) => `${index}`}
      />
    </View>
  );
};

export default NotificationsSkeleton;
