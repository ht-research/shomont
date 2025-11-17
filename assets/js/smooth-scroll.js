"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MathUtils = {
  // map number x from range [a, b] to [c, d]
  map: function map(x, a, b, c, d) {
    return (x - a) * (d - c) / (b - a) + c;
  },
  // linear interpolation
  lerp: function lerp(a, b, n) {
    return (1 - n) * a + n * b;
  },
  // random float
  getRandomFloat: function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
  }
};
var viewportSize = window.innerWidth && document.documentElement.clientWidth ? Math.min(window.innerWidth, document.documentElement.clientWidth) : window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
var body = document.body;
var flag = true;
var counter = 0;
var winsize;
var scrollInstance = true;
var calcWinsize = function calcWinsize() {
  return winsize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
};

calcWinsize();
window.addEventListener('resize', calcWinsize);
var docScroll; // for scroll speed calculation

var lastScroll;
var scrollingSpeed = 0;

var getPageYScroll = function getPageYScroll() {
  return docScroll = window.pageYOffset || document.documentElement.scrollTop;
};
var pageHeight = '';
window.addEventListener('scroll', getPageYScroll); // SmoothScroll

var SmoothScroll = /*#__PURE__*/function () {
  function SmoothScroll() {
    var _this = this;

    _classCallCheck(this, SmoothScroll);

    // the <main> element
    this.DOM = {
      main: document.querySelector('main')
    }; // the scrollable element
    // we translate this element when scrolling (y-axis)

    // this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]'); // the items on the page
    this.DOM.scrollable = pageHeight

    this.items = [];
    this.itemBackground = [];

    _toConsumableArray(this.DOM.main.querySelectorAll('.item')).forEach(function (item) {
      return _this.items.push(new Item(item));
    });

    _toConsumableArray(this.DOM.main.querySelectorAll('.background-wrapper')).forEach(function (itemBackground) {
      return _this.itemBackground.push(new ItemBackground(itemBackground));
    }); // here we define which property will change as we scroll the page
    // in this case we will be translating on the y-axis
    // we interpolate between the previous and current value to achieve the smooth scrolling effect


    this.renderedStyles = {
      translationY: {
        // interpolated value
        previous: 0,
        // current value
        current: 0,
        // amount to interpolate
        ease: 0.1,
        // current value setter
        // in this case the value of the translation will be the same like the document scroll
        setValue: function setValue() {
          return docScroll;
        }
      }
    }; // set the body's height

    this.setSize(); // set the initial values

    this.update(); // the <main> element's style needs to be modified

    this.style(); // init/bind events

    this.initEvents(); // start the render loop

    requestAnimationFrame(function () {
      return _this.render();
    });
  }

  _createClass(SmoothScroll, [{
    key: "update",
    value: function update() {
      // sets the initial value (no interpolation) - translate the scroll value
      for (var key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
      } // translate the scrollable element


      this.layout();
    }
  }, {
    key: "layout",
    value: function layout() {
      // translates the scrollable element
      if(scrollInstance){
        this.DOM.scrollable.style.transform = "translate3d(0,".concat(-1 * this.renderedStyles.translationY.previous, "px,0)");
      }
      else{
          this.DOM.scrollable.style.transform = "translate3d(0,0,0)";
      }


    }
  }, {
    key: "setSize",
    value: function setSize() {
      if(document.readyState === 'complete') {
      // set the heigh of the body in order to keep the scrollbar on the page
      body.style.height = "".concat(this.DOM.scrollable.scrollHeight, "px");
    }
    }
  }, {
    key: "style",
    value: function style() {
      // the <main> needs to "stick" to the screen and not scroll
      // for that we set it to position fixed and overflow hidden
      this.DOM.main.style.position = 'fixed';
      this.DOM.main.style.width = this.DOM.main.style.height = '100%';
      this.DOM.main.style.top = this.DOM.main.style.left = 0;
      this.DOM.main.style.overflow = 'hidden';
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this2 = this;

      // on resize reset the body's height
      window.addEventListener('resize', function () {
        return _this2.setSize();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      // Get scrolling speed
      // Update lastScroll
      scrollingSpeed = Math.abs(docScroll - lastScroll);
      lastScroll = docScroll; // update the current and interpolated values

      for (var key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].setValue();
        this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
      } // and translate the scrollable element


      this.layout(); // for every item

      var _iterator = _createForOfIteratorHelper(this.items),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;

          // if the item is inside the viewport call it's render function
          // this will update the item's inner image translation, based on the document scroll value and the item's position on the viewport
          if (item.isVisible) {
            item.render();
          }
        } // for every item

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var _iterator2 = _createForOfIteratorHelper(this.itemBackground),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var itemer = _step2.value;

          // if the item is inside the viewport call it's render function
          // this will update item's styles, based on the document scroll value and the item's position on the viewport
          if (itemer.isVisible) {
            if (itemer.insideViewport) {
              itemer.render();
            } else {
              itemer.insideViewport = true;
              itemer.update();
            }
          } else {
            itemer.insideViewport = false;
          }
        } // loop..

      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      requestAnimationFrame(function () {
        return _this3.render();
      });
    }
  }]);

  return SmoothScroll;
}();

