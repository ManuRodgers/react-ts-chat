import React, { useState, useCallback, Fragment, memo } from 'react';
import { List, Grid } from 'antd-mobile';

interface IAvatarSelectorProps {
  getSelectedAvatarName: (selectedAvatarName: string) => string;
}

const AvatarSelector: React.FunctionComponent<IAvatarSelectorProps> = ({
  getSelectedAvatarName,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const avatarList =
    'boy,bull,chick,crab,girl,hedgehog,hippopotamus,koala,lemur,man,pig,tiger,whale,woman,zebra';

  const gridData = avatarList.split(',').map(avatarName => {
    return {
      icon: require(`../images/${avatarName}.png`),
      text: avatarName,
    };
  });
  const handleAvatarSelection = useCallback(e => {
    setSelectedAvatar(e.icon);
    getSelectedAvatarName(e.text);
  }, []);

  const renderHeader = useCallback(() => {
    return selectedAvatar !== `` ? (
      <Fragment>
        <span>selected avatar: </span> <img width={20} src={selectedAvatar} />
      </Fragment>
    ) : (
      <span>Please select your avatar </span>
    );
  }, [selectedAvatar]);
  return (
    <List renderHeader={renderHeader}>
      <Grid onClick={handleAvatarSelection} columnNum={5} data={gridData} activeStyle={false} />
    </List>
  );
};

export default memo(AvatarSelector);
