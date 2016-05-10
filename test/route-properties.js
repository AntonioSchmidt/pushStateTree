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

    it('should dispatch Leave event', () => {
      let dispatchEvent = pst.dispatchEvent;
      let assertFunction = (customEvent) => {
        expect(customEvent.type).to.equal(PushStateTree.LEAVE);
        dispatchEvent.apply(this, customEvent);//.apply(this,
      };
      pst.dispatchEvent = assertFunction;
      //chai.spy.on(pst, 'dispatchEvent');
      pst.path = "test";
      expect(pst.dispatchEvent).to.have.been.called;
    });
  });
});
