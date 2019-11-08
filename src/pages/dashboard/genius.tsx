import React, { memo, useEffect, Fragment } from 'react';
import { router } from 'umi';
import { connect } from 'dva';
import { WingBlank, Card, WhiteSpace } from 'antd-mobile';

import { IUmiComponent, IGlobalState, IBoss } from '../../interfaces/index';
import Auth from '../../components/Auth';
import { getBossListAsync } from '@/actions/geniusActions';

const mapStateToProps = ({ genius }: IGlobalState) => ({
  genius,
});
type GeniusStateProps = ReturnType<typeof mapStateToProps>;

interface IGeniusProps extends IUmiComponent, GeniusStateProps {}

const Genius: React.FunctionComponent<IGeniusProps> = ({ dispatch, genius }) => {
  const { bossList } = genius;
  console.log('TCL: bossList', bossList);
  useEffect(() => {
    dispatch(getBossListAsync({}));
  }, []);
  const renderBossList = (bossList: IBoss[]) => {
    if (bossList) {
      return bossList.map(boss => {
        return (
          <Fragment key={boss.id}>
            <Card
              onClick={() => {
                router.push(`/chat/${boss.id}`);
              }}
            >
              <Card.Header
                title={boss.email.split('@')[0]}
                thumb={require(`@/images/${boss.avatar}.png`)}
                extra={<span>{boss.title}</span>}
              />
              <Card.Body>
                <div>{boss.description}</div>
              </Card.Body>
              <Card.Footer content={boss.money} />
            </Card>
            <WhiteSpace />
          </Fragment>
        );
      });
    } else {
      null;
    }
  };
  return (
    <div>
      <Auth dispatch={dispatch} />
      <WingBlank size="lg">{renderBossList(bossList as IBoss[])}</WingBlank>
    </div>
  );
};

export default memo(connect(mapStateToProps)(Genius));
