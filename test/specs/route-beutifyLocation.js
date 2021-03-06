/*globals PushStateTree, it, expect, beforeEach, beforeAll */
describe('PushStateTree beutifyLocation should', function() {
  'use strict';

  var events = {
    popstate: [],
    hashchange: [],
    DOMContentLoaded: [],
    readystatechange: [],
    load: []
  };

  beforeAll(function(){
    var addEventListener = window.addEventListener;
    window.addEventListener = function(name, callback){
      events[name].push(callback);
      addEventListener.apply(window, arguments);
    };
  });

  beforeEach(function(){
    // Reset the URI before begin the tests
    history.pushState(null, null, '/');
    for (var eventName in events)
    if (events.hasOwnProperty(eventName)) {
      var eventList = events[eventName];
      while (eventList.length) {
        var callback = eventList.pop();
        window.removeEventListener(eventName, callback);
      }
    }
  });

  it('not enable beautifyLocation feature by default', function(){
    var pst = new PushStateTree();
    expect(pst.beautifyLocation).toBeFalsy();
  });

  it('allow to change the beautifyLocation flag after start running', function(){
    var pst = new PushStateTree();
    pst.beautifyLocation = false;
    expect(pst.beautifyLocation).toBeFalsy();
    pst.beautifyLocation = true;
    expect(pst.beautifyLocation).toBeTruthy();
  });

  it('prioritise the hash to provide the URI', function(){
    var pst = new PushStateTree({
      beautifyLocation: false
    });
    location.hash = '#test';
    expect(pst.uri).toEqual('test');
  });

  it('remove the first slash from the URI in the regular URL', function(){
    var pst = new PushStateTree({
      beautifyLocation: false
    });
    history.pushState(null, null, '/test');
    expect(location.pathname).toEqual('/test');
    expect(pst.uri).toEqual('test');
  });

  it('remove the first slash from the URI in the location.hash', function(){
    var pst = new PushStateTree({
      beautifyLocation: false
    });
    location.hash = '/test';
    expect(location.hash).toEqual('#/test');
    expect(pst.uri).toEqual('test');
  });

  it('redirect from the hash to path when beautifyLocation is enabled', function(){
    var pst = new PushStateTree({
      beautifyLocation: true
    });

    // Reset URL
    var randomURI = Math.random() + '';
    history.pushState(null, null, '/' + randomURI);
    expect(pst.uri).toEqual(randomURI);
    expect(location.pathname).toEqual('/' + randomURI);

    location.hash = '/abc';
    expect(pst.uri).toEqual('abc');
    expect(location.hash).toEqual('');

    expect(location.pathname).toEqual('/abc');
  });

  it('not apply beautifyLocation when the basePath is not fulfilled', function(){
    history.pushState(null, null, '/invalidBasePath/');
    var pst = new PushStateTree({
      beautifyLocation: true,
      basePath: '/test/'
    });
    location.hash = '/abc';
    expect(pst.uri).toEqual('abc');
    expect(location.hash).toEqual('#/abc');
  });

  it('apply beautifyLocation when the basePath is fulfilled', function(){
    history.pushState(null, null, '/test/');
    var pst = new PushStateTree({
      beautifyLocation: true,
      basePath: '/test/'
    });
    location.hash = '/abc';
    expect(pst.uri).toEqual('abc');
    expect(location.hash).toEqual('');
  });

  it('no change if usePushState is false', function(){
    var pst = new PushStateTree({
      beautifyLocation: true,
      usePushState: false
    });
    pst.navigate('test2');
    expect(pst.uri).toEqual('test2');
    expect(location.hash).toEqual('#test2');
  });

});