var Item = /*#__PURE__*/function () {
  function Item(el) {
    var _this4 = this;

    _classCallCheck(this, Item);

    // the .item element
    this.DOM = {
      el: el
    }; // the inner image

    this.DOM.image = this.DOM.el.querySelector('.item-img-wrap');
    this.renderedStyles = {
      // here we define which property will change as we scroll the page and the items is inside the viewport
      // in this case we will be translating the image on the y-axis
      // we interpolate between the previous and current value to achieve a smooth effect
      innerTranslationY: {
        // interpolated value
        previous: 0,
        // current value
        current: 0,
        // amount to interpolate
        ease: 0.1,
        // the maximum value to translate the image is set in a CSS variable (--overflow)
        maxValue: parseInt(getComputedStyle(this.DOM.image).getPropertyValue('--overflow'), 10),
        // current value setter
        // the value of the translation will be:
        // when the item's top value (relative to the viewport) equals the window's height (items just came into the viewport) the translation = minimum value (- maximum value)
        // when the item's top value (relative to the viewport) equals "-item's height" (item just exited the viewport) the translation = maximum value
        setValue: function setValue() {
          var maxValue = _this4.renderedStyles.innerTranslationY.maxValue;
          var minValue = -1 * maxValue;
          return Math.max(Math.min(MathUtils.map(_this4.props.top - docScroll, winsize.height, -1 * _this4.props.height, minValue, maxValue), maxValue), minValue);
        }
      }
    }; // set the initial values

    this.update(); // use the IntersectionObserver API to check when the element is inside the viewport
    // only then the element translation will be updated

    this.observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        return _this4.isVisible = entry.intersectionRatio > 0;
      });
    });
    this.observer.observe(this.DOM.el); // init/bind events

    this.initEvents();
  }

  _createClass(Item, [{
    key: "update",
    value: function update() {
      // gets the item's height and top (relative to the document)
      this.getSize(); // sets the initial value (no interpolation)

      for (var key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
      } // translate the image


      this.layout();
    }
  }, {
    key: "getSize",
    value: function getSize() {
      var rect = this.DOM.el.getBoundingClientRect();
      this.props = {
        // item's height
        height: rect.height,
        // offset top relative to the document
        top: docScroll + rect.top
      };
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this5 = this;

      window.addEventListener('resize', function () {
        return _this5.resize();
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      // on resize rest sizes and update the translation value
      this.update();
    }
  }, {
    key: "render",
    value: function render() {
      // update the current and interpolated values
      for (var key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].setValue();
        this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
      } // and translates the image


      this.layout();
    }
  }, {
    key: "layout",
    value: function layout() {
      // translates the image
      this.DOM.image.style.transform = "translate3d(0,".concat(-1.5 * this.renderedStyles.innerTranslationY.previous, "px,0)");
    }
  }]);

  return Item;
}(); // ItemBackground


