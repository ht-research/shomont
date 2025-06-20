const MathUtils = {
    // map number x from range [a, b] to [c, d]
    map: (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c,
    // linear interpolation
    lerp: (a, b, n) => (1 - n) * a + n * b,
    // random float
    getRandomFloat: (min, max) => (Math.random() * (max - min) + min).toFixed(2)
};

let viewportSize = window.innerWidth && document.documentElement.clientWidth ? 
Math.min(window.innerWidth, document.documentElement.clientWidth) : 
window.innerWidth || 
document.documentElement.clientWidth || 
document.getElementsByTagName('body')[0].clientWidth;

const body = document.body;
let flag = true;
let counter = 0;
let winsize;
const calcWinsize = () => winsize = {width: window.innerWidth, height: window.innerHeight};
calcWinsize();

window.addEventListener('resize', calcWinsize);

let docScroll;
 // for scroll speed calculation
let lastScroll;
let scrollingSpeed = 0;

const getPageYScroll = () => docScroll = window.pageYOffset || document.documentElement.scrollTop;
window.addEventListener('scroll', getPageYScroll);


 // SmoothScroll
    class SmoothScroll {
        constructor() {
        	
            // the <main> element
            this.DOM = {main: document.querySelector('main')};
            // the scrollable element
            // we translate this element when scrolling (y-axis)
            this.DOM.scrollable = this.DOM.main.querySelector('div[data-scroll]');
          	
            // the items on the page
            this.items = [];
            this.itemBackground = [];


            [...this.DOM.main.querySelectorAll('.item')].forEach(item => this.items.push(new Item(item)));
            [...this.DOM.main.querySelectorAll('.background-wrapper')].forEach(itemBackground => this.itemBackground.push(new ItemBackground(itemBackground)));

            // here we define which property will change as we scroll the page
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
                    setValue: () => docScroll
                },
                
            };
            // set the body's height
            this.setSize();
            // set the initial values
            this.update();
            // the <main> element's style needs to be modified
            this.style();
            // init/bind events
            this.initEvents();
            // start the render loop
            requestAnimationFrame(() => this.render());
        }
        update() {
            // sets the initial value (no interpolation) - translate the scroll value
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
            }   
            // translate the scrollable element
            this.layout();
        }
        layout() {
        	
            // translates the scrollable element
            this.DOM.scrollable.style.transform = `translate3d(0,${-1*this.renderedStyles.translationY.previous}px,0)`;
        }
        setSize() {
            // set the heigh of the body in order to keep the scrollbar on the page
            body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
        }
        style() {
            // the <main> needs to "stick" to the screen and not scroll
            // for that we set it to position fixed and overflow hidden 
            this.DOM.main.style.position = 'fixed';
            this.DOM.main.style.width = this.DOM.main.style.height = '100%';
            this.DOM.main.style.top = this.DOM.main.style.left = 0;
            this.DOM.main.style.overflow = 'hidden';
        }
        initEvents() {
            // on resize reset the body's height
            window.addEventListener('resize', () => this.setSize());
        }
        render() {

        	// Get scrolling speed
            // Update lastScroll
            scrollingSpeed = Math.abs(docScroll - lastScroll);
            lastScroll = docScroll;

            // update the current and interpolated values
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
            }
            // and translate the scrollable element
            this.layout();
            
            // for every item
            for (const item of this.items) {
                // if the item is inside the viewport call it's render function
                // this will update the item's inner image translation, based on the document scroll value and the item's position on the viewport
                if ( item.isVisible ) {
                    item.render();
                }
            }

              // for every item
          
            	for (const itemer of this.itemBackground) {

	                // if the item is inside the viewport call it's render function
	                // this will update item's styles, based on the document scroll value and the item's position on the viewport
	                if ( itemer.isVisible ) {
	                    if ( itemer.insideViewport ) {
                    		itemer.render();  
	                    }
	                    else {
	                 
	                        itemer.insideViewport = true;
	                        itemer.update();
	                     
	                        
	                    }
	                }
	                else {
	                    itemer.insideViewport = false;
	                }
	            }
     
            
         
            
            // loop..
            requestAnimationFrame(() => this.render());
        }
    }

    class Item {
        constructor(el) {
            // the .item element
            this.DOM = {el: el};
            // the inner image
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
                    setValue: () => {
                        const maxValue = this.renderedStyles.innerTranslationY.maxValue;
                        const minValue = -1 * maxValue;
                        return Math.max(Math.min(MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, minValue, maxValue), maxValue), minValue)
                    }
                },
         
            };
            // set the initial values
            this.update();
            // use the IntersectionObserver API to check when the element is inside the viewport
            // only then the element translation will be updated
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0);
            });
            this.observer.observe(this.DOM.el);
            // init/bind events
            this.initEvents();
        }
        update() {
            // gets the item's height and top (relative to the document)
            this.getSize();
            // sets the initial value (no interpolation)
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
            }
            // translate the image
            this.layout();
        }
        getSize() {
            const rect = this.DOM.el.getBoundingClientRect();
            this.props = {
                // item's height
                height: rect.height,
                // offset top relative to the document
                top: docScroll + rect.top 
            }
        }
        initEvents() {
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            // on resize rest sizes and update the translation value
            this.update();
        }
        render() {
            // update the current and interpolated values
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
            }
            // and translates the image
            this.layout();
        }
        layout() {
        	
            // translates the image
            this.DOM.image.style.transform = `translate3d(0,${-1.5*this.renderedStyles.innerTranslationY.previous}px,0)`;
        }
    }


