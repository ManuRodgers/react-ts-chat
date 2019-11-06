import React, { memo, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import Auth from '@/components/Auth';
import { getGeniusListAsync } from '@/actions/bossActions';
import { IUmiComponent, IGlobalState, IGenius } from '@/interfaces';
import { WingBlank, WhiteSpace, Card } from 'antd-mobile';

const mapStateToProps = ({ boss }: IGlobalState) => ({
  boss,
});
type BossStateProps = ReturnType<typeof mapStateToProps>;
interface IBossProps extends IUmiComponent, BossStateProps {}

const Boss: React.FunctionComponent<IBossProps> = ({ boss, dispatch }) => {
  const { geniusList } = boss;
  console.log('TCL: geniusList', geniusList);
  // get genius list
  useEffect(() => {
    dispatch(getGeniusListAsync({}));
  }, []);

  const renderGeniusList = (geniusList: IGenius[]) => {
    if (geniusList) {
      return geniusList.map(genius => {
        return (
          <Fragment key={genius.id}>
            <Card>
              <Card.Header
                title={genius.email.split('@')[0]}
                thumb={require(`@/images/${genius.avatar}.png`)}
                extra={<span>{genius.job}</span>}
              />
              <Card.Body>
                <div>{genius.profile}</div>
              </Card.Body>
              <Card.Footer content={genius.salary} />
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
      <WingBlank size="lg">{renderGeniusList(geniusList as IGenius[])}</WingBlank>
    </div>
  );
};

export default memo(connect(mapStateToProps)(Boss));
