const PushStateTree = require('../src/push-state-tree');
import cleanHistoryAPI from './helper/cleanHistoryAPI';

describe('PushStateTree properties', function() {
  cleanHistoryAPI();
  let pst;
  beforeEach(() => {
    pst = new PushStateTree({
      basePath: '/'
    });
  });

  describe('path', () => {
    it('should throw an error if path is not a string', () => {
      expect(() => pst.path = 1).to.throw(TypeError, 'path must be a string');
    });

    it('should dispatch \'Leave event\' when old path was valid and current path is invalid', () => {
      let leaveCalled = false;
      pst.addEventListener('leave', (event) => {leaveCalled = event.type == 'leave'});
      pst.path = 'test';
      expect(leaveCalled).to.be.true;
    });

    it('should dispatch \'Match event\ when path is valid', () => {
      let matchCalled = false;
      pst.addEventListener('match', (event) => {matchCalled = event.type == 'match'});
      pst.path = '/test';
      expect(matchCalled).to.be.true;
    });
  });
});
