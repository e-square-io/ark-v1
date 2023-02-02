import { HasHooks } from '../../entities/hooks';

export function concatInterceptors<State>(hooksA: HasHooks<State>, hooksB: HasHooks<State>): HasHooks<State> {
  const result = { beforeInit: [], afterInit: [], beforeUpdate: [], afterUpdate: [], beforeDestroy: [], ...hooksA };

  if (hooksB?.beforeInit?.length) {
    result.beforeInit = result.beforeInit.concat(hooksB.beforeInit.slice());
  }

  if (hooksB?.afterInit?.length) {
    result.afterInit = result.afterInit.concat(hooksB.afterInit.slice());
  }

  if (hooksB?.beforeUpdate?.length) {
    result.beforeUpdate = result.beforeUpdate.concat(hooksB.beforeUpdate.slice());
  }

  if (hooksB?.afterUpdate?.length) {
    result.afterUpdate = result.afterUpdate.concat(hooksB.afterUpdate.slice());
  }

  if (hooksB?.beforeDestroy?.length) {
    result.beforeDestroy = result.beforeDestroy.concat(hooksB.beforeDestroy.slice());
  }

  return result;
}
