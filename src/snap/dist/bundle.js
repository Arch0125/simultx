(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.snap = f();
  }
})(function () {
  var define, module, exports;
  return function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) return c(i, !0);
            if (u) return u(i, !0);
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a;
          }
          var p = n[i] = {
            exports: {}
          };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r);
          }, p, p.exports, r, e, n, t);
        }
        return n[i].exports;
      }
      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o;
    }
    return r;
  }()({
    1: [function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.onTransaction = void 0;
      async function getgasfees() {
        const response = await fetch('https://beaconcha.in/api/v1/execution/gasnow');
        return response.text();
      }
      async function simul(from, to, value, data) {
        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            "id": 1,
            "jsonrpc": "2.0",
            "method": "alchemy_simulateAssetChanges",
            "params": [{
              "from": `${from}`,
              "to": `${to}`,
              "value": `${value}`,
              "data": `${data}`
            }]
          })
        };
        const res = await fetch('https://eth-goerli.g.alchemy.com/v2/gh4d1-dAT4B_1Khy86s7JUbFhQIclYqO', options);
        return res.text();
      }
      const onTransaction = async ({
        transaction,
        chainId
      }) => {
        const {
          from,
          to,
          value,
          data
        } = transaction;
        return simul(from, to, value, data).then(txdetails => {
          const res = JSON.parse(txdetails);
          return {
            insights: {
              transaction,
              chainId,
              message: `${res}`
            }
          };
        });
      };
      exports.onTransaction = onTransaction;
    }, {}]
  }, {}, [1])(1);
});