// ItemBackground
    class ItemBackground {
        constructor(el) {
            // the .item element
            this.DOM = {el: el};
            // the inner image
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
                    setValue: () => {
                        const toValue = 1.5;
                        const fromValue = 1;
                        const val = MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, fromValue, toValue);
                        return Math.max(Math.min(val, toValue), fromValue);
                    }
                },
                titleTranslationY: {
                    previous: 0, 
                    current: 0, 
                    ease: 0.1,
                    fromValue: Number(MathUtils.getRandomFloat(30,400)),
                    setValue: () => {
                        const fromValue = this.renderedStyles.titleTranslationY.fromValue;
                        const toValue = -1*fromValue;
                        const val = MathUtils.map(this.props.top - docScroll, winsize.height, -1 * this.props.height, fromValue, toValue);
                        return fromValue < 0 ? Math.min(Math.max(val, fromValue), toValue) : Math.max(Math.min(val, fromValue), toValue);
                    }
                }
            };
            // gets the item's height and top (relative to the document)
            this.getSize();
            // set the initial values
            this.update();
            // use the IntersectionObserver API to check when the element is inside the viewport
            // only then the element styles will be updated
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => this.isVisible = entry.intersectionRatio > 0);
            });
            this.observer.observe(this.DOM.el);
            // init/bind events
            this.initEvents();
        }
        update() {
            // sets the initial value (no interpolation)
            for (const key in this.renderedStyles ) {

                this.renderedStyles[key].current = this.renderedStyles[key].previous = this.renderedStyles[key].setValue();
            }
            // apply changes/styles
            this.layout();
        }
        getSize() {
            const rect = this.DOM.el.getBoundingClientRect();
            this.props = {
                // item's height
                height: rect.height,
                // offset top relative to the document
                top: docScroll + rect.top
            }
        }
        initEvents() {
            window.addEventListener('resize', () => this.resize());
        }
        resize() {
            // gets the item's height and top (relative to the document)
            this.getSize();
            // on resize reset sizes and update styles
            this.update();
        }
        render() {
            // update the current and interpolated values
            for (const key in this.renderedStyles ) {
                this.renderedStyles[key].current = this.renderedStyles[key].setValue();
                this.renderedStyles[key].previous = MathUtils.lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].ease);
            }
            
            // and apply changes
            this.layout();
        }
        layout() {
            // scale the image

            this.DOM.imageHome.style.transform = `scale3d(${this.renderedStyles.imageScale.previous},${this.renderedStyles.imageScale.previous},1)`;
            // translate the title
            // this.DOM.titleTxt.style.transform = `translate3d(0,${this.renderedStyles.titleTranslationY.previous}px,0)`;
        }
    }

    window.onunload = function(){
    	window.scrollTo(0,0);
    }

    window.onload = function(){
    	document.body.querySelector('#main-container').classList.add('unloading');
        // Get the scroll position and update the lastScroll variable
        getPageYScroll();
        lastScroll = docScroll;
        // Initialize the Smooth Scrolling
        new SmoothScroll();

        if(headers.length > 0){
	        headers.forEach((el) =>{
				observerTitle.observe(el);
			});
	    }

	if(imgReveal){
		imgReveal.forEach((el) => {
			observerImage.observe(el);
		});
	}


	if(para){
		para.forEach((el) => {
			observerPara.observe(el);
		});
	}

    }





