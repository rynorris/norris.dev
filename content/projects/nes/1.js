self["webpackChunk"]([1],{

/***/ "./worker.js":
/*!*******************!*\
  !*** ./worker.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("__webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! nes_web */ \"../pkg/nes_web.js\"))\n    .then(nes_web => {\n        var stopRunning = () => {};\n\n        const loadRom = buf => {\n            stopRunning();\n\n            var nes = null;\n            var running = true;\n\n            nes = Emulator.new(new Uint8Array(buf));\n\n            function step() {\n                var cycles = nes.run(100000);\n                render(nes);\n\n                const audio = nes.get_audio(cycles, BigInt(Math.round(48000 / 60)));\n                const video = nes.get_frame();\n\n                console.log(\"Sending AV update\", audio, video);\n                postMessage({ audio, video }, [audio, video]);\n            }\n\n            nes_audio.resume();\n            const interval = setInterval(step, 16);\n\n            stopRunning = () => clearInterval(interval);\n        };\n\n        onmessage = ({ data }) => {\n            console.log(\"Received message in worker\", data);\n            switch (data.kind) {\n                case \"rom\":\n                    loadRom(data.data);\n                    break;\n            }\n        };\n    });\n\n\n\n//# sourceURL=webpack:///./worker.js?");

/***/ })

});