import React, {useState} from 'react';
import {Button} from 'react-native-elements';
import {ActivityIndicator} from 'react-native';

type Props = {
  title: string;
  onPress: () => Promise<void>;
};

const SubmitButton = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(props.title);

  const _buttonPressed = async () => {
    setLoading(true);
    setTitle('');
    await props.onPress();
    setLoading(false);
    setTitle(props.title);
  };

  return (
    <Button
      title={title}
      disabled={loading}
      icon={<ActivityIndicator color={'#e94560'} animating={loading} />}
      onPress={_buttonPressed}
    />
  );
};

export default SubmitButton;
