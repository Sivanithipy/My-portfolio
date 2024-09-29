var VanillaTilt = (function () {
  'use strict';
  
  /**
   * Created by Sergiu Șandor (micku7zu) on 1/27/2017.
   * Original idea: https://github.com/gijsroge/tilt.js
   * MIT License.
   * Version 1.8.1
   */
  
  class VanillaTilt {
    constructor(element, settings = {}) {
      if (!(element instanceof Node)) {
        throw ("Can't initialize VanillaTilt because " + element + " is not a Node.");
      }
  
      this.width = null;
      this.height = null;
      this.clientWidth = null;
      this.clientHeight = null;
      this.left = null;
      this.top = null;
  
      // for Gyroscope sampling
      this.gammazero = null;
      this.betazero = null;
      this.lastgammazero = null;
      this.lastbetazero = null;
  
      this.transitionTimeout = null;
      this.updateCall = null;
      this.event = null;
  
      this.updateBind = this.update.bind(this);
      this.resetBind = this.reset.bind(this);
  
      this.element = element;
      this.settings = this.extendSettings(settings);
  
      this.reverse = this.settings.reverse ? -1 : 1;
      this.resetToStart = VanillaTilt.isSettingTrue(this.settings["reset-to-start"]);
      this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
      this.glarePrerender = VanillaTilt.isSettingTrue(this.settings["glare-prerender"]);
      this.fullPageListening = VanillaTilt.isSettingTrue(this.settings["full-page-listening"]);
      this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
      this.gyroscopeSamples = this.settings.gyroscopeSamples;
  
      this.elementListener = this.getElementListener();
      if (this.glare) {
        this.prepareGlare();
      }
  
      if (this.fullPageListening) {
        this.updateClientSize();
      }
  
      this.addEventListeners();
      this.reset();
  
      if (this.resetToStart === false) {
        this.settings.startX = 0;
        this.settings.startY = 0;
      }
    }
  
    static isSettingTrue(setting) {
      return setting === "" || setting === true || setting === 1;
    }
  
    /**
     * Method returns element what will be listen mouse events
     * @return {Node}
     */
    getElementListener() {
      if (this.fullPageListening) {
        return window.document;
      }
  
      if (typeof this.settings["mouse-event-element"] === "string") {
        const mouseEventElement = document.querySelector(this.settings["mouse-event-element"]);
  
        if (mouseEventElement) {
          return mouseEventElement;
        }
      }
  
      if (this.settings["mouse-event-element"] instanceof Node) {
        return this.settings["mouse-event-element"];
      }
  
      return this.element;
    }
  
    /**
     * Method set listen methods for this.elementListener
     * @return {Node}
     */
    addEventListeners() {
      this.onMouseEnterBind = this.onMouseEnter.bind(this);
      this.onMouseMoveBind = this.onMouseMove.bind(this);
      this.onMouseLeaveBind = this.onMouseLeave.bind(this);
      this.onWindowResizeBind = this.onWindowResize.bind(this);
      this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);
  
      this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
      this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
      this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);
  
      if (this.glare || this.fullPageListening) {
        window.addEventListener("resize", this.onWindowResizeBind);
      }
  
      if (this.gyroscope) {
        window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
      }
    }
  
    /**
     * Method remove event listeners from current this.elementListener
     */
    removeEventListeners() {
      this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
      this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
      this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);
  
      if (this.gyroscope) {
        window.removeEventListener("deviceorientation", this.onDeviceOrientationBind);
      }
  
      if (this.glare || this.fullPageListening) {
        window.removeEventListener("resize", this.onWindowResizeBind);
      }
    }
  
      