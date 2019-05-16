self["webpackChunk"]([1],{

/***/ "./worker.js":
/*!*******************!*\
  !*** ./worker.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const toArrayBuffer = array => array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset)\n\nconst CYCLES_PER_SECOND = 21477272;\nconst FRAMES_PER_SECOND = (1000 / 16);\nconst CYCLES_PER_FRAME = CYCLES_PER_SECOND / FRAMES_PER_SECOND;\n\n__webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! nes_web */ \"../pkg/nes_web.js\"))\n    .then(({ Emulator, Event, Key }) => {\n        const convertJsKeyCode = key => {\n            switch (key) {\n                case \"a\":\n                    return Key.A;\n                case \"s\":\n                    return Key.S;\n                case \"x\":\n                    return Key.X;\n                case \"z\":\n                    return Key.Z;\n                case \"ArrowLeft\":\n                    return Key.Left;\n                case \"ArrowRight\":\n                    return Key.Right;\n                case \"ArrowUp\":\n                    return Key.Up;\n                case \"ArrowDown\":\n                    return Key.Down;\n                default:\n                    return null;\n            }\n        };\n\n        var stopRunning = () => {};\n\n        var nes = null;\n        const loadRom = buf => {\n            stopRunning();\n\n            var running = true;\n\n            nes = Emulator.new(new Uint8Array(buf));\n\n            function step() {\n                var cycles = BigInt(0);\n                while (cycles <= CYCLES_PER_FRAME) {\n                    cycles += nes.run(100);\n                }\n\n                const audio = nes.get_audio(cycles, BigInt(Math.round(48000 / (1000 / 16))));\n                const video = nes.get_frame();\n\n                const audio_arr = toArrayBuffer(audio);\n                const video_arr = toArrayBuffer(video);\n\n                postMessage({ audio: audio_arr, video: video_arr }, [audio_arr, video_arr]);\n            }\n\n            const interval = setInterval(step, 16);\n\n            stopRunning = () => clearInterval(interval);\n        };\n\n        onmessage = ({ data }) => {\n            var key;\n            switch (data.kind) {\n                case \"rom\":\n                    loadRom(data.data);\n                    break;\n                case \"keydown\":\n                    key = convertJsKeyCode(data.key);\n                    if (key !== null) {\n                        nes.broadcast(Event.key_down(key));\n                    }\n                    break;\n                case \"keyup\":\n                    key = convertJsKeyCode(data.key);\n                    if (key !== null) {\n                        nes.broadcast(Event.key_up(key));\n                    }\n                    break;\n            }\n        };\n    });\n\n\n\n//# sourceURL=webpack:///./worker.js?");

/***/ })

});