// Text reveal animate

class TextSliderUpper {
  constructor(wrapper) {
    this.wrapper = wrapper;

    // Set delay between characters (in ms)
    this.delay = 0;

    // Wrap content in relevant wrappers
    this._wrapContent();
  }

  _wrapContent() {
    let words = this.wrapper.textContent.split(' ');
    let delay = 0;
    let content = '';

    // Loop through each word, wrap each character in a span
    words.forEach((word, multiplier) => {
      let word_split = word.split(/([^\x00-\x80]|\w)/g);
      let word_content = '';

      // Look through each letter, add a delay (incremented)
      word_split.forEach((char, index) => {
        delay += this.delay;

        word_content += `<span style="animation-delay: ${delay}ms">${char}</span>`;
      });

      // Add spacing between words
      if (content !== '') content += ' ';

      // Add wrapped words to content
      content += `<span>${word_content}</span>`;
    })

    // Add content to wrapper
    this.wrapper.innerHTML = content;
  }

  init() {
    this.wrapper.classList.add('show');
  }
}

// Get a list of all headers
let titleConfig = {
	root: null,
	threshold:0.1,
	rootMargin: '20px'
}

let lineTxt = document.querySelector('.lineTxt');
let headers = document.querySelectorAll('[data-animate]');
let underLine = document.querySelector('.underLine');
let arrow = document.querySelector('#arrow-scroll');

// let titleHome = document.querySelectorAll('.home-title');


	const observerTitle = new IntersectionObserver(function(entries,observer){
		entries.forEach((entry) => {
			if(!entry.isIntersecting){
				return;
			}

			
				  entry.target.setAttribute('data-animate','slideup');
				  let slideHeader = new TextSliderUpper(entry.target);
				  if(lineTxt){
				  	lineTxt.classList.add('active-now');
				  	underLine.classList.add('full-view');
				  }
				  if(arrow){
				  	arrow.classList.add('create');
				  }


				  // Allow for delays? Sure!
				  let delay = entry.target.dataset.delay || 0;
				  // Delay class (if necessary)
				  setTimeout(() => {
				    slideHeader.init();
				  }, delay);
				

			// entry.target.classList.add('switch');
			observer.unobserve(entry.target);
		})
	},titleConfig);


if(viewportSize < 769){
	let menu = document.querySelector('header > span.hide-from-desktop');
	let closer = document.querySelector('#close-menu');
	let menuList = document.getElementById('navblock');
	menu.addEventListener('click', function(){
		menuList.classList.add('sliding-left');
	});
	closer.addEventListener('click', function(){
		menuList.classList.remove('sliding-left');
	})
}




// paragraph roam

let para = document.querySelectorAll('.txt-para');


	let paraConfig = {
	root: null,
	threshold:0.1,
	rootMargin: '60px'
	}

	const observerPara = new IntersectionObserver(function(entries,observer){
		entries.forEach((entry) => {
			if(!entry.isIntersecting){
				return;
			}	
			entry.target.classList.add('reappear');
			observer.unobserve(entry.target);
		})
	},paraConfig);

	



// paragraph roam

//  Image reveal


let imgReveal = document.querySelectorAll('.item-img-home');


	let imgConfig = {
	root: null,
	threshold:0.1,
	rootMargin: '20px'
	}

	const observerImage = new IntersectionObserver(function(entries,observer){
		entries.forEach((entry) => {
			if(!entry.isIntersecting){
				return;
			}	
			entry.target.classList.add('reveal');
			observer.unobserve(entry.target);
		})
	},imgConfig);


let path = window.location.pathname;
if(path.includes('services')){
	document.querySelectorAll('.services')[0].classList.add('italic');
	document.querySelectorAll('.services')[1].classList.add('italic');
}
else if(path.includes('contact')){
	document.querySelectorAll('.contact')[0].classList.add('italic');
	document.querySelectorAll('.contact')[1].classList.add('italic');
}
else if(path.includes('about')){
	document.querySelectorAll('.about')[0].classList.add('italic');
	document.querySelectorAll('.about')[1].classList.add('italic');
}
else if(path.includes('collections')){
	document.querySelectorAll('.collections')[0].classList.add('italic');
	document.querySelectorAll('.collections')[1].classList.add('italic');
}
else{
	if(viewportSize < 769){
		document.querySelector('.home').classList.add('italic');
	}
	
}

//  Image reveal


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