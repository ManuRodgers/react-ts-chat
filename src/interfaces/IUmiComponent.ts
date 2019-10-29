import { Dispatch } from 'redux';
import { RouterTypes } from 'umi';

export default interface IUmiComponent extends RouterTypes<{}, { id: string }> {
  dispatch: Dispatch;
}