var ItemBackground = /*#__PURE__*/function () {
  function ItemBackground(el) {
    var _this6 = this;

    _classCallCheck(this, ItemBackground);

    // the .item element
    this.DOM = {
      el: el
    }; // the inner image

    this.DOM.imageHome = this.DOM.el.querySelector('.item-home');
    this.DOM.imageWrapper = this.DOM.imageHome.parentNode;
    this.DOM.titleText = this.DOM.el.querySelector('.flying-txt');
    this.renderedStyles = {
      // here we define which property will change as we scroll the page and the item is inside the viewport
      // in this case we will be:
      // - scaling the inner image
      // - translating the item's title
      // we interpolate between the previous and current value to achieve a smooth effect
      imageScale: {
        // interpolated value
        previous: 0,
        // current value
        current: 0,
        // amount to interpolate
        ease: 0.1,
        // current value setter
        setValue: function setValue() {
          var toValue = 1.5;
          var fromValue = 1;
          var val = MathUtils.map(_this6.props.top - docScroll, winsize.height, -1 * _this6.props.height, fromValue, toValue);
          return Math.max(Math.min(val, toValue), fromValue);
        }
      },
      titleTranslationY: {
        previous: 0,
        current: 0,
        ease: 0.1,
        fromValue: Number(MathUtils.getRandomFloat(30, 400)),
        setValue: function setValue() {
          var fromValue = _this6.renderedStyles.titleTranslationY.fromValue;
          var toValue = -1 * fromValue;
          var val = MathUtils.map(_this6.props.top - docScroll, winsize.height, -1 * _this6.props.height, fromValue, toValue);
          return fromValue < 0 ? Math.min(Math.max(val, fromValue), toValue) : Math.max(Math.min(val, fromValue), toValue);
        }
      }
    }; // gets the item's height and top (relative to the document)

    this.getSize(); // set the initial values

    this.update(); // use the IntersectionObserver API to check when the element is inside the viewport
    // only then the element styles will be updated

    this.observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        return _this6.isVisible = entry.intersectionRatio > 0;
      });
    });
    this.observer.observe(this.DOM.el); // init/bind events

    this.initEvents();
  }

  _createClass(ItemBackground, [{
    key: "update",
    value: function update() {
      // sets the initial value (no interpolation)
      for (var key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
      } // apply changes/styles


      this.layout();
    }
  }, {
    key: "getSize",
    value: function getSize() {
      var rect = this.DOM.el.getBoundingClientRect();
      this.props = {
        // item's height
        height: rect.height,
        // offset top relative to the document
        top: docScroll + rect.top
      };
    }
  }, {
    key: "initEvents",
    value: function initEvents() {
      var _this7 = this;

      window.addEventListener('resize', function () {
        return _this7.resize();
      });
    }
  }, {
    key: "resize",
    value: function resize() {
      // gets the item's height and top (relative to the document)
      this.getSize(); // on resize reset sizes and update styles

      this.update();
    }
  }, {
    key: "render",
    value: function render() {
      // update the current and interpolated values
      for (var key in this.renderedStyles) {
        this.renderedStyles[key].current = this.renderedStyles[key].setValue();
        this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
      } // and apply changes


      this.layout();
    }
  }, {
    key: "layout",
    value: function layout() {
      // scale the image
      this.DOM.imageHome.style.transform = "scale3d(".concat(this.renderedStyles.imageScale.previous, ",").concat(this.renderedStyles.imageScale.previous, ",1)"); // translate the title
      // this.DOM.titleTxt.style.transform = `translate3d(0,${this.renderedStyles.titleTranslationY.previous}px,0)`;
    }
  }]);

  return ItemBackground;
}();

window.onunload = function () {
  window.scrollTo(0, 0);
};

window.onload = function () {
  pageHeight = document.querySelector('div[data-scroll]');
  document.body.querySelector('#main-container').classList.add('unloading'); // Get the scroll position and update the lastScroll variable

  getPageYScroll();
  lastScroll = docScroll; // Initialize the Smooth Scrolling

  scrollInstance = new SmoothScroll();

  if (headers.length > 0) {
    Array.prototype.slice.call(headers).forEach(function (el) {
      observerTitle.observe(el);
    });
  }

  if (imgReveal) {
    Array.prototype.slice.call(imgReveal).forEach(function (el) {
      observerImage.observe(el);
    });
  }

  if (para) {
    Array.prototype.slice.call(para).forEach(function (el) {
      observerPara.observe(el);
    });
  }
}; // Text reveal animate


var TextSliderUpper = /*#__PURE__*/function () {
  function TextSliderUpper(wrapper) {
    _classCallCheck(this, TextSliderUpper);

    this.wrapper = wrapper; // Set delay between characters (in ms)

    this.delay = 0; // Wrap content in relevant wrappers

    this._wrapContent();
  }

  _createClass(TextSliderUpper, [{
    key: "_wrapContent",
    value: function _wrapContent() {
      var _this8 = this;

      var words = this.wrapper.textContent.split(' ');
      var delay = 0;
      var content = ''; // Loop through each word, wrap each character in a span

      Array.prototype.slice.call(words).forEach(function (word, multiplier) {
        if (!word.trim()) return;
        var word_split = word.split(/([^\x00-\x80]|\w)/g);
        var word_content = ''; // Look through each letter, add a delay (incremented)

        Array.prototype.slice.call(word_split).forEach(function (char, index) {
          delay += _this8.delay;
          word_content += "<span style=\"animation-delay: ".concat(delay, "ms\">").concat(char, "</span>");
        }); // Add spacing between words

        if (content !== '') content += ' '; // Add wrapped words to content

        content += "<span>".concat(word_content, "</span>");
      }); // Add content to wrapper

      this.wrapper.innerHTML = content;
    }
  }, {
    key: "init",
    value: function init() {
      this.wrapper.classList.add('show');
    }
  }]);

  return TextSliderUpper;
}(); // Get a list of all headers


