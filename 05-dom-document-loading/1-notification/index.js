export default class NotificationMessage {
    static inDom = {};
    element = {};
    
    timerShowId = 0;
    
    constructor(msg = '', {type = '',duration = 1000} = {}){
      this.msg = msg;
      this.duration = duration;
      this.type = type;
     
  
      this.render();
    }
    show() {
      if (NotificationMessage.isDom) {
        NotificationMessage.isDom.remove();
      }
      document.body.append(this.element);
  
      this.timerShowId = setTimeout(() => {
        this.destroy();
      }, this.duration);
      NotificationMessage.isDom = this;
    }
  
   render() {
    const parent = document.createElement('div');
    parent.innerHTML = this.getTemplate();
    this.element = parent.firstElementChild;
    
    }
  
   
  
    remove() {
    clearTimeout(this.timerShowId);
    if(this.element){
      this.element.remove();
    }
    }
  
    destroy() {
      this.remove();
      this.element = null;
      NotificationMessage.inDom = null;
  
    }
  
    getTemplate() {
      return `<div class="notification ${this.type}" style="--value:${this.duration/1000+"s"}">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.msg}
        </div>
      </div>
    </div>`
    }
  }