var titleConfig = {
  root: null,
  threshold: 0.1,
  rootMargin: '80px'
};
var lineTxt = document.querySelector('.lineTxt');
var headers = document.querySelectorAll('[data-animate]');
var underLine = document.querySelector('.underLine');
var arrow = document.querySelector('#arrow-scroll'); // let titleHome = document.querySelectorAll('.home-title');

var observerTitle = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.setAttribute('data-animate', 'slideup');
    var slideHeader = new TextSliderUpper(entry.target);

    if (lineTxt) {
      lineTxt.classList.add('active-now');
      underLine.classList.add('full-view');
    }

    if (arrow) {
      arrow.classList.add('create');
    } // Allow for delays? Sure!


    var delay = entry.target.dataset.delay || 0; // Delay class (if necessary)

    setTimeout(function () {
      slideHeader.init();
    }, delay); // entry.target.classList.add('switch');

    observer.unobserve(entry.target);
  });
}, titleConfig);

if (viewportSize < 769) {
  var menu = document.querySelector('header > span.hide-from-desktop');
  var closer = document.querySelector('#close-menu');
  var menuList = document.getElementById('navblock');
  var scroller = document.querySelector('.inner-wrapper');
  var bodyNew = document.querySelector('body');
  menu.addEventListener('click', function () {
    menuList.classList.add('sliding-left');
    scroller.classList.add('stick');
    bodyNew.classList.add('stick');
    scrollInstance = false;
  });
  closer.addEventListener('click', function () {
    window.scrollTo(0, 0);
    // setTimeout(function(){
      menuList.classList.remove('sliding-left');
      scroller.classList.remove('stick');
      bodyNew.classList.remove('stick');
      scrollInstance = true;
    // },1000);


  });
} // paragraph roam


var para = document.querySelectorAll('.txt-para');
var paraConfig = {
  root: null,
  threshold: 0.1,
  rootMargin: '20px'
};
var observerPara = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add('reappear');
    observer.unobserve(entry.target);
  });
}, paraConfig); // paragraph roam
//  Image reveal

var imgReveal = document.querySelectorAll('.item-img-home');
var imgConfig = {
  root: null,
  threshold: 0.1,
  rootMargin: '20px'
};
var observerImage = new IntersectionObserver(function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add('reveal');
    observer.unobserve(entry.target);
  });
}, imgConfig);

// collection block reveal




var path = window.location.pathname;

if (path.includes('services')) {
  document.querySelectorAll('.services')[0].classList.add('italic');
  document.querySelectorAll('.services')[1].classList.add('italic');
} else if (path.includes('contact')) {
  document.querySelectorAll('.contact')[0].classList.add('italic');
  document.querySelectorAll('.contact')[1].classList.add('italic');
} else if (path.includes('about')) {
  document.querySelectorAll('.about')[0].classList.add('italic');
  document.querySelectorAll('.about')[1].classList.add('italic');
} else if (path.includes('collections')) {
  document.querySelectorAll('.collections')[0].classList.add('italic');
  document.querySelectorAll('.collections')[1].classList.add('italic');
} else {
  if (viewportSize < 769) {
    document.querySelector('.home').classList.add('italic');
  }
} //  Image reveal
// Loop through, add relevant class
// text reveal animate
// Preload images
// const preloadImages = () => {
//     return new Promise((resolve, reject) => {
//         imagesLoaded(document.querySelectorAll('.item-img-home'), {background: true},resolve);
//     });
// };
// // And then..
// preloadImages().then(() => {
//     // Remove the loader
//     document.body.querySelector('#main-container').classList.add('unloading');
//     // Get the scroll position and update the lastScroll variable
//     getPageYScroll();
//     lastScroll = docScroll;
//     // Initialize the Smooth Scrolling
//     new SmoothScroll();
// });
// getPageYScroll();
// new SmoothScroll();
